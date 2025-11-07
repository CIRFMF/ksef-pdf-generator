import type { IPdfGenerator } from '../interfaces/IPdfGenerator.js';

export class InvoicePdfGenerator implements IPdfGenerator {
  constructor(private generateFn: any) {}

  async generate(file: File, additionalData?: any): Promise<Blob> {
    return await this.generateFn(file, additionalData, 'blob');
  }
}
