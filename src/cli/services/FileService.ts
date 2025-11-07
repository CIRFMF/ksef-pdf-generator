import { promises as fs } from 'fs';
import path from 'path';
import type { IFileService } from '../interfaces/IFileService.js';
import type { ILogger } from '../interfaces/ILogger.js';

export class FileService implements IFileService {
  private logger: ILogger;

  constructor(logger: ILogger) {
    this.logger = logger;
  }

  async readXmlFile(filePath: string): Promise<string> {
    const resolvedPath = path.resolve(filePath);
    await this.ensureFileExists(resolvedPath);
    return await fs.readFile(resolvedPath, 'utf-8');
  }

  async writePdfFile(blob: Blob, outputPath: string): Promise<void> {
    const resolvedPath = path.resolve(outputPath);
    const buffer = await this.convertBlobToBuffer(blob);
    
    const outputDir = path.dirname(resolvedPath);
    await fs.mkdir(outputDir, { recursive: true });
    
    await fs.writeFile(resolvedPath, buffer);
  }

  async ensureFileExists(filePath: string): Promise<void> {
    try {
      await fs.access(filePath);
    } catch {
      throw new Error(`Plik wejściowy nie istnieje: ${filePath}`);
    }
  }

  createFileFromContent(content: string, filename: string): File {
    const FileConstructor = (global as any).File;
    if (!FileConstructor) {
      throw new Error('Środowisko File nie zostało zainicjalizowane');
    }
    return new FileConstructor([content], filename, { type: 'application/xml' });
  }

  private async convertBlobToBuffer(blob: Blob): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
      const reader = new (global as any).FileReader();
      reader.onload = () => {
        const arrayBuffer = reader.result;
        resolve(Buffer.from(arrayBuffer));
      };
      reader.onerror = () => reject(new Error('Błąd podczas odczytu Blob'));
      reader.readAsArrayBuffer(blob);
    });
  }
}
