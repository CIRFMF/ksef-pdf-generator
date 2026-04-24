# Biblioteka do generowania wizualizacji PDF faktur i UPO

Biblioteka do generowania wizualizacji PDF faktur oraz UPO na podstawie plików XML po stronie klienta.

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

## 2.2 Uruchomienie serwera HTTP (REST)

Serwer REST korzysta bezposrednio z metod `generateInvoice` oraz `generateUPO`.

1. Zbuduj serwer:
   ```bash
   npm run build:server
   ```

2. Uruchom serwer:
   ```bash
   npm run server:start
   ```

3. Tryb developerski (watch):
   ```bash
   npm run server:dev
   ```

Serwer uruchomi sie domyslnie pod adresem: [http://localhost:3000](http://localhost:3000)

## 2.3 Uruchomienie serwera HTTP (REST) w wplaikacji Docker

1. Zbuduj serwer:
   ```bash
    docker build -t ksef-pdf .
   ```

2. Uruchom serwer:
   ```bash
    docker run --detach --name ksef-pdf --hostname ksef-pdf --publish 3000:3000 --restart unless-stopped ksef-pdf
   ```

Serwer uruchomi sie domyslnie pod adresem: [http://localhost:3000](http://localhost:3000)

### Endpointy

1. Health check:
   ```bash
   curl http://localhost:3000/health
   ```

2. Generowanie PDF faktury z XML:
   ```bash
   curl -X POST http://localhost:3000/invoice \
     -H "Content-Type: text/xml" \
     -H "x-ksef-number: 1111111111-20251107-080080679C57-14" \
     -H "x-ksef-qrcode: https://ksef-test.mf.gov.pl/invoice/..." \
     --data-binary @assets/invoice.xml \
     -o invoice.pdf
   ```

3. Generowanie PDF UPO z XML:
   ```bash
   curl -X POST http://localhost:3000/upo \
     -H "Content-Type: text/xml" \
     --data-binary @assets/upo.xml \
     -o upo.pdf
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

### 6.Lokalizacja - i18next

Biblioteka wspiera lokalizację, poprzez użycie biblioteki i18next. Pliki z tłumaczeniami należy umieścic w folderze
** src/lib-public/i18n/lang **. Dokumentacja samej biblioteki i18next znajduje się pod adresem https://www.i18next.com/.

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
