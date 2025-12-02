const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');
const os = require('os');
const { validateFilePath, validateOutputPath, validateCommandArgs, validateSettings, validateFileFilters } = require('./validation');
const { fileURLToPath } = require('url');

let mainWindow;
const isDev = !app.isPackaged;

// Track running processes
const runningProcesses = new Map();

// Settings file path
const settingsPath = path.join(app.getPath('userData'), 'settings.json');

// Default settings
const defaultSettings = {
  functionTimeout: 30000,
  useGpu: true,
  defaultVideoCompression: 80,
  defaultFps: 15,
  defaultWidth: 800,
  defaultHeight: 600,
  defaultLoopCount: 0,
  defaultCompressionLevel: 80
};

// Clean up temp files on app exit
async function cleanupTempFiles() {
  try {
    const tmpDir = os.tmpdir();
    const files = await fs.promises.readdir(tmpDir);

    // Find and delete all DeskGif temp files
    const deskGifFiles = files.filter(file => file.startsWith('DeskGif_'));

    for (const file of deskGifFiles) {
      try {
        const filePath = path.join(tmpDir, file);
        await fs.promises.unlink(filePath);
      } catch (err) {
        // Ignore errors for individual file cleanup
        console.error(`Failed to cleanup temp file ${file}:`, err);
      }
    }
  } catch (err) {
    console.error('Failed to cleanup temp directory:', err);
  }
}

// Get paths to binaries
function getBinaryPath(binary) {
  const platform = process.platform;
  const ext = platform === 'win32' ? '.exe' : '';

  if (isDev) {
    return path.join(__dirname, '..', 'binaries', platform, binary + ext);
  }

  return path.join(process.resourcesPath, 'binaries', platform, binary + ext);
}

function createWindow() {
  const preloadPath = path.join(__dirname, 'preload.js');

  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 600,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: preloadPath,
      sandbox: true,  // ✅ Security: Enable Chromium sandbox
      webSecurity: true,
      allowRunningInsecureContent: false
    },
    icon: path.join(__dirname, '..', 'icon.png')
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
    // mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
  }

  // Handle drag and drop
  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (url !== mainWindow.webContents.getURL()) {
      event.preventDefault();
      // Handle file drops that try to navigate to file://
      if (url.startsWith('file://')) {
        try {
          const filePath = fileURLToPath(url);
          if (filePath) {
            mainWindow.webContents.send('drag-drop', filePath);
          }
        } catch (err) {
          console.error('Failed to parse dropped file URL:', err);
        }
      }
    }
  });
  
  mainWindow.webContents.on('drop', (event, dragData) => {
    event.preventDefault();

    const candidates = [];
    if (dragData) {
      if (Array.isArray(dragData.filePaths)) candidates.push(...dragData.filePaths);
      if (Array.isArray(dragData.files)) candidates.push(...dragData.files);
      if (Array.isArray(dragData)) candidates.push(...dragData);
    }

    const filePath = candidates.find(Boolean);
    if (filePath) {
      mainWindow.webContents.send('drag-drop', filePath);
    }
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Clean up temp files before quitting
app.on('before-quit', async (event) => {
  event.preventDefault();

  // Kill any running processes
  for (const [processId, process] of runningProcesses) {
    if (!process.killed) {
      process.kill('SIGTERM');
    }
  }
  runningProcesses.clear();

  // Clean up temp files
  await cleanupTempFiles();

  // Now actually quit
  app.exit(0);
});

// File dialog for upload
ipcMain.handle('select-file', async (event, filters) => {
  try {
    // Validate filters if provided
    if (filters && !validateFileFilters(filters)) {
      throw new Error('Invalid file filters provided');
    }

    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openFile'],
      filters: filters || [
        { name: 'Videos', extensions: ['mp4', 'avi', 'mov', 'mkv', 'webm'] },
        { name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'gif', 'webp'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    });

    if (!result.canceled && result.filePaths.length > 0) {
      return result.filePaths[0];
    }
    return null;
  } catch (error) {
    console.error('Failed to open file dialog:', error);
    return null;
  }
});

// Save file dialog
ipcMain.handle('save-file', async (event, defaultName, filters) => {
  try {
    // Validate filters if provided
    if (filters && !validateFileFilters(filters)) {
      throw new Error('Invalid file filters provided');
    }

    const result = await dialog.showSaveDialog(mainWindow, {
      defaultPath: defaultName,
      filters: filters || [
        { name: 'All Files', extensions: ['*'] }
      ]
    });

    if (!result.canceled) {
      return result.filePath;
    }
    return null;
  } catch (error) {
    console.error('Failed to open save dialog:', error);
    return null;
  }
});

// Read file
ipcMain.handle('read-file', async (event, filePath) => {
  if (!validateFilePath(filePath)) {
    throw new Error('Invalid file path provided');
  }
  return fs.promises.readFile(filePath);
});

// Write file
ipcMain.handle('write-file', async (event, filePath, data) => {
  if (!validateOutputPath(filePath)) {
    throw new Error('Invalid output file path provided');
  }
  await fs.promises.writeFile(filePath, data);
  return true;
});

// Delete file
ipcMain.handle('delete-file', async (event, filePath) => {
  try {
    if (!validateFilePath(filePath)) {
      throw new Error('Invalid file path provided');
    }
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Failed to delete file:', error);
    throw error;
  }
});

// Save a temp file (used for drag-drop when path is unavailable)
ipcMain.handle('save-temp-file', async (event, name, data) => {
  if (!name || typeof name !== 'string') {
    throw new Error('Invalid file name');
  }
  if (!data) {
    throw new Error('No data provided');
  }

  const safeName = name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const tempPath = path.join(os.tmpdir(), `DeskGif_drop_${Date.now()}_${safeName}`);
  const buffer = Buffer.isBuffer(data) ? data : Buffer.from(data);
  await fs.promises.writeFile(tempPath, buffer);
  return tempPath;
});

// Execute FFmpeg command
ipcMain.handle('ffmpeg', async (event, args, inputPath, outputPath, useGpu = false, processIdParam = null) => {
  // Validate inputs
  if (!validateFilePath(inputPath)) {
    throw new Error('Invalid input file path provided');
  }
  if (!validateOutputPath(outputPath)) {
    throw new Error('Invalid output file path provided');
  }
  if (!validateCommandArgs(args)) {
    throw new Error('Invalid command arguments provided');
  }

  return new Promise((resolve, reject) => {
    const ffmpegPath = getBinaryPath('ffmpeg');

    // FIXED: Get file extension from outputPath
    const outputExt = path.extname(outputPath);
    const tempOutput = path.join(os.tmpdir(), `DeskGif_${Date.now()}_output${outputExt}`);

    // Build FFmpeg arguments with optional GPU acceleration
    let fullArgs = [];

    if (useGpu) {
      // Add hardware acceleration flags
      // Try to use hardware acceleration, falls back to software if unavailable
      fullArgs.push('-hwaccel', 'auto');
      // For NVIDIA GPUs (NVENC)
      if (process.platform === 'win32') {
        fullArgs.push('-hwaccel_device', '0');
      }
    }

    fullArgs.push('-i', inputPath, ...args, tempOutput);

    const processId = processIdParam || `ffmpeg_${Date.now()}`;
    const childProcess = spawn(ffmpegPath, fullArgs);
    runningProcesses.set(processId, childProcess);

    let stderr = '';

    childProcess.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    childProcess.on('close', async (code) => {
      runningProcesses.delete(processId);

      if (code === 0) {
        try {
          const data = await fs.promises.readFile(tempOutput);
          await fs.promises.writeFile(outputPath, data);
          await fs.promises.unlink(tempOutput);
          resolve({ success: true, output: outputPath, processId });
        } catch (err) {
          // Clean up temp file on error
          try {
            if (fs.existsSync(tempOutput)) {
              await fs.promises.unlink(tempOutput);
            }
          } catch (cleanupErr) {
            console.error('Failed to cleanup temp file:', cleanupErr);
          }
          reject(err);
        }
      } else if (code === null) {
        // Process was killed - clean up temp file
        try {
          if (fs.existsSync(tempOutput)) {
            await fs.promises.unlink(tempOutput);
          }
        } catch (cleanupErr) {
          console.error('Failed to cleanup temp file:', cleanupErr);
        }
        reject(new Error('Process was terminated (timeout or user cancellation)'));
      } else {
        // FFmpeg failed - clean up temp file
        try {
          if (fs.existsSync(tempOutput)) {
            await fs.promises.unlink(tempOutput);
          }
        } catch (cleanupErr) {
          console.error('Failed to cleanup temp file:', cleanupErr);
        }
        reject(new Error(`FFmpeg failed: ${stderr}`));
      }
    });
  });
});

// Execute ImageMagick command
ipcMain.handle('imagemagick', async (event, args, inputPath, outputPath, processIdParam = null) => {
  // Validate inputs
  if (!validateFilePath(inputPath)) {
    throw new Error('Invalid input file path provided');
  }
  if (!validateOutputPath(outputPath)) {
    throw new Error('Invalid output file path provided');
  }
  if (!validateCommandArgs(args)) {
    throw new Error('Invalid command arguments provided');
  }

  return new Promise((resolve, reject) => {
    const magickPath = getBinaryPath('magick');

    // Get file extension from outputPath
    const outputExt = path.extname(outputPath);
    const tempOutput = path.join(os.tmpdir(), `DeskGif_${Date.now()}_output${outputExt}`);

    const fullArgs = [inputPath, ...args, tempOutput];

    const processId = processIdParam || `imagemagick_${Date.now()}`;
    const childProcess = spawn(magickPath, fullArgs);
    runningProcesses.set(processId, childProcess);

    let stderr = '';

    childProcess.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    childProcess.on('close', async (code) => {
      runningProcesses.delete(processId);

      if (code === 0) {
        try {
          const data = await fs.promises.readFile(tempOutput);
          await fs.promises.writeFile(outputPath, data);
          await fs.promises.unlink(tempOutput);
          resolve({ success: true, output: outputPath, processId });
        } catch (err) {
          // Clean up temp file on error
          try {
            if (fs.existsSync(tempOutput)) {
              await fs.promises.unlink(tempOutput);
            }
          } catch (cleanupErr) {
            console.error('Failed to cleanup temp file:', cleanupErr);
          }
          reject(err);
        }
      } else if (code === null) {
        // Process was killed - clean up temp file
        try {
          if (fs.existsSync(tempOutput)) {
            await fs.promises.unlink(tempOutput);
          }
        } catch (cleanupErr) {
          console.error('Failed to cleanup temp file:', cleanupErr);
        }
        reject(new Error('Process was terminated (timeout or user cancellation)'));
      } else {
        // ImageMagick failed - clean up temp file
        try {
          if (fs.existsSync(tempOutput)) {
            await fs.promises.unlink(tempOutput);
          }
        } catch (cleanupErr) {
          console.error('Failed to cleanup temp file:', cleanupErr);
        }
        reject(new Error(`ImageMagick failed: ${stderr}`));
      }
    });
  });
});

// Execute gifsicle command
ipcMain.handle('gifsicle', async (event, args, inputPath, outputPath, processIdParam = null) => {
  // Validate inputs
  if (!validateFilePath(inputPath)) {
    throw new Error('Invalid input file path provided');
  }
  if (!validateOutputPath(outputPath)) {
    throw new Error('Invalid output file path provided');
  }
  if (!validateCommandArgs(args)) {
    throw new Error('Invalid command arguments provided');
  }

  return new Promise((resolve, reject) => {
    const gifsiclePath = getBinaryPath('gifsicle');
    const tempOutput = path.join(os.tmpdir(), `DeskGif_${Date.now()}_output.gif`);

    const fullArgs = [...args, inputPath, '-o', tempOutput];

    const processId = processIdParam || `gifsicle_${Date.now()}`;
    const childProcess = spawn(gifsiclePath, fullArgs);
    runningProcesses.set(processId, childProcess);

    let stderr = '';

    childProcess.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    childProcess.on('close', async (code) => {
      runningProcesses.delete(processId);

      if (code === 0) {
        try {
          const data = await fs.promises.readFile(tempOutput);
          await fs.promises.writeFile(outputPath, data);
          await fs.promises.unlink(tempOutput);
          resolve({ success: true, output: outputPath, processId });
        } catch (err) {
          // Clean up temp file on error
          try {
            if (fs.existsSync(tempOutput)) {
              await fs.promises.unlink(tempOutput);
            }
          } catch (cleanupErr) {
            console.error('Failed to cleanup temp file:', cleanupErr);
          }
          reject(err);
        }
      } else if (code === null) {
        // Process was killed - clean up temp file
        try {
          if (fs.existsSync(tempOutput)) {
            await fs.promises.unlink(tempOutput);
          }
        } catch (cleanupErr) {
          console.error('Failed to cleanup temp file:', cleanupErr);
        }
        reject(new Error('Process was terminated (timeout or user cancellation)'));
      } else {
        // Gifsicle failed - clean up temp file
        try {
          if (fs.existsSync(tempOutput)) {
            await fs.promises.unlink(tempOutput);
          }
        } catch (cleanupErr) {
          console.error('Failed to cleanup temp file:', cleanupErr);
        }
        reject(new Error(`Gifsicle failed: ${stderr}`));
      }
    });
  });
});

// Inspect GIF info (frame count, metadata)
ipcMain.handle('gifsicle-info', async (event, inputPath) => {
  if (!validateFilePath(inputPath)) {
    throw new Error('Invalid input file path provided');
  }

  return new Promise((resolve, reject) => {
    const gifsiclePath = getBinaryPath('gifsicle');
    const childProcess = spawn(gifsiclePath, ['-I', inputPath]);

    let stdout = '';
    let stderr = '';

    childProcess.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    childProcess.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    childProcess.on('close', (code) => {
      if (code === 0) {
        // Count lines that indicate frames/images
        const frameMatches = stdout.match(/image\s+#\d+/gi) || [];
        resolve({
          frames: frameMatches.length,
          raw: stdout
        });
      } else if (code === null) {
        reject(new Error('Gifsicle info was terminated'));
      } else {
        reject(new Error(`Gifsicle info failed: ${stderr || stdout}`));
      }
    });
  });
});

// Get file info
ipcMain.handle('get-file-info', async (event, filePath) => {
  if (!validateFilePath(filePath)) {
    throw new Error('Invalid file path provided');
  }
  const stats = await fs.promises.stat(filePath);
  return {
    size: stats.size,
    created: stats.birthtime,
    modified: stats.mtime
  };
});

// Load settings
ipcMain.handle('load-settings', async () => {
  try {
    if (fs.existsSync(settingsPath)) {
      const data = await fs.promises.readFile(settingsPath, 'utf-8');
      return JSON.parse(data);
    }
    // Return default settings if file doesn't exist
    return defaultSettings;
  } catch (error) {
    console.error('Failed to load settings:', error);
    return defaultSettings;
  }
});

// Save settings
ipcMain.handle('save-settings', async (event, settings) => {
  try {
    if (!validateSettings(settings)) {
      throw new Error('Invalid settings object provided');
    }
    await fs.promises.writeFile(settingsPath, JSON.stringify(settings, null, 2), 'utf-8');
    return { success: true };
  } catch (error) {
    console.error('Failed to save settings:', error);
    throw error;
  }
});

// Kill process by ID
ipcMain.handle('kill-process', async (event, processId) => {
  try {
    const process = runningProcesses.get(processId);
    if (process && !process.killed) {
      process.kill('SIGTERM');
      runningProcesses.delete(processId);
      return { success: true };
    }
    return { success: false, message: 'Process not found' };
  } catch (error) {
    console.error('Failed to kill process:', error);
    throw error;
  }
});

// Get temp file path
ipcMain.handle('get-temp-path', async (event, filename) => {
  if (!filename || typeof filename !== 'string') {
    throw new Error('Invalid filename provided');
  }
  // Sanitize filename
  const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
  return path.join(os.tmpdir(), safeName);
});

// Extract GIF frames with metadata
ipcMain.handle('get-gif-frames', async (event, inputPath) => {
  if (!validateFilePath(inputPath)) {
    throw new Error('Invalid file path provided');
  }

  return new Promise((resolve, reject) => {
    const ffmpegPath = getBinaryPath('ffmpeg');
    const gifsiclePath = getBinaryPath('gifsicle');

    // First, get frame count and delays using gifsicle
    const gifsicleProcess = spawn(gifsiclePath, ['-I', inputPath]);

    let stdout = '';
    let stderr = '';

    gifsicleProcess.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    gifsicleProcess.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    gifsicleProcess.on('close', async (code) => {
      if (code !== 0) {
        reject(new Error(`Gifsicle info failed: ${stderr || stdout}`));
        return;
      }

      try {
        // Parse frame information from gifsicle output
        const lines = stdout.split('\n');
        const frameInfo = [];

        // Extract frame delays (in centiseconds, 100ths of a second)
        for (const line of lines) {
          const match = line.match(/image\s+#(\d+).*?delay\s+(\d+\.?\d*)/i);
          if (match) {
            const frameNum = parseInt(match[1]);
            const delayCs = parseFloat(match[2]);
            const delayMs = Math.round(delayCs * 10); // Convert to milliseconds
            frameInfo.push({ frameNum, delay: delayMs });
          }
        }

        if (frameInfo.length === 0) {
          reject(new Error('No frames found in GIF'));
          return;
        }

        // Now extract thumbnails using ffmpeg
        const tempDir = os.tmpdir();
        const thumbnailPattern = path.join(tempDir, `DeskGif_frame_${Date.now()}_%03d.png`);

        // Extract all frames as PNG thumbnails (scaled down to 150px width for performance)
        const ffmpegArgs = [
          '-i', inputPath,
          '-vf', 'scale=150:-1',
          thumbnailPattern
        ];

        const ffmpegProcess = spawn(ffmpegPath, ffmpegArgs);
        let ffmpegStderr = '';

        ffmpegProcess.stderr.on('data', (data) => {
          ffmpegStderr += data.toString();
        });

        ffmpegProcess.on('close', async (ffmpegCode) => {
          if (ffmpegCode !== 0) {
            reject(new Error(`FFmpeg frame extraction failed: ${ffmpegStderr}`));
            return;
          }

          try {
            // Read all generated thumbnail files
            const result = [];
            const tempDirName = path.dirname(thumbnailPattern);
            const basePattern = path.basename(thumbnailPattern).replace('%03d', '');

            for (let i = 0; i < frameInfo.length; i++) {
              // FFmpeg uses 1-based indexing for output
              const thumbnailPath = path.join(tempDirName, basePattern.replace('*', String(i + 1).padStart(3, '0')));

              try {
                if (fs.existsSync(thumbnailPath)) {
                  const thumbnailData = await fs.promises.readFile(thumbnailPath);
                  const base64Thumbnail = thumbnailData.toString('base64');

                  result.push({
                    delay: frameInfo[i].delay,
                    thumbnail: base64Thumbnail
                  });

                  // Clean up thumbnail file
                  await fs.promises.unlink(thumbnailPath).catch(() => {});
                }
              } catch (err) {
                console.error(`Failed to read thumbnail ${i}:`, err);
                // Use placeholder if thumbnail read fails
                result.push({
                  delay: frameInfo[i].delay,
                  thumbnail: ''
                });
              }
            }

            resolve(result);
          } catch (err) {
            reject(err);
          }
        });
      } catch (err) {
        reject(err);
      }
    });
  });
});
