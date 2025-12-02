import React from 'react';
import { Film, Zap, Info } from 'lucide-react';

const ConvertSettings = ({ settings, setSettings }) => {
  return (
    <div className="space-y-6">
      {/* Info Card */}
      <div className="bg-gradient-to-br from-blue-500/10 to-green-500/10 border border-blue-500/20 rounded-2xl p-6">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-500/20 rounded-xl">
            <Info className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100 mb-1">
              Video to GIF Conversion
            </h3>
            <p className="text-sm text-slate-400">
              Dimensions are auto-detected from your video. High-quality palette generation ensures accurate colors.
              Use the <strong className="text-purple-400">Optimize</strong> tool afterwards to compress your GIF.
            </p>
          </div>
        </div>
      </div>

      {/* Settings Card */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 backdrop-blur-sm">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2 flex items-center gap-2">
              <Film size={14} />
              Width (pixels)
            </label>
            <input
              type="number"
              value={settings.width}
              onChange={(e) => {
                const val = e.target.value;
                setSettings({...settings, width: val === '' ? '' : Number(val)});
              }}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="800"
            />
            <p className="text-xs text-slate-500 mt-2">Output width in pixels</p>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2 flex items-center gap-2">
              <Zap size={14} />
              Frames Per Second
            </label>
            <input
              type="number"
              min="1"
              max="60"
              value={settings.fps}
              onChange={(e) => {
                const val = e.target.value;
                setSettings({...settings, fps: val === '' ? '' : Number(val)});
              }}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="15"
            />
            <p className="text-xs text-slate-500 mt-2">Lower FPS = smaller file size</p>
          </div>
        </div>

        {/* FPS Presets */}
        <div className="mt-6 pt-6 border-t border-slate-700">
          <label className="block text-xs font-medium text-slate-400 mb-3">Quick FPS Presets:</label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: '10 FPS', value: 10, desc: 'Smallest' },
              { label: '15 FPS', value: 15, desc: 'Balanced' },
              { label: '24 FPS', value: 24, desc: 'Smooth' },
              { label: '30 FPS', value: 30, desc: 'High Quality' }
            ].map((preset) => (
              <button
                key={preset.value}
                onClick={() => setSettings({...settings, fps: preset.value})}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  settings.fps === preset.value
                    ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30'
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

export default ConvertSettings;
