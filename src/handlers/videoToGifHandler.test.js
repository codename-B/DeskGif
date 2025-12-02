import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { handleVideoToGif } from './videoToGifHandler';
import toast from 'react-hot-toast';
import fs from 'fs/promises';
import path from 'path';

// Mock window.electron
const mockElectron = {
  ffmpeg: vi.fn(),
  readFile: vi.fn(),
  deleteFile: vi.fn(),
};
window.electron = mockElectron;

// Mock react-hot-toast
vi.mock('react-hot-toast');

describe('handleVideoToGif', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    let current = 1700000000000;
    vi.spyOn(Date, 'now').mockImplementation(() => ++current);
    // Reset mocks for each test
    mockElectron.ffmpeg.mockResolvedValue({ success: true });
    mockElectron.readFile.mockResolvedValue(Buffer.from('gif_data'));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should convert video to GIF successfully', async () => {
    const filePath = 'test.mp4';
    const settings = { fps: 10, width: 200 };
    const setProcessing = vi.fn();
    const setProgress = vi.fn();
    const cleanupOldFile = vi.fn();
    const updateFile = vi.fn();
    const appSettings = { useGpu: false };
    const registerProcess = vi.fn();

    await handleVideoToGif({
      filePath,
      settings,
      setProcessing,
      setProgress,
      cleanupOldFile,
      updateFile,
      appSettings,
      registerProcess,
    });

    expect(setProcessing).toHaveBeenCalledWith(true);
    expect(setProgress).toHaveBeenCalledWith('Converting video to GIF...');
    
    // Expect palette generation
    const palettePath = filePath.replace(/\.[^.]+$/, '_palette.png');
    const paletteProcessId = 'ffmpeg_palette_1700000000001';
    expect(mockElectron.ffmpeg).toHaveBeenCalledWith(
      ['-y', '-vf', `fps=${settings.fps},scale=${settings.width}:-1:flags=lanczos,palettegen`, '-f', 'image2'],
      filePath,
      palettePath,
      appSettings.useGpu,
      paletteProcessId
    );
    expect(registerProcess).toHaveBeenCalledWith(paletteProcessId);

    // Expect GIF creation
    const outputPath = filePath.replace(/\.[^.]+$/, '_converted.gif');
    const gifProcessId = 'ffmpeg_gif_1700000000002';
    expect(mockElectron.ffmpeg).toHaveBeenCalledWith(
      [
        '-i', palettePath,
        '-filter_complex', `[0:v]fps=${settings.fps},scale=${settings.width}:-1:flags=lanczos[x];[x][1:v]paletteuse=dither=bayer:bayer_scale=5`,
        '-y',
        '-f', 'gif'
      ],
      filePath,
      outputPath,
      appSettings.useGpu,
      gifProcessId
    );
    expect(registerProcess).toHaveBeenCalledWith(gifProcessId);

    expect(mockElectron.readFile).toHaveBeenCalledWith(outputPath);
    expect(cleanupOldFile).toHaveBeenCalledWith(filePath);
    expect(updateFile).toHaveBeenCalledWith(outputPath, expect.any(String)); // Blob URL
    expect(setProgress).toHaveBeenCalledWith('Complete! GIF created. Use Optimize tool to compress further.');
    expect(setProcessing).toHaveBeenCalledWith(false);
    expect(toast.error).not.toHaveBeenCalled();
    expect(mockElectron.deleteFile).toHaveBeenCalledWith(palettePath);
  });

  it('should handle conversion errors', async () => {
    const filePath = 'test.mp4';
    const settings = { fps: 10, width: 200 };
    const setProcessing = vi.fn();
    const setProgress = vi.fn();
    const cleanupOldFile = vi.fn();
    const updateFile = vi.fn();
    const appSettings = { useGpu: false };

    const errorMessage = 'FFmpeg failed to convert';
    mockElectron.ffmpeg.mockRejectedValue(new Error(errorMessage));
    const registerProcess = vi.fn();

    await handleVideoToGif({
      filePath,
      settings,
      setProcessing,
      setProgress,
      cleanupOldFile,
      updateFile,
      appSettings,
      registerProcess,
    });

    expect(toast.error).toHaveBeenCalledWith('Conversion failed: ' + errorMessage);
    expect(setProcessing).toHaveBeenCalledWith(false);
  });
});
