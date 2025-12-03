import { loginClient, confirmSubscription, requestPasswordReset, loginWithGoogle } from "../services/subscriptionService"

export class ClientLoginController {
    constructor(workspaceId, clientId, returnTo, subscription, navigate) {
        this.workspaceId = workspaceId;
        this.clientId = clientId;
        this.returnTo = returnTo;
        this.subscription = subscription;
        this.navigate = navigate;
        
        this.formData = {
            email: "",
            password: "",
        };
        this.loading = false;
        this.error = null;
        this.showPasswordReset = false;
        this.resetEmail = "";
        this.resetLoading = false;
        this.resetSuccess = false;
        
        this.listeners = new Set();

        // Bind methods
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handlePasswordReset = this.handlePasswordReset.bind(this);
        this.handleGoogleLogin = this.handleGoogleLogin.bind(this);
        this.setLoading = this.setLoading.bind(this);
        this.setError = this.setError.bind(this);
        this.setShowPasswordReset = this.setShowPasswordReset.bind(this);
        this.setResetEmail = this.setResetEmail.bind(this);
        this.setResetLoading = this.setResetLoading.bind(this);
        this.setResetSuccess = this.setResetSuccess.bind(this);
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
        this.setError(null);
        this.notify();
    }

    setLoading(loading) {
        this.loading = loading;
        this.notify();
    }

    setError(error) {
        this.error = error;
        this.notify();
    }

    setShowPasswordReset(show) {
        this.showPasswordReset = show;
        this.notify();
    }

    setResetEmail(email) {
        this.resetEmail = email;
        this.notify();
    }

    setResetLoading(loading) {
        this.resetLoading = loading;
        this.notify();
    }

    setResetSuccess(success) {
        this.resetSuccess = success;
        this.notify();
    }

    async handleSubmit() {
        this.setLoading(true);
        this.setError(null);

        try {
            // Login
            const loginResult = await loginClient(this.workspaceId, this.formData);
            
            if (!loginResult.success) {
                this.setError(loginResult.error || "Eroare la autentificare");
                this.setLoading(false);
                return;
            }

            // După login reușit, confirmă abonamentul cu clientId
            if (this.clientId) {
                const confirmResult = await confirmSubscription(this.clientId, this.formData);
                
                if (!confirmResult.success) {
                    this.setError(confirmResult.error || "Eroare la confirmarea abonamentului");
                    this.setLoading(false);
                    return;
                }
            }

            // Navighează la returnTo sau dashboard
            if (this.returnTo) {
                this.navigate(this.returnTo);
            } else {
                this.navigate(`/workspace/${this.workspaceId}/client/dashboard`);
            }
        } catch (err) {
            console.error("Login error:", err);
            this.setError("A apărut o eroare. Te rugăm să încerci din nou.");
            this.setLoading(false);
        }
    }

    async handlePasswordReset() {
        this.setResetLoading(true);
        this.setError(null);

        try {
            const result = await requestPasswordReset(this.workspaceId, this.resetEmail);
            
            if (!result.success) {
                this.setError(result.error || "Eroare la solicitarea resetării parolei");
                this.setResetLoading(false);
                return;
            }

            this.setResetSuccess(true);
            this.setResetLoading(false);
        } catch (err) {
            console.error("Password reset error:", err);
            this.setError("A apărut o eroare. Te rugăm să încerci din nou.");
            this.setResetLoading(false);
        }
    }

    async handleGoogleLogin() {
        this.setLoading(true);
        this.setError(null);

        try {
            // TODO: În producție, va folosi Google OAuth SDK
            // Pentru demo, simulăm obținerea token-ului
            const mockGoogleToken = "mock_google_token_" + Date.now();
            
            const loginResult = await loginWithGoogle(this.workspaceId, mockGoogleToken);
            
            if (!loginResult.success) {
                this.setError(loginResult.error || "Eroare la autentificarea cu Google");
                this.setLoading(false);
                return;
            }

            // După login reușit cu Google, confirmă abonamentul dacă există clientId
            if (this.clientId) {
                const confirmResult = await confirmSubscription(this.clientId, {
                    email: loginResult.user.email,
                    authProvider: 'google',
                });
                
                if (!confirmResult.success) {
                    this.setError(confirmResult.error || "Eroare la confirmarea abonamentului");
                    this.setLoading(false);
                    return;
                }
            }

            // Navighează la returnTo sau dashboard
            if (this.returnTo) {
                this.navigate(this.returnTo);
            } else {
                this.navigate(`/workspace/${this.workspaceId}/client/dashboard`);
            }
        } catch (err) {
            console.error("Google login error:", err);
            this.setError("A apărut o eroare. Te rugăm să încerci din nou.");
            this.setLoading(false);
        }
    }

    isFormValid() {
        return this.formData.email.trim() && this.formData.password.trim();
    }

    isResetFormValid() {
        return this.resetEmail.trim();
    }
}
