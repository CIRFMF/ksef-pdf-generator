import { program } from 'commander';
import { generateInvoiceCLI } from './generate-invoice-cli';
import { generateUpoCLI } from './generate-upo-cli';

program
  .name('ksef-pdf')
  .description('Generate PDFs from KSeF XML files')
  .version('1.1.0');

program
  .command('upo <input> <output>')
  .description('Generate PDF from a UPO (Potwierdzenie) XML file')
  .action(async (input: string, output: string) => {
    try {
      await generateUpoCLI(input, output);
      console.log(`UPO PDF written to ${output}`);
    } catch (err) {
      console.error('Error generating UPO PDF:', err);
      process.exit(1);
    }
  });

program
  .command('invoice <input> <output>')
  .description('Generate PDF from a KSeF invoice XML file')
  .requiredOption('--nr-ksef <nrKSeF>', 'KSeF invoice number')
  .option('--qr-code <url>', 'QR code URL for invoice verification in KSeF')
  .option('--qr2-code <url>', 'Secondary QR code URL for supplier certificate verification')
  .action(async (input: string, output: string, options) => {
    try {
      await generateInvoiceCLI(input, output, {
        nrKSeF: options.nrKsef,
        qrCode: options.qrCode,
        qr2Code: options.qr2Code,
      });
      console.log(`Invoice PDF written to ${output}`);
    } catch (err) {
      console.error('Error generating invoice PDF:', err);
      process.exit(1);
    }
  });

program.parseAsync();
