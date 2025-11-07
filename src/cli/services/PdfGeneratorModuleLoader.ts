import type { ILogger } from '../interfaces/ILogger.js';
import type { generateInvoice, generatePDFUPO } from '../../app/build/ksef-pdf-generator.es.js';

export class PdfGeneratorModuleLoader {
  private logger: ILogger;

  constructor(logger: ILogger) {
    this.logger = logger;
  }

  async loadGenerators(): Promise<{ 
    generateInvoice: typeof generateInvoice; 
    generatePDFUPO: typeof generatePDFUPO 
  }> {
    try {
      // Import statyczny modułu ksef-pdf-generator dla SEA bundling
      const { generateInvoice, generatePDFUPO } = await import('../../app/build/ksef-pdf-generator.es.js');
      
      if (!generateInvoice || !generatePDFUPO) {
        throw new Error('Moduł nie eksportuje wymaganych funkcji');
      }

      this.logger.info('✓ Moduł ksef-pdf-generator załadowany pomyślnie');
      
      return {
        generateInvoice,
        generatePDFUPO
      };
    } catch (error) {
      this.logger.error('Błąd podczas ładowania modułu ksef-pdf-generator:', error);
      throw error;
    }
  }
}
