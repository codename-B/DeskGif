import toast from 'react-hot-toast';
import { generateProcessId } from '../utils/processId';

export const handleOptimize = async ({
  filePath,
  settings,
  setProcessing,
  setProgress,
  cleanupOldFile,
  updateFile
  ,
  registerProcess
}) => {
  setProcessing(true);
  setProgress('Optimizing GIF...');

  try {
    const outputPath = filePath.replace(/\.[^.]+$/, '_optimized.gif');
    const processId = generateProcessId('gifsicle_optimize');
    if (registerProcess) registerProcess(processId);
    await window.electron.gifsicle(
      ['--optimize=3', `--lossy=${settings.compressionLevel}`, '--colors', '256'],
      filePath,
      outputPath,
      processId
    );

    const resultData = await window.electron.readFile(outputPath);
    const resultBlob = new Blob([resultData], { type: 'image/gif' });
    const resultUrl = URL.createObjectURL(resultBlob);

    try {
      await cleanupOldFile(filePath);
      updateFile(outputPath, resultUrl);
      setProgress('Complete! File updated.');
    } catch (error) {
      if (resultUrl) {
        URL.revokeObjectURL(resultUrl);
      }
      throw error;
    }
  } catch (error) {
    console.error('Optimize error:', error);
    toast.error('Optimization failed: ' + error.message);
  }

  setProcessing(false);
};
