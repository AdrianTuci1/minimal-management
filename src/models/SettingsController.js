export class SettingsController {
    constructor(openDrawer) {
        this.openDrawer = openDrawer;
        this.listeners = new Set();

        // Settings options
        this.settingsOptions = [
            {
                id: "program",
                title: "Program si informatii clinica",
                description: "Gestioneaza programul de functionare si descrierea clinicii.",
                icon: "/info.png",
                drawerId: "settings-program"
            },
            {
                id: "language",
                title: "Limba",
                description: "Selecteaza limba implicita a platformei.",
                icon: "/ro_flag.webp",
                drawerId: "settings-language"
            },
            {
                id: "api-keys",
                title: "Chei API",
                description: "Gestioneaza cheile API pentru integrarea cu servicii externe.",
                icon: "/api.png",
                drawerId: "settings-api-keys"
            },
            {
                id: "smartbill",
                title: "Smart Bill",
                description: "Configureaza integrarea cu serviciul Smart Bill pentru facturare electronica.",
                icon: "/sb-logo.png",
                drawerId: "settings-smartbill"
            },
            {
                id: "appointments-page",
                title: "Pagina de programari",
                description: "Configureaza setarile pentru pagina de programari.",
                icon: "/appointment.png",
                drawerId: "settings-appointments-page"
            }
        ];

        // Bind methods
        this.handleSettingsClick = this.handleSettingsClick.bind(this);
    }

    subscribe(listener) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    notify() {
        this.listeners.forEach(listener => listener());
    }

    handleSettingsClick(drawerId) {
        this.openDrawer(drawerId, null, "edit");
    }
}
