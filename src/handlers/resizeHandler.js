import toast from 'react-hot-toast';
import { generateProcessId } from '../utils/processId';

export const handleResize = async ({
  file,
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
  setProgress('Resizing...');

  try {
    const isGif = file.name.match(/\.gif$/i);
    const isVideo = file.name.match(/\.(mp4|avi|mov|mkv|webm)$/i);

    let outputPath, resultData, resultBlob, resultUrl;

    if (isGif) {
      setProgress('Resizing GIF...');
      outputPath = filePath.replace(/\.[^.]+$/, '_resized.gif');

      const processId = generateProcessId('gifsicle_resize');
      if (registerProcess) registerProcess(processId);
      await window.electron.gifsicle(
        ['--resize', `${settings.width}x${settings.height}`, '--optimize=3'],
        filePath,
        outputPath,
        processId
      );

      resultData = await window.electron.readFile(outputPath);
      resultBlob = new Blob([resultData], { type: 'image/gif' });
      resultUrl = URL.createObjectURL(resultBlob);

    } else if (isVideo) {
      setProgress('Resizing video...');
      const fileExt = file.name.split('.').pop();
      outputPath = filePath.replace(/\.[^.]+$/, `_resized.${fileExt}`);

      // Ensure dimensions are even numbers (required for h264 encoding)
      const evenWidth = Math.round(settings.width / 2) * 2;
      const evenHeight = Math.round(settings.height / 2) * 2;
      const scaleFilter = `scale=${evenWidth}:${evenHeight}`;

      const processId = generateProcessId('ffmpeg_resize');
      if (registerProcess) registerProcess(processId);
      await window.electron.ffmpeg(
        ['-vf', scaleFilter, '-c:a', 'copy'],
        filePath,
        outputPath,
        useGpu,
        processId
      );

      resultData = await window.electron.readFile(outputPath);
      resultBlob = new Blob([resultData]);
      resultUrl = URL.createObjectURL(resultBlob);

    } else {
      setProgress('Resizing image...');
      outputPath = filePath.replace(/\.[^.]+$/, '_resized.png');

      const processId = generateProcessId('imagemagick_resize');
      if (registerProcess) registerProcess(processId);
      await window.electron.imagemagick(
        ['-resize', `${settings.width}x${settings.height}`],
        filePath,
        outputPath,
        processId
      );

      resultData = await window.electron.readFile(outputPath);
      resultBlob = new Blob([resultData]);
      resultUrl = URL.createObjectURL(resultBlob);
    }

    try {
      await cleanupOldFile(filePath);
      updateFile(outputPath, resultUrl);
      setProgress('Complete! File resized.');
    } catch (error) {
      if (resultUrl) {
        URL.revokeObjectURL(resultUrl);
      }
      throw error;
    }
  } catch (error) {
    console.error('Resize error:', error);
    toast.error('Resize failed: ' + error.message);
  }

  setProcessing(false);
};
