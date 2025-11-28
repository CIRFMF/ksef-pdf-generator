# System Logowania API

Aplikacja zawiera wbudowany system logowania, który automatycznie rejestruje wszystkie żądania, odpowiedzi i wyjątki.

## Architektura

System logowania składa się z dwóch modułów:

### 1. `src/api/logger.ts`
Centralny logger z metodami:
- `logger.info(message, data)` - Informacje
- `logger.warn(message, data)` - Ostrzeżenia
- `logger.error(message, data)` - Błędy
- `logger.debug(message, data)` - Debug (tylko w dev)

### 2. `src/api/middleware.ts`
Middleware Express:
- `requestLogger` - Loguje każde żądanie i odpowiedź
- `errorHandler` - Globalna obsługa błędów
- `notFoundHandler` - Obsługa tras 404

## Funkcjonalności

### Logowanie żądań

Każde żądanie zawiera:
- **requestId** - Unikalny identyfikator żądania (do śledzenia)
- **Metoda HTTP** (GET, POST, itp.)
- **URL** żądania
- **IP** klienta
- **User-Agent**
- **Rozmiar** żądania

Przykład:
```
[2025-11-27T10:30:45.123Z] [INFO] [REQ] POST /generate-invoice
{
  "requestId": "1732686645123-a1b2c3d4e",
  "ip": "192.168.1.100",
  "userAgent": "Mozilla/5.0..."
}
```

### Logowanie odpowiedzi

Każda odpowiedź zawiera:
- **Status HTTP** (200, 400, 500, itp.)
- **Czas przetwarzania** (ms)
- **requestId** - do powiązania z żądaniem

Przykład:
```
[2025-11-27T10:30:47.460Z] [INFO] [RES] 200 POST /generate-invoice (2337ms)
{
  "requestId": "1732686645123-a1b2c3d4e",
  "duration": 2337,
  "statusCode": 200
}
```

### Logowanie błędów

Każdy błąd zawiera:
- **Wiadomość błędu**
- **Stack trace** (pełny stos wywołań)
- **requestId** - do śledzenia pochodzenia błędu
- **Szczegóły** operacji która się nie powiodła

Przykład:
```
[2025-11-27T10:30:47.123Z] [ERROR] Error in /generate-invoice
{
  "requestId": "1732686645123-a1b2c3d4e",
  "error": "Cannot read property 'nrKSeF' of undefined",
  "stack": "Error: Cannot read property...\n    at Object.generateInvoice..."
}
```

### Śledzenie operacji

Każde żądanie API loguje szczegóły operacji:

**Generowanie faktury:**
```
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
```

## Lokalizacja logów

### Development
```
./logs/api-YYYY-MM-DD.log
```

### Production (Windows Service)
```
C:\logs\ksef-api\api-YYYY-MM-DD.log
```

### Custom lokalizacja
Ustaw zmienną środowiskową `LOG_DIR`:
```javascript
envs: [
  { name: 'LOG_DIR', value: 'D:\\custom\\logs\\path' }
]
```

## Konfiguracja

### Zmienne środowiskowe

W skrypcie `scripts/install-service.cjs`:

```javascript
envs: [
  // Środowisko
  { name: 'NODE_ENV', value: 'production' },
  
  // Port API
  { name: 'PORT', value: '3001' },
  
  // Katalog logów (opcjonalnie)
  { name: 'LOG_DIR', value: 'C:\\logs\\ksef-api' },
  
  // Włącz debug logi (dev)
  { name: 'DEBUG', value: 'true' },
  
  // Loguj do pliku w dev (domyślnie false)
  { name: 'LOG_TO_FILE', value: 'true' }
]
```

### Poziomy logowania

Logger obsługuje 4 poziomy:

| Poziom | Kiedy użyć | Przykład |
|--------|-----------|----------|
| **INFO** | Normalne operacje | "Invoice generated successfully" |
| **WARN** | Podejrzane sytuacje | "Missing nrKSeF in request" |
| **ERROR** | Błędy | "Failed to generate PDF" |
| **DEBUG** | Szczegóły (dev only) | "Processing started" |

## Przeglądanie logów

### PowerShell - Ostatnie logi

```powershell
# Ostatnie 50 linii
Get-Content "C:\logs\ksef-api\api-2025-11-27.log" -Tail 50

# Na bieżąco (real-time)
Get-Content "C:\logs\ksef-api\api-2025-11-27.log" -Wait

# Szukanie błędów
Get-Content "C:\logs\ksef-api\api-2025-11-27.log" | Select-String "ERROR"

# Szukanie konkretnego requestId
Get-Content "C:\logs\ksef-api\api-2025-11-27.log" | Select-String "1732686645123-a1b2c3d4e"
```

### PowerShell - Statystyka

```powershell
# Liczba żądań dzisiaj
(Get-Content "C:\logs\ksef-api\api-2025-11-27.log" | Select-String "\[REQ\]").Count

# Liczba błędów
(Get-Content "C:\logs\ksef-api\api-2025-11-27.log" | Select-String "ERROR").Count

# Średni czas odpowiedzi
$content = Get-Content "C:\logs\ksef-api\api-2025-11-27.log" -Raw
$matches = [regex]::Matches($content, '\((\d+)ms\)')
$durations = $matches | ForEach-Object { [int]$_.Groups[1].Value }
$avgDuration = ($durations | Measure-Object -Average).Average
Write-Host "Średni czas odpowiedzi: $avgDuration ms"
```

### Event Viewer - Logi systemu

```powershell
# Otwórz Event Viewer
eventvwr.msc

# Przejdź do: Windows Logs → Application
# Szukaj logów z timestamp'ów z API logów
```

## Rotacja i archiwizacja logów

Logi są automatycznie segregowane po datach. Aby usunąć stare logi:

```powershell
# Usuń logi starsze niż 30 dni
$logsPath = "C:\logs\ksef-api"
$daysToKeep = 30
Get-ChildItem $logsPath -Filter "api-*.log" | 
  Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-$daysToKeep) } | 
  Remove-Item

# Zaplanuj w Task Scheduler do uruchomienia codziennie
```

## Troubleshooting

### Problem: Logi nie są tworzone

1. Sprawdzić katalog logów:
   ```powershell
   Test-Path "C:\logs\ksef-api"
   ```

2. Sprawdzić uprawnienia do katalogu:
   ```powershell
   Get-Acl "C:\logs\ksef-api" | Select-Object -ExpandProperty Access
   ```

3. Sprawdzić czy serwis ma uprawnienia do zapisu

### Problem: Za dużo logów

ZmniejszLevel logowania w kodzie lub:
- Zwiększ rotację (kasuj częściej)
- Zmniejsz `LOG_TO_FILE` w dev

### Problem: Nie widzę debug logów

Debug logi wyświetlają się tylko jeśli:
- `NODE_ENV` ≠ `production` LUB
- `DEBUG=true` jest ustawione

## Best Practices

1. **Używaj requestId** - Zawsze uwzględniaj requestId w komunikacji z użytkownikami
2. **Czyszczenie logów** - Regularnie usuwaj stare logi
3. **Monitorowanie** - Skonfiguruj alerty na ERROR logi
4. **Bezpieczeństwo** - Nie loguj poufnych danych (hasła, tokeny)

## Przykład integracji z monitoringiem

### Azure Application Insights
```typescript
// W przyszłości: integracja z Application Insights
```

### ELK Stack
```typescript
// W przyszłości: integracja z Elasticsearch, Logstash, Kibana
```
