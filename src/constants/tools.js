import { Film, Image, Crop, RotateCw, Zap, Wand2, Scissors, Settings, Gauge, FileText } from 'lucide-react';

export const tools = [
  { id: 'convert', name: 'Video to GIF', icon: Film, description: 'Transform your videos into optimized GIFs' },
  { id: 'resize', name: 'Resize', icon: Image, description: 'Adjust dimensions while maintaining quality' },
  { id: 'crop', name: 'Crop', icon: Crop, description: 'Select and extract specific regions' },
  { id: 'rotate', name: 'Rotate', icon: RotateCw, description: 'Rotate media to any angle' },
  { id: 'optimize', name: 'Optimize GIF', icon: Zap, description: 'Reduce file size without quality loss' },
  { id: 'effects', name: 'Effects', icon: Wand2, description: 'Apply filters and transformations' },
  { id: 'speed', name: 'Speed', icon: Gauge, description: 'Change playback speed and skip frames' },
  { id: 'clip', name: 'Clip/Trim', icon: Scissors, description: 'Trim and extract segments' },
  { id: 'frames', name: 'Edit Frames', icon: Film, description: 'Edit individual GIF frames' },
  { id: 'license', name: 'License', icon: FileText, description: 'View GPLv2 license terms' },
  { id: 'settings', name: 'Settings', icon: Settings, description: 'Configure application preferences' }
];
