# CLAUDE.md — ksef-pdf-generator

## Why This Project Exists

The goal is to generate invoice PDFs without building and maintaining a custom template system that breaks every time the layout needs to change. Instead, this project leverages the Polish government's KSeF (Krajowy System e-Faktur) open-source PDF generators — they handle all the rendering logic from structured XML. The XML schema is the template.

The missing piece is a thin HTTP service that wraps this library so other systems can send invoice XML and get back a PDF. That's the end-game: **XML in, PDF out, via a simple API**.

## Project Overview

TypeScript library for generating PDF visualizations of KSeF invoices and UPO confirmations from XML files. Built with Vite, pdfmake, and xml-js.

**Architecture:** Layered — Public API (`src/index.ts`) -> business logic (`src/lib-public/`) -> shared utilities (`src/shared/`) -> external libs (pdfmake, xml-js).

**Domain:** Polish e-invoicing schemas FA(1), FA(2), FA(3), UPO v4.2/v4.3. Generator directories: `FA1/`, `FA2/`, `FA3/`, `UPO4_2/`, `UPO4_3/`.

## Commands

```bash
npm run dev        # Dev server (port 5173)
npm run build      # Production build (ES + UMD)
npm run type       # TypeScript type checking
npm run test       # Watch mode tests (vitest)
npm run test:ui    # Interactive test UI
npm run test:ci    # CI tests with coverage
```

## Code Conventions

**TypeScript:**
- Strict mode enabled
- Explicit return types on all functions (`@typescript-eslint/explicit-function-return-type: error`)
- Explicit member accessibility on classes (`@typescript-eslint/explicit-member-accessibility: warn`)
- `@typescript-eslint/no-explicit-any` is off — use sparingly and only when schema types are genuinely dynamic

**Prettier** (`.prettierrc.json`):
- 110 char print width, single quotes, trailing commas (`es5`), 2-space indent, semicolons

**ESLint** (`eslint.config.mts`):
- Curly braces always required (`curly: error`)
- Blank line after variable declarations (`@stylistic/padding-line-between-statements`)
- Member ordering enforced (`@typescript-eslint/member-ordering`)

**Naming:**
- Polish-English naming matching XML schema structure (e.g., `Naglowek`, `Wiersze`, `Stopka`, `Rozliczenie`, `Platnosc`, `Adres`)
- Types/interfaces in `types/` folders and `*.types.ts` files
- Co-located test files: `Component.ts` -> `Component.spec.ts`

## Architecture & SOLID Principles

- **Single Responsibility:** Each generator file handles one PDF section (e.g., `Adres.ts` = address, `Platnosc.ts` = payment, `Wiersze.ts` = line items)
- **Open/Closed:** New schema versions (FA4, UPO v5) should add new generator directories under `src/lib-public/generators/`, not modify existing ones
- **Liskov Substitution:** Generator functions share consistent signatures (`(invoice, additionalData?) => Content[]`)
- **Interface Segregation:** Type definitions are schema-specific (`fa1.types.ts`, `fa2.types.ts`, `fa3.types.ts`)
- **Dependency Inversion:** Generators depend on abstractions (`Content[]`, `FormatTyp`) not pdfmake internals

## DRY Practices

- Reuse shared utilities from `src/shared/PDF-functions.ts` (`formatText`, `createLabelText`, `createSection`, `createHeader`, `generateTable`, `getContentTable`)
- Reuse common generators from `src/lib-public/generators/common/` (Naglowek, Wiersze, Stopka, Rozliczenie, DaneFaKorygowanej, Zalaczniki)
- Reuse lookup functions from `src/shared/generators/common/functions.ts`
- Constants centralized in `src/shared/consts/const.ts`
- Use `FormatTyp` enum from `src/shared/enums/common.enum.ts` for all text formatting — do not inline formatting logic

## TDD Approach

- Write tests BEFORE implementation (Red-Green-Refactor)
- Co-locate test files: `Component.ts` -> `Component.spec.ts`
- Test structure: `describe('functionName')` with `it('expected behavior')`
- Test edge cases: undefined inputs, empty `_text`, invalid XML values
- Use Vitest globals (`describe`, `it`, `expect`) — no imports needed
- Mock external dependencies via `vi.spyOn` / `vi.fn`
- Run `npm run test:ci` to verify coverage before committing

## Technical Documentation

- All new public functions must have explicit TypeScript return types (ESLint enforced)
- Type definitions serve as documentation — keep them accurate and up-to-date
- Generator function names must match the XML schema section they handle
- Document non-obvious business logic with inline comments (tax rules, schema-specific behavior)

## Key Files Reference

| File | Purpose |
|------|---------|
| `src/index.ts` | Library entry point |
| `src/lib-public/generate-invoice.ts` | Invoice routing logic |
| `src/shared/PDF-functions.ts` | Shared PDF utility functions |
| `src/shared/generators/common/functions.ts` | Common lookup/helper functions |
| `src/shared/consts/const.ts` | Centralized constants |
| `src/shared/enums/common.enum.ts` | Shared enums (FormatTyp, etc.) |
| `src/lib-public/generators/common/` | Common generators reused across schema versions |
