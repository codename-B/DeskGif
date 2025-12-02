import {create} from 'zustand';
import toast from 'react-hot-toast';
import { defaultSettings } from '../constants/defaultSettings';

// Maximum file size: 500MB
const MAX_FILE_SIZE = 500 * 1024 * 1024;

export const useStore = create((set, get) => ({
  // From useSettings
  settings: defaultSettings,
  setSettings: (updates) =>
    set((state) => {
      const next =
        typeof updates === 'function' ? updates(state.settings) : updates;
      return { settings: { ...state.settings, ...next } };
    }),

  // From useFileManager
  file: null,
  filePath: null,
  originalFilePath: null,
  preview: null,
  previewUrl: null, // Track for cleanup
  processing: false,
  result: null,
  progress: '',
  setFile: (file) => set({ file }),
  setFilePath: (filePath) => set({ filePath }),
  setOriginalFilePath: (originalFilePath) => set({ originalFilePath }),
  setPreview: (preview) => {
    const state = get();
    // Revoke old preview URL
    if (state.previewUrl && state.previewUrl !== preview) {
      URL.revokeObjectURL(state.previewUrl);
    }
    set({ preview, previewUrl: preview });
  },
  setProcessing: (processing) => set({ processing }),
  setResult: (result) => set({ result }),
  setProgress: (progress) => set({ progress }),

  // Actions from useFileManager
  handleFileUpload: async (filePath = null) => {
    try {
      let path = filePath;
      if (!path) {
        path = await window.electron.selectFile();
      }

      if (!path) return;

      // Check file size before loading
      const fileInfo = await window.electron.getFileInfo(path);
      if (fileInfo.size > MAX_FILE_SIZE) {
        const sizeMB = (fileInfo.size / (1024 * 1024)).toFixed(2);
        toast.error(`File is too large (${sizeMB}MB). Maximum file size is 500MB.`);
        return;
      }

      // Revoke old preview URL before creating new one
      const state = get();
      if (state.previewUrl) {
        URL.revokeObjectURL(state.previewUrl);
      }

      // Read the file and create blob URL
      const data = await window.electron.readFile(path);
      const blob = new Blob([data]);
      const url = URL.createObjectURL(blob);

      const fileName = path.split(/[\\/]/).pop();
      const file = { path, name: fileName };

      set({
        file,
        filePath: path,
        originalFilePath: path,
        preview: url,
        previewUrl: url,
        result: null
      });

      // Auto-detect dimensions for video/image
      const isVideo = fileName.match(/\.(mp4|avi|mov|mkv|webm)$/i);
      const isImage = fileName.match(/\.(jpg|jpeg|png|gif|webp)$/i);

      if (isVideo) {
        const video = document.createElement('video');
        video.src = url;
        video.onloadedmetadata = () => {
          set((state) => ({
            settings: {
              ...state.settings,
              width: video.videoWidth,
              height: video.videoHeight
            }
          }));
        };
      } else if (isImage) {
        const img = document.createElement('img');
        img.src = url;
        img.onload = () => {
          set((state) => ({
            settings: {
              ...state.settings,
              width: img.naturalWidth,
              height: img.naturalHeight
            }
          }));
        };
      }
    } catch (error) {
      console.error('Failed to handle file upload:', error);
      toast.error('Failed to load file');
    }
  },
  handleDragDrop: (filePath) => {
    if (!filePath || typeof filePath !== 'string') return;

    let cleanPath = filePath.trim();

    // Handle file:// URIs
    if (cleanPath.startsWith('file://')) {
      try {
        cleanPath = decodeURI(cleanPath.replace('file://', ''));
      } catch (err) {
        console.error('Failed to decode dropped file path:', err);
      }
    }

    // Normalize leading slash on Windows (e.g., /C:/path -> C:/path)
    // Normalize leading slash on Windows-style paths even when process is not available in sandboxed renderer
    if (/^\/[A-Za-z]:/.test(cleanPath)) {
      cleanPath = cleanPath.replace(/^\/([A-Za-z]:)/, '$1');
    }

    if (!cleanPath) return;
    useStore.getState().handleFileUpload(cleanPath);
  },
  handleClearFile: () => {
    const state = get();
    // Revoke preview URL before clearing
    if (state.previewUrl) {
      URL.revokeObjectURL(state.previewUrl);
    }
    set({
      file: null,
      filePath: null,
      originalFilePath: null,
      preview: null,
      previewUrl: null,
      result: null,
      progress: '',
    });
  },
  cleanupOldFile: async (path) => {
    if (path && path !== useStore.getState().originalFilePath) {
      await window.electron.deleteFile(path);
    }
  },
  updateFile: (newPath, newPreview) => {
    const state = get();
    // Revoke old preview URL
    if (state.previewUrl && state.previewUrl !== newPreview) {
      URL.revokeObjectURL(state.previewUrl);
    }

    // Update file object with new name from the new path
    const fileName = newPath.split(/[\\/]/).pop();
    const newFile = { path: newPath, name: fileName };

    set({
      file: newFile,
      filePath: newPath,
      preview: newPreview,
      previewUrl: newPreview,
      result: null
    });
  },
}));
