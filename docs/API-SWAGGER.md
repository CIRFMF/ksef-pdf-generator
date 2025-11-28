# Swagger/OpenAPI - Dokumentacja API

Aplikacja zawiera wbudowaną dokumentację interaktywną API zbudowaną z wykorzystaniem Swagger (OpenAPI 3.0).

## 🚀 Dostęp do dokumentacji

### Development

```powershell
npm run dev:api
# Otwórz: http://localhost:3001/docs
```

### Production

```powershell
npm run start:api
# Otwórz: http://localhost:3001/docs
```

### Po zainstalowaniu jako Windows Service

```
http://localhost:3001/docs
# lub http://localhost:5051/docs (jeśli zmieniony port)
```

## 📚 Dostępne endpointy w dokumentacji

### 1. **Health Check** - `GET /health`
- Sprawdzenie, czy API jest aktywne
- Zwraca status, wiadomość i timestamp

### 2. **Get Logs** - `GET /logs?lines=50`
- Pobieranie ostatnich logów
- Parametr `lines` - liczba linii (default 50)
- Przydatne do debugowania

### 3. **Generate Invoice** - `POST /generate-invoice`
- **Główny endpoint** do generowania faktur PDF
- Parametry:
  - `file` (required) - Plik XML z danymi faktury
  - `additionalData` (required) - JSON z dodatkowymi danymi (np. nrKSeF)
- Zwraca plik PDF

## 🧪 Testowanie z Swagger UI

### Testuj endpoint `/health`

1. Otwórz http://localhost:3001/docs
2. Kliknij na **Health Check**
3. Kliknij **"Try it out"**
4. Kliknij **"Execute"**
5. Zobaczysz odpowiedź

### Testuj endpoint `/generate-invoice`

1. Otwórz http://localhost:3001/docs
2. Kliknij na **Generate Invoice**
3. Kliknij **"Try it out"**
4. Załaduj plik XML: `assets/invoice.xml`
5. Wpisz dodatkowe dane:
   ```json
   {
     "nrKSeF": "123456789012345678"
   }
   ```
6. Kliknij **"Execute"**
7. Pobierz wygenerowany PDF

## 📋 OpenAPI JSON

Specyfikacja OpenAPI dostępna pod:
```
http://localhost:3001/api-docs
```

Możesz zaimportować tę specyfikację do:
- Postman (Import → Link)
- Insomnia
- Other OpenAPI clients

### Importuj do Postman'a

1. Otwórz Postman
2. **File** → **Import**
3. Wklej URL: `http://localhost:3001/api-docs`
4. Kliknij **Import**

## 🎯 Cechy dokumentacji

✅ **Automatyczna generacja** - Z JSDoc komentarzy w kodzie
✅ **Interaktywne testy** - Testuj API bezpośrednio z Swagger UI
✅ **Schema validation** - Walidacja parametrów
✅ **Przykłady** - Przykładowe wartości dla każdego endpoint'u
✅ **Błędy** - Dokumentacja kodów błędów (400, 404, 500)
✅ **Tagi** - Logiczna organizacja endpoint'ów

## 📝 Struktura dokumentacji

### Systemu
- Health Check - Status API

### Logging
- Get Logs - Pobieranie logów

### Invoice
- Generate Invoice - Generowanie faktur

## 🔧 Dodawanie nowych endpoint'ów do dokumentacji

Każdy nowy endpoint powinien mieć JSDoc komentarz w `src/api/server.ts`:

```typescript
/**
 * @swagger
 * /my-endpoint:
 *   post:
 *     summary: Opis endpoint'u
 *     description: Pełny opis
 *     tags:
 *       - Category
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               field:
 *                 type: string
 *             required:
 *               - field
 *     responses:
 *       200:
 *         description: Sukces
 *       400:
 *         description: Błąd
 */
app.post('/my-endpoint', (req, res) => {
  // ...
});
```

## 📚 Konfiguracja Swagger

Konfiguracja znajduje się w `src/api/swagger.ts`:

```typescript
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'KSEF PDF Generator API',
      version: '0.0.30',
      // ...
    },
    servers: [
      { url: 'http://localhost:3001' },
      { url: 'http://localhost:5051' }
    ]
  },
  apis: ['./src/api/server.ts']
};
```

### Zmiana informacji

1. Edytuj `src/api/swagger.ts`
2. Zmień właściwości w `definition.info`
3. Zbuduj: `npm run build`
4. Zrestart serwer

## 🚀 Użycie z npm

```powershell
# Development
npm run dev:api
# Swagger dostępny na: http://localhost:3001/docs

# Production
npm run build
npm run start:api
# Swagger dostępny na: http://localhost:3001/docs
```

## 🌐 Dostęp do dokumentacji

| Typ | URL | Port |
|-----|-----|------|
| Swagger UI | `/docs` | 3001 (dev) |
| OpenAPI JSON | `/api-docs` | 3001 (dev) |
| Swagger UI | `/docs` | 5051 (prod) |
| OpenAPI JSON | `/api-docs` | 5051 (prod) |

## 🔒 Bezpieczeństwo

Swagger UI w production powinno być:
- Chroniące hasłem (jeśli publicznie dostępne)
- Umieszczone za reverse proxy
- Wyłączone w produkcji (opcjonalnie)

Aby wyłączyć Swagger w produkcji, edytuj `src/api/server.ts`:

```typescript
if (process.env.NODE_ENV !== 'production') {
  app.use('/docs', swaggerUi.serve);
  app.get('/docs', swaggerUi.setup(specs));
}
```

## 🎓 Nauczanie się

### REST API Best Practices
- Czytaj komentarze w endpoint'ach
- Sprawdź przykładowe wartości
- Testuj verschiedne kody odpowiedzi

### OpenAPI Standard
- [OpenAPI 3.0 Spec](https://spec.openapis.org/oas/v3.0.3)
- [Swagger/OpenAPI Guide](https://swagger.io/tools/swagger-ui/)

## 💡 Porady

1. **Testuj w Swagger UI** - Najłatwiej debugować
2. **Importuj do Postman** - Do bardziej zaawansowanych testów
3. **Czytaj schematy** - Dokładnie definiują oczekiwane dane
4. **Sprawdzaj kody błędów** - Każdy endpoint dokumentuje możliwe błędy

---

**Gotowe!** API ma teraz pełną dokumentację interaktywną. 🎉
