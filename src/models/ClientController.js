export class ClientController {
    constructor(workspace, workspaceConfig) {
        this.workspace = workspace;
        this.workspaceConfig = workspaceConfig;
    }

    get normalizedWorkspaceType() {
        return this.workspaceConfig?.id || this.workspace.type;
    }

    getButtonText() {
        switch (this.normalizedWorkspaceType) {
            case "clinic":
                return "Solicită o programare";
            case "fitness":
                return "Devin-o client";
            case "hotel":
                return "Rezervă";
            default:
                return "Solicită o programare";
        }
    }

    getFirstButtonUrl() {
        const workspaceId = this.workspace.id;
        switch (this.normalizedWorkspaceType) {
            case "clinic":
                return `/workspace/${workspaceId}/public/request-appointment`;
            case "fitness":
                return `/workspace/${workspaceId}/public/become-client`;
            case "hotel":
                return `/workspace/${workspaceId}/public/book-reservation`;
            default:
                return `/workspace/${workspaceId}/public/request-appointment`;
        }
    }

    getSecondButtonText() {
        switch (this.normalizedWorkspaceType) {
            case "clinic":
                return "Vezi serviciile";
            case "fitness":
                return "Vezi abonamente";
            case "hotel":
                return "Vezi serviciile";
            default:
                return "Vezi serviciile";
        }
    }

    getSchedule() {
        if (this.workspace.type === "hotel") {
            return "24/7";
        }
        return this.workspace.schedule || {
            weekdays: "Luni - Vineri: 09:00 - 18:00",
            saturday: "Sâmbătă: 09:00 - 14:00",
            sunday: "Duminică: Închis"
        };
    }

    isDateUnavailable(date) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const dayDate = new Date(date);
        dayDate.setHours(0, 0, 0, 0);

        // Past dates unavailable
        if (dayDate < today) {
            return true;
        }

        // Weekend unavailable (unless hotel)
        if (this.workspace.type !== "hotel") {
            const dayOfWeek = dayDate.getDay();
            if (dayOfWeek === 0 || dayOfWeek === 6) {
                return true;
            }
        }

        // Too far in future unavailable (e.g., > 60 days)
        const daysDiff = Math.floor((dayDate - today) / (1000 * 60 * 60 * 24));
        if (daysDiff > 60) {
            return true;
        }

        return false;
    }
}
