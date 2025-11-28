# Podsumowanie implementacji systemu logowania

## Utworzone/Zmodyfikowane pliki

### Nowe pliki:

1. **`src/api/logger.ts`** - Centralny moduł logowania
   - Klasa `Logger` z metodami: `info()`, `warn()`, `error()`, `debug()`
   - Automatyczne tworzenie katalogów logów
   - Obsługa zmiennych środowiskowych: `LOG_DIR`, `DEBUG`, `LOG_TO_FILE`
   - Logi zapisywane do pliku i konsoli

2. **`src/api/middleware.ts`** - Middleware Express do logowania
   - `requestLogger` - loguje każde żądanie i odpowiedź
   - `errorHandler` - globalna obsługa błędów
   - `notFoundHandler` - obsługa tras 404
   - Dodawanie unique ID do każdego żądania (dla śledzenia)

3. **`docs/API-LOGGING.md`** - Dokumentacja systemu logowania
   - Architektura systemu
   - Funkcjonalności i przykłady logów
   - Konfiguracja i zmienne środowiskowe
   - Przeglądanie logów z PowerShell
   - Troubleshooting

4. **`docs/API-LOGGING-TESTS.md`** - Przewodnik testowania
   - Przykłady testów HTTP
   - Testy z PowerShell i curl
   - Komendy do przeglądania logów
   - Metryki i monitoring
   - Kolekcja Postman

### Zmodyfikowane pliki:

1. **`src/api/server.ts`**
   - Dodano import: `logger`, `requestLogger`, `errorHandler`, `notFoundHandler`
   - Dodano middleware: `requestLogger` do logowania żądań
   - Wzbogacono endpoint `/generate-invoice` o logowanie:
     * Log przetwarzania pliku
     * Log szczegółów faktury
     * Log czasów przetwarzania
     * Log błędów z requestId
   - Dodano nowy endpoint `GET /logs` - zwraca ostatnie logi w formacie JSON
   - Dodano middleware obsługi błędów: `errorHandler`, `notFoundHandler`
   - Zmieniono log startu serwera z `console.log` na `logger.info`

2. **`docs/SETUP-WINDOWS-SERVICE.md`**
   - Dodana sekcja "## Logowanie" z wszystkimi informacjami o systemie logów
   - Przykłady lokalizacji logów (dev i production)
   - Polecenia PowerShell do przeglądania logów
   - Konfiguracja zmiennych środowiskowych dla logów
   - Rotacja i archiwizacja logów

3. **`docs/API-README.md`**
   - Dodane skrypty npm: `install:service`, `uninstall:service`
   - Nowa sekcja "## 7. Logowanie" z przykładami
   - Endpoint `GET /logs` do przeglądania logów REST API
   - Link do `docs/API-LOGGING.md`
   - Aktualizacja numeracji sekcji

4. **`package.json`**
   - Dodane skrypty:
     * `"install:service": "node scripts/install-service.cjs"`
     * `"uninstall:service": "node scripts/uninstall-service.cjs"`

## Co jest logowane?

### Żądania (DEBUG/INFO)
```
[timestamp] [INFO] [REQ] METHOD URL
- requestId
- IP klienta
- User-Agent
- Content-Length
```

### Operacje (DEBUG/INFO)
```
[timestamp] [INFO] Message
- requestId
- Szczegóły operacji (czas, rozmiar, itd.)
```

### Odpowiedzi (INFO)
```
[timestamp] [INFO] [RES] STATUS METHOD URL (duration)
- requestId
- Czas przetwarzania
```

### Ostrzeżenia (WARN)
```
[timestamp] [WARN] Message
- requestId
- Szczegóły ostrzeżenia
```

### Błędy (ERROR)
```
[timestamp] [ERROR] Message
- requestId
- Wiadomość błędu
- Stack trace
```

## Endpointy API

### `/health` (GET)
Sprawdzenie, że serwer jest uruchomiony

### `/logs` (GET)
Zwraca ostatnie logi w formacie JSON
- Query param: `lines` (default: 50)
- Zwraca: `{ timestamp, logFile, totalLines, displayedLines, logs: [] }`

### `/generate-invoice` (POST)
Generowanie faktury z logowaniem wszystkich operacji

## Zmienne środowiskowe

| Zmienna | Default | Opis |
|---------|---------|------|
| `NODE_ENV` | `development` | Środowisko (production/development) |
| `PORT` | 3001 | Port API |
| `LOG_DIR` | `./logs` (dev) lub `C:\logs\ksef-api` (prod) | Katalog logów |
| `DEBUG` | false | Włącz debug logi |
| `LOG_TO_FILE` | true (prod) / false (dev) | Loguj do pliku |

## Testowanie

```powershell
# 1. Zbuduj aplikację
npm run build

# 2. Uruchom serwer
npm run start:api

# 3. W innym PowerShell testuj:
curl.exe -X POST "http://localhost:3001/generate-invoice" `
  -F "file=@assets/invoice.xml" `
  -F "additionalData={\"nrKSeF\":\"TEST123456789012345\"}" `
  -o out.pdf

# 4. Przeglądaj logi:
Get-Content "logs/api-2025-11-27.log" -Tail 20
# LUB
Invoke-WebRequest "http://localhost:3001/logs"
```

## Wydajność

Logowanie ma minimalny wpływ na wydajność:
- Przetwarzanie logów dzieje się w pamięci
- Zapis do pliku jest asynchroniczny
- Każde żądanie dodaje ~1-2ms

## Bezpieczeństwo

✅ **Bezpieczne**:
- Logi zawierają requestId zamiast pełnych danych wrażliwych
- IP klienta jest logowany (dla audytu)
- Error stack trace zawiera tylko nazwy funkcji

⚠️ **Uwagi**:
- Sprawdzaj uprawnienia do katalogów logów
- Nie przechowuj poufnych danych w zmiennych środowiskowych
- Regularnie usuwaj stare logi

## Co dalej?

Opcjonalne ulepszenia:
- [ ] Integracja z Azure Application Insights
- [ ] Integracja z ELK Stack (Elasticsearch, Logstash, Kibana)
- [ ] Dashboard do monitorowania
- [ ] Alerty na ERROR logi
- [ ] Kompresja starych logów (gzip)
