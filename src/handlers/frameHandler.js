import toast from 'react-hot-toast';
import { generateProcessId } from '../utils/processId';

export const rebuildGif = async ({
  frames,
  filePath,
  gifOptions,
  setProcessing,
  setProgress,
  cleanupOldFile,
  updateFile,
  setFrames,
  registerProcess
}) => {
  if (frames.length === 0) {
    toast.error('No frames to process!');
    return;
  }

  setProcessing(true);
  setProgress('Rebuilding GIF...');

  try {
    const outputPath = filePath.replace(/\.[^.]+$/, '_edited.gif');

    const keptFrames = frames
      .map((frame, index) => !frame.skip ? index : null)
      .filter(index => index !== null);

    if (keptFrames.length === 0) {
      toast.error('You must keep at least one frame!');
      setProcessing(false);
      return;
    }

    const args = [];

    const frameSelection = keptFrames.map(i => `#${i}`).join(' ').split(' ');
    args.push(...frameSelection);

    if (gifOptions.delayTime > 0) {
      args.push(`--delay=${gifOptions.delayTime}`);
    } else {
      frames.forEach((frame, index) => {
        if (!frame.skip && frame.delay > 0) {
          const keptIndex = keptFrames.indexOf(index);
          if (keptIndex >= 0) {
            args.push(`--delay=${frame.delay}`, `#${keptIndex}`);
          }
        }
      });
    }

    args.push(`--loopcount=${gifOptions.loopCount}`);

    if (gifOptions.dontStack) {
      args.push('--disposal=previous');
    }

    args.push('--optimize=3');

    const processId = generateProcessId('gifsicle_frames');
    if (registerProcess) registerProcess(processId);
    await window.electron.gifsicle(args, filePath, outputPath, processId);

    const resultData = await window.electron.readFile(outputPath);
    const resultBlob = new Blob([resultData], { type: 'image/gif' });
    const resultUrl = URL.createObjectURL(resultBlob);

    try {
      await cleanupOldFile(filePath);
      updateFile(outputPath, resultUrl);
      setFrames([]);
      setProgress('Complete! GIF rebuilt.');
    } catch (error) {
      if (resultUrl) {
        URL.revokeObjectURL(resultUrl);
      }
      throw error;
    }
  } catch (error) {
    console.error('Rebuild error:', error);
    toast.error('Failed to rebuild GIF: ' + error.message);
  }

  setProcessing(false);
};
