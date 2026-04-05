import { writeFileSync } from 'fs';
import { TCreatedPdf } from 'pdfmake/build/pdfmake';

export function writePDF(pdf: TCreatedPdf, outputPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    pdf.getBuffer((buffer: Buffer) => {
      try {
        writeFileSync(outputPath, buffer);
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  });
}
