import toast from 'react-hot-toast';
import { generateProcessId } from '../utils/processId';

export const handleEffects = async ({
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
  setProgress('Applying effects...');

  let tempPath = null;
  try {
    const fileExt = filePath.match(/\.[^.]+$/)?.[0] || '.png';
    const isGif = fileExt.toLowerCase() === '.gif';
    const isVideo = !!fileExt.match(/\.(mp4|avi|mov|mkv|webm)$/i);

    let outputPath = filePath.replace(/\.[^.]+$/, `_effects${fileExt}`);
    let magickArgs = [];
    let gifsicleArgs = [];

    if (isGif) {
      magickArgs.push('-coalesce');
    }

    // ImageMagick effects
    if (settings.hue !== 0 || settings.saturation !== 100 || settings.lightness !== 100) {
      magickArgs.push('-modulate', `${settings.lightness},${settings.saturation},${settings.hue}`);
    }
    if (settings.brightness !== 100 || settings.contrast !== 100) {
      const brightnessVal = settings.brightness - 100;
      const contrastVal = settings.contrast - 100;
      magickArgs.push('-brightness-contrast', `${brightnessVal}x${contrastVal}`);
    }
    if (settings.colorPreset === 'grayscale') magickArgs.push('-colorspace', 'Gray');
    else if (settings.colorPreset === 'sepia') magickArgs.push('-sepia-tone', '80%');
    else if (settings.colorPreset === 'monochrome') magickArgs.push('-monochrome');
    else if (settings.colorPreset === 'negative') magickArgs.push('-negate');
    else if (settings.colorPreset === 'tint') magickArgs.push('-fill', settings.tintColor, '-tint', '50');
    else if (settings.colorPreset === 'background') magickArgs.push('-background', settings.backgroundColor, '-flatten');

    if (settings.flipVertical) magickArgs.push('-flip');
    if (settings.flipHorizontal) magickArgs.push('-flop');
    if (settings.rotationDegrees !== 0) magickArgs.push('-rotate', settings.rotationDegrees.toString());

    if (settings.replaceColorEnabled) {
      const targetColor = settings.replaceColorTarget === 'custom' ? settings.replaceColorCustom : settings.replaceColorTarget;
      magickArgs.push('-fuzz', `${settings.fuzz}%`, '-transparent', targetColor);
    }

    if (settings.gaussianBlur > 0) magickArgs.push('-blur', `0x${settings.gaussianBlur}`);
    if (settings.sharpen > 0) magickArgs.push('-sharpen', `0x${settings.sharpen}`);

    if (settings.filter === 'gotham') magickArgs.push('-modulate', '120,10,100', '-fill', '#222b6d', '-colorize', '20');
    else if (settings.filter === 'lomo') magickArgs.push('-channel', 'R', '-level', '33%', '-channel', 'G', '-level', '33%');
    else if (settings.filter === 'nashville') magickArgs.push('-contrast', '-modulate', '100,150,100', '-auto-gamma');
    else if (settings.filter === 'toaster') magickArgs.push('-modulate', '150,80,100', '-gamma', '1.2', '-contrast');
    else if (settings.filter === 'vignette') magickArgs.push('-background', 'black', '-vignette', '0x20');
    else if (settings.filter === 'polaroid') magickArgs.push('-bordercolor', 'white', '-border', '10', '-bordercolor', 'grey60', '-border', '1');

    if (settings.frame === 'solid') magickArgs.push('-bordercolor', settings.borderColor, '-border', settings.borderWidth.toString());
    else if (settings.frame === 'rounded') magickArgs.push('(', '+clone', '-alpha', 'extract', '-draw', `roundrectangle 0,0,%w,%h,${settings.cornerRadius},${settings.cornerRadius}`, ')', '-compose', 'CopyOpacity', '-composite');
    else if (settings.frame === 'camera') magickArgs.push('-frame', '10x10+3+3');
    else if (settings.frame === 'fuzzy') magickArgs.push('-virtual-pixel', 'edge', '-blur', '0x8', '-fuzz', '50%', '-trim');

    // Gifsicle animation settings
    if (isGif) {
      if (settings.loopCount >= 0) gifsicleArgs.push(`--loopcount=${settings.loopCount}`);
      if (settings.reverse) gifsicleArgs.push('#-1-0');
      if (settings.skipFrames > 1) {
        gifsicleArgs.unshift('--unoptimize');
        gifsicleArgs.push(`#0-:${settings.skipFrames}`);
      }
    }

    if (magickArgs.length === (isGif ? 1 : 0) && gifsicleArgs.length === 0 && !isVideo) {
      toast.error('No effects or animation changes selected!');
      setProcessing(false);
      return;
    }

    let finalOutputPath;
    if (isVideo) {
      setProgress('Applying effects to video...');
      const vfilters = [];
      if (settings.hue !== 0 || settings.saturation !== 100) vfilters.push(`hue=s=${settings.saturation / 100}`);
      if (settings.brightness !== 100 || settings.contrast !== 100) vfilters.push(`eq=brightness=${(settings.brightness - 100) / 100}:contrast=${settings.contrast / 100}`);
      if (settings.flipVertical) vfilters.push('vflip');
      if (settings.flipHorizontal) vfilters.push('hflip');

      if (vfilters.length === 0) {
        toast.error('Selected effects are not supported for videos!');
        setProcessing(false);
        return;
      }
      finalOutputPath = outputPath;
      const processId = generateProcessId('ffmpeg_effects');
      if (registerProcess) registerProcess(processId);
      await window.electron.ffmpeg(['-vf', vfilters.join(','), '-c:a', 'copy'], filePath, finalOutputPath, useGpu, processId);
    } else {
      let currentPath = filePath;
      if (magickArgs.length > (isGif ? 1 : 0)) {
        setProgress(isGif ? 'Applying effects to GIF frames...' : 'Applying effects...');
        tempPath = filePath.replace(/\.[^.]+$/, `_temp${fileExt}`);
        if (isGif) magickArgs.push('-layers', 'Optimize');
        const processId = generateProcessId('imagemagick_effects');
        if (registerProcess) registerProcess(processId);
        await window.electron.imagemagick(magickArgs, currentPath, tempPath, processId);
        currentPath = tempPath;
      }

      if (isGif && gifsicleArgs.length > 0) {
        setProgress('Applying GIF animations...');
        finalOutputPath = filePath.replace(/\.[^.]+$/, `_animated${fileExt}`);
        gifsicleArgs.push('--optimize=3');
        const processId = generateProcessId('gifsicle_effects');
        if (registerProcess) registerProcess(processId);
        await window.electron.gifsicle(gifsicleArgs, currentPath, finalOutputPath, processId);
      } else {
        finalOutputPath = currentPath;
      }
    }

    if (finalOutputPath && finalOutputPath !== filePath) {
      const resultData = await window.electron.readFile(finalOutputPath);
      const resultBlob = new Blob([resultData], { type: isGif ? 'image/gif' : isVideo ? 'video/mp4' : 'image/png' });
      const resultUrl = URL.createObjectURL(resultBlob);

      try {
        await cleanupOldFile(filePath);
        updateFile(finalOutputPath, resultUrl);
      } catch (error) {
        if (resultUrl) {
          URL.revokeObjectURL(resultUrl);
        }
        throw error;
      }
    }

    setProgress('Complete! File updated.');
  } catch (error) {
    console.error('Effects error:', error);
    toast.error('Effects failed: ' + error.message);
  } finally {
    if (tempPath) {
      await window.electron.deleteFile(tempPath);
    }
    setProcessing(false);
  }
};
