import { Command } from 'commander';
import type { ILogger } from '../interfaces/ILogger.js';
import type { IFileService } from '../interfaces/IFileService.js';
import type { IEnvironmentInitializer } from '../interfaces/IEnvironmentInitializer.js';
import type { IPdfGenerator } from '../interfaces/IPdfGenerator.js';
import { ConsoleLogger, FileService, PdfGeneratorModuleLoader } from '../services/index.js';
import { BrowserEnvironmentInitializer } from '../environment/index.js';
import { InvoicePdfGenerator, UpoPdfGenerator } from '../generators/index.js';
import { GenerateInvoiceCommand, GeneratePdfCommand } from '../commands/index.js';

export class CliApplication {
  private logger: ILogger;
  private fileService: IFileService;
  private environmentInitializer: IEnvironmentInitializer;
  private moduleLoader: PdfGeneratorModuleLoader;
  private invoiceGenerator?: IPdfGenerator;
  private upoGenerator?: IPdfGenerator;

  constructor() {
    this.logger = new ConsoleLogger();
    this.fileService = new FileService(this.logger);
    this.environmentInitializer = new BrowserEnvironmentInitializer();
    this.moduleLoader = new PdfGeneratorModuleLoader(this.logger);
  }

  async initialize(): Promise<void> {
    this.environmentInitializer.initialize();
    
    const generators = await this.moduleLoader.loadGenerators();
    this.invoiceGenerator = new InvoicePdfGenerator(generators.generateInvoice);
    this.upoGenerator = new UpoPdfGenerator(generators.generatePDFUPO);
  }

  setupCommands(program: Command): void {
    this.setupInvoiceCommand(program);
    this.setupUpoCommand(program);
  }

  private setupInvoiceCommand(program: Command): void {
    program
      .command('invoice')
      .description('Generuj wizualizację PDF faktury z pliku XML')
      .argument('<input>', 'Ścieżka do pliku XML faktury (FA(1), FA(2) lub FA(3))')
      .argument('<output>', 'Ścieżka do wyjściowego pliku PDF')
      .option('--nr-ksef <numer>', 'Numer KSeF faktury')
      .option('--qr-code <url>', 'URL do kodu QR faktury')
      .action(async (input: string, output: string, options: any) => {
        try {
          const additionalData: any = {};
          if (options.nrKsef) {
            additionalData.nrKSeF = options.nrKsef;
          }
          if (options.qrCode) {
            additionalData.qrCode = options.qrCode;
          }

          if (!this.invoiceGenerator) {
            throw new Error('Generator faktur nie został zainicjalizowany');
          }

          const command = new GenerateInvoiceCommand(
            this.invoiceGenerator,
            this.fileService,
            this.logger,
            input,
            output,
            additionalData
          );

          await command.execute();
        } catch (error) {
          process.exit(1);
        }
      });
  }

  private setupUpoCommand(program: Command): void {
    program
      .command('upo')
      .description('Generuj wizualizację PDF UPO z pliku XML')
      .argument('<input>', 'Ścieżka do pliku XML UPO (schemat UPO v4_2)')
      .argument('<output>', 'Ścieżka do wyjściowego pliku PDF')
      .action(async (input: string, output: string) => {
        try {
          if (!this.upoGenerator) {
            throw new Error('Generator UPO nie został zainicjalizowany');
          }

          const command = new GeneratePdfCommand(
            this.upoGenerator,
            this.fileService,
            this.logger,
            input,
            output,
            'UPO'
          );

          await command.execute();
        } catch (error) {
          process.exit(1);
        }
      });
  }
}
