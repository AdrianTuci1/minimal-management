import { processSubscriptionPayment } from "../services/subscriptionService"

export class SubscriptionPaymentController {
    constructor(workspaceId, subscription, workspace, workspaceConfig, navigate) {
        this.workspaceId = workspaceId;
        this.subscription = subscription;
        this.workspace = workspace;
        this.workspaceConfig = workspaceConfig;
        this.navigate = navigate;
        
        this.formData = {
            fullName: "",
            email: "",
            phone: "",
            dateOfBirth: "",
            objectives: "",
        };
        this.processing = false;
        this.error = null;
        
        this.listeners = new Set();

        // Bind methods
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.setProcessing = this.setProcessing.bind(this);
        this.setError = this.setError.bind(this);
    }

    subscribe(listener) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    notify() {
        this.listeners.forEach(listener => listener());
    }

    handleInputChange(field, value) {
        this.formData = { ...this.formData, [field]: value };
        this.notify();
    }

    setProcessing(processing) {
        this.processing = processing;
        this.notify();
    }

    setError(error) {
        this.error = error;
        this.notify();
    }

    get normalizedWorkspaceType() {
        return this.workspaceConfig?.id || this.workspace?.type;
    }

    get isFitness() {
        return this.normalizedWorkspaceType === "fitness";
    }

    hasValidSubscription() {
        return this.subscription !== null;
    }

    isFormValid() {
        return this.formData.fullName.trim() && 
               this.formData.email.trim() && 
               this.formData.phone.trim();
    }

    async handleSubmit() {
        if (!this.isFormValid()) {
            this.setError("Vă rugăm completați toate câmpurile obligatorii");
            return;
        }

        this.setProcessing(true);
        this.setError(null);

        try {
            // Procesează plata prin serviciu (care va face apel către backend)
            const result = await processSubscriptionPayment(this.workspaceId, this.subscription, this.formData);
            
            if (!result.success) {
                this.setError(result.error || "Eroare la procesarea plății");
                this.setProcessing(false);
                return;
            }

            // Navighează la pagina de confirmare cu token-ul temporar
            this.navigate(`/workspace/${this.workspaceId}/public/confirm-subscription/${result.confirmationToken}`, {
                state: {
                    subscription: this.subscription,
                    formData: this.formData,
                    clientId: result.clientId,
                    accessUrl: result.accessUrl,
                }
            });
        } catch (err) {
            console.error("Payment error:", err);
            this.setError("A apărut o eroare. Te rugăm să încerci din nou.");
            this.setProcessing(false);
        }
    }
}
