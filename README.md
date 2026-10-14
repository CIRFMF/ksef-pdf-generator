# KSeF PDF Generator

A statically linked, zero-dependency converter for generating KSeF-compliant PDF invoices (Faktura) and UPO documents from XML.

## Overview

This project provides a command‑line tool (`ksef-pdf-generator`) that reads an XML invoice/UPO file and produces a PDF ready for submission to the National e‑Invoicing System (KSeF). The produced binaries are fully statically linked, meaning they run on any compatible Linux/macOS/Windows system without requiring Node.js or any other runtime.

The tool is published as GitHub Releases; you can download the pre‑built binaries directly from the **Releases** page.

## Features

- Generates PDF from KSeF invoice XML (`faktura`/`invoice`) with automatic QR code extraction when possible.
- Generates PDF from UPO XML.
- Embedded PDFMake engine with fonts bundled.
- No runtime dependencies – the distributed binaries are statically linked.
- Supports Linux (x64/arm64), Windows (x64/arm64) and macOS (x64/arm64).

## Installation

Download the latest release from the [GitHub Releases](https://github.com/your-org/ksef-pdf-generator/releases) page matching your platform and make it executable:

```bash
# Example for Linux x86_64
chmod +x ksef-pdf-generator-linux-x64
./ksef-pdf-generator-linux-x64 invoice input.xml output.pdf
```

## Usage

```bash
ksef-pdf-generator <type> <input.xml> <output.pdf> [additional-data.json]
```

- `<type>`: `invoice` or `faktura` for a KSeF invoice, `upo` for a UPO document.
- `<input.xml>`: path to the source XML file.
- `<output.pdf>`: where the generated PDF will be written.
- `[additional-data.json]`: optional JSON file with extra fields (e.g., custom QR code, KSeF number).

If the JSON is omitted, the tool attempts to derive the KSeF number and QR code from the filename and XML content (see source for details).

## Building from Source

Prerequisites: Node.js (≥18) and a recent version of `npm` or `pnpm`.

```bash
# Install dependencies
npm ci

# Build the distributable UMD module (used by the CLI)
npm run build

# Build the CLI executable (requires pkg)
npm run build:exe
```

The resulting binaries will appear in the `bin/` directory.

## Makefile

A small `Makefile` is provided for convenience:

- `make` or `make build` – run `npm run build`.
- `make exe` – build the static executables (`npm run build:exe`).
- `make clean` – remove `dist/` and `bin/` directories.
- `make test` – run the test suite (`npm test`).

## License

ISC – see the LICENSE file.

## Acknowledgments

- PDFMake for PDF generation.
- The KSeF specification (Ministerstwo Finansów).