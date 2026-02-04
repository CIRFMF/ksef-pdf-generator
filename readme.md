# Biblioteka do generowania wizualizacji PDF faktur i UPO

Biblioteka do generowania wizualizacji PDF faktur oraz UPO na podstawie plików XML. Dostępna jako narzędzie CLI oraz biblioteka do użycia w przeglądarce.

---

## 1. Główne funkcjonalności

- Generowanie wizualizacji PDF faktur (FA1, FA2, FA3)
- Generowanie wizualizacji PDF UPO
- Narzędzie CLI do generowania PDF z linii poleceń
- Biblioteka JavaScript do użycia w przeglądarce

---

## 2. Narzędzie CLI

### 2.1 Instalacja

```bash
git clone https://github.com/CIRFMF/ksef-pdf-generator#
cd ksef-pdf-generator
npm install
```

### 2.2 Użycie CLI

Generowanie PDF z pliku XML:

```bash
./bin/ksef-pdf-generator <ścieżka-do-pliku.xml> [opcje]
```

**Opcje:**
- `-o, --output <ścieżka>` - Ścieżka do pliku wyjściowego PDF (opcjonalne)
- `-k, --ksef <numer>` - Numer KSeF (opcjonalne, tylko dla faktur)
- `-q, --qrcode <url>` - URL QR Code (opcjonalne, tylko dla faktur)
- `-h, --help` - Wyświetl pomoc

**Przykłady:**

```bash
# Generowanie faktury (PDF zostanie zapisany jako invoice.pdf)
./bin/ksef-pdf-generator assets/invoice.xml

# Generowanie faktury z własną nazwą pliku wyjściowego
./bin/ksef-pdf-generator assets/invoice.xml -o moja-faktura.pdf

# Generowanie UPO
./bin/ksef-pdf-generator assets/upo.xml

# Generowanie faktury z numerem KSeF i QR Code
./bin/ksef-pdf-generator assets/invoice.xml \
  -k "5555555555-20250808-9231003CA67B-BE" \
  -q "https://ksef-test.mf.gov.pl/invoice/5265877635/26-10-2025/HS5E1zrA8WVjDNq_xMVIN5SD6nyRymmQ-BcYHReUAa0"
```

CLI zwraca ścieżkę do wygenerowanego pliku PDF na standardowe wyjście:
```bash
$ ./bin/ksef-pdf-generator assets/invoice.xml
/home/user/ksef-pdf-generator/assets/invoice.pdf
```

---

## 3. Aplikacja webowa pokazowa

### 3.1 Jak uruchomić

1. Uruchom aplikację developerską:
   ```bash
   npm run dev
   ```

2. Aplikacja uruchomi się domyślnie pod adresem: [http://localhost:5173/](http://localhost:5173/)

### 3.2 Budowanie biblioteki

Jak zbudować bibliotekę produkcyjnie:

```bash
npm run build
```

### 3.3 Jak wygenerować fakturę

1. Po uruchomieniu aplikacji przejdź do **Wygeneruj wizualizacje faktury PDF**.
2. Wybierz plik XML zgodny ze schemą **FA(1), FA(2) lub FA(3)**.
3. Przykładowy plik znajduje się w folderze:
   ```
   assets/invoice.xml
   ```  
4. Po wybraniu pliku, PDF zostanie wygenerowany.

---

### 3.4 Jak wygenerować UPO

1. Po uruchomieniu aplikacji przejdź do **Wygeneruj wizualizacje UPO PDF**.
2. Wybierz plik XML zgodny ze schemą **UPO v4_2**.
3. Przykładowy plik znajduje się w folderze:
   ```
   assets/upo.xml
   ```  
4. Po wybraniu pliku, PDF zostanie wygenerowany.

---

## 4. Testy jednostkowe

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
