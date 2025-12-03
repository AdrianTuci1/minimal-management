export class RequestAppointmentController {
    constructor() {
        this.currentStep = 1;
        this.selectedService = null;
        this.isCustomService = false;

        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        this.selectedDate = tomorrow;

        this.selectedTime = null;
        this.formData = {
            name: "",
            phone: "",
            email: "",
            notes: "",
        };

        this.listeners = new Set();

        // Bind methods
        this.setStep = this.setStep.bind(this);
        this.selectService = this.selectService.bind(this);
        this.toggleCustomService = this.toggleCustomService.bind(this);
        this.selectDate = this.selectDate.bind(this);
        this.selectTime = this.selectTime.bind(this);
        this.updateFormData = this.updateFormData.bind(this);
        this.submitRequest = this.submitRequest.bind(this);
    }

    subscribe(listener) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    notify() {
        this.listeners.forEach(listener => listener());
    }

    setStep(step) {
        this.currentStep = step;
        this.notify();
    }

    selectService(service) {
        this.selectedService = service;
        this.isCustomService = false;
        this.notify();
    }

    toggleCustomService() {
        this.isCustomService = true;
        this.selectedService = null;
        this.notify();
    }

    selectDate(date) {
        this.selectedDate = date;
        this.selectedTime = null; // Reset time when date changes
        this.notify();
    }

    selectTime(timeInMinutes) {
        this.selectedTime = timeInMinutes;
        this.notify();
    }

    updateFormData(field, value) {
        this.formData = { ...this.formData, [field]: value };
        this.notify();
    }

    generateTimeSlots() {
        const slots = [];
        for (let hour = 8; hour < 20; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                const timeInMinutes = hour * 60 + minute;
                slots.push({
                    timeInMinutes,
                    display: `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`,
                });
            }
        }
        return slots;
    }

    isSlotAvailable(date, timeInMinutes) {
        const dayOfWeek = date.getDay();
        const hour = Math.floor(timeInMinutes / 60);

        // Example: exclude some early morning slots on weekends
        if (dayOfWeek === 0 || dayOfWeek === 6) {
            if (hour < 10) return false;
        }

        // Example: exclude lunch time (12:00-14:00)
        if (hour >= 12 && hour < 14) {
            return false;
        }

        return true;
    }

    isFormValid() {
        const hasService = this.selectedService || this.isCustomService;
        const hasDate = this.selectedDate !== null;
        const hasTime = this.selectedTime !== null;
        const hasName = this.formData.name.trim();
        const hasPhone = this.formData.phone.trim();
        const hasEmail = this.formData.email.trim();

        return hasService && hasDate && hasTime && hasName && hasPhone && hasEmail;
    }

    submitRequest() {
        if (!this.isFormValid()) return;

        // Create full datetime
        const appointmentDateTime = new Date(this.selectedDate);
        const hours = Math.floor(this.selectedTime / 60);
        const minutes = this.selectedTime % 60;
        appointmentDateTime.setHours(hours, minutes, 0, 0);

        const requestData = {
            service: this.selectedService || { custom: "Altceva - nu se află în listă" },
            dateTime: appointmentDateTime,
            ...this.formData
        };

        console.log("Submitting appointment request:", requestData);

        // Move to confirmation step
        this.setStep(4);
        return requestData;
    }
}
