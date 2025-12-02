export const getDefaultSettings = (appSettings = {}) => ({
  // General (use app settings if available)
  width: appSettings.defaultWidth || 800,
  height: appSettings.defaultHeight || 600,
  fps: appSettings.defaultFps || 15,
  lossy: appSettings.defaultVideoCompression || 80,
  compressionLevel: appSettings.defaultCompressionLevel || 80,
  rotation: 90,
  liveRotation: 0,
  cropX: 0,
  cropY: 0,
  cropWidth: 100,
  cropHeight: 100,

  // Effects - Colorize
  hue: 0,
  saturation: 100,
  lightness: 100,
  brightness: 100,
  contrast: 100,

  // Color Presets
  colorPreset: 'none',
  tintColor: '#ff0000',
  backgroundColor: '#ffffff',

  // Transformations
  flipVertical: false,
  flipHorizontal: false,
  rotationDegrees: 0,

  // Animation
  loopCount: appSettings.defaultLoopCount || 0,
  reverse: false,
  boomerang: false,
  fadeIn: false,
  fadeOut: false,
  addCounter: false,

  // Speed Control
  speedMultiplier: 1, // 1 = normal speed, 2 = 2x faster, 0.5 = half speed
  skipFrames: 1, // 1 = no skipping, 2 = keep every 2nd frame, 3 = keep every 3rd frame, etc.

  // Replace color
  replaceColorEnabled: false,
  replaceColorTarget: 'white',
  replaceColorCustom: '#ffffff',
  fuzz: 10,

  // Blur/Sharpen
  gaussianBlur: 0,
  sharpen: 0,

  // Filters
  filter: 'none',

  // Frames
  frame: 'none',
  borderWidth: 10,
  borderColor: '#000000',
  cornerRadius: 20,

  // Clip/Trim
  clipStartTime: '00:00:00',
  clipEndTime: '00:00:10',
  clipStartFrame: 0,
  clipEndFrame: 100,
  clipMode: 'time' // 'time' for video, 'frames' for GIF
});

// For backward compatibility
export const defaultSettings = getDefaultSettings();
