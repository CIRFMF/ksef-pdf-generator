import type { ILogger } from '../interfaces/ILogger.js';

export class ConsoleLogger implements ILogger {
  info(message: string): void {
    console.log(message);
  }

  success(message: string): void {
    console.log(`✅ ${message}`);
  }

  error(message: string, error?: any): void {
    console.error(`❌ ${message}`, error || '');
  }
}
