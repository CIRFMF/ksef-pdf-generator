# Instalacja aplikacji jako Windows Service

Instrukcja do instalacji KSEF PDF Generator API jako Windows Service na Windows Server z wykorzystaniem modułu `node-windows`.

## Wymagania

- Windows Server 2012 R2 lub nowszy
- Node.js 18+ zainstalowany
- PowerShell z uprawnieniami administratora
- Aplikacja zbudowana (`npm run build`)

## Kroki instalacji

### 1. Przygotowanie aplikacji

```powershell
# Przejdź do katalogu projektu
cd D:\repo\ksef-pdf-generator-api

# Zainstaluj zależności
npm install

# Zbuduj aplikację
npm run build
```

### 2. Utwórz skrypt instalacyjny Windows Service

Utwórz plik `scripts/install-service.cjs` w katalogu projektu:

```javascript
const Service = require('node-windows').Service;
const path = require('path');

// Konfiguracja serwisu
const svc = new Service({
  name: 'KsefPdfGeneratorAPI',
  description: 'KSEF PDF Generator API Service',
  script: path.join(__dirname, '../dist/api/server.cjs'),
  nodeOptions: '--max-old-space-size=2048',
  env: {
    name: 'NODE_ENV',
    value: 'production'
  },
  envs: [
    {
      name: 'NODE_ENV',
      value: 'production'
    },
    {
      name: 'PORT',
      value: '3001'
    }
  ]
});

// Obsługa zdarzeń
svc.on('install', function() {
  console.log('✓ Serwis został zainstalowany');
  svc.start();
});

svc.on('alreadyinstalled', function() {
  console.log('✓ Serwis jest już zainstalowany');
});

svc.on('start', function() {
  console.log('✓ Serwis został uruchomiony');
});

svc.on('error', function(err) {
  console.error('✗ Błąd:', err);
  process.exit(1);
});

// Zainstaluj serwis
svc.install();
```

### 3. Utwórz skrypt do odinstalowania serwisu

Utwórz plik `scripts/uninstall-service.cjs`:

```javascript
const Service = require('node-windows').Service;
const path = require('path');

const svc = new Service({
  name: 'KsefPdfGeneratorAPI',
  script: path.join(__dirname, '../dist/api/server.cjs')
});

svc.on('uninstall', function() {
  console.log('✓ Serwis został odinstalowany');
  process.exit(0);
});

svc.on('error', function(err) {
  console.error('✗ Błąd:', err);
  process.exit(1);
});

svc.uninstall();
```

### 4. Aktualizuj package.json

Dodaj skrypty do sekcji `"scripts"` w `package.json`:

```json
"install:service": "node scripts/install-service.cjs",
"uninstall:service": "node scripts/uninstall-service.cjs"
```

### 5. Instalacja serwisu

Otwórz PowerShell z uprawnieniami administratora i wykonaj:

```powershell
# Przejdź do katalogu projektu
cd D:\repo\ksef-pdf-generator-api

# Instalacja domyślna (port 3001, logi w aplikacja/logs)
npm run install:service

# LUB instalacja z custom portem
npm run install:service -- --port=5051

# LUB instalacja z custom katalogiem logów
npm run install:service -- --log-dir="C:\MyLogs"

# LUB instalacja z oboma parametrami
npm run install:service -- --port=5051 --log-dir="C:\MyLogs"
```

Po pomyślnej instalacji serwis pojawi się w Services (services.msc) z nazwą `KsefPdfGeneratorAPI`.

## Zarządzanie serwisem

### Uruchomienie serwisu

```powershell
Start-Service -Name "KsefPdfGeneratorAPI"
```

### Zatrzymanie serwisu

```powershell
Stop-Service -Name "KsefPdfGeneratorAPI"
```

### Restart serwisu

```powershell
Restart-Service -Name "KsefPdfGeneratorAPI"
```

### Sprawdzenie statusu

```powershell
Get-Service -Name "KsefPdfGeneratorAPI"
```

### Odinstalowanie serwisu

Otwórz PowerShell z uprawnieniami administratora:

```powershell
cd D:\repo\ksef-pdf-generator-api
npm run uninstall:service
```

## Logowanie

Aplikacja zawiera wbudowany system logowania, który automatycznie loguje:
- Każde przychodzące żądanie HTTP (metoda, URL, IP, User-Agent)
- Czas odpowiedzi dla każdego żądania
- Wszystkie błędy z pełnym stack trace
- Statusy odpowiedzi (2xx, 4xx, 5xx)
- Szczegóły przetwarzania PDF (czas, rozmiar pliku, nrKSeF)

### Lokalizacja logów

Dzienniki API zapisywane są domyślnie w katalogu aplikacji:
- **Katalog domyślny**: `aplikacja/logs/api-YYYY-MM-DD.log`
- **Przykład**: `D:\repo\ksef-pdf-generator-api\logs\api-2025-11-27.log`

Możesz zmienić lokalizację logów podając parametr `--log-dir` podczas instalacji:

```powershell
npm run install:service -- --log-dir="C:\Logs\KsefAPI"
# Wtedy logi będą w: C:\Logs\KsefAPI\api-2025-11-27.log
```

### Przykładowe logi

```
[2025-11-27T10:30:45.123Z] [INFO] [REQ] POST /generate-invoice
{
  "requestId": "1732686645123-a1b2c3d4e",
  "ip": "192.168.1.100",
  "userAgent": "Mozilla/5.0..."
}

[2025-11-27T10:30:47.456Z] [INFO] Invoice generated successfully
{
  "requestId": "1732686645123-a1b2c3d4e",
  "duration": "2333ms",
  "fileName": "invoice.xml",
  "nrKSeF": "123456789012345678"
}

[2025-11-27T10:30:47.460Z] [INFO] [RES] 200 POST /generate-invoice (2337ms)
{
  "requestId": "1732686645123-a1b2c3d4e",
  "duration": 2337,
  "statusCode": 200
}
```

### Konfiguracja logów

Ustaw zmienne środowiskowe w skrypcie `scripts/install-service.cjs`:

```javascript
envs: [
  { name: 'NODE_ENV', value: 'production' },
  { name: 'PORT', value: '3001' },
  { name: 'LOG_DIR', value: 'C:\\logs\\ksef-api' },  // Custom ścieżka
  { name: 'DEBUG', value: 'false' }  // Debug logi
]
```

### Przeglądanie logów w Windows

**Method 1: Event Viewer (Viewer zdarzeń)**
```powershell
# Otwórz Event Viewer
eventvwr.msc

# Przejdź do: Windows Logs → Application
# Szukaj źródła z tagiem aplikacji
```

**Method 2: PowerShell - Ostatnie logi**
```powershell
# Przeglądaj ostatnie logi
Get-Content "C:\logs\ksef-api\api-2025-11-27.log" -Tail 50 -Wait

# Szukaj błędów
Get-Content "C:\logs\ksef-api\api-2025-11-27.log" | Select-String "ERROR"
```

**Method 3: Real-time monitoring**
```powershell
# Wyświetl nowe logi na bieżąco
Get-Content "C:\logs\ksef-api\api-2025-11-27.log" -Wait

# Lub dla dowolnego dnia
$logFile = Get-ChildItem "C:\logs\ksef-api" | Sort-Object LastWriteTime -Descending | Select-Object -First 1
Get-Content $logFile.FullName -Wait
```

### Rotacja logów

Logi są tworzone dziennie z datą w nazwie pliku. Aby automatycznie usuwać stare logi:

```powershell
# Usuń logi starsze niż 30 dni
$logsPath = "C:\logs\ksef-api"
$daysToKeep = 30
Get-ChildItem $logsPath -Filter "api-*.log" | Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-$daysToKeep) } | Remove-Item

# Zaplanuj w Task Scheduler
```

## Dzienniki Windows Service

### Zmienne środowiskowe

Edytuj skrypt `scripts/install-service.cjs`, aby dodać więcej zmiennych:

```javascript
envs: [
  { name: 'NODE_ENV', value: 'production' },
  { name: 'PORT', value: '3001' },
  { name: 'LOG_DIR', value: 'C:\\logs\\ksef-api' }
]
```

### Zmiana portu i katalogu logów

Najłatwiej zmienić parametry podczas instalacji:

```powershell
npm run install:service -- --port=5051 --log-dir="E:\Logs"
```

### Limity pamięci

Aby zwiększyć limit pamięci dla Node.js (przydatne przy dużych plikach PDF):

```javascript
const svc = new Service({
  // ...
  nodeOptions: '--max-old-space-size=4096'  // 4GB
});
```

### Automatyczne restartowanie przy błędzie

Modułu `node-windows` nie ma wbudowanej obsługi auto-restartu. Alternatywa - użyj **PM2** z pluginem windows-startup:

```powershell
npm install -g pm2
pm2 start dist/api/server.cjs --name KsefPdfGeneratorAPI
pm2 save
pm2-runtime start ecosystem.config.js
```

## Troubleshooting

### Problem: Serwis nie uruchamia się

1. Sprawdź Event Viewer w Applications
2. Upewnij się, że ścieżka do `dist/api/server.cjs` jest prawidłowa
3. Spróbuj uruchomić serwer ręcznie: `node dist/api/server.cjs`

### Problem: Port już zajęty

```powershell
# Znajdź co słucha na porcie 3001
netstat -ano | findstr :3001

# Zmień PORT w zmiennych środowiskowych serwisu
```

### Problem: Brak uprawnień do rejestracji serwisu

Otwórz PowerShell z uprawnieniami administratora (Run as Administrator)

### Problem: Serwis się zawiesza

Zwiększ limit pamięci w opcji `nodeOptions` lub dodaj monitoring z PM2.

## Monitoring

### Przy użyciu PM2

```powershell
npm install -g pm2

# Uruchom aplikację
pm2 start dist/api/server.cjs --name "ksef-api"

# Zarejestruj jako Windows Service
pm2-runtime start ecosystem.config.js

# Sprawdź status
pm2 status
```

### Sprawdzenie dostępności API

```powershell
# Test healthcheck
Invoke-WebRequest -Uri "http://localhost:3001/health"
```

## Bezpieczeństwo

1. **Firewall**: Otwórz port 3001 (lub inny) dla niezbędnych użytkowników
2. **SSL/TLS**: Użyj reverse proxy (IIS, nginx) dla HTTPS
3. **Zmienne środowiskowe**: Nie przechowuj poufnych danych w pliku - użyj zmiennych systemowych
4. **Uprawnienia**: Uruchamiaj serwis z minimalnie wymaganymi uprawnieniami

## Wdrażanie aktualizacji

```powershell
# 1. Zatrzymaj serwis
Stop-Service -Name "KsefPdfGeneratorAPI"

# 2. Zbuduj nową wersję
npm run build

# 3. Uruchom serwis
Start-Service -Name "KsefPdfGeneratorAPI"
```

## Referencje

- [node-windows dokumentacja](https://github.com/coreybutler/node-windows)
- [Windows Services w PowerShell](https://learn.microsoft.com/en-us/powershell/scripting/samples/managing-services)
