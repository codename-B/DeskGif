import React from 'react';
import { useStore } from '../../store/useStore';
import { Maximize2, Info } from 'lucide-react';

const ResizeSettings = ({ previewDimensions }) => {
  const { settings, setSettings } = useStore();
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
              Resize Media
            </h3>
            <p className="text-sm text-slate-400">
              {previewDimensions.width > 0 ? (
                <>
                  Current dimensions: <span className="font-mono text-purple-400">{previewDimensions.width} × {previewDimensions.height}</span>
                </>
              ) : (
                'Enter new dimensions for your media'
              )}
            </p>
            <p className="text-xs text-blue-400 mt-2">
              Works with images, GIFs, and videos!
            </p>
          </div>
        </div>
      </div>

      {/* Settings Card */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-4">
          <Maximize2 size={18} className="text-purple-400" />
          <h3 className="text-sm font-semibold text-slate-100">Dimensions</h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2">
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
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2">
              Height (pixels)
            </label>
            <input
              type="number"
              value={settings.height}
              onChange={(e) => {
                const val = e.target.value;
                setSettings({...settings, height: val === '' ? '' : Number(val)});
              }}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="600"
            />
          </div>
        </div>

        {/* Quick Aspect Ratios */}
        {previewDimensions.width > 0 && (
          <div className="pt-6 border-t border-slate-700 mt-6">
            <label className="block text-xs font-medium text-slate-400 mb-3">Quick Sizes:</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: '50%', factor: 0.5 },
                { label: '75%', factor: 0.75 },
                { label: '125%', factor: 1.25 }
              ].map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => setSettings({
                    ...settings,
                    width: Math.round(previewDimensions.width * preset.factor),
                    height: Math.round(previewDimensions.height * preset.factor)
                  })}
                  className="px-4 py-2 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-medium transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResizeSettings;
