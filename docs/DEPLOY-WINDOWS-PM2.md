# Deploy KSEF API na Windows Server - Opcja C: PM2 + pm2-windows-service

Przewodnik do wdrażania API KSEF z PM2 (zaawansowany process manager) i pm2-windows-service do automatycznego uruchamiania po restarcie serwera.

## Wymagania

- Windows Server 2016 lub nowszy
- Node.js LTS 18+ (z npm)
- KSEF API zbudowana (`npm run build`)
- Administrator privileges (do instalacji usługi systemowej)

## Krok 1: Instalacja PM2 globalnie

```powershell
# Zainstaluj PM2 globalnie
npm install -g pm2

# Sprawdź wersję
pm2 -v

# Powinno zwrócić: v5.x.x lub nowsze
```

## Krok 2: Instalacja pm2-windows-service

PM2 Windows service to moduł który pozwala na automatyczne uruchamianie PM2 po restarcie systemu.

```powershell
# Zainstaluj moduł
npm install -g pm2-windows-service

# Weryfikuj instalację
npm list -g | findstr pm2
```

## Krok 3: Konfiguracja PM2 Ecosystem

W katalogu projektu utwórz plik `ecosystem.config.js`:

```powershell
cd D:\repo\ksef-pdf-generator_new
New-Item -Name "ecosystem.config.js" -ItemType File
```

Zawartość `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [
    {
      // Identyfikator aplikacji
      name: 'ksef-api',
      
      // Ścieżka do bundled servera (CommonJS)
      script: './dist/api/server.cjs',
      
      // Argumenty CLI (jeśli potrzebne)
      args: '',
      
      // Liczba instancji - 0 = liczba rdzeni CPU
      instances: 0,
      exec_mode: 'cluster',
      
      // Environment variables
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
        LOG_LEVEL: 'info'
      },
      
      // Ścieżka do logów
      out_file: './logs/pm2-out.log',
      err_file: './logs/pm2-err.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      
      // Restart policy
      watch: false,                    // Nie restart na zmianę pliku
      max_memory_restart: '500M',      // Restart jeśli > 500MB
      
      // Graceful restart
      kill_timeout: 5000,
      wait_ready: true,
      
      // Ścieżka do working directory
      cwd: './',
      
      // Merge logs z wielu instancji
      combine_logs: true,
    }
  ],
  
  // Deploy section (opcjonalnie - dla CI/CD)
  deploy: {
    production: {
      user: 'Administrator',
      host: 'localhost',
      ref: 'origin/main',
      repo: 'git@github.com:user/ksef-pdf-generator.git',
      path: 'D:\\repo\\ksef-pdf-generator_new',
      'post-deploy': 'npm install && npm run build && pm2 startOrRestart ecosystem.config.js --env production'
    }
  }
};
```

## Krok 4: Uruchomienie aplikacji z PM2

### 4.1 Pierwszy start

```powershell
cd D:\repo\ksef-pdf-generator_new

# Uruchom aplikację wg konfiguracji
pm2 start ecosystem.config.js

# Sprawdź status
pm2 status

# Powinno wyświetlić:
# id | name      | mode      | ↺ | status  | cpu  | memory
# 0  | ksef-api  | cluster   | 0 | online  | 0%   | 50MB
```

### 4.2 Monitorowanie

```powershell
# Podgląd logów w czasie rzeczywistym
pm2 logs ksef-api

# Podgląd pojedynczych logów
pm2 logs ksef-api --lines 50
pm2 logs ksef-api --err

# Monitorowanie zasobów (CPU, RAM)
pm2 monit

# Statystyki (proces, uptime, restarty)
pm2 show ksef-api
```

## Krok 5: Instalacja PM2 jako usługi systemowej

### 5.1 Zainstaluj PM2 service wrapper

```powershell
# PowerShell jako Administrator
pm2-service-install -n ksef -u Administrator -p password
```

**Parametry:**
- `-n ksef`: Nazwa usługi
- `-u Administrator`: Użytkownik Windows
- `-p password`: Hasło użytkownika

### 5.2 Ustaw PM2 do zarządzania aplikacją

```powershell
# Ustaw PM2 do autostartu
pm2 startup windows --service-name ksef

# Zapisz bieżącą konfigurację PM2 (aby zachować aplikacje)
pm2 save
```

### 5.3 Weryfikacja usługi

```powershell
# Sprawdzanie czy usługa istnieje
Get-Service -Name ksef

# Status
Get-Service -Name ksef | Select-Object Status

# Powinno zwrócić "Running"
```

## Krok 6: Zaawansowana konfiguracja PM2

### 6.1 Gracieful shutdown (0 downtime restart)

Edytuj `ecosystem.config.js`:

```javascript
{
  ...
  // Zmiana na graceful restart
  kill_timeout: 10000,           // 10 sekund na zamknięcie
  wait_ready: true,              // Czekaj na ready signal
  listen_timeout: 10000,         // Timeout dla PORT binding
  
  // Sygna graceful restart
  exec_mode: 'cluster',
  max_restarts: 10,
  min_uptime: '10s'
}
```

### 6.2 Autorestart policy

```javascript
{
  ...
  // Automatyczne restarty
  exp_backoff_restart_delay: 100,  // Backoff delay między restarty
  max_restarts: 10,                // Maksymalnie 10 restarty
  min_uptime: '10s',               // Jeśli działa < 10s = liczba restart
  
  // Memory limit
  max_memory_restart: '1G',        // Restart jeśli > 1GB RAM
  
  // Crash policy
  autorestart: true,
}
```

### 6.3 Monitoring i alarmy (PM2 Plus - opcjonalnie)

```powershell
# Połącz z PM2 Plus (cloud monitoring)
pm2 link <secret_key> <public_key>

# Lub lokalnie bez cloud:
pm2 install pm2-auto-pull  # Auto-pull zmian z Git
pm2 install pm2-logrotate  # Rotacja logów
```

## Krok 7: Útilities i Maintenance

### 7.1 Restarty

```powershell
# Restart aplikacji (z graceful shutdown)
pm2 restart ksef-api

# Reload bez restartu (0 downtime)
pm2 reload ksef-api

# Restart z nową konfiguracją
pm2 startOrRestart ecosystem.config.js

# Reload wszystkich aplikacji
pm2 reload all
```

### 7.2 Zarządzanie procesami

```powershell
# Stop aplikacji
pm2 stop ksef-api

# Stop wszystkich
pm2 stop all

# Start
pm2 start ksef-api

# Delete aplikację z listy PM2
pm2 delete ksef-api
```

### 7.3 Logowanie i rotacja

```powershell
# Zainstaluj logrotate moduł
pm2 install pm2-logrotate

# Konfiguracja logrotate
pm2 set pm2-logrotate:max_size 10M      # Rozmiar pliku zanim rotacja
pm2 set pm2-logrotate:retain 14         # Ile dni trzymać logi
pm2 set pm2-logrotate:compress true     # Kompresuj stare logi
pm2 set pm2-logrotate:dateFormat YYYY-MM-DD_HH-mm-ss

# Przeglądanie konfiguracji
pm2 config show
```

### 7.4 PM2 Web Dashboard (opcjonalnie)

```powershell
# Uruchom web interfejs
pm2 web

# Dostępny na: http://localhost:9615
```

## Krok 8: Update i rebuild aplikacji

Przy każdym update'u kodu:

```powershell
cd D:\repo\ksef-pdf-generator_new

# Pull nowy kod
git pull

# Install dependencies
npm install

# Build
npm run build

# Restart aplikacji z zero downtime
pm2 reload ecosystem.config.js

# Lub restart z downtime
pm2 restart ecosystem.config.js
```

## Krok 9: Testowanie

### 9.1 Test endpoint

```powershell
# Test lokalnie
curl.exe -X POST http://localhost:3001/generate-invoice `
  -F "file=@D:\repo\ksef-pdf-generator_new\assets\invoice.xml" `
  -F "additionalData={`"nrKSeF`":`"TEST123`"}" `
  -o test.pdf

# Sprawdź czy PDF jest poprawny
Test-Path test.pdf
```

### 9.2 Stress test (opcjonalnie)

```powershell
# Zainstaluj artillery dla load testingu
npm install -g artillery

# Utwórz plik load-test.yml
$yaml = @"
config:
  target: "http://localhost:3001"
  phases:
    - duration: 60
      arrivalRate: 10
      name: "Ramp up"
    - duration: 120
      arrivalRate: 20
      name: "Sustained load"
scenarios:
  - name: "Generate Invoice"
    flow:
      - post:
          url: "/generate-invoice"
          formData:
            file: "@assets/invoice.xml"
            additionalData: '{`"nrKSeF`":`"TEST123`"}'
          expect: 200
"@

$yaml | Out-File load-test.yml -Encoding UTF8

# Uruchom test
artillery run load-test.yml
```

## Krok 10: Firewall i Security

```powershell
# Pozwól na ruch HTTP (port 3001 - tylko internal)
New-NetFirewallRule -DisplayName "PM2 Node.js API" `
  -Direction Inbound -LocalPort 3001 -Protocol TCP `
  -LocalAddress 127.0.0.1 -Action Allow

# Jeśli chcesz dostęp z innego IP
New-NetFirewallRule -DisplayName "PM2 Node.js API Public" `
  -Direction Inbound -LocalPort 3001 -Protocol TCP `
  -Action Allow

# Przejrzyj reguły
Get-NetFirewallRule -DisplayName "*Node.js*"
```

## Troubleshooting

### Problem: "pm2: command not found"

```powershell
# Sprawdź instalację
npm list -g | findstr pm2

# Przeinstaluj
npm install -g pm2

# Dodaj do PATH jeśli potrzebne
$env:Path += ";C:\Users\$env:USERNAME\AppData\Roaming\npm"
[Environment]::SetEnvironmentVariable("Path", $env:Path, [EnvironmentVariableTarget]::Machine)
```

### Problem: Aplikacja się resetuje co chwila

```powershell
# Sprawdź logi na błędy
pm2 logs ksef-api --err

# Jeśli error to JSON parsing: plik ecosystem.config.js może być źle sformatowany
# Waliduj JSON/JavaScript
node -c ecosystem.config.js
```

### Problem: PM2 service nie uruchamia się

```powershell
# Przeinstaluj service
pm2-service-uninstall
pm2-service-install -n ksef -u Administrator -p password

# Restart Windows usługi
Restart-Service -Name ksef
```

### Problem: "EACCES: permission denied" przy zapisie logów

```powershell
# Upewnij się że folder logs ma prawidłowe permisje
$logDir = "D:\repo\ksef-pdf-generator_new\logs"
New-Item -ItemType Directory -Force -Path $logDir | Out-Null

# Ustaw uprawnienia dla użytkownika
icacls $logDir /grant "Administrators:(OI)(CI)F" /T
```

### Problem: PM2 monit wyświetla high CPU/Memory

```powershell
# Sprawdź czy aplikacja się zapętla
pm2 logs ksef-api

# Jeśli sporo błędów - najczęściej XML parsing issue
# Debuguj z: NODE_DEBUG=* pm2 start ecosystem.config.js

# Ustaw memory limit bardziej agresywnie
# W ecosystem.config.js: max_memory_restart: '300M'
```

## Checklista Producji

- [ ] PM2 zainstalowany globalnie
- [ ] pm2-windows-service zainstalowany
- [ ] ecosystem.config.js stworzony i testowany
- [ ] Aplikacja uruchomiona z `pm2 start ecosystem.config.js`
- [ ] Usługa systemowa zainstalowana i włączona
- [ ] `pm2 save` wykonane aby zachować konfigurację
- [ ] Logi kierowane do pliku (`logs/pm2-*.log`)
- [ ] Monit i health checks skonfigurowane
- [ ] Firewall rules otwarte
- [ ] Backup ecosystem.config.js wykonany
- [ ] Update procedure dokumentowana
- [ ] Alert system (email/Slack) skonfigurowany (PM2 Plus)

## Reference i Link

- PM2 Documentation: https://pm2.keymetrics.io/docs
- PM2 Windows Service: https://github.com/legion2002/pm2-windows-service
- PM2 Ecosystem Config: https://pm2.keymetrics.io/docs/usage/ecosystem-file
- Node.js Cluster Mode: https://nodejs.org/api/cluster.html
