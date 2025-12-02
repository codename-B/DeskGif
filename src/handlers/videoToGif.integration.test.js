import { describe, it, expect } from 'vitest';
import { spawn } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..', '..');

const run = (cmd, args, options = {}) => new Promise((resolve, reject) => {
  const child = spawn(cmd, args, options);
  let stderr = '';
  child.stderr.on('data', (d) => { stderr += d.toString(); });
  child.on('close', (code) => {
    if (code === 0) return resolve({ code, stderr });
    reject(new Error(stderr || `Process exited with ${code}`));
  });
});

describe('video to gif integration', () => {
  const inputPath = path.join(projectRoot, 'test.mp4');
  const ffmpegPath = path.join(projectRoot, 'binaries', process.platform, process.platform === 'win32' ? 'ffmpeg.exe' : 'ffmpeg');

  it('converts mp4 to gif with default pipeline arguments', async () => {
    const hasInput = await fs.stat(inputPath).then(() => true).catch(() => false);
    if (!hasInput) {
      console.warn('Skipping: test.mp4 not found in project root');
      return;
    }
    const hasFfmpeg = await fs.stat(ffmpegPath).then(() => true).catch(() => false);
    if (!hasFfmpeg) {
      console.warn(`Skipping: ffmpeg binary missing at ${ffmpegPath}`);
      return;
    }

    const palettePath = path.join(os.tmpdir(), `vitest_palette_${Date.now()}.png`);
    const outputPath = path.join(os.tmpdir(), `vitest_output_${Date.now()}.gif`);

    try {
      // Palette generation (matches handler defaults)
      await run(ffmpegPath, [
        '-y',
        '-i', inputPath,
        '-vf', 'fps=15,scale=800:-1:flags=lanczos,palettegen',
        '-f', 'image2',
        palettePath
      ]);

      // GIF creation using the palette (matches handler args)
      await run(ffmpegPath, [
        '-i', inputPath,
        '-i', palettePath,
        '-filter_complex', '[0:v]fps=15,scale=800:-1:flags=lanczos[x];[x][1:v]paletteuse=dither=bayer:bayer_scale=5',
        '-y',
        '-f', 'gif',
        outputPath
      ]);

      const stats = await fs.stat(outputPath);
      expect(stats.size).toBeGreaterThan(0);
      const header = await fs.readFile(outputPath, { encoding: 'binary' });
      expect(header.startsWith('GIF8')).toBe(true);
    } finally {
      // Cleanup temp artifacts
      await fs.unlink(palettePath).catch(() => {});
      await fs.unlink(outputPath).catch(() => {});
    }
  }, 30000);
});
