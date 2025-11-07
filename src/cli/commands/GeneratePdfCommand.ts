import path from 'path';
import type { ICliCommand } from '../interfaces/ICliCommand.js';
import type { IPdfGenerator } from '../interfaces/IPdfGenerator.js';
import type { IFileService } from '../interfaces/IFileService.js';
import type { ILogger } from '../interfaces/ILogger.js';

export class GeneratePdfCommand implements ICliCommand {
  constructor(
    private generator: IPdfGenerator,
    private fileService: IFileService,
    private logger: ILogger,
    private inputPath: string,
    private outputPath: string,
    private commandName: string
  ) {}

  async execute(): Promise<void> {
    try {
      this.logger.info(`Generowanie ${this.commandName} PDF z: ${this.inputPath}`);
      
      const xmlContent = await this.fileService.readXmlFile(this.inputPath);
      const file = this.fileService.createFileFromContent(xmlContent, path.basename(this.inputPath));
      
      const pdfBlob = await this.generator.generate(file);
      
      await this.fileService.writePdfFile(pdfBlob, this.outputPath);
      
      this.logger.success(`${this.commandName} PDF wygenerowane pomyślnie: ${this.outputPath}`);
    } catch (error) {
      this.logger.error(`Błąd podczas generowania ${this.commandName} PDF:`, error);
      throw error;
    }
  }
}
