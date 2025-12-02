import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useStore } from './useStore';

describe('useStore handleDragDrop', () => {
  beforeEach(() => {
    // Reset store state
    useStore.setState(useStore.getInitialState());
  });

  it('normalizes file:// URIs and calls handleFileUpload', async () => {
    const mockUpload = vi.fn();
    useStore.setState((state) => ({
      ...state,
      handleFileUpload: mockUpload,
    }));

    useStore.getState().handleDragDrop('file:///C:/tmp/video.mp4');
    expect(mockUpload).toHaveBeenCalledWith('C:/tmp/video.mp4');
  });

  it('normalizes /C:/ paths on Windows', () => {
    const mockUpload = vi.fn();
    useStore.setState((state) => ({
      ...state,
      handleFileUpload: mockUpload,
    }));

    useStore.getState().handleDragDrop('/C:/tmp/video.mp4');
    expect(mockUpload).toHaveBeenCalledWith('C:/tmp/video.mp4');
  });

  it('ignores empty or invalid paths', () => {
    const mockUpload = vi.fn();
    useStore.setState((state) => ({
      ...state,
      handleFileUpload: mockUpload,
    }));

    useStore.getState().handleDragDrop('');
    useStore.getState().handleDragDrop(null);
    expect(mockUpload).not.toHaveBeenCalled();
  });
});
