export class WorkspaceController {
    constructor(workspaceType, initialData = {}) {
        this.workspaceType = workspaceType;
        this.appointments = initialData.appointments || [];
        this.reservations = initialData.reservations || [];
        this.formData = {};
        this.listeners = new Set();

        // Bind methods to ensure 'this' context
        this.setAppointments = this.setAppointments.bind(this);
        this.setReservations = this.setReservations.bind(this);
        this.updateAppointment = this.updateAppointment.bind(this);
        this.createAppointment = this.createAppointment.bind(this);
        this.deleteAppointment = this.deleteAppointment.bind(this);
        this.handleFieldChange = this.handleFieldChange.bind(this);
        this.resetFormData = this.resetFormData.bind(this);
        this.setFormData = this.setFormData.bind(this);
    }

    subscribe(listener) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    notify() {
        this.listeners.forEach(listener => listener());
    }

    setAppointments(appointments) {
        this.appointments = appointments;
        this.notify();
    }

    setReservations(reservations) {
        this.reservations = reservations;
        this.notify();
    }

    setFormData(data) {
        this.formData = { ...this.formData, ...data };
        this.notify();
    }

    resetFormData() {
        this.formData = {};
        this.notify();
    }

    updateAppointment(id, data) {
        this.appointments = this.appointments.map(apt =>
            apt.id === id ? { ...apt, ...data } : apt
        );
        this.notify();
        return this.appointments.find(apt => apt.id === id);
    }

    updateReservation(id, data) {
        this.reservations = this.reservations.map(res =>
            res.id === id ? { ...res, ...data } : res
        );
        this.notify();
        return this.reservations.find(res => res.id === id);
    }

    createAppointment(data) {
        const newAppointment = {
            id: `appt-${Date.now()}`,
            ...data,
            status: data.status || "nouă",
        };

        // Special handling for fitness
        if (this.workspaceType === "fitness" && !newAppointment.startMinutes && newAppointment.start) {
            newAppointment.startMinutes = newAppointment.start;
        }

        this.appointments = [...this.appointments, newAppointment];
        this.notify();
        return newAppointment;
    }

    createReservation(data) {
        const newReservation = {
            id: `res-${Date.now()}`,
            ...data,
            status: data.status || "nouă",
        };

        this.reservations = [...this.reservations, newReservation];
        this.notify();
        return newReservation;
    }

    deleteAppointment(id) {
        this.appointments = this.appointments.filter(apt => apt.id !== id);
        this.notify();
    }

    deleteReservation(id) {
        this.reservations = this.reservations.filter(res => res.id !== id);
        this.notify();
    }

    handleFieldChange(fieldId, value, isCreateMode, drawerDataId) {
        let updatedValue = value;

        // Parse time format (HH:MM) to minutes for start field
        if (fieldId === "start") {
            const timeMatch = String(value).match(/^(\d{1,2}):(\d{2})$/);
            if (timeMatch) {
                const hours = parseInt(timeMatch[1], 10);
                const minutes = parseInt(timeMatch[2], 10);
                updatedValue = hours * 60 + minutes;
            }
        }

        // Parse duration/durationDays to number
        if (fieldId === "duration" || fieldId === "durationDays") {
            updatedValue = parseInt(value, 10) || (fieldId === "durationDays" ? 1 : 0);
        }

        if (isCreateMode) {
            const updates = { [fieldId]: updatedValue };

            // For fitness, sync startMinutes
            if (fieldId === "start" && this.workspaceType === "fitness") {
                updates.startMinutes = updatedValue;
            }

            this.setFormData(updates);
            return;
        }

        // Edit mode
        const nextValues = { [fieldId]: updatedValue };

        if (fieldId === "start" && this.workspaceType === "fitness") {
            nextValues.startMinutes = updatedValue;
        }

        if (this.workspaceType === "hotel") {
            this.updateReservation(drawerDataId, nextValues);
        } else {
            this.updateAppointment(drawerDataId, nextValues);
        }
    }
}
