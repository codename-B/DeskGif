import React from 'react';
import { useStore } from '../../store/useStore';
import { Zap, Info, AlertCircle } from 'lucide-react';

const OptimizeSettings = () => {
  const { file, settings, setSettings } = useStore();
  const isGif = file?.name.match(/\.gif$/i);

  // If no file or not a GIF, show warning
  if (!file || !isGif) {
    return (
      <div className="space-y-6">
        <div className="relative overflow-hidden bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-amber-500/10 backdrop-blur-sm border border-amber-500/20 rounded-2xl p-6">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5"></div>
          <div className="relative flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-100 mb-1">GIF File Required</h3>
              <p className="text-sm text-slate-400">
                Please upload a GIF file to use the optimization feature. This tool uses lossy compression to reduce GIF file sizes.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Info Card */}
      <div className="bg-gradient-to-br from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-2xl p-6">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-green-500/20 rounded-xl">
            <Info className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100 mb-1">
              GIF Optimization
            </h3>
            <p className="text-sm text-slate-400">
              Reduce GIF file size using lossy compression. Higher compression = smaller file but lower quality.
            </p>
          </div>
        </div>
      </div>

      {/* Settings Card */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-4">
          <Zap size={18} className="text-purple-400" />
          <label className="text-sm font-semibold text-slate-100">
            Compression Level: <span className="text-purple-400 font-mono">{settings.compressionLevel}</span>
          </label>
        </div>

        {/* Slider */}
        <input
          type="range"
          min="30"
          max="200"
          value={settings.compressionLevel}
          onChange={(e) => setSettings({...settings, compressionLevel: parseInt(e.target.value)})}
          className="w-full h-2 bg-slate-700 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-green-500 [&::-webkit-slider-thumb]:to-blue-500 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-transform [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-gradient-to-r [&::-moz-range-thumb]:from-green-500 [&::-moz-range-thumb]:to-blue-500 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:cursor-grab [&::-moz-range-thumb]:hover:scale-110 [&::-moz-range-thumb]:transition-transform [&::-moz-range-thumb]:border-none"
        />

        <div className="flex justify-between text-xs text-slate-500 mt-3">
          <span>Light (30)</span>
          <span>Medium (115)</span>
          <span>Heavy (200)</span>
        </div>

        {/* Compression Level Indicator */}
        <div className="mt-6 p-4 bg-slate-900/50 rounded-xl border border-slate-700">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">Quality</span>
            <span className={`text-sm font-semibold ${
              settings.compressionLevel < 80 ? 'text-green-400' :
              settings.compressionLevel < 140 ? 'text-yellow-400' :
              'text-red-400'
            }`}>
              {settings.compressionLevel < 80 ? 'High' :
               settings.compressionLevel < 140 ? 'Medium' :
               'Low'}
            </span>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm text-slate-400">File Size</span>
            <span className={`text-sm font-semibold ${
              settings.compressionLevel < 80 ? 'text-red-400' :
              settings.compressionLevel < 140 ? 'text-yellow-400' :
              'text-green-400'
            }`}>
              {settings.compressionLevel < 80 ? 'Larger' :
               settings.compressionLevel < 140 ? 'Medium' :
               'Smaller'}
            </span>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="pt-6 border-t border-slate-700 mt-6">
          <label className="block text-xs font-medium text-slate-400 mb-3">Quick Presets:</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Light', value: 35, desc: 'Best Quality' },
              { label: 'Medium', value: 80, desc: 'Balanced' },
              { label: 'Heavy', value: 200, desc: 'Smallest' }
            ].map((preset) => (
              <button
                key={preset.value}
                onClick={() => setSettings({...settings, compressionLevel: preset.value})}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  settings.compressionLevel === preset.value
                    ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg shadow-green-500/30'
                    : 'bg-slate-700/50 hover:bg-slate-700 text-slate-300'
                }`}
              >
                <div>{preset.label}</div>
                <div className="text-xs opacity-70">{preset.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OptimizeSettings;
