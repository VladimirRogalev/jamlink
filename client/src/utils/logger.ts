// Simple logger for client
type LogLevel = 'error' | 'warn' | 'info' | 'debug';

interface LogEntry {
  level: LogLevel;
  message: string;
  data?: any;
  timestamp: string;
  userId?: string;
  sessionId?: string;
}

class ClientLogger {
  private isDevelopment = import.meta.env.MODE === 'development';
  private logLevel: LogLevel = this.isDevelopment ? 'debug' : 'info';
  
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

  private formatMessage(level: LogLevel, message: string, data?: any): string {
    const timestamp = new Date().toISOString();
    const color = this.colors[level];
    const prefix = `${color} [${level.toUpperCase()}] ${timestamp}`;
    
    if (data) {
      return `${prefix} ${message}\n${JSON.stringify(data, null, 2)}`;
    }
    
    return `${prefix} ${message}`;
  }

  private log(level: LogLevel, message: string, data?: any): void {
    if (!this.shouldLog(level)) return;

    const formattedMessage = this.formatMessage(level, message, data);
    
    // In production send to server
    if (!this.isDevelopment) {
      this.sendToServer(level, message, data);
    } else {
      // In development output to console
      console.log(formattedMessage);
    }
  }

  private async sendToServer(level: LogLevel, message: string, data?: any): Promise<void> {
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
  error(message: string, data?: any): void {
    this.log('error', message, data);
  }

  warn(message: string, data?: any): void {
    this.log('warn', message, data);
  }

  info(message: string, data?: any): void {
    this.log('info', message, data);
  }

  debug(message: string, data?: any): void {
    this.log('debug', message, data);
  }
}

// Create single logger instance
const logger = new ClientLogger();

export default logger;
