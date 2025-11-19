Arhitectură (Design Pattern Principal):

Model-View-Controller (MVC) / Model-View-ViewModel (MVVM): Separați logica de afaceri (Modelul, care ar fi datele și starea nodurilor/conexiunilor), interfața grafică (View-ul, adică randarea nodurilor) și logica de interacțiune (Controller/ViewModel, care gestionează evenimentele de click, drag-and-drop, validări).

Logica Nodurilor (Design Pattern):

Strategy: Fiecare tip de nod (e.g., Trigger, Action, Logic) ar implementa o interfață (sau clasă abstractă) comună de Node Execution Strategy. Astfel, adăugarea de noi tipuri de noduri nu afectează codul de bază al editorului.

Command: Acțiunile utilizatorului (mutarea unui nod, conectarea, ștergerea) ar putea fi implementate ca obiecte Command pentru a facilita funcționalitățile de Undo/Redo.

Comunicarea Nodurilor (Design Pattern):

Observer: Un nod (Observabil/Subiect) notifică nodurile conectate (Observatori) când starea sau output-ul său se schimbă. Esențial pentru simularea fluxului de date și pentru depanare.

⚙️ 2. Documentația Funcțională (Functional Specification)
Descrie ce trebuie să facă editorul din perspectiva utilizatorului.

🧩 Funcționalitate Principală
Construire Fluxuri de Lucru (Workflows): Permite utilizatorilor să definească automatizări complexe prin conectarea vizuală a nodurilor.

Depanare și Simulare: Posibilitatea de a rula fluxul în mod simulat (sau real) și de a vizualiza datele care trec prin fiecare nod.

Salvare/Încărcare: Serializarea și deserializarea structurii nodurilor (graficului) într-un format ușor de stocat (ex: JSON).

🎨 Designul Interfeței (UX/UI)
Canvas (Pânza): O zonă de lucru infinită/scalabilă unde nodurile pot fi așezate și mutate (Drag-and-Drop).

Porturi (Ports): Puncte de intrare (Input) și ieșire (Output) pe fiecare nod, pentru a stabili conexiuni.

Conexiuni (Edges): Linii vizuale care unesc porturile. Trebuie să gestioneze logica tipurilor (e.g., nu poți conecta un nod de tip "Text" la un input care așteaptă un "Număr").

💻 Utilizare
Creare Nod: Un panou lateral (Palette) de unde nodurile pot fi trase pe canvas (posibil cu un Factory Pattern în spate).

Editare Nod: Dublu-click sau panou lateral de configurare pentru a seta parametrii specifici nodului.

Context Menu: Meniu rapid pentru a șterge, duplica sau dezactiva noduri/conexiuni.

🔌 3. Tipuri de Noduri (Node Types Document)
Descrie fiecare componentă ca o implementare a Strategy Pattern (așa cum am menționat mai sus).

Categoria 1: Noduri de Declencșare (Triggers / Sursa)

Funcționalitate: Pornesc fluxul de lucru. Nu au porturi de Input.

Exemple Attio: "When a Deal is Updated", "When a New Person is Added", "Webhook Received".

Categoria 2: Noduri de Acțiune (Actions / Efect)

Funcționalitate: Efectuează o operație într-un sistem (Attio sau extern). Au Input și Output de date (rezultatul acțiunii).

Exemple Attio: "Create Attio Record", "Send Email (via Mailchimp)", "Update Field".

Categoria 3: Noduri de Logică/Control (Control Flow)

Funcționalitate: Controlează fluxul de execuție.

Exemple: "If/Else (Switch)" (folosește datele de la input pentru a alege una dintre căile de output), "Delay", "Filter Data".

Categoria 4: Noduri de Transformare a Datelor (Data Transformation)

Funcționalitate: Modifică datele care trec.