export const withTimeout = async (promise, timeoutMs, onTimeout) => {
  let timeoutId;

  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(async () => {
      try {
        if (onTimeout) {
          await onTimeout();
        }
      } finally {
        reject(new Error(`Operation timed out after ${timeoutMs / 1000} seconds`));
      }
    }, timeoutMs);
  });

  try {
    const result = await Promise.race([promise, timeoutPromise]);
    clearTimeout(timeoutId);
    return result;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

export const createTimeoutWrapper = (timeoutMs) => {
  return async (handler, ...args) => {
    const startTime = Date.now();
    let processId = null;

    try {
      const result = await withTimeout(
        handler(...args),
        timeoutMs,
        async () => {
          // Attempt to kill the process if we have an ID
          if (processId) {
            try {
              await window.electron.killProcess(processId);
            } catch (err) {
              console.error('Failed to kill process:', err);
            }
          }
        }
      );

      // Extract process ID if available
      if (result && result.processId) {
        processId = result.processId;
      }

      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`Operation failed after ${duration}ms:`, error.message);
      throw error;
    }
  };
};
