# Whiteboards

Acest folder conține componentele whiteboard specifice fiecărui tip de workspace.

## Structura

```
whiteboards/
├── clinic/          # Whiteboard pentru clinică dentară
│   ├── Whiteboard.jsx
│   └── index.js
├── hotel/           # Whiteboard pentru hotel
│   ├── HotelWhiteboard.jsx
│   └── index.js
└── fitness/         # Whiteboard pentru sală de fitness
    ├── FitnessWhiteboard.jsx
    └── index.js
```

## Tipuri de workspace

### Clinic (`clinic/`)
- **Layout**: Vertical cu timeline pe stânga
- **Axă verticală**: Timpul (ore)
- **Axă orizontală**: Medici (coloane)
- **Unitate**: Programări pe intervale de 15 minute
- **Funcționalități**: Drag & drop cu snap la 15 minute

### Hotel (`hotel/`)
- **Layout**: Orizontal cu timeline pe sus
- **Axă verticală**: Camere (rânduri)
- **Axă orizontală**: Zile (2 săptămâni)
- **Unitate**: Rezervări pe zile
- **Funcționalități**: Drag & drop cu snap la 1 zi

### Fitness (`fitness/`)
- **Status**: Implementat
- **Layout**: Vertical cu timeline pe stânga
- **Axă verticală**: Timpul (ore)
- **Axă orizontală**: Clienți (coloane)
- **Unitate**: Programări pe intervale de 15 minute
- **Funcționalități**: Drag & drop cu snap la 15 minute

## Utilizare

Whiteboard-urile sunt importate și utilizate în `WorkspaceView.jsx` bazat pe tipul workspace-ului:

```javascript
import Whiteboard from "../whiteboards/clinic/Whiteboard"
import HotelWhiteboard from "../whiteboards/hotel/HotelWhiteboard"
import FitnessWhiteboard from "../whiteboards/fitness/FitnessWhiteboard"

// În renderMainContent:
if (config.id === "hotel") {
  return <HotelWhiteboard ... />
}
if (config.id === "fitness") {
  return <FitnessWhiteboard ... />
}
return <Whiteboard ... />
```

## Adăugare tip nou de workspace

Pentru a adăuga un nou tip de workspace:

1. Creează folder-ul în `whiteboards/[tip]/`
2. Creează componenta whiteboard
3. Creează `index.js` cu export
4. Adaugă configurația în `workspaceConfig.js`
5. Actualizează `WorkspaceView.jsx` pentru a folosi noul whiteboard

