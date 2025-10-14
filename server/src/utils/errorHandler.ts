/**
 * Safely extracts error information from unknown error type
 * @param error - Unknown error object
 * @returns Object with error message and stack trace
 */
export function getErrorInfo(error: unknown): { message: string; stack?: string } {
  if (error instanceof Error) {
    return {
      message: error.message,
      stack: error.stack,
    };
  }
  
  if (typeof error === 'string') {
    return {
      message: error,
    };
  }
  
  if (error && typeof error === 'object' && 'message' in error) {
    return {
      message: String(error.message),
      stack: 'stack' in error ? String(error.stack) : undefined,
    };
  }
  
  return {
    message: String(error),
  };
}

/**
 * Creates a standardized error log object
 * @param error - Unknown error object
 * @param context - Additional context information
 * @returns Object suitable for logger
 */
export function createErrorLog(error: unknown, context?: Record<string, any>) {
  const errorInfo = getErrorInfo(error);
  
  return {
    error: errorInfo.message,
    stack: errorInfo.stack,
    ...context,
  };
}
