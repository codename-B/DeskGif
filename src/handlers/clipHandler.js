import toast from 'react-hot-toast';
import { generateProcessId } from '../utils/processId';

export const handleClip = async ({
  file,
  filePath,
  settings,
  setProcessing,
  setProgress,
  updateFile,
  cleanupOldFile,
  appSettings = {},
  registerProcess
}) => {
  const useGpu = appSettings.useGpu || false;

  setProcessing(true);
  const isGif = file.name.match(/\.gif$/i);

  try {
    if (isGif) {
      setProgress('Clipping GIF frames...');
      const outputPath = filePath.replace(/\.[^.]+$/, '_clipped.gif');

      const parsedStart = Number(settings.clipStartFrame);
      const parsedEnd = Number(settings.clipEndFrame);

      if (!Number.isFinite(parsedStart) || !Number.isFinite(parsedEnd)) {
        toast.error('Please enter valid start and end frames.');
        setProcessing(false);
        return;
      }

      const startFrame = Math.max(0, Math.floor(parsedStart));
      let endFrame = Math.max(startFrame, Math.floor(parsedEnd));

      // Best-effort clamp to detected frame count if available in settings
      const detectedFrames = Number(settings?.detectedFrameCount);
      if (Number.isFinite(detectedFrames) && detectedFrames > 0) {
        const maxIdx = Math.max(0, detectedFrames - 1);
        endFrame = Math.min(endFrame, maxIdx);
      }

      if (endFrame < startFrame) {
        toast.error('End frame must be after start frame!');
        setProcessing(false);
        return;
      }

      // Use ffmpeg with palettegen/paletteuse for quality; single-pass filter_complex
      const filterComplex =
        `[0:v]select=between(n\\,${startFrame}\\,${endFrame}),setpts=PTS-STARTPTS,` +
        `split[sel][palin];[palin]palettegen=stats_mode=single[pal];` +
        `[sel][pal]paletteuse=dither=floyd_steinberg`;

      const ffmpegArgs = [
        '-v', 'error',
        '-filter_complex', filterComplex,
        '-gifflags', '+transdiff',
      ];

      const processId = generateProcessId('ffmpeg_gif_clip');
      if (registerProcess) registerProcess(processId);
      await window.electron.ffmpeg(ffmpegArgs, filePath, outputPath, false, processId);

      const resultData = await window.electron.readFile(outputPath);
      const resultBlob = new Blob([resultData], { type: 'image/gif' });
      const resultUrl = URL.createObjectURL(resultBlob);

      try {
        updateFile(outputPath, resultUrl);
        await cleanupOldFile(filePath);
        setProgress('Complete! GIF clipped.');
      } catch (error) {
        if (resultUrl) {
          URL.revokeObjectURL(resultUrl);
        }
        throw error;
      }
    } else {
      setProgress('Clipping video...');

      const fileExt = file.name.split('.').pop();
      const outputPath = filePath.replace(/\.[^.]+$/, `_clipped.${fileExt}`);

      const startParts = settings.clipStartTime.split(':').map(Number);
      const endParts = settings.clipEndTime.split(':').map(Number);

      const startSeconds = startParts[0] * 3600 + startParts[1] * 60 + startParts[2];
      const endSeconds = endParts[0] * 3600 + endParts[1] * 60 + endParts[2];
      const duration = endSeconds - startSeconds;

      if (duration <= 0) {
        toast.error('End time must be after start time!');
        setProcessing(false);
        return;
      }

      const clipArgs = [
        '-ss', settings.clipStartTime,
        '-t', duration.toString(),
        '-c', 'copy'
      ];

      const processId = generateProcessId('ffmpeg_clip');
      if (registerProcess) registerProcess(processId);
      await window.electron.ffmpeg(clipArgs, filePath, outputPath, useGpu, processId);

      const resultData = await window.electron.readFile(outputPath);
      const resultBlob = new Blob([resultData]);
      const resultUrl = URL.createObjectURL(resultBlob);

      try {
        updateFile(outputPath, resultUrl);
        await cleanupOldFile(filePath);
        setProgress('Complete! Video clipped.');
      } catch (error) {
        if (resultUrl) {
          URL.revokeObjectURL(resultUrl);
        }
        throw error;
      }
    }
  } catch (error) {
    console.error('Clip error:', error);
    toast.error('Clipping failed: ' + error.message);
  }

  setProcessing(false);
};
