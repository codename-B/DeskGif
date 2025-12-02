import ConvertSettings from './ConvertSettings';
import ResizeSettings from './ResizeSettings';
import CropSettings from './CropSettings';
import RotateSettings from './RotateSettings';
import OptimizeSettings from './OptimizeSettings';
import EffectsSettings from './EffectsSettings';
import SpeedSettings from './SpeedSettings';
import ClipSettings from './ClipSettings';
import FrameEditor from './FrameEditor';
import SettingsPage from './SettingsPage';
import LicensePage from '../License/LicensePage';

export const settingsComponents = {
  convert: ConvertSettings,
  resize: ResizeSettings,
  crop: CropSettings,
  rotate: RotateSettings,
  optimize: OptimizeSettings,
  effects: EffectsSettings,
  speed: SpeedSettings,
  clip: ClipSettings,
  frames: FrameEditor,
  license: LicensePage,
  settings: SettingsPage,
};
