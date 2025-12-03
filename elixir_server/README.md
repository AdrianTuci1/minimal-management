# Display Sim Elixir WebSocket Server

Serverul Elixir pentru gestionarea conexiunilor WebSocket în timp real pentru aplicația Display Sim.

## Arhitectură

Serverul este construit folosind:
- **Elixir** cu **OTP** pentru concurență și toleranță la erori
- **Cowboy** pentru server HTTP și WebSocket
- **Registry** pentru a urmări conexiunile active
- **DynamicSupervisor** pentru a gestiona procesele dinamice

## Structură

```
elixir_server/
├── lib/
│   ├── application.ex         # Aplicația principală
│   ├── router.ex             # Router HTTP și WebSocket
│   ├── websocket_handler.ex  # Handler pentru conexiuni WebSocket
│   ├── websocket_supervisor.ex # Supervizor pentru conexiuni
│   └── connection.ex         # GenServer pentru fiecare conexiune
├── config/                # Configurări
├── test/                  # Teste
└── mix.exs               # Fișierul proiectului
```

## Funcționalități

### Gestionarea Conexiunilor WebSocket

1. **Autentificare**: Clienții se autentifică trimitând workspace_id și user_id
2. **Broadcast**: Mesajele pot fi trimise către toți utilizatorii dintr-un workspace
3. **Mesaje Directe**: Mesajele pot fi trimise către un utilizator specific
4. **Notificări**: Serverul primește notificări de la serverul Node.js

### API HTTP

Serverul expune endpoint-uri HTTP pentru comunicare cu serverul Node.js:

#### Health Check
- `GET /health` - Verifică starea serverului

#### Notificări
- `POST /api/workspaces/:workspace_id/notify` - Primește notificări despre schimbări
  - Body: `{"type": "create|update|delete", "entity": "Client|Staff|Service|Appointment", "data": {...}}`
  - Headers: `X-API-Key: your-api-key`

#### Broadcast
- `POST /api/workspaces/:workspace_id/broadcast` - Trimite mesaje către toți utilizatorii
  - Body: `{"message": "..."}`
  - Headers: `X-API-Key: your-api-key`

#### Mesaje Directe
- `POST /api/users/:user_id/message` - Trimite mesaje către un utilizator specific
  - Body: `{"message": "..."}`
  - Headers: `X-API-Key: your-api-key`

#### Utilizatori Conectați
- `GET /api/workspaces/:workspace_id/users` - Obține utilizatorii conectați
  - Headers: `X-API-Key: your-api-key`

#### WebSocket Endpoint
- `GET /ws` - Endpoint pentru conexiuni WebSocket

## Protocol WebSocket

### Autentificare
```json
{
  "type": "auth",
  "workspace_id": 123,
  "user_id": 456
}
```

### Răspuns la Autentificare
```json
{
  "type": "auth_success"
}
```

### Notificări de Schimbări
```json
{
  "type": "data_change",
  "entity": "Appointment",
  "action": "create",
  "data": {
    "id": "appt-123",
    "clientId": "client-456",
    "staffId": "staff-789",
    "serviceId": "service-101",
    "date": "2024-02-12",
    "startMinutes": 540,
    "duration": 60,
    "status": "nouă"
  }
}
```

### Broadcast
```json
{
  "type": "broadcast",
  "message": "Sistemul va fi în mentenanță în 10 minute"
}
```

### Mesaj Direct
```json
{
  "type": "direct_message",
  "message": "Programarea ta a fost confirmată"
}
```

## Instalare

```bash
cd elixir_server
mix deps.get
mix compile
```

## Configurare

1. Setează variabilele de mediu în `config/config.exs`:
   - `api_key` - Cheie pentru comunicare cu serverul Node.js
   - `cowboy_port` - Portul pentru serverul HTTP (default: 4000)

## Pornire

```bash
# Dezvoltare
mix phx.server

# Producție
mix release
```

## Testare

```bash
mix test
```

## Comunicare cu Serverul Node.js

Serverul Elixir primește notificări de la serverul Node.js prin HTTP și le distribuie clienților conectați prin WebSocket. Acest lucru permite sincronizarea datelor în timp real fără a necesita conexiuni directe între servere.

## Licență

MIT
