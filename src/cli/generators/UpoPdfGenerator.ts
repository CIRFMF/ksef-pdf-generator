import type { IPdfGenerator } from '../interfaces/IPdfGenerator.js';

export class UpoPdfGenerator implements IPdfGenerator {
  constructor(private generateFn: any) {}

  async generate(file: File): Promise<Blob> {
    return await this.generateFn(file);
  }
}
