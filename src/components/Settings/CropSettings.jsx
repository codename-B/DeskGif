import React from 'react';
import { useStore } from '../../store/useStore';
import { Crop, Info, X } from 'lucide-react';

const CropSettings = () => {
  const { settings, setSettings } = useStore();
  return (
    <div className="space-y-6">
      {/* Info Card */}
      <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-2xl p-6">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-purple-500/20 rounded-xl">
            <Info className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100 mb-1">
              How to Crop
            </h3>
            <ol className="text-sm text-slate-400 space-y-1">
              <li>1. Click and drag on the preview to select crop area</li>
              <li>2. Release to finalize selection</li>
              <li>3. Click <strong className="text-purple-400">"Process"</strong> to apply</li>
            </ol>
            <p className="text-xs text-purple-400 mt-2">
              Works with images, GIFs, and videos!
            </p>
          </div>
        </div>
      </div>

      {/* Current Selection Card */}
      {settings.cropWidth > 0 && settings.cropHeight > 0 && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Crop size={18} className="text-purple-400" />
              <h3 className="text-sm font-semibold text-slate-100">Current Selection</h3>
            </div>
            <button
              onClick={() => setSettings((prev) => ({
                ...prev,
                cropX: 0,
                cropY: 0,
                cropWidth: 0,
                cropHeight: 0
              }))}
              className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg text-xs font-medium transition-colors"
            >
              <X size={14} />
              Clear
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700">
              <p className="text-xs text-slate-500 mb-1">Position (X, Y)</p>
              <p className="font-mono text-lg text-white">
                {Math.round(settings.cropX)}, {Math.round(settings.cropY)}
              </p>
            </div>
            <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700">
              <p className="text-xs text-slate-500 mb-1">Size (W × H)</p>
              <p className="font-mono text-lg text-white">
                {Math.round(settings.cropWidth)} × {Math.round(settings.cropHeight)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CropSettings;
