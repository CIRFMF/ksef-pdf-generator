# Uruchamianie KSeF API w PM2 (Windows)

Ten plik opisuje, jak uruchomić dwie równoległe instancje API z wykorzystaniem PM2 oraz jak je kontrolować.

## 1. Instalacja zależności

```powershell
npm install
npm run build
```

PM2 jest zainstalowany jako zależność deweloperska, więc nie trzeba globalnej instalacji.

## 2. Start dwóch instancji

```powershell
npm run pm2:start
```

Skrypt `scripts/start-pm2-instances.cjs`:
- uruchamia `dist/api/server.cjs` dwukrotnie,
- przypisuje porty `5051` i `5052`,
- ustawia oddzielne katalogi logów (`logs/pm2-instance-1`, `logs/pm2-instance-2`),
- ustawia limit pamięci `--max-old-space-size=3072`,
- automatycznie restartuje procesy w razie awarii.

Po starcie sprawdź status:

```powershell
npm run pm2:status
```

lub `npx pm2 status`.

## 3. Zatrzymanie instancji

```powershell
npm run pm2:stop
```

Polecenie usuwa z PM2 procesy `ksef-api-1` i `ksef-api-2`. 

## 4. Logi

- PM2 standardowo zapisuje logi do `logs/pm2-instance-1/out.log` / `error.log` oraz analogicznie dla drugiej instancji.
- Logi aplikacji (np. `logs/api-2025-11-28.log`) pozostają bez zmian i są rozdzielane przez zmienną `LOG_DIR` ustawioną per instancja.

Podgląd logów w czasie rzeczywistym:

```powershell
npx pm2 logs ksef-api-1
npx pm2 logs ksef-api-2
```

## 5. Integracja z NGINX

Jeśli korzystasz z NGINX jako reverse proxy, dodaj instancje do bloku `upstream`:

```nginx
upstream ksef_api {
    server 127.0.0.1:5051;
    server 127.0.0.1:5052;
}
```

Dzięki temu NGINX równomiernie rozdzieli ruch między oba procesy. Możesz dodać kolejne instancje powtarzając wpisy w `instances` w skrypcie PM2.
