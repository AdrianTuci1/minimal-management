export class BecomeClientController {
    constructor(workspace, workspaceConfig) {
        this.workspace = workspace;
        this.workspaceConfig = workspaceConfig;
        this.selectedSubscription = null;
        this.isMobile = false;
        this.formData = {
            name: "",
            phone: "",
            email: "",
            birthDate: "",
            objectives: ""
        };
        this.listeners = new Set();

        // Mock subscription/packages data pentru fitness
        this.subscriptions = [
            {
                id: "standard",
                name: "Abonament Standard",
                description: "Acces nelimitat la sală, inclusiv toate zonele de antrenament și echipamentele.",
                price: 250,
                duration: "1 lună",
                features: ["Acces nelimitat", "Toate echipamentele", "Consultatii antrenori", "Program grup"],
                popular: false,
                available: true,
            },
            {
                id: "premium",
                name: "Abonament Premium",
                description: "Tot ce include Standard, plus antrenament personal și consultații nutriționale.",
                price: 450,
                duration: "1 lună",
                features: ["Tot din Standard", "Antrenament personal", "Consultatii nutriție", "Prioritate programare"],
                popular: true,
                available: true,
            },
            {
                id: "personal",
                name: "Pachet Antrenament Personal",
                description: "10 ședințe de antrenament personal cu un antrenor dedicat.",
                price: 1200,
                duration: "10 ședințe",
                features: ["10 ședințe personalizate", "Plan de antrenament", "Suport nutrițional", "Flexibilitate programare"],
                popular: false,
                available: true,
            },
            {
                id: "nutrition",
                name: "Consult Nutriție",
                description: "Consultație individuală cu nutriționist pentru plan alimentar personalizat.",
                price: 300,
                duration: "1 consultație",
                features: ["Plan alimentar", "Evaluare corp", "Consultatii follow-up", "Suport online"],
                popular: false,
                available: true,
            },
        ];

        // Bind methods
        this.selectSubscription = this.selectSubscription.bind(this);
        this.updateFormData = this.updateFormData.bind(this);
        this.setMobile = this.setMobile.bind(this);
        this.submitForm = this.submitForm.bind(this);
    }

    subscribe(listener) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    notify() {
        this.listeners.forEach(listener => listener());
    }

    get normalizedWorkspaceType() {
        return this.workspaceConfig?.id || this.workspace?.type;
    }

    get isFitness() {
        return this.normalizedWorkspaceType === "fitness";
    }

    selectSubscription(subscription) {
        this.selectedSubscription = subscription;
        this.notify();
    }

    updateFormData(field, value) {
        this.formData = { ...this.formData, [field]: value };
        this.notify();
    }

    setMobile(isMobile) {
        this.isMobile = isMobile;
        this.notify();
    }

    isFormValid() {
        if (this.isFitness) {
            return this.selectedSubscription !== null;
        } else {
            const hasName = this.formData.name.trim();
            const hasPhone = this.formData.phone.trim();
            const hasEmail = this.formData.email.trim();
            return hasName && hasPhone && hasEmail;
        }
    }

    submitForm() {
        if (!this.isFormValid()) return null;

        if (this.isFitness) {
            return {
                subscription: this.selectedSubscription,
                workspaceId: this.workspace.id
            };
        } else {
            return {
                ...this.formData,
                workspaceId: this.workspace.id
            };
        }
    }
}
