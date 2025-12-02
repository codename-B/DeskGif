const { contextBridge, ipcRenderer } = require('electron');

try {
  contextBridge.exposeInMainWorld('electron', {
    selectFile: (filters) => ipcRenderer.invoke('select-file', filters),
    saveFile: (defaultName, filters) => ipcRenderer.invoke('save-file', defaultName, filters),
    readFile: (filePath) => ipcRenderer.invoke('read-file', filePath),
    writeFile: (filePath, data) => ipcRenderer.invoke('write-file', filePath, data),
    deleteFile: (filePath) => ipcRenderer.invoke('delete-file', filePath),
    saveTempFile: (name, data) => ipcRenderer.invoke('save-temp-file', name, data),
    ffmpeg: (args, inputPath, outputPath, useGpu, processId) => ipcRenderer.invoke('ffmpeg', args, inputPath, outputPath, useGpu, processId),
    imagemagick: (args, inputPath, outputPath, processId) => ipcRenderer.invoke('imagemagick', args, inputPath, outputPath, processId),
    gifsicle: (args, inputPath, outputPath, processId) => ipcRenderer.invoke('gifsicle', args, inputPath, outputPath, processId),
    gifsicleInfo: (inputPath) => ipcRenderer.invoke('gifsicle-info', inputPath),
    getFileInfo: (filePath) => ipcRenderer.invoke('get-file-info', filePath),
    getGifFrames: (filePath) => ipcRenderer.invoke('get-gif-frames', filePath),
    getTempPath: (filename) => ipcRenderer.invoke('get-temp-path', filename),
    // Settings management
    loadSettings: () => ipcRenderer.invoke('load-settings'),
    saveSettings: (settings) => ipcRenderer.invoke('save-settings', settings),
    killProcess: (processId) => ipcRenderer.invoke('kill-process', processId),
    on: (channel, callback) => {
      const newCallback = (_, data) => callback(data);
      ipcRenderer.on(channel, newCallback);
      return () => {
        ipcRenderer.removeListener(channel, newCallback);
      };
    }
  });
} catch (error) {
  console.error('PRELOAD SCRIPT ERROR:', error);
}
