# REST API dla generatora PDF

REST API dla generowania PDF z faktur i UPO z plików XML.

## Uruchomienie

### Docker (zalecane)
```bash
# Zbuduj i uruchom
docker-compose up --build

# Uruchom w tle
docker-compose up -d

# Zatrzymaj
docker-compose down
```

### Lokalnie
```bash
# Zainstaluj zależności
npm install

# Uruchom API
npm run api

# Tryb development z auto-reload
npm run api:dev
```

API będzie dostępne pod adresem: http://localhost:3000

## Endpointy

### Health Check
```bash
GET /health
```

### Generowanie PDF faktury
```bash
POST /api/invoice/pdf
Content-Type: application/json

{
  "xml": "<xml string>",
  "additionalData": {
    // Opcjonalne dodatkowe dane
  }
}
```

Zwraca: PDF jako plik binarny

### Generowanie PDF UPO
```bash
POST /api/upo/pdf
Content-Type: application/json

{
  "xml": "<xml string>"
}
```

Zwraca: PDF jako plik binarny

## Przykład użycia z .NET

```csharp
using System.Net.Http;
using System.Text;
using System.Text.Json;

public class PdfGeneratorClient
{
    private readonly HttpClient _httpClient;
    private const string BaseUrl = "http://localhost:3000";

    public PdfGeneratorClient()
    {
        _httpClient = new HttpClient();
    }

    public async Task<byte[]> GenerateInvoicePdfAsync(string xmlContent, object additionalData = null)
    {
        var requestBody = new
        {
            xml = xmlContent,
            additionalData = additionalData
        };

        var json = JsonSerializer.Serialize(requestBody);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        var response = await _httpClient.PostAsync($"{BaseUrl}/api/invoice/pdf", content);
        response.EnsureSuccessStatusCode();

        return await response.Content.ReadAsByteArrayAsync();
    }

    public async Task<byte[]> GenerateUpoPdfAsync(string xmlContent)
    {
        var requestBody = new { xml = xmlContent };
        var json = JsonSerializer.Serialize(requestBody);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        var response = await _httpClient.PostAsync($"{BaseUrl}/api/upo/pdf", content);
        response.EnsureSuccessStatusCode();

        return await response.Content.ReadAsByteArrayAsync();
    }
}

// Użycie:
var client = new PdfGeneratorClient();
var xmlContent = File.ReadAllText("invoice.xml");
var pdfBytes = await client.GenerateInvoicePdfAsync(xmlContent);
File.WriteAllBytes("output.pdf", pdfBytes);
```

## Testowanie z curl

```bash
# Health check
curl http://localhost:3000/health

# Generowanie PDF faktury
curl -X POST http://localhost:3000/api/invoice/pdf \
  -H "Content-Type: application/json" \
  -d "{\"xml\": \"$(cat assets/invoice.xml | sed 's/"/\\"/g')\"}" \
  --output invoice.pdf

# Generowanie PDF UPO
curl -X POST http://localhost:3000/api/upo/pdf \
  -H "Content-Type: application/json" \
  -d "{\"xml\": \"$(cat assets/upo.xml | sed 's/"/\\"/g')\"}" \
  --output upo.pdf
```
