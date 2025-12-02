# DeskGif

<img width="1386" height="893" alt="image" src="https://github.com/user-attachments/assets/afa0a95e-3181-4883-a2c0-6a1b7cfdb3d8" />

A powerful desktop application for editing GIFs and videos, powered by ImageMagick, FFmpeg, and gifsicle.

## Features

### Video Conversion
- Convert videos (MP4, AVI, MOV, MKV, WebM) to GIF format
- Adjustable frame rate, dimensions, and compression
- Optional GPU acceleration for faster processing
- Automatic dimension detection

### GIF Optimization
- Compress GIFs with customizable compression levels
- Reduce file size while maintaining quality
- Batch optimization support

### GIF Frame Editing
- Extract and view individual frames
- Edit frame delays
- Skip/remove unwanted frames
- Copy and duplicate frames
- Bulk operations on frame ranges

### Image to GIF Conversion
- Convert static images to GIF format
- Support for JPG, JPEG, PNG, WebP formats
- Customize output settings

### Video Clipping
- Trim videos to specific time ranges
- Extract segments from longer videos
- Preserve video quality

## Technology Stack

### Frontend
- **React 18** - UI framework
- **Vite 7** - Build tool and dev server
- **Zustand** - State management
- **Tailwind CSS 4** - Styling
- **Radix UI** - Accessible UI components
- **Lucide React** - Icon library
- **React Hot Toast** - Notifications

### Backend
- **Electron 38** - Desktop app framework
- **FFmpeg** - Video processing
- **ImageMagick** - Image manipulation
- **gifsicle** - GIF optimization
