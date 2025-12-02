import React from 'react';
import { useStore } from '../store/useStore';
import { Download, X, FileVideo, FileImage } from 'lucide-react';

const Preview = ({
  activeTab,
  settings,
  previewRef,
  handleCropMouseDown,
  handleImageLoad,
  handleDownload,
}) => {
  const { file, preview, progress, handleClearFile } = useStore();
  const isVideo = file.name.match(/\.(mp4|avi|mov|mkv|webm)$/i);

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-700/50 rounded-lg">
            {isVideo ? (
              <FileVideo size={20} className="text-blue-400" />
            ) : (
              <FileImage size={20} className="text-green-400" />
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-white">{file.name}</p>
            {progress && (
              <p className="text-xs text-purple-400 mt-0.5">{progress}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/20 rounded-lg text-sm font-medium transition-colors"
          >
            <Download size={16} />
            <span>Save</span>
          </button>
          <button
            onClick={handleClearFile}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg text-sm font-medium transition-colors"
          >
            <X size={16} />
            <span>Remove</span>
          </button>
        </div>
      </div>

      {/* Preview Container */}
      <div className="relative bg-slate-900/50 rounded-xl p-6 flex items-center justify-center min-h-[400px]">
        {preview && (
          <div
            className="relative inline-block"
            style={{
              cursor: activeTab === 'crop' ? 'crosshair' : 'default',
              userSelect: 'none'
            }}
          >
            {file.name.match(/\.(mp4|avi|mov|mkv|webm)$/i) ? (
              <>
                <video
                  ref={previewRef}
                  src={preview}
                  controls={activeTab !== 'crop'}
                  className="max-h-[500px] rounded-lg shadow-2xl"
                  draggable={false}
                  onMouseDown={activeTab === 'crop' ? handleCropMouseDown : undefined}
                  onLoadedMetadata={handleImageLoad}
                  style={{
                    transform: activeTab === 'rotate' ? `rotate(${settings.liveRotation}deg)` : 'none',
                    transition: 'transform 0.1s ease'
                  }}
                />
                {activeTab === 'crop' && settings.cropWidth > 0 && settings.cropHeight > 0 && (
                  <div
                    className="absolute border-2 border-purple-500 bg-transparent pointer-events-none"
                    style={{
                      left: `${settings.cropX}px`,
                      top: `${settings.cropY}px`,
                      width: `${settings.cropWidth}px`,
                      height: `${settings.cropHeight}px`,
                      boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)'
                    }}
                  >
                    <div className="absolute -top-8 left-0 bg-purple-500 text-white px-3 py-1 text-xs rounded-lg font-mono whitespace-nowrap">
                      {Math.round(settings.cropWidth)} × {Math.round(settings.cropHeight)}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <img
                ref={previewRef}
                src={preview}
                alt="Preview"
                className="max-h-[500px] rounded-lg shadow-2xl"
                draggable={false}
                onMouseDown={activeTab === 'crop' ? handleCropMouseDown : undefined}
                style={{
                  transform: activeTab === 'rotate' ? `rotate(${settings.liveRotation}deg)` : 'none',
                  transition: 'transform 0.1s ease'
                }}
                onLoad={handleImageLoad}
              />
            )}

            {activeTab === 'crop' && !file.name.match(/\.(mp4|avi|mov|mkv|webm)$/i) && settings.cropWidth > 0 && settings.cropHeight > 0 && (
              <div
                className="absolute border-2 border-purple-500 bg-transparent pointer-events-none"
                style={{
                  left: `${settings.cropX}px`,
                  top: `${settings.cropY}px`,
                  width: `${settings.cropWidth}px`,
                  height: `${settings.cropHeight}px`,
                  boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)'
                }}
              >
                <div className="absolute -top-8 left-0 bg-purple-500 text-white px-3 py-1 text-xs rounded-lg font-mono whitespace-nowrap">
                  {Math.round(settings.cropWidth)} × {Math.round(settings.cropHeight)}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Preview;
