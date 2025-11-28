# 📋 Logowanie API - Szybki Start

System logowania został pełnie wdrożony. Każde żądanie do API jest automatycznie rejestrowane.

## 🚀 Szybki start

```powershell
# 1. Zbuduj aplikację
npm run build

# 2. Uruchom serwer
npm run start:api

# 3. Testuj
curl.exe -X POST "http://localhost:3001/generate-invoice" `
  -F "file=@assets/invoice.xml" `
  -F "additionalData={\"nrKSeF\":\"TEST123456789012345\"}" `
  -o out.pdf

# 4. Przeglądaj logi
Get-Content "logs/api-$(Get-Date -Format yyyy-MM-dd).log" -Tail 20
# LUB
Invoke-WebRequest "http://localhost:3001/logs?lines=50"
```

## 📁 Co zostało dodane

| Plik | Opis |
|------|------|
| `src/api/logger.ts` | Moduł logowania |
| `src/api/middleware.ts` | Middleware do logowania |
| `src/api/server.ts` | ✏️ Zmodyfikowany z logowaniem |
| `docs/API-LOGGING.md` | 📚 Pełna dokumentacja |
| `docs/API-LOGGING-TESTS.md` | 🧪 Przewodnik testowania |
| `docs/LOGGING-IMPLEMENTATION-SUMMARY.md` | 📋 Podsumowanie zmian |

## 🔍 Co jest logowane

✅ Każde żądanie HTTP (metoda, URL, IP, User-Agent)
✅ Czas przetwarzania każdego żądania
✅ Szczegóły przetwarzania PDF (czas, rozmiar, nrKSeF)
✅ Wszystkie błędy z pełnym stack trace
✅ Statusy odpowiedzi (2xx, 4xx, 5xx)

## 📊 Nowe endpointy

### `GET /logs`
Zwraca ostatnie logi w formacie JSON
```powershell
Invoke-WebRequest "http://localhost:3001/logs?lines=50"
```

Response:
```json
{
  "timestamp": "2025-11-27T10:30:45.123Z",
  "logFile": "./logs/api-2025-11-27.log",
  "totalLines": 245,
  "displayedLines": 50,
  "logs": ["[timestamp] [level] message", ...]
}
```

## 📂 Lokalizacja logów

| Środowisko | Ścieżka |
|-----------|---------|
| Development | `./logs/api-YYYY-MM-DD.log` |
| Production | `C:\logs\ksef-api\api-YYYY-MM-DD.log` |

## 🔧 Zmienne środowiskowe

W `scripts/install-service.cjs`:
```javascript
envs: [
  { name: 'NODE_ENV', value: 'production' },
  { name: 'PORT', value: '3001' },
  { name: 'LOG_DIR', value: 'C:\\logs\\ksef-api' },
  { name: 'DEBUG', value: 'false' }
]
```

## 💻 Polecenia PowerShell

```powershell
# Ostatnie 50 logów
Get-Content "logs/api-$(Get-Date -Format yyyy-MM-dd).log" -Tail 50

# Na bieżąco (monitoring)
Get-Content "logs/api-$(Get-Date -Format yyyy-MM-dd).log" -Wait

# Szukaj błędów
Get-Content "logs/api-*.log" | Select-String "ERROR"

# Szukaj konkretnego requestId
Get-Content "logs/api-*.log" | Select-String "1732686645123-a1b2c3d4e"

# Liczba żądań dzisiaj
(Get-Content "logs/api-$(Get-Date -Format yyyy-MM-dd).log" | Select-String "\[REQ\]").Count

# Średni czas odpowiedzi
$content = Get-Content "logs/api-$(Get-Date -Format yyyy-MM-dd).log" -Raw
$matches = [regex]::Matches($content, '\((\d+)ms\)')
$durations = $matches | ForEach-Object { [int]$_.Groups[1].Value }
($durations | Measure-Object -Average).Average
```

## 📖 Dokumentacja API - Swagger

Interaktywna dokumentacja dostępna pod:

```
http://localhost:3001/docs
```

**Możliwości:**
- 📚 Przeglądanie endpoint'ów
- 🧪 Testowanie bezpośrednio z dokumentacji
- 📋 Pełne schematy żądań i odpowiedzi
- 💾 Pobieranie specyfikacji OpenAPI

[Więcej szczegółów](./docs/API-SWAGGER.md)

## 🧹 Czyszczenie logów

### Ręczne czyszczenie

```powershell
# Usuń logi starsze niż 30 dni
npm run cleanup:logs

# LUB z custom ścieżką
node scripts/cleanup-logs.cjs "D:\CustomLogs"
```

### Automatyczne czyszczenie (codziennie o 2:00 AM)

Przeczytaj: `docs/CLEANUP-LOGS.md`

## 🎯 Przykładowy log

```
[2025-11-27T10:30:45.123Z] [INFO] [REQ] POST /generate-invoice
{
  "requestId": "1732686645123-a1b2c3d4e",
  "ip": "192.168.1.100",
  "userAgent": "curl/7.85.0"
}

[2025-11-27T10:30:45.500Z] [DEBUG] Processing invoice generation
{
  "requestId": "1732686645123-a1b2c3d4e",
  "fileName": "invoice.xml",
  "fileSize": 2048
}

[2025-11-27T10:30:47.100Z] [INFO] Invoice generated successfully
{
  "requestId": "1732686645123-a1b2c3d4e",
  "duration": "1600ms",
  "fileName": "invoice.xml",
  "nrKSeF": "123456789012345678"
}

[2025-11-27T10:30:47.105Z] [INFO] [RES] 200 POST /generate-invoice (1605ms)
{
  "requestId": "1732686645123-a1b2c3d4e",
  "duration": 1605,
  "statusCode": 200
}
```

## 🔐 Windows Service

Jeśli korzystasz z Windows Service:

```powershell
# Zainstaluj serwis - logi domyślnie w aplikacja/logs
npm run install:service

# LUB zainstaluj z custom portem i katalogiem logów
npm run install:service -- --port=5051 --log-dir="C:\Logs\KsefAPI"

# Przeglądaj logi serwisu
Get-Content "aplikacja/logs/api-$(Get-Date -Format yyyy-MM-dd).log" -Wait
# LUB przy custom ścieżce
Get-Content "C:\Logs\KsefAPI\api-$(Get-Date -Format yyyy-MM-dd).log" -Wait

# Odinstaluj
npm run uninstall:service
```

## 📚 Więcej informacji

- **Pełna dokumentacja**: `docs/API-LOGGING.md`
- **Testy i przykłady**: `docs/API-LOGGING-TESTS.md`
- **Podsumowanie zmian**: `docs/LOGGING-IMPLEMENTATION-SUMMARY.md`
- **Windows Service**: `docs/SETUP-WINDOWS-SERVICE.md`

## ✅ Cechy

- ✅ Automatyczne logowanie wszystkich żądań
- ✅ Przechwytywanie wszystkich wyjątków
- ✅ Unique ID dla każdego żądania (do śledzenia)
- ✅ Logowanie do pliku i konsoli
- ✅ REST API endpoint do przeglądania logów
- ✅ PowerShell komendy do analizy
- ✅ Obsługa dev i production
- ✅ Minimalna wartość wydajności (~1-2ms per request)

---

**Gotowe!** 🎉 Aplikacja jest teraz w pełni logowana i monitorowana.
