# Biblioteka do generowania wizualizacji PDF faktur i UPO

Biblioteka do generowania wizualizacji PDF faktur oraz UPO na podstawie plików XML po stronie klienta.

---

## 1. Główne ustalenia

    Biblioteka zawiera następujące funkcjonalności:
    - Generowanie wizualizacji PDF faktur
    - Generowanie wizualizacji PDF UPO
    - REST API do zdalnego generowania faktur i UPO
    - Wsparcie dla konteneryzacji Docker

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

## 2.1 Uruchomienie REST API

Biblioteka zawiera serwer REST API do generowania faktur i UPO przez HTTP.

### Uruchomienie lokalne:

1. Uruchom serwer:
   ```bash
   npm run start:server
   ```

Serwer uruchomi się domyślnie pod adresem: [http://localhost:3000](http://localhost:3000)

Dokumentacja API (Swagger) dostępna pod: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

### Dostępne endpointy:

#### POST /api/generate-invoice
Generuje PDF faktury z pliku XML i metadanych.

**Request:**
- `Content-Type: multipart/form-data`
- `file`: Plik XML faktury (FA(1), FA(2) lub FA(3))
- `metadata`: JSON string z dodatkowymi danymi (AdditionalDataTypes)

**Response:**
- `200 OK`: PDF faktury (application/pdf)
- `400 Bad Request`: Brak pliku lub metadanych
- `500 Internal Server Error`: Błąd podczas generowania

#### POST /api/generate-upo
Generuje PDF UPO z pliku XML.

**Request:**
- `Content-Type: multipart/form-data`
- `file`: Plik XML UPO (schemat UPO v4_2)

**Response:**
- `200 OK`: PDF UPO (application/pdf)
- `400 Bad Request`: Brak pliku
- `500 Internal Server Error`: Błąd podczas generowania

### Uruchomienie z Docker:

1. Zbuduj obraz Docker:
   ```bash
   docker build -t ksef-pdf-generator .
   ```

2. Uruchom kontener:
   ```bash
   docker run -p 3000:3000 ksef-pdf-generator
   ```

Serwer będzie dostępny pod adresem: [http://localhost:3000](http://localhost:3000)

## 2.2 Budowanie bibliotki

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
