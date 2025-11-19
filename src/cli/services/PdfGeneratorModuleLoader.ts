import type { ILogger } from '../interfaces/ILogger.js';
// Używamy tylko typów z deklaracji modułu bundla – w runtime i tak ładowany jest plik .js z dist
import type { generateInvoice, generatePDFUPO } from '../../lib-public/index';

export class PdfGeneratorModuleLoader {
  private logger: ILogger;

  constructor(logger: ILogger) {
    this.logger = logger;
  }

  async loadGenerators(): Promise<{
    generateInvoice: typeof generateInvoice;
    generatePDFUPO: typeof generatePDFUPO;
  }> {
    try {
      const { generateInvoice, generatePDFUPO } = await import("../../lib-public/index.js");

      if (!generateInvoice || !generatePDFUPO) {
        throw new Error('Moduł nie eksportuje wymaganych funkcji');
      }

      this.logger.info('✓ Bundel ksef-pdf-generator załadowany pomyślnie');

      return { generateInvoice, generatePDFUPO };
    } catch (error) {
      this.logger.error('Błąd podczas ładowania bundla ksef-pdf-generator:', error);
      throw error;
    }
  }
}