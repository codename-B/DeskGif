import React from 'react';
import { useStore } from '../../store/useStore';
import { Gauge, Zap, Info, Wand2 } from 'lucide-react';

const SpeedSettings = ({ handleProcess }) => {
  const { settings, setSettings } = useStore();
  return (
    <div className="space-y-6 mb-6">
      {/* Info Card */}
      <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-2xl p-6">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-cyan-500/20 rounded-xl">
            <Info className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100 mb-1">
              Speed & Frame Control
            </h3>
            <p className="text-sm text-slate-400">
              Change playback speed or skip frames to speed up your GIFs and videos.
              Uses FFmpeg for fast processing.
              <strong className="text-cyan-400"> Click "Apply Speed Changes" to process.</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Speed Control */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-6">
          <Gauge size={18} className="text-cyan-400" />
          <h3 className="text-sm font-semibold text-slate-100">Speed Multiplier</h3>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2">
              Speed <span className="text-cyan-400 font-mono">{settings.speedMultiplier}x</span>
            </label>
            <input
              type="range"
              min="0.25"
              max="4"
              step="0.25"
              value={settings.speedMultiplier}
              onChange={(e) => setSettings({...settings, speedMultiplier: parseFloat(e.target.value)})}
              className="w-full h-2 bg-slate-700 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-cyan-500 [&::-webkit-slider-thumb]:to-blue-500 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-transform [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-gradient-to-r [&::-moz-range-thumb]:from-cyan-500 [&::-moz-range-thumb]:to-blue-500 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:cursor-grab [&::-moz-range-thumb]:hover:scale-110 [&::-moz-range-thumb]:transition-transform [&::-moz-range-thumb]:border-none"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-2">
              <span>0.25x (slower)</span>
              <span>1x (normal)</span>
              <span>4x (faster)</span>
            </div>
          </div>
          <p className="text-xs text-slate-400 bg-slate-900/50 rounded-lg p-3 border border-slate-700">
            Adjusts playback speed by changing frame timestamps.
            {settings.speedMultiplier < 1 ? ' Slower playback.' :
             settings.speedMultiplier === 1 ? ' Normal speed.' :
             ' Faster playback.'}
          </p>
        </div>
      </div>

      {/* Frame Skipping */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-6">
          <Zap size={18} className="text-yellow-400" />
          <h3 className="text-sm font-semibold text-slate-100">Frame Skipping</h3>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2 flex items-center gap-2">
              <Zap size={14} className="text-yellow-400" />
              Keep Every Nth Frame <span className="text-yellow-400 font-mono">(every {settings.skipFrames}{settings.skipFrames === 1 ? ' - no skip' : 'th'})</span>
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={settings.skipFrames}
              onChange={(e) => setSettings({...settings, skipFrames: parseInt(e.target.value)})}
              className="w-full h-2 bg-slate-700 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-yellow-500 [&::-webkit-slider-thumb]:to-orange-500 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-transform [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-gradient-to-r [&::-moz-range-thumb]:from-yellow-500 [&::-moz-range-thumb]:to-orange-500 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:cursor-grab [&::-moz-range-thumb]:hover:scale-110 [&::-moz-range-thumb]:transition-transform [&::-moz-range-thumb]:border-none"
            />
          </div>
          <p className="text-xs text-slate-400 bg-slate-900/50 rounded-lg p-3 border border-slate-700">
            {settings.skipFrames === 1 ?
              'All frames included - no skipping' :
              `Keeps every ${settings.skipFrames}th frame (frames 0, ${settings.skipFrames}, ${settings.skipFrames*2}...). Reduces file size and increases speed by ${Math.round((1 - 1/settings.skipFrames) * 100)}%.`
            }
          </p>
        </div>
      </div>

      {/* Quick Presets */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-4">
          <Wand2 size={18} className="text-purple-400" />
          <h3 className="text-sm font-semibold text-slate-100">Quick Presets</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setSettings({...settings, speedMultiplier: 0.5, skipFrames: 1})}
            className="px-4 py-3 rounded-lg text-sm font-medium bg-slate-700/50 hover:bg-slate-700 text-slate-300 transition-all"
          >
            Half Speed
          </button>
          <button
            onClick={() => setSettings({...settings, speedMultiplier: 1, skipFrames: 1})}
            className="px-4 py-3 rounded-lg text-sm font-medium bg-slate-700/50 hover:bg-slate-700 text-slate-300 transition-all"
          >
            Normal
          </button>
          <button
            onClick={() => setSettings({...settings, speedMultiplier: 2, skipFrames: 1})}
            className="px-4 py-3 rounded-lg text-sm font-medium bg-slate-700/50 hover:bg-slate-700 text-slate-300 transition-all"
          >
            2x Speed
          </button>
          <button
            onClick={() => setSettings({...settings, speedMultiplier: 1, skipFrames: 2})}
            className="px-4 py-3 rounded-lg text-sm font-medium bg-slate-700/50 hover:bg-slate-700 text-slate-300 transition-all"
          >
            Skip Half Frames
          </button>
        </div>
      </div>

      {/* Apply Button */}
      <button
        onClick={handleProcess}
        className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-4 px-6 rounded-xl font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2"
      >
        <Zap size={20} />
        Apply Speed Changes
      </button>
    </div>
  );
};

export default SpeedSettings;
