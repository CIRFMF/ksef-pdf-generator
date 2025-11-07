export interface IPdfGenerator {
  generate(file: File, additionalData?: any): Promise<Blob>;
}
