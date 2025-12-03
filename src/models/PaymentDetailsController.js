export class PaymentDetailsController {
    constructor(workspaceId, reservationData, workspace, workspaceConfig) {
        this.workspaceId = workspaceId;
        this.reservationData = reservationData;
        this.workspace = workspace;
        this.workspaceConfig = workspaceConfig;
        
        this.formData = {
            fullName: "",
            email: "",
            phone: "",
            specialRequests: "",
        };
        
        this.listeners = new Set();

        // Mock room types data (same as BookReservationView)
        this.roomTypes = [
            {
                id: "single",
                name: "Camera Single",
                price: 250,
            },
            {
                id: "double",
                name: "Camera Double",
                price: 350,
            },
            {
                id: "suite",
                name: "Suite",
                price: 550,
            },
            {
                id: "family",
                name: "Camera Family",
                price: 450,
            },
        ];

        // Bind methods
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
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

    get checkIn() {
        return this.reservationData.checkIn;
    }

    get checkOut() {
        return this.reservationData.checkOut;
    }

    get selectedRooms() {
        return this.reservationData.selectedRooms;
    }

    get nights() {
        if (!this.checkIn || !this.checkOut) return 0;
        const checkInDate = this.checkIn instanceof Date ? this.checkIn : new Date(this.checkIn);
        const checkOutDate = this.checkOut instanceof Date ? this.checkOut : new Date(this.checkOut);
        const diffTime = checkOutDate.getTime() - checkInDate.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return Math.max(0, diffDays);
    }

    get total() {
        if (this.nights === 0 || !this.selectedRooms) return 0;
        return Object.entries(this.selectedRooms).reduce((sum, [roomId, quantity]) => {
            const roomType = this.roomTypes.find((rt) => rt.id === roomId);
            if (!roomType || quantity === 0) return sum;
            return sum + roomType.price * quantity * this.nights;
        }, 0);
    }

    get checkInDate() {
        return this.checkIn instanceof Date ? this.checkIn : new Date(this.checkIn);
    }

    get checkOutDate() {
        return this.checkOut instanceof Date ? this.checkOut : new Date(this.checkOut);
    }

    hasValidReservationData() {
        return this.checkIn && this.checkOut && this.selectedRooms && Object.keys(this.selectedRooms).length > 0;
    }

    isFormValid() {
        return this.formData.fullName.trim() && 
               this.formData.email.trim() && 
               this.formData.phone.trim();
    }

    async handleSubmit() {
        if (!this.isFormValid()) {
            throw new Error("Formularul nu este completat corect");
        }

        // TODO: Implement payment processing
        const paymentData = {
            guestInfo: this.formData,
            reservationData: this.reservationData,
            total: this.total,
            workspaceId: this.workspaceId
        };

        console.log("Processing payment", paymentData);
        
        // În producție, aici s-ar procesa plata
        // și s-ar redirecționa către pagina de confirmare
        
        return paymentData;
    }
}
