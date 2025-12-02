import toast from 'react-hot-toast';
import { generateProcessId } from '../utils/processId';

export const handleCrop = async ({
  file,
  filePath,
  settings,
  setSettings,
  previewRef,
  setProcessing,
  setProgress,
  cleanupOldFile,
  updateFile,
  appSettings = {},
  registerProcess
}) => {
  const useGpu = appSettings.useGpu || false;

  setProcessing(true);
  setProgress('Cropping...');

  try {
    const isGif = file.name.match(/\.gif$/i);
    const isVideo = file.name.match(/\.(mp4|avi|mov|mkv|webm)$/i);

    const element = previewRef.current;
    if (!element) {
      toast.error('Preview not loaded');
      setProcessing(false);
      return;
    }

    let actualX, actualY, actualWidth, actualHeight;

    if (isVideo) {
      const scaleX = element.videoWidth / element.offsetWidth;
      const scaleY = element.videoHeight / element.offsetHeight;

      actualX = Math.round(settings.cropX * scaleX);
      actualY = Math.round(settings.cropY * scaleY);
      actualWidth = Math.round(settings.cropWidth * scaleX);
      actualHeight = Math.round(settings.cropHeight * scaleY);
    } else {
      const scaleX = element.naturalWidth / element.offsetWidth;
      const scaleY = element.naturalHeight / element.offsetHeight;

      actualX = Math.round(settings.cropX * scaleX);
      actualY = Math.round(settings.cropY * scaleY);
      actualWidth = Math.round(settings.cropWidth * scaleX);
      actualHeight = Math.round(settings.cropHeight * scaleY);
    }

    if (actualWidth < 1 || actualHeight < 1) {
      toast.error('Please select a crop area by dragging on the preview');
      setProcessing(false);
      return;
    }

    let outputPath, resultData, resultBlob, resultUrl;

    if (isGif) {
      setProgress('Cropping GIF...');
      outputPath = filePath.replace(/\.[^.]+$/, '_cropped.gif');

      const x2 = actualX + actualWidth;
      const y2 = actualY + actualHeight;

      const processId = generateProcessId('gifsicle_crop');
      if (registerProcess) registerProcess(processId);
      await window.electron.gifsicle(
        ['--crop', `${actualX},${actualY}-${x2},${y2}`, '--optimize=3'],
        filePath,
        outputPath,
        processId
      );

      resultData = await window.electron.readFile(outputPath);
      resultBlob = new Blob([resultData], { type: 'image/gif' });
      resultUrl = URL.createObjectURL(resultBlob);

    } else if (isVideo) {
      setProgress('Cropping video...');
      const fileExt = file.name.split('.').pop();
      outputPath = filePath.replace(/\.[^.]+$/, `_cropped.${fileExt}`);

      const cropFilter = `crop=${actualWidth}:${actualHeight}:${actualX}:${actualY}`;

      const processId = generateProcessId('ffmpeg_crop');
      if (registerProcess) registerProcess(processId);
      await window.electron.ffmpeg(
        [
          '-map', '0:v:0',
          '-map', '0:a?',
          '-vf', cropFilter,
          '-c:v', 'libx264',
          '-preset', 'veryfast',
          '-crf', '18',
          '-c:a', 'copy'
        ],
        filePath,
        outputPath,
        useGpu,
        processId
      );

      resultData = await window.electron.readFile(outputPath);
      resultBlob = new Blob([resultData]);
      resultUrl = URL.createObjectURL(resultBlob);

    } else {
      setProgress('Cropping image...');
      outputPath = filePath.replace(/\.[^.]+$/, '_cropped.png');

      const processId = generateProcessId('imagemagick_crop');
      if (registerProcess) registerProcess(processId);
      await window.electron.imagemagick(
        ['-crop', `${actualWidth}x${actualHeight}+${actualX}+${actualY}`, '+repage'],
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
      setSettings((prev) => ({
        ...prev,
        cropX: 0,
        cropY: 0,
        cropWidth: 0,
        cropHeight: 0
      }));
      setProgress('Complete! File cropped.');
    } catch (error) {
      // If cleanup or update fails, revoke the URL to prevent memory leak
      if (resultUrl) {
        URL.revokeObjectURL(resultUrl);
      }
      throw error;
    }
  } catch (error) {
    console.error('Crop error:', error);
    toast.error('Crop failed: ' + error.message);
  }

  setProcessing(false);
};
