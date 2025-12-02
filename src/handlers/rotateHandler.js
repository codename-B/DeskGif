import toast from 'react-hot-toast';
import { generateProcessId } from '../utils/processId';

export const handleRotate = async ({
  file,
  filePath,
  settings,
  setSettings,
  setProcessing,
  setProgress,
  cleanupOldFile,
  updateFile,
  appSettings = {},
  registerProcess
}) => {
  const useGpu = appSettings.useGpu || false;

  setProcessing(true);
  setProgress('Rotating...');

  try {
    const isGif = file.name.match(/\.gif$/i);
    const isVideo = file.name.match(/\.(mp4|avi|mov|mkv|webm)$/i);

    let outputPath, resultData, resultBlob, resultUrl;

    if (isGif) {
      setProgress('Rotating GIF frames...');
      outputPath = filePath.replace(/\.[^.]+$/, '_rotated.gif');

      const processId = generateProcessId('imagemagick_rotate');
      if (registerProcess) registerProcess(processId);
      await window.electron.imagemagick(
        ['-coalesce', '-rotate', settings.liveRotation.toString(), '-layers', 'Optimize'],
        filePath,
        outputPath,
        processId
      );

      resultData = await window.electron.readFile(outputPath);
      resultBlob = new Blob([resultData], { type: 'image/gif' });
      resultUrl = URL.createObjectURL(resultBlob);

    } else if (isVideo) {
      setProgress('Rotating video...');
      const fileExt = file.name.split('.').pop();
      outputPath = filePath.replace(/\.[^.]+$/, `_rotated.${fileExt}`);

      let rotateFilter;
      const angle = settings.liveRotation;

      if (angle === 90 || angle === -270) {
        rotateFilter = 'transpose=1';
      } else if (angle === -90 || angle === 270) {
        rotateFilter = 'transpose=2';
      } else if (angle === 180 || angle === -180) {
        rotateFilter = 'transpose=1,transpose=1';
      } else {
        const radians = (angle * Math.PI) / 180;
        rotateFilter = `rotate=${radians}:c=white`;
      }

      const processId = generateProcessId('ffmpeg_rotate');
      if (registerProcess) registerProcess(processId);
      await window.electron.ffmpeg(
        ['-vf', rotateFilter, '-c:a', 'copy'],
        filePath,
        outputPath,
        useGpu,
        processId
      );

      resultData = await window.electron.readFile(outputPath);
      resultBlob = new Blob([resultData]);
      resultUrl = URL.createObjectURL(resultBlob);

    } else {
      setProgress('Rotating image...');
      outputPath = filePath.replace(/\.[^.]+$/, '_rotated.png');

      const processId = generateProcessId('imagemagick_rotate');
      if (registerProcess) registerProcess(processId);
      await window.electron.imagemagick(
        ['-rotate', settings.liveRotation.toString(), '-background', 'white', '-flatten'],
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
      setSettings({...settings, liveRotation: 0});
      setProgress('Complete! File rotated.');
    } catch (error) {
      if (resultUrl) {
        URL.revokeObjectURL(resultUrl);
      }
      throw error;
    }
  } catch (error) {
    console.error('Rotate error:', error);
    toast.error('Rotate failed: ' + error.message);
  }

  setProcessing(false);
};
