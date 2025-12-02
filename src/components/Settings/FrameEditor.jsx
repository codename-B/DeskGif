import React from 'react';
import { useStore } from '../../store/useStore';
import { AlertCircle, Film, Clock, Play, Copy, SkipForward, Settings, Sparkles } from 'lucide-react';
import { rebuildGif } from '../../handlers/frameHandler';

const FrameEditor = ({
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
  toggleFrameRange,
}) => {
  const {
    file,
    filePath,
    setProcessing,
    setProgress,
    processing,
    progress,
    cleanupOldFile,
    updateFile,
  } = useStore();

  const onRebuildGif = () => {
    rebuildGif({
      frames,
      filePath,
      gifOptions,
      setProcessing,
      setProgress,
      cleanupOldFile,
      updateFile,
      setFrames
    });
  };

  return (
    <div className="space-y-6 mb-4">
      {!file || !file.name.match(/\.gif$/i) ? (
        <div className="relative overflow-hidden bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-amber-500/10 backdrop-blur-sm border border-amber-500/20 rounded-2xl p-6">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5"></div>
          <div className="relative flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-100 mb-1">GIF File Required</h3>
              <p className="text-sm text-slate-400">
                Please upload a GIF file to edit frames
              </p>
            </div>
          </div>
        </div>
      ) : frames.length === 0 ? (
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-blue-500/10 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-6">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5"></div>
          <div className="relative">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <Film className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-100 mb-2">Edit GIF Frames</h3>
                <p className="text-sm text-slate-400">
                  Extract frames from your GIF to edit delays, skip frames, or reorder them.
                </p>
              </div>
            </div>
            <button
              onClick={extractFrames}
              disabled={extractingFrames}
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-blue-600 disabled:from-slate-700 disabled:to-slate-700 disabled:text-slate-500 transition-all duration-200 shadow-lg hover:shadow-purple-500/25"
            >
              {extractingFrames ? 'Extracting Frames...' : 'Extract Frames'}
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Frame Thumbnails */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 overflow-x-auto">
            <div className="flex items-center gap-3 mb-4">
              <Film className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-semibold text-slate-100">Frame Timeline</h3>
              <span className="text-sm text-slate-400">({frames.length} frames)</span>
            </div>
            <div className="flex gap-4 pb-2">
              {frames.map((frame, index) => (
                <div key={frame.id} className="flex-shrink-0">
                  <div className={`relative border-2 ${frame.skip ? 'border-red-500/50 opacity-50' : 'border-slate-600'} rounded-xl overflow-hidden transition-all duration-200 hover:border-purple-500`}>
                    <img src={frame.thumbnail} alt={`Frame ${index + 1}`} className="w-32 h-24 object-cover" />
                    <div className="absolute top-2 left-2 bg-slate-900/90 backdrop-blur-sm text-slate-100 px-2 py-1 text-xs rounded-lg font-semibold">
                      #{index + 1}
                    </div>
                  </div>
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <label className="text-xs text-slate-400">Delay:</label>
                      <input
                        type="number"
                        value={frame.delay}
                        onChange={(e) => updateFrameDelay(frame.id, e.target.value)}
                        className="w-16 px-2 py-1 text-sm bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => toggleFrameSkip(frame.id)}
                        className={`flex-1 px-2 py-1 text-xs rounded-lg text-white font-medium transition-all duration-200 ${
                          frame.skip
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg shadow-green-500/25'
                            : 'bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 shadow-lg shadow-red-500/25'
                        }`}
                      >
                        {frame.skip ? 'enable' : 'skip'}
                      </button>
                      <button
                        onClick={() => copyFrame(frame.id)}
                        className="flex-1 px-2 py-1 text-xs bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg font-medium transition-all duration-200 shadow-lg shadow-blue-500/25"
                      >
                        copy
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Toggle Range */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <SkipForward className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-semibold text-slate-100">Toggle Frame Range</h3>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <label className="text-sm text-slate-400 font-medium">From:</label>
              <input
                type="number"
                min="1"
                max={frames.length}
                value={frameRange.from}
                onChange={(e) => setFrameRange({...frameRange, from: parseInt(e.target.value) || 1})}
                className="w-24 px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <label className="text-sm text-slate-400 font-medium">To:</label>
              <input
                type="number"
                min="1"
                max={frames.length}
                value={frameRange.to}
                onChange={(e) => setFrameRange({...frameRange, to: parseInt(e.target.value) || 1})}
                className="w-24 px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => toggleFrameRange(true)}
                className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg shadow-red-500/25"
              >
                Skip Range
              </button>
              <button
                onClick={() => toggleFrameRange(false)}
                className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg shadow-green-500/25"
              >
                Enable Range
              </button>
            </div>
          </div>

          {/* GIF Options */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Settings className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-semibold text-slate-100">GIF Options</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Delay Time
                </label>
                <p className="text-xs text-slate-500 mb-2">
                  In 1/100 of second. Changing this value will reset delay for all frames.
                </p>
                <input
                  type="number"
                  value={gifOptions.delayTime}
                  onChange={(e) => setGifOptions({...gifOptions, delayTime: parseInt(e.target.value) || 0})}
                  className="w-32 px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Loop Count
                </label>
                <p className="text-xs text-slate-500 mb-2">
                  Leave at 0 to loop forever
                </p>
                <input
                  type="number"
                  value={gifOptions.loopCount}
                  onChange={(e) => setGifOptions({...gifOptions, loopCount: parseInt(e.target.value) || 0})}
                  className="w-32 px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-start gap-3 p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                <input
                  type="checkbox"
                  checked={gifOptions.useGlobalColormap}
                  onChange={(e) => setGifOptions({...gifOptions, useGlobalColormap: e.target.checked})}
                  className="w-5 h-5 mt-0.5 rounded bg-slate-800 border-slate-600 text-purple-500 focus:ring-2 focus:ring-purple-500 focus:ring-offset-0 focus:ring-offset-slate-900"
                />
                <div>
                  <label className="text-sm font-medium text-slate-300 block">
                    Use Global Colormap
                  </label>
                  <p className="text-xs text-slate-500 mt-1">
                    Use the same set of colors for all frames to reduce file size
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Effects */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-semibold text-slate-100">Effects</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                <input
                  type="checkbox"
                  checked={gifOptions.crossfade}
                  onChange={(e) => setGifOptions({...gifOptions, crossfade: e.target.checked})}
                  className="w-5 h-5 mt-0.5 rounded bg-slate-800 border-slate-600 text-purple-500 focus:ring-2 focus:ring-purple-500 focus:ring-offset-0 focus:ring-offset-slate-900"
                />
                <label className="text-sm font-medium text-slate-300">
                  Crossfade Frames
                </label>
              </div>
              <div className="flex items-start gap-3 p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                <input
                  type="checkbox"
                  checked={gifOptions.dontStack}
                  onChange={(e) => setGifOptions({...gifOptions, dontStack: e.target.checked})}
                  className="w-5 h-5 mt-0.5 rounded bg-slate-800 border-slate-600 text-purple-500 focus:ring-2 focus:ring-purple-500 focus:ring-offset-0 focus:ring-offset-slate-900"
                />
                <div>
                  <label className="text-sm font-medium text-slate-300 block">
                    Don't Stack Frames
                  </label>
                  <p className="text-xs text-slate-500 mt-1">
                    Remove the frame when it's time to display next one. Use for images with transparent background.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Rebuild Button */}
          <button
            onClick={onRebuildGif}
            disabled={processing}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 disabled:from-slate-700 disabled:to-slate-700 disabled:text-slate-500 transition-all duration-200 shadow-lg hover:shadow-green-500/25 flex items-center justify-center gap-2"
          >
            <Play className="w-5 h-5" />
            {processing ? progress : 'Rebuild GIF'}
          </button>
        </>
      )}
    </div>
  );
};

export default FrameEditor;
