# Ghid de testare - Zona de client în ServicesView

## Pași pentru testare

### 1. Creează un workspace de tip fitness/hotel/clinică

1. Accesează dashboard-ul principal (`/`)
2. Creează un workspace nou:
   - Click pe "Creează workspace" sau folosește Spotlight (Cmd/Ctrl + K)
   - Selectează tipul: **"Sala de sport"** (fitness), **"Hotel"** sau **"Clinică"**
   - Introdu un nume (ex: "Sala Fitness Premium")
   - Creează workspace-ul

### 2. Devino client (înregistrare pentru abonament)

1. Accesează pagina publică a workspace-ului:
   - Navighează la `/workspace/{workspaceId}/public`
   - Sau click pe workspace în dashboard și apoi pe butonul "Devin-o client" / "Rezervă" / "Solicită o programare"

2. Selectează un abonament:
   - Pentru fitness: vezi opțiunile de abonamente (Standard, Premium, etc.)
   - Selectează unul și continuă

3. Completează datele personale:
   - Nume, email, telefon
   - Continuă către plată

4. Completează procesul de plată:
   - Vei primi un link de confirmare sau vei fi redirecționat la login

### 3. Autentifică-te ca client

1. După ce ai creat abonamentul, vei primi un link de acces sau un clientId
2. Navighează la `/workspace/{workspaceId}/client-login`
3. Introdu email-ul și parola (sau folosește Google OAuth)
4. După autentificare, sesiunea va fi salvată în localStorage

### 4. Testează ServicesView în Dashboard

1. Accesează Dashboard (`/`)
2. Navighează la **"Servicii"** în sidebar (sau accesează direct `/` cu `userType: "service_user"`)
3. Ar trebui să vezi:
   - Carduri pentru fiecare abonament activ
   - Un buton de expandare (chevron ▼/▲) pe fiecare card (doar dacă ești autentificat ca client)

### 5. Expandare card de serviciu

1. Click pe butonul de expandare (chevron) de pe un card
2. Ar trebui să vezi:
   - **Informații workspace**: adresă, telefon, email
   - **Acțiuni rapide**: butoane pentru programare/rezervare (în funcție de tipul workspace-ului)
   - **Datele mele**: nume, email, telefon din formularul de înregistrare

### 6. Testează acțiunile rapide

1. Click pe "Programează" (fitness/clinic) sau "Rezervă" (hotel)
2. Ar trebui să navigheze la pagina corespunzătoare
3. Click pe "Servicii" pentru a vedea toate serviciile disponibile

## Verificări importante

✅ **Autentificare**: Verifică în browser DevTools → Application → Local Storage → `clientSession`
- Ar trebui să existe o sesiune cu `workspaceId`, `email`, `clientId`

✅ **Date client**: Verifică `subscriptionClients` în Local Storage
- Ar trebui să existe date despre client cu `workspaceId`, `subscription`, `formData`

✅ **Expandare**: Butonul de expandare apare doar dacă:
- `isAuthenticated === true` (sesiune client activă)
- Email-ul din sesiune se potrivește cu email-ul din datele clientului

## Debugging

### Dacă nu vezi butonul de expandare:
1. Verifică dacă ești autentificat: `localStorage.getItem('clientSession')`
2. Verifică dacă există date client: `localStorage.getItem('subscriptionClients')`
3. Verifică în console dacă există erori

### Dacă datele nu se afișează corect:
1. Verifică că `clientDataMap` este populat corect în `useEffect`
2. Verifică că `workspaceId` din sesiune se potrivește cu `workspaceId` din datele clientului

### Testare rapidă (mock data):
Poți adăuga manual în localStorage pentru testare rapidă:

```javascript
// În browser console
localStorage.setItem('clientSession', JSON.stringify({
  token: 'test-token',
  workspaceId: 'workspace-123',
  email: 'test@example.com',
  clientId: 'client-123',
  createdAt: new Date().toISOString()
}))

localStorage.setItem('subscriptionClients', JSON.stringify({
  'client-123': {
    clientId: 'client-123',
    workspaceId: 'workspace-123',
    subscription: {
      name: 'Abonament Premium',
      description: 'Test subscription',
      price: 450,
      duration: '1 lună'
    },
    formData: {
      name: 'Test User',
      email: 'test@example.com',
      phone: '+40 123 456 789'
    },
    confirmed: true,
    confirmedAt: new Date().toISOString(),
    createdAt: new Date().toISOString()
  }
}))
```

Apoi refresh pagina și accesează ServicesView.

## Tipuri de workspace suportate

- ✅ **Fitness** (`sala-fitness` sau `fitness`)
- ✅ **Hotel** (`hotel`)
- ✅ **Clinică** (`clinica-dentara` sau `clinic`)

Toate folosesc același mecanism de expandare în ServicesView.

