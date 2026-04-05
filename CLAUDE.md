# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TypeScript library for generating PDF visualizations of KSeF (Polish National e-Invoice System) invoices and UPO (Potwierdzenie) documents from XML files, entirely on the client side (browser).

Supported formats:
- **Invoices**: FA (1), FA (2), FA (3), FA_RR (Rachunek Rozliczeniowy)
- **UPO**: v4.2, v4.3

## CLI Usage

After building with `npm run build:cli`, the binary is at `dist-cli/ksef-pdf.js`:

```bash
# Generate PDF from UPO XML
ksef-pdf upo <input.xml> <output.pdf>

# Generate PDF from invoice XML
ksef-pdf invoice <input.xml> <output.pdf> --nr-ksef <nrKSeF>

# Generate PDF from invoice XML with QR code(s)
ksef-pdf invoice <input.xml> <output.pdf> --nr-ksef <nrKSeF> --qr-code <url> [--qr2-code <url>]
```

`--nr-ksef` is required for invoices. `--qr-code` renders a verifiable QR code section in the PDF footer. `--qr2-code` renders a secondary supplier certificate QR code.

## Commands

```bash
npm run dev          # Start dev server at http://localhost:5173/
npm run build        # Production library build (ES + UMD + .d.ts)
npm run build:cli    # Build Node.js CLI binary to dist-cli/ksef-pdf.js
npm run type         # TypeScript type checking
npm run test         # Run tests in watch mode (Vitest)
npm run test:ui      # Run tests with interactive UI
npm run test:ci      # Run tests in CI mode with v8 coverage
```

There is no dedicated lint command — ESLint is configured via `eslint.config.mts`.

To run a single test file:
```bash
npx vitest run src/path/to/file.spec.ts
```

## Architecture

### Data Flow

```
XML File → parseXML() (xml-js) → Type Detection → Format Generator → Component Generators → pdfMake document definition → Blob/Base64
```

### Key Entry Points

- `src/index.ts` — Library main export
- `src/lib-public/index.ts` — Library public API (`generateInvoice`, `generatePDFUPO`, types)
- `src/lib-public/generate-invoice.ts` — Invoice generation orchestrator (detects format, delegates to FA1/FA2/FA3/FA_RR generators)
- `src/app-public/main.ts` — Demo browser app with file upload UI

### Directory Structure

```
src/
├── cli/                 # Node.js CLI (built separately via vite.cli.config.ts)
│   ├── index.ts              # Entry point with commander subcommands
│   ├── xml-parser.ts         # Node.js XML parser (reads from file path via fs)
│   ├── pdf-writer.ts         # Writes TCreatedPdf to disk using getBuffer()
│   ├── generate-invoice-cli.ts  # Invoice CLI wrapper (reuses FA1-4/FARR generators)
│   └── generate-upo-cli.ts      # UPO CLI wrapper
├── lib-public/          # Main library
│   ├── generate-invoice.ts   # Top-level orchestrator
│   ├── FA1-generator.ts      # Format-level generators
│   ├── FA2-generator.ts
│   ├── FA3-generator.ts
│   ├── FARR-generator.ts
│   ├── UPO-generator.ts
│   ├── types/               # TypeScript interfaces for each schema
│   ├── enums/
│   └── generators/          # Component-level generators (50+ files)
│       ├── common/          # Shared: Naglowek, Stopka, Rozliczenie, etc.
│       ├── FA1/
│       ├── FA2/
│       ├── FA3/
│       ├── FA_RR/
│       ├── UPO4_2/
│       └── UPO4_3/
├── shared/              # Utilities used across all generators
│   ├── XML-parser.ts         # Converts XML File → JSON (strips namespace prefixes)
│   ├── PDF-functions.ts      # Core formatting helpers (formatText, getValue, generateLine, getStyle, etc.)
│   ├── types/
│   ├── enums/                # FormatTyp (45+ types), Position, Answer
│   ├── consts/               # Tax rates, payment forms, country codes
│   └── mocks/
│       └── functions.mock.ts # Vitest setup file (mocks browser APIs for jsdom)
└── app-public/          # Demo app only (not part of library output)
```

### Component Generator Pattern

Each section of a PDF document is a separate generator file (e.g., `Faktura.ts`, `Podmiot1.ts`, `WierszeFaktury.ts`). Each exports a function that receives parsed XML data and returns a pdfMake content array. Every generator file has a co-located `.spec.ts` test.

Format generators (FA1, FA2, etc.) compose these component generators into a full pdfMake document definition passed to `pdfMake.createPdf()`.

### Naming Conventions

Variable and field names follow the Polish XML schema (e.g., `Podmiot1`, `NrFaktury`, `WartoscSprzedazyOpodatkowanej`). This is intentional — do not rename these to English.

### Build Output

Vite produces three artifacts in `dist/`:
- `ksef-fe-invoice-converter.js` — ES module
- `ksef-fe-invoice-converter.umd.cjs` — UMD bundle
- `index.d.ts` — Type definitions (via vite-plugin-dts)

### Testing

Tests use Vitest with jsdom environment. All tests are co-located with source files as `.spec.ts`. The setup file at `src/shared/mocks/functions.mock.ts` mocks browser APIs needed by pdfMake and xml-js in jsdom.

Test style: format-level generators mock all sub-generators with `vi.mock()` and spy on `pdfMake.createPdf` to assert it is called with the correct document definition.
