import { useState, useEffect } from 'react';
import { defaultAppSettings } from '../constants/appSettings';

export const useAppSettings = () => {
  const [appSettings, setAppSettings] = useState(defaultAppSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const settings = await window.electron.loadSettings();
      setAppSettings({ ...defaultAppSettings, ...settings });
    } catch (error) {
      console.error('Failed to load settings:', error);
      setAppSettings(defaultAppSettings);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (newSettings) => {
    try {
      await window.electron.saveSettings(newSettings);
      setAppSettings(newSettings);
      return true;
    } catch (error) {
      console.error('Failed to save settings:', error);
      return false;
    }
  };

  const resetSettings = async () => {
    await saveSettings(defaultAppSettings);
  };

  return {
    appSettings,
    setAppSettings,
    saveSettings,
    resetSettings,
    loading
  };
};
