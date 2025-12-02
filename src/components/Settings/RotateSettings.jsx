import React from 'react';
import { useStore } from '../../store/useStore';
import { RotateCw, Info } from 'lucide-react';

const RotateSettings = () => {
  const { settings, setSettings } = useStore();
  return (
    <div className="space-y-6">
      {/* Info Card */}
      <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-6">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-500/20 rounded-xl">
            <Info className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100 mb-1">
              Rotate Media
            </h3>
            <p className="text-sm text-slate-400">
              Use the slider to rotate. The preview updates in real-time!
              Click <strong className="text-purple-400">"Process"</strong> to apply permanently.
            </p>
            <p className="text-xs text-blue-400 mt-2">
              Works with images, GIFs, and videos!
            </p>
          </div>
        </div>
      </div>

      {/* Rotation Control Card */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-4">
          <RotateCw size={18} className="text-purple-400" />
          <label className="text-sm font-semibold text-slate-100">
            Rotation: <span className="text-purple-400 font-mono">{settings.liveRotation}°</span>
          </label>
        </div>

        {/* Slider */}
        <input
          type="range"
          min="-180"
          max="180"
          value={settings.liveRotation}
          onChange={(e) => setSettings({...settings, liveRotation: parseInt(e.target.value)})}
          className="w-full h-2 bg-slate-700 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-blue-500 [&::-webkit-slider-thumb]:to-purple-500 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-transform [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-gradient-to-r [&::-moz-range-thumb]:from-blue-500 [&::-moz-range-thumb]:to-purple-500 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:cursor-grab [&::-moz-range-thumb]:hover:scale-110 [&::-moz-range-thumb]:transition-transform [&::-moz-range-thumb]:border-none"
        />

        <div className="flex justify-between text-xs text-slate-500 mt-3 mb-6">
          <span>-180°</span>
          <span>0°</span>
          <span>180°</span>
        </div>

        {/* Quick Presets */}
        <div className="pt-4 border-t border-slate-700">
          <label className="block text-xs font-medium text-slate-400 mb-3">Quick Presets:</label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: '-90°', value: -90 },
              { label: '0°', value: 0 },
              { label: '90°', value: 90 },
              { label: '180°', value: 180 }
            ].map((preset) => (
              <button
                key={preset.value}
                onClick={() => setSettings({...settings, liveRotation: preset.value})}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  settings.liveRotation === preset.value
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-purple-500/30'
                    : 'bg-slate-700/50 hover:bg-slate-700 text-slate-300'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RotateSettings;
