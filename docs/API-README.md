# API — uruchamianie, budowanie i testy

Poniższy plik opisuje krok po kroku jak uruchamiać aplikację lokalnie w trybie deweloperskim oraz jak przygotować i uruchomić build produkcyjny z działającym serwerem API.

UWAGI: polecenia podane są dla PowerShell na Windows. Repozytorium znajduje się w `D:\repo\ksef-pdf-generator_new`.

## Wymagania
- Node.js >= 18
- npm

## 1. Pierwsza instalacja (raz)

1. Otwórz PowerShell i przejdź do katalogu repo:
   ```powershell
   cd D:\repo\ksef-pdf-generator_new
   npm install
   ```

## 2. Tryb development (szybkie testy)

- Frontend (jeśli potrzebujesz interfejsu):
  ```powershell
  npm run dev
  ```

- API (uruchamia TypeScript źródło bez budowania):
  ```powershell
  npm run dev:api
  ```

  - Serwer API nasłuchuje domyślnie na `http://localhost:3001`.

## 3. Testowanie endpointu (szybko)

- Przy użyciu natywnego `curl.exe` (zalecane w PowerShell):
  ```powershell
  curl.exe -X POST "http://localhost:3001/generate-invoice" `
    -F "file=@assets\invoice.xml" `
    -F "additionalData={\"nrKSeF\":\"TEST123\",\"companyLogoBase64\":\"data:image/png;base64,BASE64_LOGO_DATA\"}" `
    -o out.pdf
  ```

  > Wartość `companyLogoBase64` może być pełnym Data URL (zalecane) lub samym ciągiem base64 – w tym drugim przypadku zostanie automatycznie poprzedzona nagłówkiem `data:image/png;base64,`.

- PowerShell (bez curl.exe) — skrypt .NET HttpClient (przykład wcześniej w repo): możesz uruchomić `node scripts/test-generate-invoice.mjs`.

- Postman:
  - Method: POST
  - URL: `http://localhost:3001/generate-invoice`
  - Body → `form-data`:
    - `file` (File) → wybierz `assets/invoice.xml`
    - `additionalData` (Text) → `{"nrKSeF":"TEST123","companyLogoBase64":"data:image/png;base64,BASE64_LOGO_DATA"}` (wymagane pole `nrKSeF`, pozostałe opcjonalne)
      - Obsługiwane pola: `nrKSeF` (wymagane), `qrCode`, `qrCode2`, `isMobile`, `companyLogoBase64` (logo na nagłówku PDF)
  - Send and Download → zapisze PDF bezpośrednio.

## 4. Budowanie produkcyjne

Pełny build uruchamia budowanie frontendu (vite) oraz bundluje serwer (esbuild):

```powershell
npm run build
```

- Po wykonaniu w `dist/api` pojawi się `server.cjs` (CommonJS) i możesz uruchomić serwer zbudowany:
  ```powershell
  npm run start:api
  # lub
  node dist/api/server.cjs
  ```

## 5. Szybkie przebudowanie tylko serwera

Jeżeli zmienisz pliki w `src/api` lub w logice serwera, nie musisz budować całego projektu — wystarczy:

```powershell
npm run build:server
npm run start:api
```

`build:server` uruchamia `esbuild` i produkuje `dist/api/server.cjs`.

## 6. Skrypty npm (przydatne)

- `npm run dev` — dev frontend (vite)
- `npm run dev:api` — uruchamia API z `ts-node` (szybkie do deva)
- `npm run build` — build frontend + `build:server`
- `npm run build:server` — build tylko serwera (esbuild -> `dist/api/server.cjs`)
- `npm run start:api` — uruchamia zbudowany serwer (`node dist/api/server.cjs`)
- `npm run test:api` — testuje API (skrypt `scripts/test-generate-invoice.mjs`) — wysyła `assets/invoice.xml` i zapisuje `out.pdf`
- `npm run install:service` — instaluje aplikację jako Windows Service
- `npm run uninstall:service` — odinstalowuje Windows Service

## 7. Logowanie (Logging)

Aplikacja zawiera wbudowany system logowania, który automatycznie rejestruje:
- Każde żądanie HTTP (metoda, URL, IP, User-Agent, czas odpowiedzi)
- Szczegóły przetwarzania PDF (czas, rozmiar pliku, nrKSeF)
- Wszystkie błędy z pełnym stack trace

### Przeglądanie logów

**Development:**
```powershell
# Logów są w ./logs/api-YYYY-MM-DD.log
Get-Content "logs/api-2025-11-27.log" -Tail 50
```

**Production (Windows Service):**
```powershell
# Logów są w C:\logs\ksef-api\api-YYYY-MM-DD.log
Get-Content "C:\logs\ksef-api\api-2025-11-27.log" -Wait
```

**REST API endpoint (nowy):**
```powershell
# Ostatnie 50 logów
Invoke-WebRequest "http://localhost:3001/logs" | Select-Object -ExpandProperty Content | ConvertFrom-Json

# Ostatnie 100 logów
Invoke-WebRequest "http://localhost:3001/logs?lines=100" | Select-Object -ExpandProperty Content | ConvertFrom-Json
```

Szczegóły w: `docs/API-LOGGING.md`

## 8. Najczęstsze problemy i wskazówki

- `Cannot find module dist/lib-public/generate-invoice.js` — znaczy, że build frontendu nie wygenerował plików JS w `dist/lib-public`. Zadziała `npm run dev:api` (uruchamia serwer z kodu źródłowego) lub uruchom pełny `npm run build` by wygenerować wymagane artefakty.
- `FileReader is not defined` — oznaczało, że parsowanie XML używało browser API. W kodzie zrobiliśmy poprawkę w `src/shared/XML-parser.ts`, tak żeby serwer przyjmował `Buffer` i parsował XML w Node.
- Problemy ESM/CJS: widoczne przy uruchamianiu `node dist/api/server.js`. Obecna konfiguracja generuje serwer jako CommonJS `dist/api/server.cjs` i `start:api` uruchamia ten plik, żeby uniknąć problemów z typem modułu.
- Port 3001 zajęty — sprawdź i zabij proces:
  ```powershell
  netstat -ano | Select-String ":3001"
  Stop-Process -Id <PID> -Force
  ```

## 9. Dokumentacja API - Swagger

Aplikacja zawiera interaktywną dokumentację API z Swagger UI.

### Dostęp do dokumentacji

```powershell
# Development
npm run dev:api
# Otwórz: http://localhost:3001/docs

# Production
npm run start:api
# Otwórz: http://localhost:3001/docs
```

**Funkcjonalności:**
- ✅ Przeglądanie wszystkich endpoint'ów
- ✅ Testowanie endpoint'ów bezpośrednio
- ✅ Wdrażanie kodu klienta
- ✅ Pobieranie specyfikacji OpenAPI

Szczegóły w: `docs/API-SWAGGER.md`

## 10. Dodane pliki pomocnicze

- `scripts/test-generate-invoice.mjs` — prosty klient, który wysyła `assets/invoice.xml` i zapisuje `out.pdf`.
- `tsconfig.server.json` — uproszczony tsconfig dla `ts-node` w trybie development.
- `scripts/install-service.cjs` — instalacja Windows Service
- `scripts/uninstall-service.cjs` — odinstalowanie Windows Service
- `scripts/cleanup-logs.cjs` — czyszczenie starych logów
- `src/api/logger.ts` — moduł logowania
- `src/api/middleware.ts` — middleware do logowania żądań i obsługi błędów
- `src/api/swagger.ts` — konfiguracja Swagger/OpenAPI
- `docs/API-LOGGING.md` — dokumentacja systemu logowania
- `docs/API-SWAGGER.md` — dokumentacja Swagger UI
- `docs/SETUP-WINDOWS-SERVICE.md` — instrukcja instalacji jako Windows Service
- `docs/CLEANUP-LOGS.md` — instrukcja czyszczenia logów

## 11. Automatyzacja (opcjonalnie)

- Możemy dodać `postbuild` script uruchamiający `npm run build:server` po `vite build`.
- Mogę przygotować kolekcję Postman (.json) do importu.

---
Plik zaktualizowany. Dokumentacja API zawiera teraz system logowania, Swagger UI i Windows Service support.
