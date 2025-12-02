import { useState, useEffect, useRef } from 'react';

export const useCropTool = (activeTab, settings, setSettings) => {
  const [cropDragging, setCropDragging] = useState(false);
  const [cropStart, setCropStart] = useState({ x: 0, y: 0 });
  const [previewDimensions, setPreviewDimensions] = useState({ width: 0, height: 0 });
  const previewRef = useRef(null);

  const handleCropMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!previewRef.current) return;
    const rect = previewRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCropStart({ x, y });
    setCropDragging(true);
    setSettings((prev) => ({
      ...prev,
      cropX: x,
      cropY: y,
      cropWidth: 0,
      cropHeight: 0
    }));
  };

  const handleImageLoad = (e) => {
    const element = e.target;
    if (element.tagName === 'VIDEO') {
      setPreviewDimensions({ width: element.videoWidth, height: element.videoHeight });
    } else {
      setPreviewDimensions({ width: element.naturalWidth, height: element.naturalHeight });
    }
  };

  // Document-level mouse handlers for crop
  useEffect(() => {
    if (activeTab !== 'crop') return;

    const handleDocMouseMove = (e) => {
      if (cropDragging && previewRef.current) {
        e.preventDefault();
        const rect = previewRef.current.getBoundingClientRect();

        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;

        x = Math.max(0, Math.min(x, rect.width));
        y = Math.max(0, Math.min(y, rect.height));

        const width = Math.abs(x - cropStart.x);
        const height = Math.abs(y - cropStart.y);

        let newX = Math.min(cropStart.x, x);
        let newY = Math.min(cropStart.y, y);

        newX = Math.max(0, Math.min(newX, rect.width));
        newY = Math.max(0, Math.min(newY, rect.height));

        const maxWidth = rect.width - newX;
        const maxHeight = rect.height - newY;
        const clampedWidth = Math.min(width, maxWidth);
        const clampedHeight = Math.min(height, maxHeight);

        setSettings(prev => ({
          ...prev,
          cropX: newX,
          cropY: newY,
          cropWidth: clampedWidth,
          cropHeight: clampedHeight
        }));
      }
    };

    const handleDocMouseUp = (e) => {
      if (cropDragging) {
        e.preventDefault();
        setCropDragging(false);
      }
    };

    document.addEventListener('mousemove', handleDocMouseMove);
    document.addEventListener('mouseup', handleDocMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleDocMouseMove);
      document.removeEventListener('mouseup', handleDocMouseUp);
    };
  }, [cropDragging, activeTab, cropStart]);

  // Reset crop selection when leaving crop tab
  useEffect(() => {
    if (activeTab !== 'crop') {
      setCropDragging(false);
      setSettings(prev => ({
        ...prev,
        cropX: 0,
        cropY: 0,
        cropWidth: 0,
        cropHeight: 0
      }));
    }
  }, [activeTab]);

  return {
    cropDragging,
    previewDimensions,
    previewRef,
    handleCropMouseDown,
    handleImageLoad
  };
};
