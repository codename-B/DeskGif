import React, { useEffect, useRef, useState } from 'react';
import { useStore } from '../../store/useStore';
import { Play, Scissors, Clock } from 'lucide-react';
import * as SliderPrimitive from '@radix-ui/react-slider';
import toast from 'react-hot-toast';

const ClipSettings = () => {
  const { file, filePath, preview, settings, setSettings } = useStore();
  const fileName = file?.name ?? '';
  const isGif = /\.gif$/i.test(fileName);
  const isVideo = /\.(mp4|avi|mov|mkv|webm)$/i.test(fileName);
  const [maxDuration, setMaxDuration] = useState(isGif ? 100 : 300); // Default max for frames or seconds
  const [isDetecting, setIsDetecting] = useState(false);
  const prevFilePathRef = useRef(null);

  // Detect video/GIF duration
  useEffect(() => {
    if (!file || !preview) return;
    let cancelled = false;

    const isNewFile = filePath && filePath !== prevFilePathRef.current;
    if (isNewFile) {
      prevFilePathRef.current = filePath;
    }

    const detectDuration = async () => {
      setIsDetecting(true);

      if (isVideo) {
        // Create a video element to get duration using the preview URL
        const videoEl = document.createElement('video');
        videoEl.src = preview;
        videoEl.preload = 'metadata';

        videoEl.onloadedmetadata = () => {
          if (cancelled) return;
          const duration = Math.floor(videoEl.duration);
          setMaxDuration(duration);

          // Update end time if it's still at default (and preserve latest settings)
          setSettings((prev) => {
            const isDefault = prev.clipEndTime === '00:00:10';
            if (!isDefault) return prev;
            const newEndTime = duration < 10 ? secondsToTime(duration) : prev.clipEndTime;
            return { ...prev, clipEndTime: newEndTime };
          });

          setIsDetecting(false);
        };

        videoEl.onerror = (e) => {
          console.error('Error detecting video duration:', e);
          if (!cancelled) setIsDetecting(false);
        };
      } else if (isGif) {
        if (!filePath) {
          setIsDetecting(false);
          return;
        }
        try {
          const info = await window.electron.gifsicleInfo(filePath);
          if (cancelled) return;

          const frameCount = Math.max(info?.frames || 0, 1);
          setMaxDuration(frameCount - 1); // slider uses end-inclusive frame indices

          setSettings((prev) => {
            const prevStart = Number(prev.clipStartFrame);
            const prevEnd = Number(prev.clipEndFrame);
            const clampedPrevEnd = Math.min(
              Number.isFinite(prevEnd) ? prevEnd : frameCount - 1,
              frameCount - 1
            );
            const clampedPrevStart = Math.max(
              0,
              Math.min(Number.isFinite(prevStart) ? prevStart : 0, clampedPrevEnd)
            );

            const nextStart = isNewFile ? 0 : clampedPrevStart;
            const nextEnd = isNewFile ? frameCount - 1 : clampedPrevEnd;

            return {
              ...prev,
              clipStartFrame: nextStart,
              clipEndFrame: nextEnd,
              detectedFrameCount: frameCount
            };
          });
        } catch (err) {
          console.error('Error detecting GIF frames:', err);
          if (!cancelled) toast.error('Could not detect GIF frames; using default range.');
          setMaxDuration(100);
        } finally {
          if (!cancelled) setIsDetecting(false);
        }
      } else {
        setIsDetecting(false);
      }
    };

    detectDuration();
    return () => {
      cancelled = true;
    };
  }, [file, preview, filePath, isGif, isVideo]);

  // Convert time string to seconds
  const timeToSeconds = (timeStr) => {
    if (!timeStr) return 0;
    const parts = timeStr.split(':').map((part) => Number(part) || 0);
    const [h = 0, m = 0, s = 0] = parts;
    const totalSeconds = h * 3600 + m * 60 + s;
    return Number.isFinite(totalSeconds) ? totalSeconds : 0;
  };

  const clampRange = (start, end) => {
    const safeStart = Math.max(0, Math.min(start, maxDuration));
    const safeEnd = Math.max(safeStart, Math.min(end, maxDuration));
    return [safeStart, safeEnd];
  };

  // Convert seconds to time string
  const secondsToTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleRangeChange = (newRange) => {
    const [newStart, newEnd] = clampRange(newRange[0], newRange[1]);
    if (isGif) {
      setSettings({ clipStartFrame: newStart, clipEndFrame: newEnd });
    } else {
      setSettings({ clipStartTime: secondsToTime(newStart), clipEndTime: secondsToTime(newEnd) });
    }
  };

  const normalizeManualInputs = () => {
    if (isGif) {
      const [start, end] = clampRange(Number(settings.clipStartFrame) || 0, Number(settings.clipEndFrame) || 0);
      setSettings({ clipStartFrame: start, clipEndFrame: end });
    } else {
      const [start, end] = clampRange(timeToSeconds(settings.clipStartTime), timeToSeconds(settings.clipEndTime));
      setSettings({ clipStartTime: secondsToTime(start), clipEndTime: secondsToTime(end) });
    }
  };

  useEffect(() => {
    normalizeManualInputs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maxDuration, isGif]);

  const [startValue, endValue] = clampRange(
    isGif ? Number(settings.clipStartFrame) || 0 : timeToSeconds(settings.clipStartTime),
    isGif ? Number(settings.clipEndFrame) || 0 : timeToSeconds(settings.clipEndTime)
  );
  const duration = endValue - startValue;

  // Keep slider values and stored settings in sync, even if user clicks Process without blurring inputs
  useEffect(() => {
    if (isGif) {
      if (settings.clipStartFrame !== startValue || settings.clipEndFrame !== endValue) {
        setSettings({ clipStartFrame: startValue, clipEndFrame: endValue });
      }
    } else {
      const startTime = secondsToTime(startValue);
      const endTime = secondsToTime(endValue);
      if (settings.clipStartTime !== startTime || settings.clipEndTime !== endTime) {
        setSettings({ clipStartTime: startTime, clipEndTime: endTime });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startValue, endValue, isGif]);

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-purple-500/20 rounded-xl">
            <Scissors className="w-5 h-5 text-purple-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-100">
            {isGif ? 'Frame Selection' : 'Timeline Selection'}
          </h3>
        </div>
        <p className="text-sm text-slate-400">
          {isGif
            ? 'Select the range of frames to keep from your GIF'
            : 'Choose the start and end time for your video clip'}
        </p>
        {isVideo && !isDetecting && (
          <p className="text-xs text-purple-400 mt-2">
            Total duration: <span className="font-mono">{secondsToTime(maxDuration)}</span>
          </p>
        )}
        {isGif && !isDetecting && (
          <p className="text-xs text-purple-400 mt-2">
            Total frames: <span className="font-mono">{maxDuration + 1}</span>
          </p>
        )}
        {isDetecting && (
          <p className="text-xs text-blue-400 mt-2">
            Detecting media info...
          </p>
        )}
      </div>

      {/* Range Slider Card */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 backdrop-blur-sm">
        <div className="space-y-6">
          {/* Visual Range Display */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Play size={16} className="text-green-400" />
              <span className="text-slate-400">Start:</span>
              <span className="font-mono font-semibold text-white">
                {isGif ? `Frame ${startValue}` : settings.clipStartTime}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-blue-400" />
              <span className="text-slate-400">Duration:</span>
              <span className="font-mono font-semibold text-purple-400">
                {isGif ? `${duration} frames` : secondsToTime(duration)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Scissors size={16} className="text-red-400" />
              <span className="text-slate-400">End:</span>
              <span className="font-mono font-semibold text-white">
                {isGif ? `Frame ${endValue}` : settings.clipEndTime}
              </span>
            </div>
          </div>

          {/* Dual Range Slider */}
          <div className="relative pt-8 pb-4">
            {/* Selected Range Highlight */}

            <SliderPrimitive.Root
              value={[startValue, endValue]}
              onValueChange={handleRangeChange}
              max={maxDuration}
              step={1}
              className="relative flex items-center select-none touch-none w-full h-5"
            >
              <SliderPrimitive.Track className="bg-slate-700 relative grow rounded-full h-2">
                <SliderPrimitive.Range className="absolute bg-purple-500 rounded-full h-full" />
              </SliderPrimitive.Track>
              <SliderPrimitive.Thumb className="block w-5 h-5 bg-white border-2 border-purple-500 rounded-full hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-slate-900" />
              <SliderPrimitive.Thumb className="block w-5 h-5 bg-white border-2 border-purple-500 rounded-full hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-slate-900" />
            </SliderPrimitive.Root>

            {/* Scale Markers */}
            <div className="absolute top-16 left-0 right-0 flex justify-between text-xs text-slate-500 mt-4">
              <span>0</span>
              <span>{Math.floor(maxDuration / 4)}</span>
              <span>{Math.floor(maxDuration / 2)}</span>
              <span>{Math.floor((maxDuration * 3) / 4)}</span>
              <span>{maxDuration}</span>
            </div>
          </div>

          {/* Manual Input Fields */}
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2">
                {isGif ? 'Start Frame' : 'Start Time'}
              </label>
              {isGif ? (
                <input
                  type="number"
                  min="0"
                  max={maxDuration}
                  value={settings.clipStartFrame}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSettings({ clipStartFrame: val === '' ? '' : Number(val) });
                  }}
                  onBlur={normalizeManualInputs}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              ) : (
                <input
                  type="text"
                  placeholder="HH:MM:SS"
                  value={settings.clipStartTime}
                  onChange={(e) => setSettings({ clipStartTime: e.target.value })}
                  onBlur={normalizeManualInputs}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2">
                {isGif ? 'End Frame' : 'End Time'}
              </label>
              {isGif ? (
                <input
                  type="number"
                  min="0"
                  max={maxDuration}
                  value={settings.clipEndFrame}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSettings({ clipEndFrame: val === '' ? '' : Number(val) });
                  }}
                  onBlur={normalizeManualInputs}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <input
                  type="text"
                  placeholder="HH:MM:SS"
                  value={settings.clipEndTime}
                  onChange={(e) => setSettings({ clipEndTime: e.target.value })}
                  onBlur={normalizeManualInputs}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              )}
            </div>
          </div>

          {/* Quick Presets (Videos only) */}
          {!isGif && (
            <div className="pt-4 border-t border-slate-700">
              <label className="block text-xs font-medium text-slate-400 mb-3">Quick Presets:</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'First 10s', start: '00:00:00', end: '00:00:10' },
                  { label: 'First 30s', start: '00:00:00', end: '00:00:30' },
                  { label: 'First 1m', start: '00:00:00', end: '00:01:00' }
                ].map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() =>
                      setSettings({
                        clipStartTime: preset.start,
                        clipEndTime: preset.end
                      })
                    }
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
    </div>
  );
};

export default ClipSettings;
