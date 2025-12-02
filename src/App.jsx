import React, { useState, useMemo, useEffect } from 'react';
import { useStore } from './store/useStore';
import toast, { Toaster } from 'react-hot-toast';

// Hooks
import { useCropTool } from './hooks/useCropTool';
import { useFrameEditor } from './hooks/useFrameEditor';
import { useAppSettings } from './hooks/useAppSettings';

// Mappings
import { settingsComponents } from './components/Settings/SettingsMapping';
import { processHandlers } from './handlers/handlerMapping';

// Components
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import FileUpload from './components/FileUpload';
import Preview from './components/Preview';

// Constants
import { tools } from './constants/tools';

// Utils
import { withTimeout } from './utils/processTimeout';

const App = () => {
  const [activeTab, setActiveTab] = useState('convert');
  const {
    settings,
    setSettings,
    file,
    filePath,
    preview,
    processing,
    progress,
    setProcessing,
    setProgress,
    handleFileUpload,
    handleClearFile,
    cleanupOldFile,
    updateFile,
    setFilePath,
    setPreview,
    setFile,
    setResult,
    handleDragDrop,
  } = useStore();

  // Load app settings
  const { appSettings, saveSettings, resetSettings, loading: settingsLoading } = useAppSettings();

  const {
    previewDimensions,
    previewRef,
    handleCropMouseDown,
    handleImageLoad
  } = useCropTool(activeTab, settings, setSettings);

  const {
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
    toggleFrameRange
  } = useFrameEditor(setProgress);

  useEffect(() => {
    const unlisten = window.electron.on('drag-drop', (filePath) => {
      useStore.getState().handleDragDrop(filePath);
    });

    return () => {
      unlisten();
    };
  }, []);

  useEffect(() => {
    const preventDefaults = (event) => {
      event.preventDefault();
      event.stopPropagation();
    };

    const handleWindowDrop = async (event) => {
      preventDefaults(event);
      const fileList = event.dataTransfer?.files;
      const uriList = event.dataTransfer?.getData('text/uri-list');
      const plainText = event.dataTransfer?.getData('text/plain');

      let path = null;
      if (fileList && fileList.length > 0) {
        path = fileList[0].path;
      } else if (uriList) {
        const first = uriList.split('\n')[0].trim();
        if (first.startsWith('file://')) {
          path = decodeURI(first.replace('file://', ''));
        }
      } else if (plainText) {
        const first = plainText.split('\n')[0].trim();
        if (first.startsWith('file://')) {
          path = decodeURI(first.replace('file://', ''));
        } else if (first) {
          path = first;
        }
      }

      // Fallback: if path is not available but file object exists, persist to temp and use that path
      if (!path && fileList && fileList.length > 0) {
        const fileObj = fileList[0];
        try {
          const buffer = new Uint8Array(await fileObj.arrayBuffer());
          const tempPath = await window.electron.saveTempFile(fileObj.name || 'dropped.bin', buffer);
          path = tempPath;
        } catch (err) {
          console.error('Failed to persist dropped file:', err);
        }
      }

      if (path) {
        handleDragDrop(path.trim());
      }
    };

    window.addEventListener('dragover', preventDefaults);
    window.addEventListener('drop', handleWindowDrop);

    return () => {
      window.removeEventListener('dragover', preventDefaults);
      window.removeEventListener('drop', handleWindowDrop);
    };
  }, [handleDragDrop]);

  const handleDownload = async () => {
    if (!preview) return;

    try {
      const savePath = await window.electron.saveFile(
        `DeskGif_${activeTab}_${Date.now()}.${file.name.split('.').pop()}`,
        [
          { name: 'GIF', extensions: ['gif'] },
          { name: 'PNG', extensions: ['png'] },
          { name: 'JPG', extensions: ['jpg', 'jpeg'] },
          { name: 'All Files', extensions: ['*'] }
        ]
      );

      if (savePath) {
        const response = await fetch(preview);
        const blob = await response.blob();
        const buffer = await blob.arrayBuffer();
        const uint8Array = new Uint8Array(buffer);
        await window.electron.writeFile(savePath, uint8Array);
        toast.success('File saved successfully!');
      }
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to save file: ' + error.message);
    }
  };

  const handleProcess = async () => {
    const timeout = appSettings.functionTimeout || 30000;
    const handler = processHandlers[activeTab];
    let currentProcessId = null;

    const registerProcess = (processId) => {
      currentProcessId = processId;
    };

    if (!handler) {
      toast('Coming soon!', { icon: '🔧' });
      return;
    }

    const handlerProps = {
      filePath,
      settings,
      setProcessing,
      setProgress,
      cleanupOldFile,
      updateFile,
      appSettings,
      file,
      setSettings,
      previewRef,
      setFilePath,
      setFile,
      setPreview,
      setResult,
      registerProcess,
    };

    try {
      await withTimeout(handler(handlerProps), timeout, async () => {
        setProgress('Operation timed out - cancelling...');
        setProcessing(false);
        if (currentProcessId) {
          try {
            await window.electron.killProcess(currentProcessId);
          } catch (err) {
            console.error('Failed to cancel process:', err);
          }
        }
        toast.error(`Operation timed out after ${timeout / 1000} seconds. You can increase the timeout in Settings.`, {
          duration: 5000
        });
      });
    } catch (error) {
      console.error('Process error:', error);
      setProcessing(false);
      toast.error('An error occurred: ' + error.message, {
        duration: 5000
      });
    }
  };

  const activeTool = useMemo(() => tools.find(t => t.id === activeTab), [activeTab]);

  const renderSettings = () => {
    const SettingsComponent = settingsComponents[activeTab];

    if (!SettingsComponent) {
      return null;
    }

    const componentProps = {
      settings,
      setSettings,
      file,
      filePath,
      preview,
      previewDimensions,
      appSettings,
      saveSettings,
      resetSettings,
      setFilePath,
      setPreview,
      setFile,
      setResult,
      setProcessing,
      setProgress,
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
      processing,
      progress,
      cleanupOldFile,
      updateFile,
      handleProcess,
    };

    return <SettingsComponent {...componentProps} />;
  };

  const isSimplePage = activeTab === 'settings' || activeTab === 'license';

  return (
    <div className="h-screen bg-slate-950 flex flex-col">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1e293b',
            color: '#f1f5f9',
            border: '1px solid #475569'
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#f1f5f9'
            }
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#f1f5f9'
            }
          }
        }}
      />
      <Header />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="flex-1 p-8 overflow-y-auto bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                {activeTool?.name}
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                {activeTool?.description}
              </p>
            </div>

              {isSimplePage ? (
                <div className="mb-6">
                  {renderSettings()}
                </div>
              ) : (
                <>
                  {!file ? (
                    <FileUpload />
                  ) : (
                    <div className="mb-6">
                      <Preview
                        activeTab={activeTab}
                        settings={settings}
                        previewRef={previewRef}
                        handleCropMouseDown={handleCropMouseDown}

                        handleImageLoad={handleImageLoad}
                        handleDownload={handleDownload}
                      />
                    </div>
                  )}

                  {file && (
                    <div className="mb-6">
                      {renderSettings()}

                      {activeTab !== 'frames' && activeTab !== 'license' && activeTab !== 'settings' && (
                        <button
                          onClick={handleProcess}
                          disabled={processing}
                          className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 disabled:from-slate-700 disabled:to-slate-800 text-white py-4 rounded-xl font-semibold shadow-lg shadow-purple-500/30 disabled:shadow-none transition-all duration-200 flex items-center justify-center gap-2"
                        >
                          {processing ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                              <span>{progress}</span>
                            </>
                          ) : (
                            <span>Process</span>
                          )}
                        </button>
                      )}
                    </div>
                  )}
                </>
              )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
