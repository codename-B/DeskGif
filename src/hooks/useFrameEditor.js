import { useState } from 'react';
import { useStore } from '../store/useStore';
import toast from 'react-hot-toast';

export const useFrameEditor = (setProgress) => {
  const { file, preview } = useStore();
  const [frames, setFrames] = useState([]);
  const [extractingFrames, setExtractingFrames] = useState(false);
  const [frameRange, setFrameRange] = useState({ from: 1, to: 5 });
  const [gifOptions, setGifOptions] = useState({
    delayTime: 20,
    loopCount: 0,
    useGlobalColormap: false,
    crossfade: false,
    dontStack: false
  });

  const extractFrames = async () => {
    if (!file || !file.name.match(/\.gif$/i)) {
      toast.error('Please upload a GIF file first!');
      return;
    }

    setExtractingFrames(true);
    setProgress('Analyzing GIF frames...');

    try {
      const frameData = await window.electron.getGifFrames(file.path);
      setFrames(frameData.map((frame, i) => ({
        id: i,
        delay: frame.delay,
        skip: false,
        thumbnail: `data:image/png;base64,${frame.thumbnail}`
      })));
      setFrameRange({ from: 1, to: Math.min(5, frameData.length) });
      setProgress('Frames loaded! Edit delays and skip frames below.');
    } catch (error) {
      console.error('Frame extraction error:', error);
      toast.error('Failed to extract frames: ' + error.message);
    }

    setExtractingFrames(false);
  };

  const updateFrameDelay = (frameId, delay) => {
    setFrames(frames.map(f => f.id === frameId ? {...f, delay: parseInt(delay) || 0} : f));
  };

  const toggleFrameSkip = (frameId) => {
    setFrames(frames.map(f => f.id === frameId ? {...f, skip: !f.skip} : f));
  };

  const copyFrame = (frameId) => {
    const frameToCopy = frames.find(f => f.id === frameId);
    if (frameToCopy) {
      const newFrame = {...frameToCopy, id: frames.length};
      const insertIndex = frameId + 1;
      const newFrames = [
        ...frames.slice(0, insertIndex),
        newFrame,
        ...frames.slice(insertIndex)
      ];
      setFrames(newFrames.map((f, i) => ({...f, id: i})));
    }
  };

  const toggleFrameRange = (skip) => {
    const from = frameRange.from - 1;
    const to = frameRange.to - 1;
    setFrames(frames.map((f, i) =>
      i >= from && i <= to ? {...f, skip} : f
    ));
  };

  return {
    frames,
    setFrames,
    extractingFrames,
    frameRange,
    setFrameRange,
    gifOptions,
    setGifOptions,
    extractFrames,
    updateFrameDelay,
    toggleFrameSkip,
    copyFrame,
    toggleFrameRange
  };
};
