# 📝 Podsumowanie rozbudowy skryptów instalacyjnych

## Co się zmieniło

### 🔧 Rozbudowane skrypty

#### `scripts/install-service.cjs`

**Nowe możliwości:**
- Pobieranie argumentów z linii poleceń (`--port`, `--log-dir`)
- Wyświetlanie konfiguracji przed instalacją
- Automatyczne tworzenie katalogu logów
- Dynamiczne ustawienie zmiennych środowiskowych
- Informacja o lokalizacji logów po instalacji

**Użycie:**
```powershell
# Domyślnie
npm run install:service

# Z custom portem
npm run install:service -- --port=5051

# Z custom katalogiem logów
npm run install:service -- --log-dir="D:\Logs"

# Z oboma parametrami
npm run install:service -- --port=5051 --log-dir="D:\Logs"
```

#### `scripts/uninstall-service.cjs`

**Ulepszenia:**
- Lepsze komunikaty (⚠️ prefix)
- Informacja o możliwości usunięcia katalogu po odinstalowaniu

### 📚 Nowa dokumentacja

#### `scripts/INSTALL-SERVICE-README.md`
Szczegółowy przewodnik z:
- Przykładami instalacji (domyślna, z portem, z logami)
- Poleceniami zarządzania serwisem
- Przeglądaniem logów
- Troubleshootingiem

#### Aktualizacja `docs/SETUP-WINDOWS-SERVICE.md`
- Nowa sekcja "Zmiana portu i katalogu logów"
- Przykłady instalacji z parametrami
- Informacja o lokalizacji logów (aplikacja/logs zamiast C:\logs)

#### Aktualizacja `LOGGING-QUICKSTART.md`
- Nowe polecenia instalacji z parametrami

## 📂 Domyślne lokalizacje

### Przed zmianami
```
C:\logs\ksef-api\api-YYYY-MM-DD.log
```

### Po zmianach (domyślnie)
```
aplikacja/logs/api-YYYY-MM-DD.log
```

Jeśli aplikacja jest w `D:\repo\ksef-pdf-generator-api`:
```
D:\repo\ksef-pdf-generator-api\logs\api-2025-11-27.log
```

## 🎯 Przykłady użycia

### Scenariusz 1: Standardowa instalacja
```powershell
npm run install:service
# Rezultat:
# - Port: 3001
# - Logi: D:\repo\ksef-pdf-generator-api\logs\
```

### Scenariusz 2: Instalacja na porcie 8080
```powershell
npm run install:service -- --port=8080
# Rezultat:
# - Port: 8080
# - Logi: D:\repo\ksef-pdf-generator-api\logs\
```

### Scenariusz 3: Instalacja z logami na dysku C
```powershell
npm run install:service -- --log-dir="C:\Logs\KsefAPI"
# Rezultat:
# - Port: 3001
# - Logi: C:\Logs\KsefAPI\
```

### Scenariusz 4: Pełna konfiguracja
```powershell
npm run install:service -- --port=9000 --log-dir="E:\AppLogs\Ksef"
# Rezultat:
# - Port: 9000
# - Logi: E:\AppLogs\Ksef\
```

## 🔄 Zmiana konfiguracji

Aby zmienić konfigurację istniejącego serwisu:

```powershell
# 1. Odinstaluj
npm run uninstall:service

# 2. Zainstaluj z nowymi parametrami
npm run install:service -- --port=9000 --log-dir="E:\Logs"
```

## 🛡️ Bezpieczeństwo

- Katalogu logów jest tworzony automatycznie z uprawnieniami serwisu
- Serwis uruchamia się z uprawnieniami systemu
- Rekomendacja: Katalog logów poza głównym katalogiem aplikacji

## 📊 Zmienne środowiskowe ustawiane automatycznie

| Zmienna | Wartość |
|---------|---------|
| `NODE_ENV` | `production` |
| `PORT` | `3001` (lub podany `--port=`) |
| `LOG_DIR` | `aplikacja/logs` (lub podany `--log-dir=`) |

## ✅ Checklist instalacji

- [ ] Aplikacja zbudowana (`npm run build`)
- [ ] PowerShell z uprawnieniami Administrator
- [ ] Wybrany port (domyślnie 3001)
- [ ] Wybrany katalog logów (domyślnie aplikacja/logs)
- [ ] Wykonana komenda `npm run install:service -- --port=XXXX --log-dir="YYYYY"`
- [ ] Serwis pojawił się w Services (services.msc)
- [ ] Serwis się uruchomił
- [ ] Logi są tworzone w wybranym katalogu

## 🔗 Powiązane dokumenty

- [LOGGING-QUICKSTART.md](../LOGGING-QUICKSTART.md)
- [docs/API-LOGGING.md](../docs/API-LOGGING.md)
- [docs/SETUP-WINDOWS-SERVICE.md](../docs/SETUP-WINDOWS-SERVICE.md)
- [scripts/INSTALL-SERVICE-README.md](./INSTALL-SERVICE-README.md)

---

**Gotowe!** Skrypty instalacyjne są teraz w pełnie konfigurowalne. 🎉
