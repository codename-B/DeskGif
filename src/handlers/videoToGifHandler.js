import toast from 'react-hot-toast';
import { generateProcessId } from '../utils/processId';

export const handleVideoToGif = async ({
  filePath,
  settings,
  setProcessing,
  setProgress,
  cleanupOldFile,
  updateFile,
  appSettings = {},
  registerProcess
}) => {
  const useGpu = appSettings.useGpu || false;
  const palettePath = filePath.replace(/\.[^.]+$/, '_palette.png');

  setProcessing(true);
  setProgress('Converting video to GIF...');

  try {
    const outputPath = filePath.replace(/\.[^.]+$/, '_converted.gif');

    setProgress('Generating color palette...');
    const paletteArgs = [
      '-y',
      '-vf', `fps=${settings.fps},scale=${settings.width}:-1:flags=lanczos,palettegen`,
      '-f', 'image2'
    ];
    const paletteProcessId = generateProcessId('ffmpeg_palette');
    if (registerProcess) registerProcess(paletteProcessId);
    await window.electron.ffmpeg(paletteArgs, filePath, palettePath, useGpu, paletteProcessId);

    setProgress('Creating GIF...');
    const gifArgs = [
      '-i', palettePath,
      '-filter_complex', `[0:v]fps=${settings.fps},scale=${settings.width}:-1:flags=lanczos[x];[x][1:v]paletteuse=dither=bayer:bayer_scale=5`,
      '-y',
      '-f', 'gif'
    ];
    const gifProcessId = generateProcessId('ffmpeg_gif');
    if (registerProcess) registerProcess(gifProcessId);
    await window.electron.ffmpeg(gifArgs, filePath, outputPath, useGpu, gifProcessId);

    const resultData = await window.electron.readFile(outputPath);
    const resultBlob = new Blob([resultData], { type: 'image/gif' });
    const resultUrl = URL.createObjectURL(resultBlob);

    try {
      await cleanupOldFile(filePath);
      updateFile(outputPath, resultUrl);
      setProgress('Complete! GIF created. Use Optimize tool to compress further.');
    } catch (error) {
      if (resultUrl) {
        URL.revokeObjectURL(resultUrl);
      }
      throw error;
    }
  } catch (error) {
    console.error('Conversion error:', error);
    toast.error('Conversion failed: ' + error.message);
  } finally {
    try {
      await window.electron.deleteFile(palettePath);
    } catch (cleanupErr) {
      console.warn('Failed to delete palette file:', cleanupErr);
    }
  }

  setProcessing(false);
};
