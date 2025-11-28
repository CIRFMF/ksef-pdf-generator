# Skrypty instalacyjne Windows Service

Rozszerzone skrypty do instalacji i odinstalowania aplikacji jako Windows Service.

## Instalacja (install-service.cjs)

### Instalacja domyślna

Logi będą w katalogu `aplikacja/logs`, port 3001:

```powershell
npm run install:service
```

### Instalacja z custom portem

```powershell
npm run install:service -- --port=5051
```

### Instalacja z custom katalogiem logów

```powershell
npm run install:service -- --log-dir="D:\custom\path\logs"
```

### Instalacja z oboma parametrami

```powershell
npm run install:service -- --port=5051 --log-dir="C:\MyLogs"
```

## Odinstalowanie (uninstall-service.cjs)

```powershell
npm run uninstall:service
```

Skrypt automatycznie:
1. Zatrzyma serwis
2. Odinstaluje serwis z systemu
3. Wyświetli informacje o sukcesie

## Zmienne środowiskowe

Skrypty ustawiają następujące zmienne:

| Zmienna | Wartość | Opis |
|---------|---------|------|
| `NODE_ENV` | `production` | Środowisko |
| `PORT` | `3001` (domyślnie) | Port API |
| `LOG_DIR` | `aplikacja/logs` (domyślnie) | Katalog logów |

## Wymagania

- PowerShell z uprawnieniami **Administrator**
- Node.js >= 18
- Aplikacja zbudowana (`npm run build`)

## Przykłady użycia

### Standardowa instalacja

```powershell
cd D:\repo\ksef-pdf-generator-api
npm run build
npm run install:service
```

Rezultat:
- Serwis: `KsefPdfGeneratorAPI`
- Port: `http://localhost:3001`
- Logi: `D:\repo\ksef-pdf-generator-api\logs\api-YYYY-MM-DD.log`

### Instalacja na porcie 8080 z logami na dysku C

```powershell
npm run install:service -- --port=8080 --log-dir="C:\Logs\KsefAPI"
```

Rezultat:
- Serwis: `KsefPdfGeneratorAPI`
- Port: `http://localhost:8080`
- Logi: `C:\Logs\KsefAPI\api-YYYY-MM-DD.log`

## Zarządzanie serwisem

### Sprawdzenie statusu

```powershell
Get-Service -Name "KsefPdfGeneratorAPI"
```

### Uruchomienie

```powershell
Start-Service -Name "KsefPdfGeneratorAPI"
```

### Zatrzymanie

```powershell
Stop-Service -Name "KsefPdfGeneratorAPI"
```

### Restart

```powershell
Restart-Service -Name "KsefPdfGeneratorAPI"
```

## Przeglądanie logów

### Ostatnie 50 linii dzisiejszych logów

```powershell
# Jeśli logi w katalogu aplikacji
Get-Content "D:\repo\ksef-pdf-generator-api\logs\api-$(Get-Date -Format yyyy-MM-dd).log" -Tail 50

# Jeśli custom ścieżka
Get-Content "C:\Logs\KsefAPI\api-$(Get-Date -Format yyyy-MM-dd).log" -Tail 50
```

### Monitoring real-time

```powershell
Get-Content "D:\repo\ksef-pdf-generator-api\logs\api-$(Get-Date -Format yyyy-MM-dd).log" -Wait
```

### Szukanie błędów

```powershell
Get-Content "D:\repo\ksef-pdf-generator-api\logs\api-*.log" | Select-String "ERROR"
```

## Zmiana konfiguracji

Aby zmienić konfigurację (port, logi):

1. Odinstaluj serwis
2. Zainstaluj z nowymi parametrami

```powershell
npm run uninstall:service
npm run install:service -- --port=9000 --log-dir="E:\Logs"
```

## Troubleshooting

### Problem: "Access Denied" lub brak uprawnień

Otwórz PowerShell z uprawnieniami Administrator:
- Kliknij prawym przyciskiem myszki na PowerShell
- Wybierz "Run as Administrator"

### Problem: Serwis się nie uruchamia

Sprawdź logi:
```powershell
Get-Content "D:\repo\ksef-pdf-generator-api\logs\api-$(Get-Date -Format yyyy-MM-dd).log"
```

Lub w Event Viewer:
```powershell
eventvwr.msc
# Windows Logs → Application
```

### Problem: Port już zajęty

```powershell
netstat -ano | Select-String ":3001"
```

Zainstaluj na innym porcie:
```powershell
npm run uninstall:service
npm run install:service -- --port=3002
```

### Problem: Nie mogę usunąć katalogu aplikacji

Upewnij się, że serwis jest odinstalowany:
```powershell
npm run uninstall:service
Get-Service -Name "KsefPdfGeneratorAPI" # Powinno dać błąd
```

## Notatki

- Katalog logów jest tworzony automatycznie jeśli nie istnieje
- Logi są segregowane po datach (`api-YYYY-MM-DD.log`)
- Każde żądanie ma unikalny ID dla śledzenia
- Maksymalny limit pamięci: 2GB (można zmienić w skrypcie)

## Przydatne linki

- [node-windows dokumentacja](https://github.com/coreybutler/node-windows)
- [Windows Services w PowerShell](https://learn.microsoft.com/en-us/powershell/scripting/samples/managing-services)
- [Logowanie API](../docs/API-LOGGING.md)
- [Windows Service - Setup](../docs/SETUP-WINDOWS-SERVICE.md)
