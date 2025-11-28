# 🧹 Automatyczne czyszczenie logów - GOTOWE

## Co zostało dodane

### 1. **`scripts/cleanup-logs.cjs`** - Skrypt czyszczenia
Automatyczne usuwanie logów starszych niż 30 dni
- ✅ Usuwanie logów starszych niż X dni
- ✅ Wyświetlanie statystyki usunięcia
- ✅ Bezpieczne obsługiwanie błędów
- ✅ Obsługa custom katalogu logów

### 2. **npm script** - `cleanup:logs`
```powershell
npm run cleanup:logs
```

### 3. **`docs/CLEANUP-LOGS.md`** - Dokumentacja
Pełna instrukcja do:
- Ręcznego czyszczenia logów
- Zaplanowania w Task Scheduler (codziennie)
- Zaawansowanej konfiguracji z PowerShell
- Monitorowania

### 4. **Aktualizacja `LOGGING-QUICKSTART.md`**
Dodana sekcja o czyszczeniu logów

## 🎯 Użycie

### Ręczne czyszczenie

```powershell
# Wyczyść logi starsze niż 30 dni z katalogu domyślnego
npm run cleanup:logs

# LUB wyczyść z custom katalogu
node scripts/cleanup-logs.cjs "D:\CustomLogs"
```

### Automatyczne czyszczenie

1. Otwórz Task Scheduler: `taskschd.msc`
2. Utwórz nowe zadanie
3. Ustaw program: `node.exe`
4. Ustaw argumenty: `scripts\cleanup-logs.cjs`
5. Katalog: `D:\repo\ksef-pdf-generator-api`
6. Harmonogram: Codziennie o 2:00 AM

**Lub za jedną komendą PowerShell:**
```powershell
$taskName = "KSEF-API-Cleanup-Logs"
$taskPath = "\"
$action = New-ScheduledTaskAction -Execute "node.exe" -Argument "scripts\cleanup-logs.cjs" -WorkingDirectory "D:\repo\ksef-pdf-generator-api"
$trigger = New-ScheduledTaskTrigger -Daily -At 02:00AM
$settings = New-ScheduledTaskSettingsSet -StartWhenAvailable
$principal = New-ScheduledTaskPrincipal -UserID "NT AUTHORITY\SYSTEM" -LogonType ServiceAccount -RunLevel Highest

Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger -Settings $settings -Principal $principal -Force
```

## 📊 Przykładowy output

```
🧹 Czyszczenie logów starszych niż 30 dni
📂 Katalog: D:\repo\ksef-pdf-generator-api\logs

📊 Znaleziono 95 plików logów

✓ Usunięto: api-2025-10-28.log (256.45 KB, data: 2025-10-28)
✓ Usunięto: api-2025-10-29.log (312.67 KB, data: 2025-10-29)
✓ Usunięto: api-2025-10-30.log (189.23 KB, data: 2025-10-30)
...

✅ Proces czyszczenia ukończony
📊 Usunięto 65 plików (2048.54 MB)
📁 Pozostało 30 plików
```

## 🔧 Konfiguracja

### Zmień okres przechowywania

Edytuj `scripts/cleanup-logs.cjs`:
```javascript
const daysToKeep = 30; // Zmień np. na 60 dla 60 dni
```

### Zmień harmonogram (automatyczne czyszczenie)

W Task Scheduler:
1. Kliknij prawym przyciskiem na zadanie
2. Properties
3. Triggers → Edit
4. Ustaw nowy harmonogram

## ✅ Korzyści

- ✅ **Zaoszczędzenie miejsca** - Logi nie rosną nieskończenie
- ✅ **Automatyzacja** - Czyszczenie bez interwencji
- ✅ **Historia** - Zachowanie 30 dni logów
- ✅ **Elastyczność** - Łatwo zmienić okres przechowywania
- ✅ **Monitorowanie** - Statystyka usunięcia

## 📚 Dokumentacja

- **Pełna instrukcja**: `docs/CLEANUP-LOGS.md`
- **Szybki start**: `LOGGING-QUICKSTART.md`
- **Czyszczenie logów**: `scripts/cleanup-logs.cjs`

## 🎯 Scenariusze

### Scenariusz 1: Ręczne czyszczenie co tydzień
```powershell
# Dodaj do przypomnienia/kalendarza co tydzień
npm run cleanup:logs
```

### Scenariusz 2: Automatyczne czyszczenie codziennie
```powershell
# Skonfiguruj w Task Scheduler
# Zaplanuj na 2:00 AM
```

### Scenariusz 3: Archiwiowanie zamiast usuwania
```powershell
# Stwórz backup starych logów na inny dysk
# Potem uruchom cleanup:logs
```

---

**Gotowe!** System czyszczenia logów jest teraz pełnie skonfigurowany i testowany. 🎉
