import React from 'react';
import { useStore } from '../../store/useStore';
import {
  Palette,
  Sun,
  Droplet,
  Filter,
  Sparkles,
  FlipVertical,
  FlipHorizontal,
  RotateCw,
  Repeat,
  Eraser,
  CircleDot,
  Frame,
  Info,
  Wand2
} from 'lucide-react';

const EffectsSettings = () => {
  const { settings, setSettings } = useStore();
  return (
    <div className="space-y-6 mb-6">
      {/* Info Card */}
      <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-6">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-purple-500/20 rounded-xl">
            <Info className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100 mb-1">
              Visual Effects & Transformations
            </h3>
            <p className="text-sm text-slate-400">
              Apply color adjustments, filters, transformations, and effects to your media.
              Combine multiple effects to create unique looks.
            </p>
          </div>
        </div>
      </div>

      {/* Colorize Section */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-6">
          <Palette size={18} className="text-purple-400" />
          <h3 className="text-sm font-semibold text-slate-100">Colorize</h3>
        </div>
        <div className="grid grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2">
              Hue <span className="text-purple-400 font-mono">{settings.hue}</span>
            </label>
            <input
              type="range"
              min="0"
              max="200"
              value={settings.hue}
              onChange={(e) => setSettings({...settings, hue: parseInt(e.target.value)})}
              className="w-full h-2 bg-slate-700 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-purple-500 [&::-webkit-slider-thumb]:to-pink-500 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-transform [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-gradient-to-r [&::-moz-range-thumb]:from-purple-500 [&::-moz-range-thumb]:to-pink-500 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:cursor-grab [&::-moz-range-thumb]:hover:scale-110 [&::-moz-range-thumb]:transition-transform [&::-moz-range-thumb]:border-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2">
              Saturation <span className="text-purple-400 font-mono">{settings.saturation}%</span>
            </label>
            <input
              type="range"
              min="0"
              max="200"
              value={settings.saturation}
              onChange={(e) => setSettings({...settings, saturation: parseInt(e.target.value)})}
              className="w-full h-2 bg-slate-700 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-purple-500 [&::-webkit-slider-thumb]:to-pink-500 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-transform [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-gradient-to-r [&::-moz-range-thumb]:from-purple-500 [&::-moz-range-thumb]:to-pink-500 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:cursor-grab [&::-moz-range-thumb]:hover:scale-110 [&::-moz-range-thumb]:transition-transform [&::-moz-range-thumb]:border-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2">
              Lightness <span className="text-purple-400 font-mono">{settings.lightness}%</span>
            </label>
            <input
              type="range"
              min="0"
              max="200"
              value={settings.lightness}
              onChange={(e) => setSettings({...settings, lightness: parseInt(e.target.value)})}
              className="w-full h-2 bg-slate-700 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-purple-500 [&::-webkit-slider-thumb]:to-pink-500 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-transform [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:from-purple-500 [&::-moz-range-thumb]:to-pink-500 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:cursor-grab [&::-moz-range-thumb]:hover:scale-110 [&::-moz-range-thumb]:transition-transform [&::-moz-range-thumb]:border-none"
            />
          </div>
        </div>
      </div>

      {/* Brightness & Contrast */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-6">
          <Sun size={18} className="text-yellow-400" />
          <h3 className="text-sm font-semibold text-slate-100">Brightness & Contrast</h3>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2">
              Brightness <span className="text-yellow-400 font-mono">{settings.brightness}%</span>
            </label>
            <input
              type="range"
              min="0"
              max="200"
              value={settings.brightness}
              onChange={(e) => setSettings({...settings, brightness: parseInt(e.target.value)})}
              className="w-full h-2 bg-slate-700 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-yellow-500 [&::-webkit-slider-thumb]:to-orange-500 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-transform [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-gradient-to-r [&::-moz-range-thumb]:from-yellow-500 [&::-moz-range-thumb]:to-orange-500 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:cursor-grab [&::-moz-range-thumb]:hover:scale-110 [&::-moz-range-thumb]:transition-transform [&::-moz-range-thumb]:border-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2">
              Contrast <span className="text-yellow-400 font-mono">{settings.contrast}%</span>
            </label>
            <input
              type="range"
              min="0"
              max="200"
              value={settings.contrast}
              onChange={(e) => setSettings({...settings, contrast: parseInt(e.target.value)})}
              className="w-full h-2 bg-slate-700 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-yellow-500 [&::-webkit-slider-thumb]:to-orange-500 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-transform [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-gradient-to-r [&::-moz-range-thumb]:from-yellow-500 [&::-moz-range-thumb]:to-orange-500 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:cursor-grab [&::-moz-range-thumb]:hover:scale-110 [&::-moz-range-thumb]:transition-transform [&::-moz-range-thumb]:border-none"
            />
          </div>
        </div>
      </div>

      {/* Color Presets */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-4">
          <Droplet size={18} className="text-blue-400" />
          <h3 className="text-sm font-semibold text-slate-100">Color Presets</h3>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {['none', 'grayscale', 'sepia', 'monochrome', 'negative', 'tint', 'background'].map(preset => (
            <button
              key={preset}
              onClick={() => setSettings({...settings, colorPreset: preset})}
              className={`px-3 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                settings.colorPreset === preset
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/30'
                  : 'bg-slate-700/50 hover:bg-slate-700 text-slate-300'
              }`}
            >
              {preset}
            </button>
          ))}
        </div>
        {settings.colorPreset === 'tint' && (
          <div className="mt-4 pt-4 border-t border-slate-700">
            <label className="block text-xs font-medium text-slate-400 mb-2">Tint Color</label>
            <input
              type="color"
              value={settings.tintColor}
              onChange={(e) => setSettings({...settings, tintColor: e.target.value})}
              className="w-full h-12 bg-slate-900 border border-slate-700 rounded-xl cursor-pointer"
            />
          </div>
        )}
        {settings.colorPreset === 'background' && (
          <div className="mt-4 pt-4 border-t border-slate-700">
            <label className="block text-xs font-medium text-slate-400 mb-2">Background Color</label>
            <input
              type="color"
              value={settings.backgroundColor}
              onChange={(e) => setSettings({...settings, backgroundColor: e.target.value})}
              className="w-full h-12 bg-slate-900 border border-slate-700 rounded-xl cursor-pointer"
            />
          </div>
        )}
      </div>

      {/* Transformations */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-4">
          <RotateCw size={18} className="text-green-400" />
          <h3 className="text-sm font-semibold text-slate-100">Transformations</h3>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <button
            onClick={() => setSettings({...settings, flipVertical: !settings.flipVertical})}
            className={`px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
              settings.flipVertical
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/30'
                : 'bg-slate-700/50 hover:bg-slate-700 text-slate-300'
            }`}
          >
            <FlipVertical size={16} />
            Flip Vertical
          </button>
          <button
            onClick={() => setSettings({...settings, flipHorizontal: !settings.flipHorizontal})}
            className={`px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
              settings.flipHorizontal
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/30'
                : 'bg-slate-700/50 hover:bg-slate-700 text-slate-300'
            }`}
          >
            <FlipHorizontal size={16} />
            Flip Horizontal
          </button>
        </div>
      </div>

      {/* Animation Flow */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-4">
          <Repeat size={18} className="text-cyan-400" />
          <h3 className="text-sm font-semibold text-slate-100">Animation Flow <span className="text-xs text-slate-500">(GIF only)</span></h3>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2">
              Loop Count <span className="text-slate-500">(0 = infinite)</span>
            </label>
            <input
              type="number"
              min="0"
              value={settings.loopCount}
              onChange={(e) => {
                const val = e.target.value;
                setSettings({...settings, loopCount: val === '' ? '' : Number(val)});
              }}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              placeholder="0"
            />
          </div>
          <button
            onClick={() => setSettings({...settings, reverse: !settings.reverse})}
            className={`w-full px-4 py-3 rounded-lg text-sm font-medium transition-all ${
              settings.reverse
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/30'
                : 'bg-slate-700/50 hover:bg-slate-700 text-slate-300'
            }`}
          >
            {settings.reverse ? 'Reverse: ON' : 'Reverse: OFF'}
          </button>
        </div>
      </div>

      {/* Replace Color */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-4">
          <Eraser size={18} className="text-orange-400" />
          <h3 className="text-sm font-semibold text-slate-100">Replace Color with Transparency</h3>
        </div>
        <button
          onClick={() => setSettings({...settings, replaceColorEnabled: !settings.replaceColorEnabled})}
          className={`w-full px-4 py-3 rounded-lg text-sm font-medium transition-all mb-4 ${
            settings.replaceColorEnabled
              ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/30'
              : 'bg-slate-700/50 hover:bg-slate-700 text-slate-300'
          }`}
        >
          {settings.replaceColorEnabled ? 'Enabled' : 'Disabled'}
        </button>
        {settings.replaceColorEnabled && (
          <div className="space-y-4 pt-4 border-t border-slate-700">
            <div className="flex gap-2">
              {['white', 'black', 'custom'].map(target => (
                <button
                  key={target}
                  onClick={() => setSettings({...settings, replaceColorTarget: target})}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                    settings.replaceColorTarget === target
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/30'
                      : 'bg-slate-700/50 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  {target}
                </button>
              ))}
            </div>
            {settings.replaceColorTarget === 'custom' && (
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-2">Custom Color</label>
                <input
                  type="color"
                  value={settings.replaceColorCustom}
                  onChange={(e) => setSettings({...settings, replaceColorCustom: e.target.value})}
                  className="w-full h-12 bg-slate-900 border border-slate-700 rounded-xl cursor-pointer"
                />
              </div>
            )}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2">
                Fuzz <span className="text-orange-400 font-mono">{settings.fuzz}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={settings.fuzz}
                onChange={(e) => setSettings({...settings, fuzz: parseInt(e.target.value)})}
                className="w-full h-2 bg-slate-700 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-orange-500 [&::-webkit-slider-thumb]:to-red-500 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-transform [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-gradient-to-r [&::-moz-range-thumb]:from-orange-500 [&::-moz-range-thumb]:to-red-500 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:cursor-grab [&::-moz-range-thumb]:hover:scale-110 [&::-moz-range-thumb]:transition-transform [&::-moz-range-thumb]:border-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* Blur & Sharpen */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-6">
          <CircleDot size={18} className="text-indigo-400" />
          <h3 className="text-sm font-semibold text-slate-100">Blurring & Sharpening</h3>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2">
              Gaussian Blur <span className="text-indigo-400 font-mono">{settings.gaussianBlur}</span>
            </label>
            <input
              type="range"
              min="0"
              max="20"
              value={settings.gaussianBlur}
              onChange={(e) => setSettings({...settings, gaussianBlur: parseInt(e.target.value)})}
              className="w-full h-2 bg-slate-700 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-indigo-500 [&::-webkit-slider-thumb]:to-purple-500 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-transform [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-gradient-to-r [&::-moz-range-thumb]:from-indigo-500 [&::-moz-range-thumb]:to-purple-500 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:cursor-grab [&::-moz-range-thumb]:hover:scale-110 [&::-moz-range-thumb]:transition-transform [&::-moz-range-thumb]:border-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2">
              Sharpen <span className="text-indigo-400 font-mono">{settings.sharpen}</span>
            </label>
            <input
              type="range"
              min="0"
              max="20"
              value={settings.sharpen}
              onChange={(e) => setSettings({...settings, sharpen: parseInt(e.target.value)})}
              className="w-full h-2 bg-slate-700 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-indigo-500 [&::-webkit-slider-thumb]:to-purple-500 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-transform [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-gradient-to-r [&::-moz-range-thumb]:from-indigo-500 [&::-moz-range-thumb]:to-purple-500 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:cursor-grab [&::-moz-range-thumb]:hover:scale-110 [&::-moz-range-thumb]:transition-transform [&::-moz-range-thumb]:border-none"
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={18} className="text-pink-400" />
          <h3 className="text-sm font-semibold text-slate-100">Filters</h3>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {['none', 'gotham', 'lomo', 'nashville', 'toaster', 'vignette', 'polaroid'].map(filter => (
            <button
              key={filter}
              onClick={() => setSettings({...settings, filter: filter})}
              className={`px-3 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                settings.filter === filter
                  ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/30'
                  : 'bg-slate-700/50 hover:bg-slate-700 text-slate-300'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Frames */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-4">
          <Frame size={18} className="text-teal-400" />
          <h3 className="text-sm font-semibold text-slate-100">Frames</h3>
        </div>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {['none', 'solid', 'rounded', 'camera', 'fuzzy'].map(frame => (
            <button
              key={frame}
              onClick={() => setSettings({...settings, frame: frame})}
              className={`px-3 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                settings.frame === frame
                  ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg shadow-teal-500/30'
                  : 'bg-slate-700/50 hover:bg-slate-700 text-slate-300'
              }`}
            >
              {frame}
            </button>
          ))}
        </div>
        {settings.frame === 'solid' && (
          <div className="space-y-4 pt-4 border-t border-slate-700">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2">Border Width</label>
              <input
                type="number"
                min="1"
                max="50"
                value={settings.borderWidth}
                onChange={(e) => {
                  const val = e.target.value;
                  setSettings({...settings, borderWidth: val === '' ? '' : Number(val)});
                }}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="1"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2">Border Color</label>
              <input
                type="color"
                value={settings.borderColor}
                onChange={(e) => setSettings({...settings, borderColor: e.target.value})}
                className="w-full h-12 bg-slate-900 border border-slate-700 rounded-xl cursor-pointer"
              />
            </div>
          </div>
        )}
        {settings.frame === 'rounded' && (
          <div className="pt-4 border-t border-slate-700">
            <label className="block text-xs font-medium text-slate-400 mb-2">Corner Radius</label>
            <input
              type="number"
              min="1"
              max="100"
              value={settings.cornerRadius}
              onChange={(e) => {
                const val = e.target.value;
                setSettings({...settings, cornerRadius: val === '' ? '' : Number(val)});
              }}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="1"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default EffectsSettings;
