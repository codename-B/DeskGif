import toast from 'react-hot-toast';
import { generateProcessId } from '../utils/processId';

// Helper to generate unique temp file path
const getTempPath = (extension) => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  return `DeskGif_speed_${timestamp}_${random}${extension}`;
};

export const handleSpeedChange = async ({
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

  setProcessing(true);
  setProgress('Adjusting speed...');

  try {
    const fileExt = filePath.match(/\.[^.]+$/)?.[0] || '.mp4';
    const isGif = fileExt.toLowerCase() === '.gif';
    const outputPath = filePath.replace(/\.[^.]+$/, `_speed${fileExt}`);

    let args = [];
    let needsProcessing = false;

    // Build the filter chain
    let filters = [];

    // Frame skipping - select every Nth frame
    if (settings.skipFrames > 1) {
      // Use select filter to keep every Nth frame
      // select='not(mod(n,N))' keeps frames 0, N, 2N, 3N...
      filters.push(`select='not(mod(n,${settings.skipFrames}))'`);
      needsProcessing = true;
    }

    // Speed multiplier - adjust PTS (presentation timestamp)
    if (settings.speedMultiplier !== 1) {
      // setpts adjusts timestamps. Divide by speed to speed up (e.g., 2x = PTS/2)
      filters.push(`setpts=PTS/${settings.speedMultiplier}`);
      needsProcessing = true;
    }

    if (!needsProcessing) {
      toast.error('No speed changes to apply! Adjust the sliders first.');
      setProcessing(false);
      return;
    }

    // Apply video filters
    const filterString = filters.join(',');

    if (isGif) {
      setProgress('Processing GIF frames with FFmpeg...');
      // For GIFs, we need to handle it carefully
      // First convert to video format, apply filters, then back to GIF
      // Use temp files in system temp directory for intermediate processing
      const tempVideoPath = await window.electron.getTempPath(getTempPath('.mp4'));
      const palettePath = await window.electron.getTempPath(getTempPath('.png'));

      try {
        // Step 1: GIF to video with filters
        // Add scale filter to ensure even dimensions for h264 codec
        const fullFilterString = `${filterString},scale='trunc(iw/2)*2:trunc(ih/2)*2'`;

        const processId = generateProcessId('ffmpeg_speed_gif_video');
        if (registerProcess) registerProcess(processId);
        await window.electron.ffmpeg(
          ['-vf', fullFilterString, '-c:v', 'libx264', '-pix_fmt', 'yuv420p'],
          filePath,
          tempVideoPath,
          useGpu,
          processId
        );

        setProgress('Generating optimized color palette...');

        // Step 2: Generate palette from processed video
        const paletteProcessId = generateProcessId('ffmpeg_speed_palette');
        if (registerProcess) registerProcess(paletteProcessId);
        await window.electron.ffmpeg(
          ['-vf', 'palettegen=stats_mode=diff'],
          tempVideoPath,
          palettePath,
          useGpu,
          paletteProcessId
        );

        setProgress('Converting back to GIF...');

        // Step 3: Convert back to GIF using palette
        const gifArgs = [
          '-i', palettePath,
          '-filter_complex', '[0:v][1:v]paletteuse=dither=bayer:bayer_scale=5'
        ];

        const gifProcessId = generateProcessId('ffmpeg_speed_gif');
        if (registerProcess) registerProcess(gifProcessId);
        await window.electron.ffmpeg(gifArgs, tempVideoPath, outputPath, useGpu, gifProcessId);

        // Cleanup temp files
        try {
          await window.electron.deleteFile(tempVideoPath);
          await window.electron.deleteFile(palettePath);
        } catch (e) {
          console.warn('Could not delete temp files:', e);
        }

      } catch (error) {
        // Cleanup on error
        try {
          await window.electron.deleteFile(tempVideoPath);
          await window.electron.deleteFile(palettePath);
        } catch (e) {
          // Ignore cleanup errors
        }
        throw error;
      }
    } else {
      // For videos, straightforward filter application
      setProgress('Processing video with FFmpeg...');

      // When using select filter, we need to use -vsync vfr (variable frame rate)
      // to avoid frame duplication
      if (settings.skipFrames > 1) {
        args.push('-vsync', 'vfr');
      }

      args.push('-vf', filterString, '-c:a', 'copy');

      const processId = generateProcessId('ffmpeg_speed');
      if (registerProcess) registerProcess(processId);
      await window.electron.ffmpeg(args, filePath, outputPath, useGpu, processId);
    }

    const resultData = await window.electron.readFile(outputPath);
    const resultBlob = new Blob([resultData], { type: isGif ? 'image/gif' : 'video/mp4' });
    const resultUrl = URL.createObjectURL(resultBlob);

    try {
      await cleanupOldFile(filePath);
      updateFile(outputPath, resultUrl);
      setProgress('Complete! Speed adjusted.');
    } catch (error) {
      if (resultUrl) {
        URL.revokeObjectURL(resultUrl);
      }
      throw error;
    }
  } catch (error) {
    console.error('Speed adjustment error:', error);
    toast.error('Speed adjustment failed: ' + error.message);
  }

  setProcessing(false);
};
