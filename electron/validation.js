const path = require('path');
const fs = require('fs');
const os = require('os');

/**
 * Validates a file path to prevent directory traversal and ensure file exists
 * @param {string} filePath - The file path to validate
 * @returns {boolean} - Whether the path is valid
 */
function validateFilePath(filePath) {
  if (!filePath || typeof filePath !== 'string') {
    return false;
  }

  try {
    // Check for directory traversal patterns BEFORE normalization
    if (filePath.includes('..')) {
      console.error('Security: Directory traversal attempt blocked:', filePath);
      return false;
    }

    // Resolve to absolute path
    const resolved = path.resolve(filePath);
    const normalized = path.normalize(filePath);

    // Additional safety: compare resolved path with normalized input
    // If someone tries path traversal, the resolved path will escape expected boundaries
    if (resolved !== path.resolve(normalized)) {
      console.error('Security: Path resolution mismatch:', filePath);
      return false;
    }

    // Check if file exists
    if (!fs.existsSync(resolved)) {
      console.error('Validation: File does not exist:', resolved);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Validation error:', error);
    return false;
  }
}

/**
 * Validates an output file path for writing
 * @param {string} outputPath - The output file path to validate
 * @param {object} options - Validation options
 * @param {boolean} options.allowTemp - Allow writing to temp directory (default: true)
 * @param {boolean} options.allowUserSelected - Allow any user-selected path (default: true)
 * @param {string[]} options.allowedExtensions - Array of allowed file extensions (optional)
 * @returns {boolean} - Whether the path is valid
 */
function validateOutputPath(outputPath, options = {}) {
  const {
    allowTemp = true,
    allowUserSelected = true,
    allowedExtensions = null
  } = options;

  if (!outputPath || typeof outputPath !== 'string') {
    console.error('Validation: Invalid output path type');
    return false;
  }

  try {
    // Check for directory traversal patterns BEFORE normalization
    if (outputPath.includes('..')) {
      console.error('Security: Directory traversal in output path:', outputPath);
      return false;
    }

    // Resolve to absolute path
    const resolved = path.resolve(outputPath);
    const normalized = path.normalize(outputPath);

    // Check for path traversal by comparing resolved paths
    if (resolved !== path.resolve(normalized)) {
      console.error('Security: Output path resolution mismatch:', outputPath);
      return false;
    }

    // Validate file extension if specified
    if (allowedExtensions && Array.isArray(allowedExtensions) && allowedExtensions.length > 0) {
      const ext = path.extname(resolved).toLowerCase();
      const normalizedExtensions = allowedExtensions.map(e => e.startsWith('.') ? e.toLowerCase() : `.${e.toLowerCase()}`);

      if (!normalizedExtensions.includes(ext)) {
        console.error('Validation: Invalid file extension:', ext, 'Allowed:', normalizedExtensions);
        return false;
      }
    }

    // Check if path is in allowed locations
    const tmpDir = os.tmpdir();
    const resolvedDir = path.dirname(resolved);

    // If in temp directory, always allow (for processing)
    if (allowTemp && resolvedDir.startsWith(path.resolve(tmpDir))) {
      return true;
    }

    // For user-selected paths, we allow them but ensure no traversal
    if (allowUserSelected) {
      // Basic safety check: ensure parent directory exists or can be created
      const parentDir = path.dirname(resolved);

      // Don't allow writing to system directories
      const systemDirs = [
        path.resolve(process.env.SystemRoot || 'C:\\Windows'),
        path.resolve(process.env.ProgramFiles || 'C:\\Program Files'),
        path.resolve(process.env['ProgramFiles(x86)'] || 'C:\\Program Files (x86)'),
        '/System',
        '/bin',
        '/sbin',
        '/usr/bin',
        '/usr/sbin'
      ];

      for (const sysDir of systemDirs) {
        if (resolved.startsWith(sysDir)) {
          console.error('Security: Attempt to write to system directory:', resolved);
          return false;
        }
      }

      return true;
    }

    console.error('Validation: Output path not in allowed location:', outputPath);
    return false;
  } catch (error) {
    console.error('Validation error for output path:', error);
    return false;
  }
}

/**
 * Validates an array of command-line arguments
 * @param {any} args - The arguments to validate
 * @returns {boolean} - Whether the arguments are valid
 */
function validateCommandArgs(args) {
  if (!Array.isArray(args)) {
    console.error('Validation: Args must be an array');
    return false;
  }

  // Check each argument is a string and doesn't contain suspicious patterns
  for (const arg of args) {
    if (typeof arg !== 'string') {
      console.error('Validation: All args must be strings');
      return false;
    }

    // Prevent command injection by checking for shell metacharacters
    // Allow filter-complex separators like ';' since args are passed directly to child_process.spawn
    if (arg.includes('&') || arg.includes('|') ||
        arg.includes('`') || arg.includes('$') || arg.includes('$(')) {
      console.error('Security: Suspicious shell metacharacter in args:', arg);
      return false;
    }
  }

  return true;
}

/**
 * Validates settings object
 * @param {any} settings - The settings to validate
 * @returns {boolean} - Whether the settings are valid
 */
function validateSettings(settings) {
  if (!settings || typeof settings !== 'object') {
    return false;
  }

  // Ensure settings is a plain object, not a function or array
  if (Array.isArray(settings) || typeof settings === 'function') {
    console.error('Validation: Settings must be a plain object');
    return false;
  }

  return true;
}

/**
 * Validates file filters for dialog
 * @param {any} filters - The filters to validate
 * @returns {boolean} - Whether the filters are valid
 */
function validateFileFilters(filters) {
  if (!filters) {
    return true; // Filters are optional
  }

  if (!Array.isArray(filters)) {
    return false;
  }

  for (const filter of filters) {
    if (!filter || typeof filter !== 'object') {
      return false;
    }
    if (typeof filter.name !== 'string' || !Array.isArray(filter.extensions)) {
      return false;
    }
  }

  return true;
}

module.exports = {
  validateFilePath,
  validateOutputPath,
  validateCommandArgs,
  validateSettings,
  validateFileFilters
};
