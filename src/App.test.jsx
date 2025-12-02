import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import App from './App';
import { useStore } from './store/useStore';
import { useCropTool } from './hooks/useCropTool';
import { useFrameEditor } from './hooks/useFrameEditor';
import { useAppSettings } from './hooks/useAppSettings';

// Mock the electron object
const mockElectron = {
  selectFile: vi.fn(),
  saveFile: vi.fn(),
  readFile: vi.fn(),
  writeFile: vi.fn(),
  deleteFile: vi.fn(),
  ffmpeg: vi.fn(),
  imagemagick: vi.fn(),
  gifsicle: vi.fn(),
  getFileInfo: vi.fn(),
  loadSettings: vi.fn(),
  saveSettings: vi.fn(),
  killProcess: vi.fn(),
  on: vi.fn(() => () => {}), // Return a function for unlisten
};

window.electron = mockElectron;

vi.mock('./store/useStore');
vi.mock('./hooks/useCropTool');
vi.mock('./hooks/useFrameEditor');
vi.mock('./hooks/useAppSettings');

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    useCropTool.mockReturnValue({
      previewDimensions: { width: 0, height: 0 },
      previewRef: { current: null },
      handleCropMouseDown: vi.fn(),
      handleImageLoad: vi.fn(),
    });

    useFrameEditor.mockReturnValue({
      frames: [],
      setFrames: vi.fn(),
      extractingFrames: false,
      frameRange: { from: 1, to: 5 },
      setFrameRange: vi.fn(),
      gifOptions: {},
      setGifOptions: vi.fn(),
      extractFrames: vi.fn(),
      updateFrameDelay: vi.fn(),
      toggleFrameSkip: vi.fn(),
      copyFrame: vi.fn(),
      toggleFrameRange: vi.fn(),
    });

    useAppSettings.mockReturnValue({
      appSettings: {},
      saveSettings: vi.fn(),
      resetSettings: vi.fn(),
      loading: false,
    });
  });

  it('renders the file upload component when no file is selected', () => {
    useStore.mockReturnValue({
      file: null,
      settings: {},
    });
    render(<App />);
    const uploadButton = screen.getByText('Upload Your Media');
    expect(uploadButton).toBeInTheDocument();
  });

  it('renders the preview component when a file is selected', () => {
    useStore.mockReturnValue({
      file: { name: 'test.gif' },
      preview: 'test.gif',
      settings: {},
    });
    render(<App />);
    const previewElement = screen.getByAltText('Preview');
    expect(previewElement).toBeInTheDocument();
  });

  it('calls handleFileUpload when the upload button is clicked', () => {
    const handleFileUpload = vi.fn();
    useStore.mockReturnValue({
      file: null,
      handleFileUpload,
      settings: {},
    });
    render(<App />);
    const uploadButton = screen.getByText('Upload Your Media');
    fireEvent.click(uploadButton);
    expect(handleFileUpload).toHaveBeenCalled();
  });
});
