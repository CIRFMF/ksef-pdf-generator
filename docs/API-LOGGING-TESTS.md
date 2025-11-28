# Testy logowania API

Zbiór przykładów testowania nowego systemu logowania.

## Uruchomienie serwera

```powershell
# Development
npm run dev:api

# Lub zbudowany
npm run build
npm run start:api
```

Serwer dostępny pod: `http://localhost:3001`

## Testy HTTP

### 1. Health check (bez pliku)

```powershell
Invoke-WebRequest "http://localhost:3001/health" | Select-Object -ExpandProperty Content | ConvertFrom-Json
```

Powinno zwrócić:
```json
{
  "status": "ok",
  "message": "API is running",
  "timestamp": "2025-11-27T10:30:45.123Z"
}
```

W logach:
```
[2025-11-27T10:30:45.123Z] [INFO] [REQ] GET /health
[2025-11-27T10:30:45.124Z] [INFO] [RES] 200 GET /health (1ms)
```

### 2. Przeglądanie logów (nowy endpoint)

```powershell
# Ostatnie 50 logów
$response = Invoke-WebRequest "http://localhost:3001/logs" | Select-Object -ExpandProperty Content | ConvertFrom-Json
$response.logs | Select-Object -Last 10

# Ostatnie 100 logów
Invoke-WebRequest "http://localhost:3001/logs?lines=100"
```

Odpowiedź:
```json
{
  "timestamp": "2025-11-27T10:30:45.123Z",
  "logFile": "./logs/api-2025-11-27.log",
  "totalLines": 245,
  "displayedLines": 50,
  "logs": [
    "[2025-11-27T10:30:45.123Z] [INFO] [REQ] GET /health",
    ...
  ]
}
```

### 3. Generowanie faktury (test główny)

```powershell
# Test z curl.exe
curl.exe -X POST "http://localhost:3001/generate-invoice" `
  -F "file=@assets/invoice.xml" `
  -F "additionalData={`\"nrKSeF`\":`\"TEST123456789012345`\"}" `
  -o out.pdf

# LUB test z npm
npm run test:api
```

W logach będą:
```
[2025-11-27T10:30:45.500Z] [INFO] [REQ] POST /generate-invoice
[2025-11-27T10:30:45.510Z] [DEBUG] Processing invoice generation
{
  "requestId": "1732686645123-a1b2c3d4e",
  "fileName": "invoice.xml",
  "fileSize": 2048
}
[2025-11-27T10:30:45.520Z] [DEBUG] Calling generateInvoice
{
  "requestId": "1732686645123-a1b2c3d4e",
  "nrKSeF": "TEST123456789012345"
}
[2025-11-27T10:30:47.100Z] [INFO] Invoice generated successfully
{
  "requestId": "1732686645123-a1b2c3d4e",
  "duration": "1600ms",
  "fileName": "invoice.xml",
  "nrKSeF": "TEST123456789012345"
}
[2025-11-27T10:30:47.105Z] [INFO] [RES] 200 POST /generate-invoice (1605ms)
```

### 4. Błąd - brak pliku

```powershell
$response = Invoke-WebRequest -Uri "http://localhost:3001/generate-invoice" `
  -Method POST `
  -Body @{"additionalData"=@{"nrKSeF"="TEST123"} | ConvertTo-Json} `
  -ContentType "application/json" `
  -ErrorAction Continue

$response.Content | ConvertFrom-Json
```

W logach:
```
[2025-11-27T10:30:45.123Z] [INFO] [REQ] POST /generate-invoice
[2025-11-27T10:30:45.124Z] [WARN] Request missing file
{
  "requestId": "1732686645123-a1b2c3d4e"
}
[2025-11-27T10:30:45.125Z] [INFO] [RES] 400 POST /generate-invoice (2ms)
```

### 5. Błąd - brak nrKSeF

```powershell
curl.exe -X POST "http://localhost:3001/generate-invoice" `
  -F "file=@assets/invoice.xml" `
  -F "additionalData={}" `
  -o out.pdf
```

W logach:
```
[2025-11-27T10:30:45.200Z] [WARN] Missing nrKSeF in additionalData
{
  "requestId": "1732686645123-a1b2c3d4e"
}
[2025-11-27T10:30:45.201Z] [INFO] [RES] 400 POST /generate-invoice (1ms)
```

### 6. 404 - nieznana trasa

```powershell
Invoke-WebRequest "http://localhost:3001/unknown-route"
```

W logach:
```
[2025-11-27T10:30:45.123Z] [INFO] [REQ] GET /unknown-route
[2025-11-27T10:30:45.124Z] [WARN] [404] Route not found: GET /unknown-route
{
  "requestId": "1732686645123-a1b2c3d4e",
  "ip": "::1"
}
[2025-11-27T10:30:45.125Z] [INFO] [RES] 404 GET /unknown-route (1ms)
```

## Przeglądanie logów z PowerShell

```powershell
# Pokaż ostatnie logi
Get-Content "logs/api-2025-11-27.log" -Tail 20

# Na bieżąco
Get-Content "logs/api-2025-11-27.log" -Wait

# Szukaj błędów
Get-Content "logs/api-2025-11-27.log" | Select-String "ERROR"

# Szukaj konkretnego requestId
Get-Content "logs/api-2025-11-27.log" | Select-String "1732686645123-a1b2c3d4e"

# Szukaj konkretnego nrKSeF
Get-Content "logs/api-2025-11-27.log" | Select-String "TEST123456789012345"

# Liczba żądań
(Get-Content "logs/api-2025-11-27.log" | Select-String "\[REQ\]").Count

# Liczba błędów
(Get-Content "logs/api-2025-11-27.log" | Select-String "ERROR").Count

# Średni czas odpowiedzi
$content = Get-Content "logs/api-2025-11-27.log" -Raw
$matches = [regex]::Matches($content, '\((\d+)ms\)')
$durations = $matches | ForEach-Object { [int]$_.Groups[1].Value }
$avgDuration = ($durations | Measure-Object -Average).Average
Write-Host "Średni czas odpowiedzi: $avgDuration ms"
```

## Testy integracyjne (Postman)

### Kolekcja testów

Importuj poniższe żądania do Postman'a:

```json
{
  "info": {
    "name": "KSEF PDF Generator API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Health Check",
      "request": {
        "method": "GET",
        "url": "http://localhost:3001/health"
      }
    },
    {
      "name": "Get Logs (Last 50)",
      "request": {
        "method": "GET",
        "url": "http://localhost:3001/logs"
      }
    },
    {
      "name": "Generate Invoice",
      "request": {
        "method": "POST",
        "url": "http://localhost:3001/generate-invoice",
        "body": {
          "mode": "formdata",
          "formdata": [
            {
              "key": "file",
              "type": "file",
              "src": "assets/invoice.xml"
            },
            {
              "key": "additionalData",
              "type": "text",
              "value": "{\"nrKSeF\":\"123456789012345678\"}"
            }
          ]
        }
      }
    },
    {
      "name": "Test 404",
      "request": {
        "method": "GET",
        "url": "http://localhost:3001/nonexistent"
      }
    }
  ]
}
```

## Monitoring w production

### Windows Service

```powershell
# Sprawdź status serwisu
Get-Service -Name "KsefPdfGeneratorAPI"

# Wyświetl ostatnie logi
Get-Content "C:\logs\ksef-api\api-2025-11-27.log" -Wait

# Szukaj błędów
Get-Content "C:\logs\ksef-api\api-*.log" | Select-String "ERROR"
```

### Metryki

```powershell
# Liczba żądań dzisiaj
$date = (Get-Date).ToString("yyyy-MM-dd")
$logFile = "C:\logs\ksef-api\api-$date.log"
$requests = (Get-Content $logFile | Select-String "\[REQ\]").Count
Write-Host "Żądań dzisiaj: $requests"

# Liczba błędów dzisiaj
$errors = (Get-Content $logFile | Select-String "ERROR").Count
Write-Host "Błędów dzisiaj: $errors"

# Średni czas odpowiedzi
$content = Get-Content $logFile -Raw
$matches = [regex]::Matches($content, '\((\d+)ms\)')
if ($matches.Count -gt 0) {
  $durations = $matches | ForEach-Object { [int]$_.Groups[1].Value }
  $avg = ($durations | Measure-Object -Average).Average
  $min = ($durations | Measure-Object -Minimum).Minimum
  $max = ($durations | Measure-Object -Maximum).Maximum
  Write-Host "Czas odpowiedzi - Średnia: $([Math]::Round($avg))ms, Min: $min ms, Max: $max ms"
}
```

## Troubleshooting

### Problem: Nie widzę logów

1. Sprawdź czy katalog logów istnieje:
   ```powershell
   Test-Path "logs"
   ```

2. Sprawdź uprawnienia do zapisu:
   ```powershell
   [System.IO.File]::GetAccessControl("logs") | Select-Object -ExpandProperty Access
   ```

3. Sprawdzaj konsolę serwera - logi są zawsze wypisywane na stdout

### Problem: Zbyt wiele logów

W development, wyłącz logowanie do pliku:
```powershell
$env:LOG_TO_FILE = "false"
npm run dev:api
```

### Problem: Chcę wiedzieć skąd pochodzi błąd

Szukaj requestId:
```powershell
$requestId = "1732686645123-a1b2c3d4e"
Get-Content "logs/api-*.log" | Select-String $requestId
```

To pokaże całą ścieżkę żądania od początku do błędu.
