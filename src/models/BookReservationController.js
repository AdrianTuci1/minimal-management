export class BookReservationController {
    constructor(workspace, workspaceConfig) {
        this.workspace = workspace;
        this.workspaceConfig = workspaceConfig;
        this.isMobile = false;
        this.listeners = new Set();

        // Initialize dates: check-in tomorrow, check-out day after tomorrow
        this.checkIn = this.getTomorrow();
        this.checkOut = this.getDayAfterTomorrow();
        this.selectedRooms = {};

        // Mock room types data
        this.roomTypes = [
            {
                id: "single",
                name: "Cabana Single",
                description: "Cabană intimă pentru 2 persoane, perfectă pentru o escapadă liniștită sau călătorii de afaceri.",
                price: 250,
                capacity: 2,
                amenities: ["WiFi", "TV", "Aer condiționat", "Baie privată"],
                image: '/cabin2.jpg',
                available: 3,
            },
            {
                id: "double",
                name: "Cabana Doubla",
                description: "Cabană spațioasă pentru 4 persoane, ideală pentru cupluri sau familii mici.",
                price: 350,
                capacity: 4,
                amenities: ["WiFi", "TV", "Aer condiționat", "Baie privată", "Balcon"],
                image: '/cabin3.jpg',
                available: 5,
            },
            {
                id: "suite",
                name: "Suite",
                description: "Cabană de lux cu living separat, gândită pentru până la 6 persoane și experiențe premium.",
                price: 550,
                capacity: 6,
                amenities: ["WiFi", "TV", "Aer condiționat", "Baie privată", "Balcon", "Minibar", "Jacuzzi"],
                image: '/cabin1.jpg',
                available: 2,
            },
            {
                id: "family",
                name: "Cabin Family",
                description: "Cabană generoasă pentru 4 persoane, concepută pentru familii sau grupuri de prieteni.",
                price: 450,
                capacity: 4,
                amenities: ["WiFi", "TV", "Aer condiționat", "Baie privată", "Balcon", "Sufragerie"],
                image: '/cabin4.webp',
                available: 1,
            },
        ];

        // Bind methods
        this.setCheckIn = this.setCheckIn.bind(this);
        this.setCheckOut = this.setCheckOut.bind(this);
        this.handleRoomQuantityChange = this.handleRoomQuantityChange.bind(this);
        this.setMobile = this.setMobile.bind(this);
        this.submitReservation = this.submitReservation.bind(this);
    }

    subscribe(listener) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    notify() {
        this.listeners.forEach(listener => listener());
    }

    getTomorrow() {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        return tomorrow;
    }

    getDayAfterTomorrow() {
        const dayAfter = new Date();
        dayAfter.setDate(dayAfter.getDate() + 2);
        dayAfter.setHours(0, 0, 0, 0);
        return dayAfter;
    }

    get normalizedWorkspaceType() {
        return this.workspaceConfig?.id || this.workspace?.type;
    }

    get nights() {
        if (!this.checkIn || !this.checkOut) return 0;
        const diffTime = this.checkOut.getTime() - this.checkIn.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return Math.max(0, diffDays);
    }

    get total() {
        if (this.nights === 0) return 0;
        return Object.entries(this.selectedRooms).reduce((sum, [roomId, quantity]) => {
            const roomType = this.roomTypes.find((rt) => rt.id === roomId);
            if (!roomType || quantity === 0) return sum;
            return sum + roomType.price * quantity * this.nights;
        }, 0);
    }

    get hasSelectedRooms() {
        return Object.values(this.selectedRooms).some((qty) => qty > 0);
    }

    get buttonText() {
        if (!this.hasSelectedRooms) {
            return "Detalii si plata";
        }
        return "Detalii și plată";
    }

    setCheckIn(date) {
        this.checkIn = date;
        // Reset check-out if it's before or equal to check-in
        if (this.checkOut && date && this.checkOut <= date) {
            this.checkOut = null;
        }
        this.notify();
    }

    setCheckOut(date) {
        this.checkOut = date;
        this.notify();
    }

    handleRoomQuantityChange(roomId, delta) {
        this.selectedRooms = { ...this.selectedRooms };
        const current = this.selectedRooms[roomId] || 0;
        const newQuantity = Math.max(0, Math.min(current + delta, this.roomTypes.find((rt) => rt.id === roomId)?.available || 0));
        
        if (newQuantity === 0) {
            const { [roomId]: _, ...rest } = this.selectedRooms;
            this.selectedRooms = rest;
        } else {
            this.selectedRooms[roomId] = newQuantity;
        }
        
        this.notify();
    }

    setMobile(isMobile) {
        this.isMobile = isMobile;
        this.notify();
    }

    isFormValid() {
        return this.hasSelectedRooms && this.checkIn && this.checkOut && this.nights > 0;
    }

    submitReservation() {
        if (!this.isFormValid()) return null;

        return {
            checkIn: this.checkIn,
            checkOut: this.checkOut,
            selectedRooms: this.selectedRooms,
            total: this.total,
            nights: this.nights,
            workspaceId: this.workspace.id
        };
    }
}
