// Simple logger for client
type LogLevel = 'error' | 'warn' | 'info' | 'debug';

interface LogEntry {
  level: LogLevel;
  message: string;
  data?: unknown;
  timestamp: string;
  userId?: string;
  sessionId?: string;
}

// Type for import.meta.env
interface ImportMetaEnv {
  MODE?: string;
}

interface CustomImportMeta {
  env: ImportMetaEnv;
}

// Type for global with import.meta
interface GlobalWithImportMeta {
  import?: {
    meta?: CustomImportMeta;
  };
}

class ClientLogger {
  private get isDevelopment(): boolean {
    return this.getEnvironmentMode() === 'development';
  }

  private get logLevel(): LogLevel {
    return this.isDevelopment ? 'debug' : 'info';
  }

  private getEnvironmentMode(): string {
    // First check NODE_ENV for tests
    if (typeof process !== 'undefined' && process.env.NODE_ENV) {
      return process.env.NODE_ENV;
    }

    // Check if we're in a test environment
    if (typeof global !== 'undefined' && (global as GlobalWithImportMeta).import?.meta?.env?.MODE) {
      return (global as GlobalWithImportMeta).import!.meta!.env.MODE as string;
    }

    // Check if we're in a browser environment with Vite
    try {
      // Use eval to avoid TypeScript compilation issues with import.meta
      const mode = eval('import.meta.env.MODE') as string | undefined;
      return mode || 'development';
    } catch {
      // Default to development for safety
      return 'development';
    }
  }

  private levels: Record<LogLevel, number> = {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
  };

  private colors: Record<LogLevel, string> = {
    error: '🔴',
    warn: '🟡',
    info: '🔵',
    debug: '⚪',
  };

  private shouldLog(level: LogLevel): boolean {
    return this.levels[level] <= this.levels[this.logLevel];
  }

  private formatMessage(level: LogLevel, message: string, data?: unknown): string {
    const timestamp = new Date().toISOString();
    const color = this.colors[level];
    const prefix = `${color} [${level.toUpperCase()}] ${timestamp}`;

    if (data) {
      return `${prefix} ${message}\n${JSON.stringify(data, null, 2)}`;
    }

    return `${prefix} ${message}`;
  }

  private log(level: LogLevel, message: string, data?: unknown): void {
    if (!this.shouldLog(level)) return;

    const formattedMessage = this.formatMessage(level, message, data);

    // In production send to server
    if (!this.isDevelopment) {
      this.sendToServer(level, message, data).catch(error => {
        console.error('Failed to send log to server:', error);
      });
    } else {
      // In development output to console
      console.log(formattedMessage);
    }
  }

  private async sendToServer(level: LogLevel, message: string, data?: unknown): Promise<void> {

    try {
      const logEntry: LogEntry = {
        level,
        message,
        data,
        timestamp: new Date().toISOString(),
        userId: this.getUserId(),
        sessionId: this.getSessionId(),
      };

      // Send to server (if there's a logs endpoint)
      await fetch('/api/logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(logEntry),
      });
    } catch (error) {
      // If failed to send to server, output to console
      console.error('Failed to send log to server:', error);
    }
  }

  private getUserId(): string | undefined {
    // Get user ID from Redux store or localStorage
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return user.id;
    } catch {
      return undefined;
    }
  }

  private getSessionId(): string {
    // Generate or get session ID
    let sessionId = sessionStorage.getItem('sessionId');
    if (!sessionId) {
      sessionId = Math.random().toString(36).substring(2, 15);
      sessionStorage.setItem('sessionId', sessionId);
    }
    return sessionId;
  }

  // Public methods
  error(message: string, data?: unknown): void {
    this.log('error', message, data);
  }

  warn(message: string, data?: unknown): void {
    this.log('warn', message, data);
  }

  info(message: string, data?: unknown): void {
    this.log('info', message, data);
  }

  debug(message: string, data?: unknown): void {
    this.log('debug', message, data);
  }
}

// Create single logger instance
const logger = new ClientLogger();

// Export both the instance and the class for testing
export { ClientLogger };
export type { LogLevel, LogEntry };
export default logger;