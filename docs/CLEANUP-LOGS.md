# Automatyczne czyszczenie logów

System logowania tworzy nowe pliki logów każdego dnia. Aby zaoszczędzić miejsce na dysku, możesz skonfigurować automatyczne usuwanie logów starszych niż 30 dni.

## Ręczne czyszczenie

### Wyczyść logi z katalogu domyślnego

```powershell
npm run cleanup:logs
```

### Wyczyść logi z custom katalogu

```powershell
node scripts/cleanup-logs.cjs "D:\CustomLogs"
```

## Automatyczne czyszczenie - Windows Task Scheduler

### Krok 1: Otwórz Task Scheduler

```powershell
taskschd.msc
```

### Krok 2: Utwórz nowe zadanie

1. Kliknij **"Create Basic Task"** (lub "Utwórz zadanie podstawowe")
2. Nazwa: `KSEF API - Cleanup Logs`
3. Opis: `Automatic cleanup of logs older than 30 days`
4. Kliknij **Next**

### Krok 3: Ustaw harmonogram

1. Wybierz **"Daily"** (Codziennie)
2. Ustaw czas: np. `02:00:00` (2 rano)
3. Kliknij **Next**

### Krok 4: Ustaw akcję

1. Wybierz **"Start a program"**
2. Program: `node.exe`
3. Argumenty (arguments): 
   ```
   scripts\cleanup-logs.cjs
   ```
4. Uruchom w (Start in):
   ```
   D:\repo\ksef-pdf-generator-api
   ```
5. Kliknij **Next**

### Krok 5: Potwierdź

1. Zaznacz **"Open the Properties dialog for this task when I click Finish"**
2. Kliknij **Finish**

### Krok 6: Dodatkowe ustawienia (w Properties)

1. Przejdź do zakładki **"General"**
2. Zaznacz: **"Run with highest privileges"** (Uruchom z najwyższymi uprawnieniami)
3. Przejdź do zakładki **"Triggers"**
4. Edytuj trigger i zaznacz: **"Repeat task every: 1 day"**
5. Kliknij **OK**

## Zaawansowana konfiguracja - PowerShell

### Utwórz zadanie z PowerShell

```powershell
$taskName = "KSEF-API-Cleanup-Logs"
$taskPath = "\"
$action = New-ScheduledTaskAction -Execute "node.exe" -Argument "scripts\cleanup-logs.cjs" -WorkingDirectory "D:\repo\ksef-pdf-generator-api"
$trigger = New-ScheduledTaskTrigger -Daily -At 02:00AM
$settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -RunOnlyIfNetworkAvailable
$principal = New-ScheduledTaskPrincipal -UserID "NT AUTHORITY\SYSTEM" -LogonType ServiceAccount -RunLevel Highest

Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger -Settings $settings -Principal $principal -Force
```

### Sprawdź zadanie

```powershell
Get-ScheduledTask -TaskName "KSEF-API-Cleanup-Logs"
```

### Uruchom ręcznie

```powershell
Start-ScheduledTask -TaskName "KSEF-API-Cleanup-Logs"
```

### Usuń zadanie

```powershell
Unregister-ScheduledTask -TaskName "KSEF-API-Cleanup-Logs" -Confirm:$false
```

## Monitorowanie

### Przeglądaj historię zadania

W Task Scheduler:
1. Wybierz zadanie
2. Przejdź do zakładki **"History"**
3. Sprawdź ostatnie uruchomienia

### Logi zadania w Event Viewer

```powershell
eventvwr.msc
# Przejdź do: Windows Logs → System
# Szukaj zdarzeń z Source: "Task Scheduler"
```

## Konfiguracja zaawansowana

### Zmień okres przechowywania logów

Edytuj `scripts/cleanup-logs.cjs`:

```javascript
const daysToKeep = 30; // Zmień tutaj (np. na 60)
```

### Dodaj powiadomienie e-mail (opcjonalnie)

Task Scheduler nie ma natywnego wsparcia dla emaili, ale możesz:

1. Stworzyć PowerShell script który wysyła email
2. Zaplanować go po cleanup skrypcie

```powershell
# send-email-log.ps1
$EmailFrom = "admin@example.com"
$EmailTo = "admin@example.com"
$Subject = "KSEF API - Cleanup Logs Completed"
$Body = "Daily log cleanup task has been executed at $(Get-Date)"
$SMTPServer = "smtp.gmail.com"

Send-MailMessage -From $EmailFrom -To $EmailTo -Subject $Subject -Body $Body -SmtpServer $SMTPServer
```

## Troubleshooting

### Problem: Zadanie się nie uruchamia

1. Sprawdź czy ścieżka do `scripts\cleanup-logs.cjs` jest prawidłowa
2. Sprawdź czy Node.js jest dostępny w PATH
3. Uruchom ręcznie aby sprawdzić błędy:
   ```powershell
   cd D:\repo\ksef-pdf-generator-api
   node scripts/cleanup-logs.cjs
   ```

### Problem: Brak uprawnień do usunięcia pliku

- Upewnij się że Task Scheduler uruchamia się z uprawnieniami Administrator
- Sprawdź uprawnienia do katalogu logów

### Problem: Chcę sprawdzić co się będzie usuwać

Uruchom ręcznie:
```powershell
npm run cleanup:logs
```

## Statystyka logów

### Sprawdź rozmiar logów

```powershell
$logDir = "D:\repo\ksef-pdf-generator-api\logs"
$size = (Get-ChildItem $logDir -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
Write-Host "Rozmiar logów: $([Math]::Round($size, 2)) MB"
```

### Liczba plików logów

```powershell
$logDir = "D:\repo\ksef-pdf-generator-api\logs"
$count = (Get-ChildItem $logDir -Filter "api-*.log").Count
Write-Host "Liczba plików: $count"
```

## Podsumowanie

Dzięki automatycznemu czyszczeniu logów:
- ✅ Zaoszczędzasz miejsce na dysku
- ✅ Logi nie rosną nieskończenie
- ✅ Przechowujesz 30 dni historii
- ✅ Można łatwo zmienić okres przechowywania

---

**Rekomendacja**: Skonfiguruj czyszczenie logów w Task Scheduler, aby działało automatycznie codziennie.
