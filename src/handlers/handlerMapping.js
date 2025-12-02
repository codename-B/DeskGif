import { handleVideoToGif } from './videoToGifHandler';
import { handleResize } from './resizeHandler';
import { handleCrop } from './cropHandler';
import { handleRotate } from './rotateHandler';
import { handleOptimize } from './optimizeHandler';
import { handleEffects } from './effectsHandler';
import { handleClip } from './clipHandler';
import { handleSpeedChange } from './speedHandler';

export const processHandlers = {
  convert: handleVideoToGif,
  resize: handleResize,
  crop: handleCrop,
  rotate: handleRotate,
  optimize: handleOptimize,
  effects: handleEffects,
  clip: handleClip,
  speed: handleSpeedChange,
};
