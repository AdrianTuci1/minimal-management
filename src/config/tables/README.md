# Configurații Tabele pe Tipuri de Workspace

Acest folder conține configurațiile de tabele specifice fiecărui tip de workspace.

## Structura

```
tables/
├── clinic/          # Configurații pentru clinică dentară
│   ├── tableColumns.js
│   └── index.js
├── hotel/           # Configurații pentru hotel
│   ├── tableColumns.js
│   └── index.js
└── fitness/         # Configurații pentru sală de fitness (pentru viitor)
```

## Utilizare

Configurațiile sunt importate și utilizate în `tableColumns.js` prin funcțiile `getTableColumns()` și `getFilterColumns()`:

```javascript
import { getTableColumns } from "@/config/tableColumns"
import useWorkspaceConfig from "@/hooks/useWorkspaceConfig"

const { workspaceType } = useWorkspaceConfig()
const columns = getTableColumns("pacienti", workspaceType)
```

## Tipuri de workspace

### Clinic (`clinic/`)
- **Coloane**: Pacient, Contact, Programare, De plată
- **Medici**: Medic, Specializare, Status, Pacienți azi, Tratamente active, Cabinet
- **Tratamente**: Cod, Nume, Durată, Medic recomandat, Preț, Status
- **Programări**: Pacient, Medic, Tratament, Oră, Durată, Status

### Hotel (`hotel/`)
- **Coloane**: Client, Contact, Rezervare, De plată
- **Personal**: Personal, Departament, Status, Clienți azi, Servicii active, Sector
- **Servicii**: Cod, Nume, Durată, Personal recomandat, Preț, Status
- **Rezervări**: Client, Cameră, Serviciu, Check-in, Durată (zile), Status

### Fitness (`fitness/`)
- **Status**: Pentru viitor
- **Default**: Folosește configurația clinic până la implementare

## Adăugare tip nou de workspace

Pentru a adăuga un nou tip de workspace:

1. Creează folder-ul în `tables/[tip]/`
2. Creează `tableColumns.js` cu configurațiile specifice
3. Creează `index.js` cu export
4. Adaugă configurația în `tableColumns.js` în `workspaceTableConfigs`

