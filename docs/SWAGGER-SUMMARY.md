# 📚 Swagger/OpenAPI - GOTOWE

## Co zostało dodane

### 1. **Pakiety npm**
- ✅ `swagger-ui-express` - UI do dokumentacji
- ✅ `swagger-jsdoc` - Generowanie specyfikacji z JSDoc
- ✅ `@types/swagger-ui-express` - TypeScript types
- ✅ `@types/swagger-jsdoc` - TypeScript types

### 2. **Nowe pliki**

#### `src/api/swagger.ts` - Konfiguracja Swagger
- Definicja API (wersja, opis, serwery)
- Schematy komponentów (Health, Logs, Errors)
- Punkty do dokumentacji

#### `docs/API-SWAGGER.md` - Dokumentacja
- Jak dostać się do dokumentacji
- Testowanie endpoint'ów
- Konfiguracja
- Best practices

### 3. **Nowe endpointy w API**

#### `GET /docs` - Swagger UI
```
http://localhost:3001/docs
```

#### `GET /api-docs` - OpenAPI JSON
```
http://localhost:3001/api-docs
```

### 4. **Dokumentowane endpointy**

#### `GET /health`
- Status API
- Zwraca: `{ status, message, timestamp }`

#### `GET /logs?lines=50`
- Pobieranie ostatnich logów
- Parametr: `lines` (default 50)

#### `POST /generate-invoice`
- Główny endpoint
- Parametry: `file`, `additionalData`
- Zwraca: PDF

### 5. **Aktualizacje dokumentacji**
- `docs/API-README.md`
- `LOGGING-QUICKSTART.md`

## 🎯 Użycie

### Uruchomienie i dostęp do Swagger

```powershell
# Development
npm run dev:api
# Otwórz: http://localhost:3001/docs

# Production
npm run build
npm run start:api
# Otwórz: http://localhost:3001/docs
```

### Testowanie w Swagger UI

1. Kliknij na endpoint (np. `/health`)
2. Kliknij **"Try it out"**
3. Ustaw parametry (jeśli są)
4. Kliknij **"Execute"**
5. Zobaczysz odpowiedź

### Pobieranie specyfikacji OpenAPI

Specyfikacja JSON dostępna pod:
```
http://localhost:3001/api-docs
```

Można importować do:
- **Postman** - File → Import → Link
- **Insomnia** - Import from URL
- **Swagger Editor** - File → Import URL

## 📋 OpenAPI Specification

### Info
- **Tytuł**: KSEF PDF Generator API
- **Wersja**: 0.0.30
- **Opis**: API do generowania faktur PDF z danych XML

### Serwery
- http://localhost:3001 (Development)
- http://localhost:5051 (Production)

### Schematy
- **HealthResponse** - Odpowiedź health check
- **LogResponse** - Odpowiedź z logami
- **ErrorResponse** - Odpowiedź z błędem

## 🔧 Struktura dokumentacji

### JSDoc Komentarze

Każdy endpoint ma dokumentację w formacie OpenAPI:

```typescript
/**
 * @swagger
 * /endpoint:
 *   method:
 *     summary: Opis
 *     description: Pełny opis
 *     tags:
 *       - Category
 *     parameters: [...]
 *     requestBody: {...}
 *     responses: {...}
 */
```

### Tagi
- **System** - Health check
- **Logging** - Logi
- **Invoice** - Generowanie faktur

## 📚 Dokumentacja

- [Pełna dokumentacja](./docs/API-SWAGGER.md)
- [Logowanie](./docs/API-LOGGING.md)
- [Windows Service](./docs/SETUP-WINDOWS-SERVICE.md)
- [Szybki start](./LOGGING-QUICKSTART.md)

## ✨ Cechy

- ✅ **Automatyczna generacja** - Z JSDoc komentarzy
- ✅ **Interaktywne testy** - Testuj API z UI
- ✅ **Schematy** - Pełna walidacja danych
- ✅ **Przykłady** - Dla każdego endpoint'u
- ✅ **Błędy** - Dokumentacja kodów błędów
- ✅ **OpenAPI 3.0** - Standard branżowy

## 🚀 Scenariusze

### Scenariusz 1: Testowanie API
```powershell
npm run dev:api
# Otwórz http://localhost:3001/docs
# Testuj bezpośrednio w UI
```

### Scenariusz 2: Udostępnianie API
1. Build: `npm run build`
2. Start: `npm run start:api`
3. Dokumentacja: `http://serwer:3001/docs`

### Scenariusz 3: Importowanie do Postman'a
```powershell
# Postman → Import → Link
# Wklej: http://localhost:3001/api-docs
```

### Scenariusz 4: Generowanie kodu klienta
```powershell
# Z Swagger UI → Generate Client
# Wybierz język (JavaScript, Python, Java, itd.)
```

## 🔒 Produkcja

W production możesz chcieć wyłączyć Swagger:

```typescript
if (process.env.NODE_ENV !== 'production') {
  app.use('/docs', swaggerUi.serve);
  app.get('/docs', swaggerUi.setup(specs));
}
```

Lub włączyć z flagi:

```typescript
if (process.env.ENABLE_DOCS === 'true') {
  app.use('/docs', swaggerUi.serve);
  app.get('/docs', swaggerUi.setup(specs));
}
```

## 📊 Struktura plików

```
src/api/
  ├── server.ts          (serwer + JSDoc dokumentacji)
  ├── swagger.ts         (konfiguracja Swagger)
  ├── logger.ts          (logowanie)
  ├── middleware.ts      (middleware)
  └── ...

docs/
  ├── API-SWAGGER.md     (dokumentacja Swagger)
  ├── API-LOGGING.md     (dokumentacja logowania)
  └── ...
```

## 🎓 Nauczanie się

- [OpenAPI 3.0 Spec](https://spec.openapis.org/oas/v3.0.3)
- [Swagger UI Docs](https://github.com/swagger-api/swagger-ui)
- [JSDoc for OpenAPI](https://swagger.io/tools/swagger-jsdoc/)

---

**Gotowe!** API ma teraz profesjonalną, interaktywną dokumentację. 🎉

Otwórz http://localhost:3001/docs i zaczynaj testować! 🚀
