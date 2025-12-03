import { getClientData, checkClientAuth } from "../services/subscriptionService"

export class ClientAccessController {
    constructor(workspaceId, clientId, navigate) {
        this.workspaceId = workspaceId;
        this.clientId = clientId;
        this.navigate = navigate;
        this.loading = true;
        this.error = null;
        this.listeners = new Set();

        // Bind methods
        this.handleClientAccess = this.handleClientAccess.bind(this);
        this.setLoading = this.setLoading.bind(this);
        this.setError = this.setError.bind(this);
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

    async handleClientAccess() {
        this.setLoading(true);
        this.setError(null);

        if (!this.clientId) {
            this.navigate(`/workspace/${this.workspaceId}/public?error=missing_client_id`);
            this.setLoading(false);
            return;
        }

        try {
            // Verifică datele clientului
            const clientResult = await getClientData(this.clientId);
            
            if (!clientResult.success) {
                this.navigate(`/workspace/${this.workspaceId}/public?error=invalid_client`, {
                    state: { error: clientResult.error }
                });
                this.setLoading(false);
                return;
            }

            // Verifică dacă utilizatorul este deja autentificat
            const authResult = await checkClientAuth();
            
            if (authResult.authenticated && authResult.session?.clientId === this.clientId) {
                // Utilizator autentificat - redirect la dashboard
                this.navigate(`/workspace/${this.workspaceId}/client/dashboard`);
            } else {
                // Utilizator neautentificat - redirect la login cu clientId
                this.navigate(`/workspace/${this.workspaceId}/client-login`, {
                    state: {
                        clientId: this.clientId,
                        returnTo: `/workspace/${this.workspaceId}/${this.clientId}`,
                        subscription: clientResult.data.subscription,
                    }
                });
            }
            
            this.setLoading(false);
        } catch (error) {
            this.setError(error.message || "A apărut o eroare la verificarea accesului");
            this.setLoading(false);
        }
    }
}
