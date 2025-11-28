import fs from 'fs';
import path from 'path';

export const LogLevel = {
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
  DEBUG: 'DEBUG'
} as const;

export type LogLevel = typeof LogLevel[keyof typeof LogLevel];

class Logger {
  private logDir: string;
  private logFile: string;
  private isDevelopment: boolean;

  constructor() {
    this.isDevelopment = process.env.NODE_ENV !== 'production';
    
    // Określ katalog logów
    if (process.env.LOG_DIR) {
      this.logDir = process.env.LOG_DIR;
    } else {
      // Na Windows Service: C:\logs\ksef-api
      // W dev: ./logs
      this.logDir = this.isDevelopment ? './logs' : 'C:\\logs\\ksef-api';
    }

    // Upewnij się, że katalog istnieje
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }

    // Plik logu z datą
    const today = new Date().toISOString().split('T')[0];
    this.logFile = path.join(this.logDir, `api-${today}.log`);
  }

  private formatMessage(level: LogLevel, message: string, data?: any): string {
    const timestamp = new Date().toISOString();
    const dataStr = data ? `\n${typeof data === 'string' ? data : JSON.stringify(data, null, 2)}` : '';
    return `[${timestamp}] [${level}] ${message}${dataStr}`;
  }

  private write(level: LogLevel, message: string, data?: any): void {
    const formatted = this.formatMessage(level, message, data);

    // Zawsze loguj do konsoli
    const logFn = level === LogLevel.ERROR || level === LogLevel.WARN ? console.error : console.log;
    logFn(formatted);

    // Loguj do pliku (pominąć w dev jeśli LOG_TO_FILE=false)
    if (!this.isDevelopment || process.env.LOG_TO_FILE !== 'false') {
      try {
        fs.appendFileSync(this.logFile, formatted + '\n');
      } catch (err) {
        console.error('Failed to write to log file:', err);
      }
    }
  }

  info(message: string, data?: any): void {
    this.write(LogLevel.INFO, message, data);
  }

  warn(message: string, data?: any): void {
    this.write(LogLevel.WARN, message, data);
  }

  error(message: string, data?: any): void {
    this.write(LogLevel.ERROR, message, data);
  }

  debug(message: string, data?: any): void {
    if (this.isDevelopment || process.env.DEBUG === 'true') {
      this.write(LogLevel.DEBUG, message, data);
    }
  }

  getLogFile(): string {
    return this.logFile;
  }

  getLogDir(): string {
    return this.logDir;
  }
}

export const logger = new Logger();
