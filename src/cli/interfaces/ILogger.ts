export interface ILogger {
  info(message: string): void;
  success(message: string): void;
  error(message: string, error?: any): void;
}
