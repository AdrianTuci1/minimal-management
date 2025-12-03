# Display Sim Server

Serverul Node.js pentru aplicația Display Sim, care oferă API pentru managementul clinicilor dentare, sălilor de fitness și hotelurilor.

## Arhitectură

Serverul este construit folosind:
- **Node.js** cu **Express** pentru API
- **MongoDB** cu **Mongoose** pentru baza de date
- **JWT** pentru autentificare
- Comunicare **HTTP** cu serverul **Elixir** pentru funcționalități în timp real

## Structură

```
server/
├── src/
│   ├── controllers/     # Controllere pentru entități
│   ├── models/         # Modele de date Mongoose
│   ├── routes/         # Rute API
│   ├── middleware/     # Middleware (autentificare, etc.)
│   ├── services/       # Servicii (comunicare cu Elixir)
│   ├── config/         # Configurări
│   └── index.js       # Fișier principal
├── tests/             # Teste
├── docs/              # Documentație
└── package.json
```

## Entități

Sistemul gestionează patru entități principale:

1. **Workspace** - Configurația specifică fiecărui business (clinică, fitness, hotel)
2. **Client** - Clienți/Pacienți/Clienți hotel
3. **Staff** - Medici/Antrenori/Personal hotel
4. **Service** - Tratamente/Pachete/Servicii hotel
5. **Appointment** - Programări/Rezervări

## Flexibilitate între tipuri de business

Sistemul este proiectat pentru a fi flexibil, folosind:
- **Modele de date generice** cu câmpuri specifice pentru fiecare tip de business
- **Configurări dinamice** în funcție de tipul workspace-ului
- **Controllere generice** cu logică specifică pentru fiecare tip de business

## Instalare

```bash
cd server
npm install
```

## Configurare

1. Copiați `.env.example` în `.env`
2. Modificați variabilele de mediu:
   - `MONGODB_URI` - Conexiune la baza de date
   - `JWT_SECRET` - Secret pentru JWT
   - `ELIXIR_SERVER_URL` - URL-ul serverului Elixir
   - `ELIXIR_API_KEY` - Cheie API pentru comunicare cu Elixir

## Pornire

```bash
# Dezvoltare
npm run dev

# Producție
npm start
```

## API Endpoints

### Clienti
- `GET /api/workspaces/:workspaceId/clients` - Obține toți clienții
- `GET /api/workspaces/:workspaceId/clients/:id` - Obține un client
- `POST /api/workspaces/:workspaceId/clients` - Creează un client
- `PUT /api/workspaces/:workspaceId/clients/:id` - Actualizează un client
- `DELETE /api/workspaces/:workspaceId/clients/:id` - Șterge un client
- `GET /api/workspaces/:workspaceId/clients/upcoming` - Clienți cu programări viitoare
- `GET /api/workspaces/:workspaceId/clients/stats` - Statistici clienți

### Personal
- `GET /api/workspaces/:workspaceId/staff` - Obține tot personalul
- `GET /api/workspaces/:workspaceId/staff/:id` - Obține un membru al personalului
- `POST /api/workspaces/:workspaceId/staff` - Creează personal
- `PUT /api/workspaces/:workspaceId/staff/:id` - Actualizează personal
- `DELETE /api/workspaces/:workspaceId/staff/:id` - Șterge personal
- `GET /api/workspaces/:workspaceId/staff/:id/schedule` - Program de lucru
- `PUT /api/workspaces/:workspaceId/staff/:id/schedule` - Actualizează program
- `GET /api/workspaces/:workspaceId/staff/:id/availability` - Disponibilitate

### Servicii
- `GET /api/workspaces/:workspaceId/services` - Obține toate serviciile
- `GET /api/workspaces/:workspaceId/services/:id` - Obține un serviciu
- `POST /api/workspaces/:workspaceId/services` - Creează un serviciu
- `PUT /api/workspaces/:workspaceId/services/:id` - Actualizează un serviciu
- `DELETE /api/workspaces/:workspaceId/services/:id` - Șterge un serviciu
- `GET /api/workspaces/:workspaceId/services/category` - Servicii după categorie
- `GET /api/workspaces/:workspaceId/services/popular` - Servicii populare
- `GET /api/workspaces/:workspaceId/services/stats` - Statistici servicii

### Programări/Rezervări
- `GET /api/workspaces/:workspaceId/appointments` - Obține toate programările
- `GET /api/workspaces/:workspaceId/appointments/:id` - Obține o programare
- `POST /api/workspaces/:workspaceId/appointments` - Creează o programare
- `PUT /api/workspaces/:workspaceId/appointments/:id` - Actualizează o programare
- `DELETE /api/workspaces/:workspaceId/appointments/:id` - Șterge o programare
- `GET /api/workspaces/:workspaceId/appointments/date` - Programări pentru o dată
- `GET /api/workspaces/:workspaceId/appointments/period` - Programări pentru o perioadă
- `PUT /api/workspaces/:workspaceId/appointments/:id/confirm` - Confirmă o programare
- `PUT /api/workspaces/:workspaceId/appointments/:id/cancel` - Anulează o programare

## Comunicare cu serverul Elixir

Serverul Node.js comunică cu serverul Elixir prin HTTP pentru:
- Notificări despre schimbări în timp real
- Trimiterea de mesaje către utilizatori
- Obținerea utilizatorilor conectați

## Testare

```bash
npm test
```

## Licență

ISC
