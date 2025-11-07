export interface IFileService {
  readXmlFile(filePath: string): Promise<string>;
  writePdfFile(blob: Blob, outputPath: string): Promise<void>;
  ensureFileExists(filePath: string): Promise<void>;
  createFileFromContent(content: string, filename: string): File;
}
