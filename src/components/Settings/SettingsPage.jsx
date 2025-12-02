import React, { useState, useEffect } from 'react';
import { Save, RotateCcw, CheckCircle, AlertCircle, Settings as SettingsIcon, Zap, Image as ImageIcon, Sparkles, Clock, Monitor, Cpu } from 'lucide-react';

const SettingsPage = ({ appSettings, saveSettings, resetSettings }) => {
  const [localSettings, setLocalSettings] = useState(appSettings);
  const [saveStatus, setSaveStatus] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setLocalSettings(appSettings);
  }, [appSettings]);

  useEffect(() => {
    const changed = JSON.stringify(localSettings) !== JSON.stringify(appSettings);
    setHasChanges(changed);
  }, [localSettings, appSettings]);

  const handleSave = async () => {
    const success = await saveSettings(localSettings);
    if (success) {
      setSaveStatus('success');
      setHasChanges(false);
      setTimeout(() => setSaveStatus(null), 3000);
    } else {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  const handleReset = async () => {
    if (window.confirm('Are you sure you want to reset all settings to defaults?')) {
      await resetSettings();
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Modern Dark Header */}
      <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 border border-slate-700 rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl">
              <SettingsIcon className="text-white" size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-100">Application Settings</h3>
              <p className="text-sm text-slate-400 mt-1">Configure default values and processing options</p>
            </div>
          </div>
          {saveStatus && (
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg backdrop-blur-sm ${
              saveStatus === 'success'
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : 'bg-red-500/20 text-red-400 border border-red-500/30'
            }`}>
              {saveStatus === 'success' ? (
                <>
                  <CheckCircle size={20} />
                  <span className="font-medium">Settings saved!</span>
                </>
              ) : (
                <>
                  <AlertCircle size={20} />
                  <span className="font-medium">Failed to save</span>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Processing Settings */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
            <Zap className="text-white" size={20} />
          </div>
          <h4 className="text-lg font-semibold text-slate-100">Processing Settings</h4>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-slate-400" />
                <span>Function Timeout (seconds)</span>
              </div>
            </label>
            <input
              type="number"
              min="5"
              max="300"
              value={localSettings.functionTimeout / 1000}
              onChange={(e) => {
                const val = e.target.value;
                const numVal = val === '' ? '' : Number(val);
                setLocalSettings({
                  ...localSettings,
                  functionTimeout: numVal === '' ? '' : numVal * 1000
                });
              }}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
            <p className="text-xs text-slate-500 mt-2">
              Current: {localSettings.functionTimeout / 1000}s (Range: 5-300 seconds) - Operations will be cancelled if they exceed this time
            </p>
          </div>

          <div>
            <label className="flex items-center gap-3 cursor-pointer p-4 bg-slate-900/50 rounded-lg border border-slate-700 hover:border-slate-600 transition-all">
              <input
                type="checkbox"
                checked={localSettings.useGpu || false}
                onChange={(e) => setLocalSettings({
                  ...localSettings,
                  useGpu: e.target.checked
                })}
                className="w-5 h-5 text-purple-500 bg-slate-800 border-slate-600 rounded focus:ring-2 focus:ring-purple-500 focus:ring-offset-0 cursor-pointer"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
                  <Cpu size={16} className="text-purple-400" />
                  <span>Enable GPU Acceleration (FFmpeg)</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Use hardware acceleration for video encoding (requires compatible GPU). May significantly improve performance.
                </p>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Default Conversion Settings */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
            <Monitor className="text-white" size={20} />
          </div>
          <h4 className="text-lg font-semibold text-slate-100">Default Conversion Settings</h4>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Default FPS (Frames Per Second)</label>
            <input
              type="number"
              min="1"
              max="60"
              value={localSettings.defaultFps}
              onChange={(e) => {
                const val = e.target.value;
                setLocalSettings({
                  ...localSettings,
                  defaultFps: val === '' ? '' : Number(val)
                });
              }}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
            <p className="text-xs text-slate-500 mt-2">Lower = smaller file size</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Default Width (pixels)</label>
            <input
              type="number"
              min="100"
              max="4000"
              value={localSettings.defaultWidth}
              onChange={(e) => {
                const val = e.target.value;
                setLocalSettings({
                  ...localSettings,
                  defaultWidth: val === '' ? '' : Number(val)
                });
              }}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Default Height (pixels)</label>
            <input
              type="number"
              min="100"
              max="4000"
              value={localSettings.defaultHeight}
              onChange={(e) => {
                const val = e.target.value;
                setLocalSettings({
                  ...localSettings,
                  defaultHeight: val === '' ? '' : Number(val)
                });
              }}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
          </div>
        </div>
      </div>

      {/* GIF Optimization Settings */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg">
            <Sparkles className="text-white" size={20} />
          </div>
          <h4 className="text-lg font-semibold text-slate-100">GIF Optimization Settings</h4>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">Default Compression Level</label>
            <input
              type="range"
              min="30"
              max="200"
              value={localSettings.defaultCompressionLevel}
              onChange={(e) => setLocalSettings({
                ...localSettings,
                defaultCompressionLevel: parseInt(e.target.value)
              })}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-2">
              <span>Light (30)</span>
              <span className="font-semibold text-purple-400">{localSettings.defaultCompressionLevel}</span>
              <span>Heavy (200)</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Default Loop Count</label>
            <input
              type="number"
              min="0"
              max="100"
              value={localSettings.defaultLoopCount}
              onChange={(e) => {
                const val = e.target.value;
                setLocalSettings({
                  ...localSettings,
                  defaultLoopCount: val === '' ? '' : Number(val)
                });
              }}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
            <p className="text-xs text-slate-500 mt-2">0 = infinite loop</p>
          </div>
        </div>
      </div>

      {/* Unsaved Changes Warning */}
      {hasChanges && (
        <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-xl p-4 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <AlertCircle className="text-yellow-400 flex-shrink-0" size={20} />
            <p className="text-sm text-yellow-200 font-medium">
              You have unsaved changes. Click "Save Settings" to apply them.
            </p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={handleSave}
          disabled={!hasChanges}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
            hasChanges
              ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600 shadow-lg shadow-purple-500/25'
              : 'bg-slate-700 text-slate-500 cursor-not-allowed'
          }`}
        >
          <Save size={20} />
          Save Settings
        </button>

        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-6 py-3 bg-slate-700 text-slate-200 rounded-xl font-semibold hover:bg-slate-600 transition-all border border-slate-600"
        >
          <RotateCcw size={20} />
          Reset to Defaults
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
