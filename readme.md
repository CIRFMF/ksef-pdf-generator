# Biblioteka do generowania wizualizacji PDF faktur i UPO

Biblioteka do generowania wizualizacji PDF faktur oraz UPO na podstawie plików XML po stronie klienta oraz z linii poleceń.

---

## 1. Główne ustalenia

    Biblioteka zawiera następujące funkcjonalności:
    - Generowanie wizualizacji PDF faktur
    - Generowanie wizualizacji PDF UPO

---

## 2. Jak uruchomić aplikację pokazową

1. Zainstaluj Node.js w wersji **22.14.0**  
   Możesz pobrać Node.js z oficjalnej strony: [https://nodejs.org](https://nodejs.org)

2. Sklonuj repozytorium i przejdź do folderu projektu:
   ```bash
   git clone https://github.com/CIRFMF/ksef-pdf-generator#
   cd ksef-pdf-generator
   ```

3. Zainstaluj zależności:
   ```bash
   npm install
   ```

4. Uruchom aplikację:
   ```bash
   npm run dev
   ```

Aplikacja uruchomi się domyślnie pod adresem: [http://localhost:5173/](http://localhost:5173/)

## 2.1 Budowanie bibliotki

1. Jak zbudować bibliotekę produkcyjnie:
   ```bash
   npm run build
   ```

## 3. Jak wygenerować fakturę

1. Po uruchomieniu aplikacji przejdź do **Wygeneruj wizualizacje faktury PDF**.
2. Wybierz plik XML zgodny ze schemą **FA(1), FA(2) lub FA(3)**.
3. Przykładowy plik znajduje się w folderze:
   ```
   examples/invoice.xml
   ```  
4. Po wybraniu pliku, PDF zostanie wygenerowany.

---

## 4. Jak wygenerować UPO

1. Po uruchomieniu aplikacji przejdź do **Wygeneruj wizualizacje UPO PDF**.
2. Wybierz plik XML zgodny ze schemą **UPO v4_2**.
3. Przykładowy plik znajduje się w folderze:
   ```
   examples/upo.xml
   ```  
4. Po wybraniu pliku, PDF zostanie wygenerowany.

---

## 5. Testy jednostkowe

Aplikacja zawiera zestaw testów napisanych w **TypeScript**, które weryfikują poprawność działania aplikacji.  
Projekt wykorzystuje **Vite** do bundlowania i **Vitest** jako framework testowy.

### Uruchamianie testów

1. Uruchom wszystkie testy:
   ```bash
   npm run test
   ```

2. Uruchom testy z interfejsem graficznym:
   ```bash
   npm run test:ui
   ```

3. Uruchom testy w trybie CI z raportem pokrycia:
   ```bash
   npm run test:ci
   ```

---

Raport: /coverage/index.html

---

### 🆕 Tryb CLI

Biblioteka obsługuje teraz również **tryb linii poleceń (CLI)**, który umożliwia generowanie PDF bez uruchamiania aplikacji webowej.  
Szczegóły znajdziesz w [CLI-README.md](./src/cli/CLI-README.md).

**Szybki start CLI:**
```bash
# Budowanie CLI
npm run build:cli

# Generowanie faktury PDF
node dist/cli/index.js invoice examples/invoice.xml output/faktura.pdf

# Generowanie UPO PDF
node dist/cli/index.js upo examples/upo.xml output/upo.pdf
```

---

### 1. Nazewnictwo zmiennych i metod

- **Polsko-angielskie nazwy** stosowane w zmiennych, typach i metodach wynikają bezpośrednio ze struktury pliku schemy
  faktury.  
  Takie podejście zapewnia spójność i ujednolicenie nazewnictwa z definicją danych zawartą w schemie XML.

### 2. Struktura danych

- Struktura danych interfejsu FA odzwierciedla strukturę danych źródłowych pliku XML, zachowując ich logiczne powiązania
  i hierarchię
  w bardziej czytelnej formie.

### 3. Typy i interfejsy

- Typy odzwierciedlają strukturę danych pobieranych z XML faktur oraz ułatwiają generowanie PDF
- Typy i interfejsy są definiowane w folderze types oraz plikach z rozszerzeniem types.ts.

---

## Dokumentacja używanych narzędzi

- Vitest Docs — https://vitest.dev/guide/
- Vite Docs — https://vitejs.dev/guide/
- TypeScript Handbook — https://www.typescriptlang.org/docs/

---

## Uwagi

- Upewnij się, że pliki XML są poprawnie sformatowane zgodnie z odpowiednią schemą.
- W przypadku problemów z Node.js, rozważ użycie menedżera wersji Node, np. [nvm](https://github.com/nvm-sh/nvm).
