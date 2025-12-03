import { getConfirmationToken, markConfirmationTokenAsUsed } from "../services/subscriptionService"

export class ConfirmSubscriptionController {
    constructor(workspaceId, token, workspace, workspaceConfig) {
        this.workspaceId = workspaceId;
        this.token = token;
        this.workspace = workspace;
        this.workspaceConfig = workspaceConfig;
        
        this.tokenData = null;
        this.loading = true;
        this.error = null;
        
        this.listeners = new Set();

        // Bind methods
        this.loadTokenData = this.loadTokenData.bind(this);
        this.setLoading = this.setLoading.bind(this);
        this.setError = this.setError.bind(this);
        this.setTokenData = this.setTokenData.bind(this);
        this.handleOpenLink = this.handleOpenLink.bind(this);
    }

    subscribe(listener) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    notify() {
        this.listeners.forEach(listener => listener());
    }

    setLoading(loading) {
        this.loading = loading;
        this.notify();
    }

    setError(error) {
        this.error = error;
        this.notify();
    }

    setTokenData(data) {
        this.tokenData = data;
        this.notify();
    }

    get normalizedWorkspaceType() {
        return this.workspaceConfig?.id || this.workspace?.type;
    }

    get isFitness() {
        return this.normalizedWorkspaceType === "fitness";
    }

    get subscription() {
        return this.tokenData?.clientData?.subscription;
    }

    get clientId() {
        return this.tokenData?.clientId;
    }

    get accessUrl() {
        if (!this.clientId) return null;
        return `${window.location.origin}/workspace/${this.workspaceId}/${this.clientId}`;
    }

    async loadTokenData() {
        this.setLoading(true);
        this.setError(null);

        if (!this.token) {
            this.setError("Token lipsă");
            this.setLoading(false);
            return;
        }

        try {
            const result = await getConfirmationToken(this.token);
            
            if (!result.success) {
                this.setError(result.error || "Token invalid");
                this.setLoading(false);
                return;
            }

            this.setTokenData(result.data);
            this.setLoading(false);
            
            // Marchează token-ul ca folosit (one-time use)
            markConfirmationTokenAsUsed(this.token);
        } catch (error) {
            this.setError(error.message || "A apărut o eroare la încărcarea datelor");
            this.setLoading(false);
        }
    }

    handleOpenLink() {
        if (this.accessUrl) {
            window.open(this.accessUrl, '_blank');
        }
    }

    hasValidData() {
        return this.subscription && this.clientId;
    }
}
