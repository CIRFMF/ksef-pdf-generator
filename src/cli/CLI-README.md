# Struktura CLI - Architektura Modułowa

## Budowanie i testowanie

### Kompilacja
```bash
npm run build:cli
```

### Testowanie CLI
```bash
node dist/cli/index.js --help
node dist/cli/index.js invoice examples/invoice.xml output/test.pdf
node dist/cli/index.js upo examples/upo.xml output/test-upo.pdf
```

### Budowanie SEA
```bash
npm run build:sea
node dist/sea-bundle.cjs --help
```

### Budowanie SEA dla Windows
```bash
npm run build:sea:windows
.\ksef-pdf.exe --help
```

## Szczegółowe przykłady użycia CLI

### Podstawowe użycie

#### 1. Wyświetlenie pomocy
```bash
# Z Node.js
node dist/cli/index.js --help

# Z pliku exe
.\ksef-pdf.exe --help
```

Wyświetli wszystkie dostępne komendy i opcje.

#### 2. Generowanie PDF faktury z pliku XML

**Podstawowa składnia:**
```bash
node dist/cli/index.js invoice <ścieżka-do-xml> <ścieżka-wyjściowa-pdf>
```

**Przykłady:**

```bash
# Generowanie faktury z przykładowego pliku
node dist/cli/index.js invoice examples/invoice.xml output/moja-faktura.pdf

# Generowanie z bezwzględną ścieżką
node dist/cli/index.js invoice C:\Users\lukaszw\Documents\faktura.xml C:\Output\faktura.pdf

# Generowanie z plikiem w tym samym katalogu
node dist/cli/index.js invoice invoice.xml output.pdf
```

#### 3. Generowanie PDF UPO (Urzędowego Poświadczenia Odbioru)

**Podstawowa składnia:**
```bash
node dist/cli/index.js upo <ścieżka-do-xml> <ścieżka-wyjściowa-pdf>
```

**Przykłady:**

```bash
# Generowanie UPO z przykładowego pliku
node dist/cli/index.js upo examples/upo.xml output/moje-upo.pdf

# Generowanie z bezwzględną ścieżką
node dist/cli/index.js upo C:\Users\lukaszw\Documents\upo.xml C:\Output\upo.pdf

# Generowanie z plikiem w tym samym katalogu
node dist/cli/index.js upo upo.xml upo-output.pdf
```

#### 4. Przetwarzanie wielu plików

**PowerShell - przetwarzanie wszystkich plików XML w folderze:**

```powershell
# Generowanie faktur dla wszystkich plików XML
Get-ChildItem -Path .\invoices\*.xml | ForEach-Object {
    $outputFile = "output\$($_.BaseName).pdf"
    node dist/cli/index.js invoice $_.FullName $outputFile
    Write-Host "✅ Wygenerowano: $outputFile"
}

# Generowanie UPO dla wszystkich plików XML
Get-ChildItem -Path .\upo-files\*.xml | ForEach-Object {
    $outputFile = "output\upo-$($_.BaseName).pdf"
    node dist/cli/index.js upo $_.FullName $outputFile
    Write-Host "✅ Wygenerowano: $outputFile"
}
```

**Bash (Linux/Mac) - przetwarzanie wielu plików:**

```bash
# Generowanie faktur
for file in invoices/*.xml; do
    filename=$(basename "$file" .xml)
    node dist/cli/index.js invoice "$file" "output/${filename}.pdf"
    echo "✅ Wygenerowano: output/${filename}.pdf"
done

# Generowanie UPO
for file in upo-files/*.xml; do
    filename=$(basename "$file" .xml)
    node dist/cli/index.js upo "$file" "output/upo-${filename}.pdf"
    echo "✅ Wygenerowano: output/upo-${filename}.pdf"
done
```

### Użycie z plikiem exe (bez Node.js)

Po zbudowaniu pliku `ksef-pdf.exe`, można go używać bez instalacji Node.js:

```bash
# Wyświetlenie pomocy
.\ksef-pdf.exe --help

# Generowanie faktury
.\ksef-pdf.exe invoice examples\invoice.xml output\faktura.pdf

# Generowanie UPO
.\ksef-pdf.exe upo examples\upo.xml output\upo.pdf

# Użycie z pełnymi ścieżkami
.\ksef-pdf.exe invoice C:\Faktury\faktura-2024-001.xml C:\PDF\faktura-2024-001.pdf
```

### Obsługa błędów

CLI wyświetla komunikaty o błędach w przypadku problemów:

```bash
# Brak pliku wejściowego
❌ Plik nie istnieje: nieistniejacy.xml

# Błędny format XML
❌ Błąd parsowania XML: Invalid XML syntax

# Brak uprawnień do zapisu
❌ Błąd zapisu pliku: Access denied
```

## Kompletny przewodnik budowania pliku EXE

### Wymagania wstępne

1. **Node.js w wersji 22.14.0 lub nowszej**
   - Pobierz z: https://nodejs.org
   - Sprawdź wersję: `node --version`

2. **PowerShell** (dostępny standardowo w Windows)

3. **Zainstalowane zależności projektu**
   ```bash
   npm install
   ```

### Krok po kroku - budowanie ksef-pdf.exe

#### Krok 1: Przygotowanie projektu

```bash
# Upewnij się, że jesteś w katalogu głównym projektu
cd ksef-pdf-generator

# Zainstaluj wszystkie zależności (jeśli jeszcze nie zainstalowane)
npm install
```

#### Krok 2: Budowanie CLI

```bash
# Skompiluj kod TypeScript do JavaScript
npm run build:cli
```

To polecenie:
- Kompiluje kod TypeScript z `src/cli/` do `dist/cli/`
- Kopiuje niezbędne pliki JavaScript
- Tworzy strukturę katalogów

#### Krok 3: Budowanie Single Executable Application (SEA)

```bash
# Uruchom skrypt budowania Windows EXE
npm run build:sea:windows
```

Ten krok wykonuje następujące operacje (automatycznie przez `build-sea-windows.ps1`):

1. **Tworzenie bundle** - pakuje cały kod w jeden plik
2. **Generowanie SEA blob** - przygotowuje specjalny format dla Node.js
3. **Kopiowanie node.exe** - tworzy bazę dla aplikacji
4. **Wstrzykiwanie kodu** - dodaje aplikację do pliku exe
5. **Weryfikacja** - testuje czy aplikacja działa

**Oczekiwane wyjście:**

```
🔨 Budowanie Single Executable Application dla Windows...

📦 Etap 1: Budowanie bundle...
✅ Bundle utworzony: dist/sea-bundle.cjs

🔧 Etap 2: Generowanie SEA preparation blob...
✅ Blob wygenerowany: sea-prep.blob

📋 Etap 3: Kopiowanie node.exe...
✅ Skopiowano: C:\Program Files\nodejs\node.exe -> ksef-pdf.exe

🔓 Etap 4: Usuwanie sygnatury...
ℹ️  Opcjonalne - pomijam (postject zadziała z ostrzeżeniem)

💉 Etap 5: Wstrzykiwanie blob do executable...
✅ Blob wstrzyknięty pomyślnie

✅ Etap 6: Weryfikacja...
✅ ksef-pdf.exe utworzony pomyślnie!
📊 Rozmiar: ~100 MB

🧪 Test działania:
Usage: ksef-pdf [options] [command]
...

======================================================================
✅ SUKCES! Single Executable Application utworzona!
======================================================================

📦 Plik: ksef-pdf.exe
📊 Rozmiar: 100.45 MB

Użycie:
  .\ksef-pdf.exe --help
  .\ksef-pdf.exe invoice <plik.xml> <output.pdf>
  .\ksef-pdf.exe upo <plik.xml> <output.pdf>
```

#### Krok 4: Weryfikacja działania

```bash
# Test wyświetlania pomocy
.\ksef-pdf.exe --help

# Test generowania faktury
.\ksef-pdf.exe invoice examples\invoice.xml output\test.pdf

# Test generowania UPO
.\ksef-pdf.exe upo examples\upo.xml output\test-upo.pdf
```

### Co zawiera plik ksef-pdf.exe?

Plik `ksef-pdf.exe` to **Single Executable Application** (SEA), który zawiera:

- ✅ Środowisko Node.js
- ✅ Cały kod aplikacji CLI
- ✅ Wszystkie zależności npm (pdfmake, happy-dom, itp.)
- ✅ Moduł generatora PDF
- ✅ Nie wymaga instalacji Node.js na docelowym komputerze

**Rozmiar pliku:** około 100 MB  
**Wymogi systemowe:** Windows 10/11 (64-bit)

### Dystrybucja pliku exe

Po zbudowaniu, plik `ksef-pdf.exe` można:

1. **Kopiować na inne komputery** - działa standalone, bez instalacji
2. **Dodać do PATH** - używać z dowolnego miejsca w systemie
3. **Uruchamiać bezpośrednio** - double-click lub z wiersza poleceń
4. **Dystrybuować użytkownikom** - nie potrzebują Node.js

**Przykład instalacji systemowej:**

```powershell
# Skopiuj do folderu w PATH (wymaga uprawnień administratora)
Copy-Item ksef-pdf.exe "C:\Program Files\KSEF-PDF\"

# Dodaj do PATH
$env:Path += ";C:\Program Files\KSEF-PDF\"

# Teraz można użyć z dowolnego miejsca:
ksef-pdf invoice C:\Dokumenty\faktura.xml C:\PDF\faktura.pdf
```

### Rozwiązywanie problemów podczas budowania

#### Problem: "node: command not found"
```bash
# Rozwiązanie: Zainstaluj Node.js lub dodaj do PATH
$env:Path += ";C:\Program Files\nodejs\"
```

#### Problem: "npm run build:sea:windows fails"
```bash
# Rozwiązanie 1: Sprawdź politykę wykonywania PowerShell
Get-ExecutionPolicy
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Rozwiązanie 2: Uruchom ręcznie
pwsh -ExecutionPolicy Bypass -File build-sea-windows.ps1
```

#### Problem: "postject: command not found"
```bash
# Rozwiązanie: Zainstaluj postject globalnie
npm install -g postject
```

#### Problem: Plik exe nie działa na innym komputerze
```bash
# Upewnij się, że:
# 1. System to Windows 10/11 64-bit
# 2. Nie ma blokady antywirusowej
# 3. Użytkownik ma uprawnienia do uruchomienia exe

# Test uprawnień:
icacls ksef-pdf.exe
```

### Skrypty npm dostępne w projekcie

```bash
# Uruchomienie aplikacji webowej
npm run start

# Budowanie CLI (tylko kompilacja TypeScript)
npm run build:cli

# Budowanie bundle dla SEA (bez tworzenia exe)
npm run build:sea

# Pełne budowanie exe dla Windows
npm run build:sea:windows

# Szybkie uruchomienie CLI po zbudowaniu
npm run cli

# Skróty do uruchomienia CLI
npm run cli:invoice  # dla faktur
npm run cli:upo      # dla UPO
```

## Struktura katalogów

```
src/cli/
├── index.ts                    # Punkt wejścia CLI
├── interfaces/                 # Interfejsy (Dependency Inversion)
│   ├── ICliCommand.ts
│   ├── IEnvironmentInitializer.ts
│   ├── IFileService.ts
│   ├── ILogger.ts
│   ├── IPdfGenerator.ts
│   └── index.ts
├── services/                   # Serwisy (Single Responsibility)
│   ├── ConsoleLogger.ts
│   ├── FileService.ts
│   ├── PdfGeneratorModuleLoader.ts
│   └── index.ts
├── environment/                # Konfiguracja środowiska
│   ├── BrowserEnvironmentInitializer.ts
│   └── index.ts
├── generators/                 # Generatory PDF (Strategy Pattern)
│   ├── InvoicePdfGenerator.ts
│   ├── UpoPdfGenerator.ts
│   └── index.ts
├── commands/                   # Komendy CLI (Command Pattern)
│   ├── GenerateInvoiceCommand.ts
│   ├── GeneratePdfCommand.ts
│   └── index.ts
└── application/                # Aplikacja główna (Facade Pattern)
    ├── CliApplication.ts
    └── index.ts
```

## Moduły

### Interfaces (src/cli/interfaces/)

Definicje interfejsów zgodnie z zasadą Dependency Inversion Principle (DIP):

- **ICliCommand** - interfejs dla komend CLI
- **IEnvironmentInitializer** - interfejs dla inicjalizacji środowiska
- **IFileService** - interfejs dla operacji na plikach
- **ILogger** - interfejs dla logowania
- **IPdfGenerator** - interfejs dla generatorów PDF

### Services (src/cli/services/)

Serwisy implementujące Single Responsibility Principle (SRP):

- **ConsoleLogger** - logowanie do konsoli
- **FileService** - operacje na plikach (odczyt XML, zapis PDF)
- **PdfGeneratorModuleLoader** - ładowanie modułu generatora PDF

### Environment (src/cli/environment/)

- **BrowserEnvironmentInitializer** - konfiguracja środowiska (HappyDOM, pdfMake, Canvas)

### Generators (src/cli/generators/)

Generatory PDF implementujące Strategy Pattern:

- **InvoicePdfGenerator** - generator PDF dla faktur
- **UpoPdfGenerator** - generator PDF dla UPO

### Commands (src/cli/commands/)

Komendy CLI implementujące Command Pattern:

- **GenerateInvoiceCommand** - komenda generowania faktury
- **GeneratePdfCommand** - uniwersalna komenda generowania PDF

### Application (src/cli/application/)

- **CliApplication** - główna fasada aplikacji, zarządza inicjalizacją i konfiguracją komend

### Index (src/cli/index.ts)

Punkt wejścia aplikacji - inicjalizuje aplikację i parsuje argumenty CLI.

## Zasady SOLID w praktyce

### Single Responsibility Principle (SRP)
Każda klasa ma jedną, jasno określoną odpowiedzialność:
- `FileService` - tylko operacje na plikach
- `ConsoleLogger` - tylko logowanie
- `CliApplication` - tylko konfiguracja aplikacji

### Open/Closed Principle (OCP)
Kod otwarty na rozszerzenia, zamknięty na modyfikacje:
- Nowe generatory PDF można dodać bez modyfikacji istniejącego kodu
- Nowe komendy można dodać poprzez implementację `ICliCommand`

### Liskov Substitution Principle (LSP)
Implementacje interfejsów są zamienne:
- `InvoicePdfGenerator` i `UpoPdfGenerator` implementują `IPdfGenerator`
- Można użyć dowolnej implementacji bez zmian w kodzie klienckim

### Interface Segregation Principle (ISP)
Interfejsy są małe i skoncentrowane:
- `ILogger` ma tylko 3 metody
- `IPdfGenerator` ma tylko 1 metodę

### Dependency Inversion Principle (DIP)
Zależności są od abstrakcji (interfejsów), nie od konkretnych klas:
- `FileService` przyjmuje `ILogger` w konstruktorze
- `GeneratePdfCommand` pracuje z interfejsami, nie konkretnymi implementacjami

## Wzorce projektowe

### Command Pattern
Komendy (`GenerateInvoiceCommand`, `GeneratePdfCommand`) enkapsulują żądania jako obiekty.

### Strategy Pattern
Różne strategie generowania PDF (`InvoicePdfGenerator`, `UpoPdfGenerator`).

### Facade Pattern
`CliApplication` upraszcza interfejs do skomplikowanego systemu.

### Dependency Injection
Wszystkie zależności są wstrzykiwane przez konstruktory.

## Rozszerzanie funkcjonalności

### Dodanie nowego generatora

1. Utwórz nowy plik w `src/cli/generators/`, np. `NewPdfGenerator.ts`:
```typescript
import type { IPdfGenerator } from '../interfaces/IPdfGenerator.js';

export class NewPdfGenerator implements IPdfGenerator {
  async generate(file: File, additionalData?: any): Promise<Blob> {
    // Implementacja
  }
}
```

2. Dodaj eksport w `src/cli/generators/index.ts`

3. Użyj w `CliApplication`

### Dodanie nowej komendy

1. Utwórz nowy plik w `src/cli/commands/`, np. `NewCommand.ts`:
```typescript
import type { ICliCommand } from '../interfaces/ICliCommand.js';

export class NewCommand implements ICliCommand {
  async execute(): Promise<void> {
    // Implementacja
  }
}
```

2. Dodaj eksport w `src/cli/commands/index.ts`

3. Zarejestruj komendę w `CliApplication.setupCommands()`
