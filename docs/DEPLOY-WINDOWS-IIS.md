# Deploy KSEF API na Windows Server - Opcja B: IIS + URL Rewrite

Przewodnik konfiguracji API KSEF jako reverse proxy za IIS (Internet Information Services) na Windows Server.

## Wymagania

- Windows Server 2016 lub nowszy
- IIS 10 lub nowszy
- Node.js LTS 18+ (zainstalowany z npm)
- KSEF API zbudowana (`npm run build`)
- Administrator privileges

## Krok 1: Instalacja ról i funkcji IIS

### 1.1 Otwórz Server Manager

```powershell
# Lub z menu Start: Server Manager
```

### 1.2 Dodaj role: Web Server (IIS)

1. W Server Manager kliknij **Add Roles and Features**
2. Przejdź do **Server Roles**
3. Zaznacz **Web Server (IIS)**
4. W oknie rozwijającym zaznacz:
   - **Web Server**
     - **Common HTTP Features**: Static Content, Default Document
     - **Performance**: Static Content Compression
   - **Application Development**: 
     - **CGI** (dla wsparcia aplikacji)
5. Kliknij **Next** i **Install**

### 1.3 Zainstaluj Role Services (opcjonalnie przydatne)

```powershell
# PowerShell (jako Administrator)
Add-WindowsFeature Web-Server, Web-Common-Http, Web-Static-Content
Add-WindowsFeature Web-Asp-Net45, Web-Mgmt-Console
```

## Krok 2: Instalacja URL Rewrite i Application Request Routing (ARR)

### 2.1 Pobierz i zainstaluj Web Platform Installer

Alternatywnie — pobierz instalery bezpośrednio:

**URL Rewrite Module 2.1:**
- Pobierz: https://www.iis.net/downloads/microsoft/url-rewrite
- Uruchom instalator `.msi`

**Application Request Routing 3.0:**
- Pobierz: https://www.iis.net/downloads/microsoft/application-request-routing
- Uruchom instalator `.msi`

### 2.2 Weryfikacja instalacji

1. Otwórz **IIS Manager** (inetmgr.exe)
2. Kliknij server w lewym panelu
3. Powinieneś zobaczyć ikonę **URL Rewrite** w środkowym panelu

## Krok 3: Konfiguracja Node.js Application jako usługi systemowej

### 3.1 Zainstaluj API KSEF jako usługę (opcja A — NSSM)

```powershell
# Lub użyj skryptu deploy-windows.ps1 (opcja A)
.\deploy-windows.ps1 -AppName "ksef-api" -Port 3001
```

Lub ręczna instalacja z NSSM:

```powershell
$repo = "D:\repo\ksef-pdf-generator_new"
$nssm = "C:\tools\nssm\nssm.exe"
$port = 3001

& $nssm install ksef-api "C:\Program Files\nodejs\node.exe" "$repo\dist\api\server.cjs"
& $nssm set ksef-api AppDirectory $repo
& $nssm set ksef-api AppEnvironmentExtra "NODE_ENV=production;PORT=$port"
& $nssm start ksef-api
```

### 3.2 Weryfikacja usługi

```powershell
# Sprawdź status
Get-Service -Name ksef-api

# Sprawdź czy słucha na porcie 3001
netstat -ano | findstr :3001
```

## Krok 4: Konfiguracja IIS jako Reverse Proxy

### 4.1 Włącz Application Request Routing (ARR)

1. Otwórz **IIS Manager**
2. Kliknij **Server Proxy Settings** w głównym panelu
   - Lub: Kliknij server → double-click "Application Request Routing" → Routing
3. Zaznacz **Enable proxy** → OK

### 4.2 Utwórz nową stronę internetową w IIS

1. W IIS Manager kliknij **Sites** (lewy panel)
2. Kliknij **Add Website** → Utwórz nową stronę:

```
Site name: ksef-api
Application pool: ksef-api (utwórz nowy)
Physical path: D:\repo\ksef-pdf-generator_new
Binding type: http
Host name: api.ksef.local (lub twoja domena)
Port: 80
```

3. Kliknij **OK**

### 4.3 Konfiguracja SSL (HTTPS) — Opcjonalnie ale Zalecane

1. Kliknij stronę **ksef-api** w IIS
2. Double-click **Bindings** (lewy panel)
3. Kliknij **Add** → Utwórz HTTPS binding:

```
Type: https
IP: All Unassigned (lub specyficzny IP)
Port: 443
SSL Certificate: (wybierz certyfikat)
```

4. Jeśli nie masz certyfikatu:
   - Wygeneruj self-signed: `New-SelfSignedCertificate -DnsName api.ksef.local -CertStoreLocation Cert:\LocalMachine\My`
   - Lub kup od CA (Let's Encrypt, Sectigo, itp.)

### 4.4 Konfiguracja URL Rewrite — Reverse Proxy Rules

1. Kliknij stronę **ksef-api** w IIS Manager
2. Double-click **URL Rewrite** (środkowy panel)
3. Kliknij **Add Rule(s)** → **Reverse Proxy**
4. Dialog **Add Reverse Proxy Rule**:

```
Server to proxy to (inbound): localhost:3001
Preserve host header in original request: ✓ (zaznacz)
```

5. Kliknij **OK**

#### Alternatywnie — Ręczna edycja web.config

Edytuj `D:\repo\ksef-pdf-generator_new\web.config`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <rule name="Reverse Proxy to Node.js API" stopProcessing="true">
          <match url="(.*)" />
          <conditions>
            <add input="{HTTP_HOST}" pattern="^api\.ksef\." />
          </conditions>
          <action type="Rewrite" url="http://localhost:3001/{R:1}" />
        </rule>
      </rules>
    </rewrite>
    <httpProtocol>
      <customHeaders>
        <add name="X-Forwarded-For" value="{REMOTE_ADDR}" />
        <add name="X-Forwarded-Proto" value="http" />
        <add name="X-Forwarded-Host" value="{HTTP_HOST}" />
      </customHeaders>
    </httpProtocol>
    <staticContent>
      <mimeMap fileExtension=".js" mimeType="application/javascript" />
    </staticContent>
  </system.webServer>
</configuration>
```

## Krok 5: Konfiguracja Application Pool (opcjonalnie)

1. W IIS Manager kliknij **Application Pools** (lewy panel)
2. Kliknij **ksef-api** → **Advanced Settings**:

```
.NET CLR version: No Managed Code
Process Model:
  - Identity: ApplicationPoolIdentity (lub LocalSystem)
  - Start Mode: AlwaysRunning
  - Idle Time-out: 20 (minuty)
Recycling:
  - Regular Time Interval: 1740 (29 godz.)
```

3. Kliknij **OK**

## Krok 6: Testowanie

### 6.1 Test lokalny

```powershell
# Sprawdź że Node.js API słucha
curl.exe -X POST http://localhost:3001/generate-invoice `
  -F "file=@D:\repo\ksef-pdf-generator_new\assets\invoice.xml" `
  -F "additionalData={`"nrKSeF`":`"TEST123`"}" `
  -o test.pdf

# Jeśli zwraca PDF - OK
```

### 6.2 Test przez IIS

```powershell
# Jeśli skonfigurowałeś DNS host api.ksef.local
curl.exe -X POST http://api.ksef.local/generate-invoice `
  -F "file=@D:\repo\ksef-pdf-generator_new\assets\invoice.xml" `
  -F "additionalData={`"nrKSeF`":`"TEST123`"}" `
  -o test2.pdf

# Lub przez https
curl.exe -X POST https://api.ksef.local/generate-invoice `
  -F "file=@D:\repo\ksef-pdf-generator_new\assets\invoice.xml" `
  -F "additionalData={`"nrKSeF`":`"TEST123`"}" `
  -o test3.pdf
```

### 6.3 Sprawdzenie logów

```powershell
# IIS logs
Get-Content "C:\inetpub\logs\LogFiles\W3SVC1\u_*.log" -Tail 20

# Node.js logs (jeśli używasz NSSM)
Get-Content "D:\repo\ksef-pdf-generator_new\logs\stderr.log" -Tail 50
```

## Krok 7: Konfiguracja Firewall

```powershell
# Pozwól na ruch HTTP/HTTPS
New-NetFirewallRule -DisplayName "IIS HTTP" -Direction Inbound -LocalPort 80 -Protocol TCP -Action Allow
New-NetFirewallRule -DisplayName "IIS HTTPS" -Direction Inbound -LocalPort 443 -Protocol TCP -Action Allow

# Wewnętrzne — Node.js na porcie 3001 (tylko z localhost)
New-NetFirewallRule -DisplayName "Node.js API Internal" -Direction Inbound -LocalPort 3001 -Protocol TCP -LocalAddress 127.0.0.1 -Action Allow
```

## Troubleshooting

### Problem: "502 Bad Gateway"

**Przyczyna**: Node.js API nie słucha lub nie jest dostępny

```powershell
# Sprawdzenie 1: Czy Node.js usługa działa?
Get-Service -Name ksef-api

# Sprawdzenie 2: Czy łączy się na localhost:3001?
Test-NetConnection -ComputerName localhost -Port 3001

# Sprawdzenie 3: Czy URL Rewrite reguła jest poprawna?
# W IIS Manager → ksef-api → URL Rewrite → Przejrzyj reguły
```

### Problem: "Premature termination of header"

**Przyczyna**: Czasami ARR i Node.js mają konflikt w headers

```powershell
# Rozwiązanie: Edytuj web.config i dodaj
<httpProtocol>
  <customHeaders>
    <add name="X-Forwarded-For" value="{REMOTE_ADDR}" />
    <add name="X-Forwarded-Proto" value="http" />
  </customHeaders>
</httpProtocol>
```

### Problem: CORS błędy

**Przyczyna**: IIS dodaje headers które kolidują z CORS

```powershell
# Usuń cache IIS
# IIS Manager → ksef-api → Output Caching → nie zaznaczaj dla POST
```

### Problem: SSL/HTTPS nie działa

```powershell
# Sprawdź czy certyfikat jest przypisany
Get-NetIPHttpsCertBinding

# Jeśli brak, dodaj:
New-NetIPHttpsCertBinding -IpPort 0.0.0.0:443 -CertificateHash "THUMBPRINT_CERT" -ApplicationId "{12345678...}"
```

## Producja — Checklist

- [ ] Node.js API działa jako usługa (NSSM)
- [ ] IIS ma rolę Web Server
- [ ] URL Rewrite i ARR zainstalowane
- [ ] Reverse Proxy reguła skonfigurowana
- [ ] SSL/HTTPS certyfikat zainstalowany
- [ ] Firewall rules otwarte
- [ ] DNS rrekord A wskazuje na serwer
- [ ] Logi monitorowane (stdout.log, stderr.log)
- [ ] Backup konfiguracji: `C:\inetpub\history`
- [ ] Auto-restart usługi skonfigurowany

## Reference

- IIS URL Rewrite: https://docs.microsoft.com/en-us/iis/extensions/url-rewrite-module/using-url-rewrite-module-20
- ARR: https://docs.microsoft.com/en-us/iis/extensions/application-request-routing-arr
- Node.js na Windows: https://nodejs.org/en/docs/guides/nodejs-on-windows/
