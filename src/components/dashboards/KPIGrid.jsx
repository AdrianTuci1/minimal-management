import React from 'react'
import {
    Calendar,
    CheckCircle,
    XCircle,
    Users,
    DollarSign,
    Percent
} from 'lucide-react'

const KPIGrid = ({ stats, loading, labels = {} }) => {
    // Helper to safe extract
    const extractNumber = (value) => {
        if (value === null || value === undefined) return 0
        if (typeof value === 'number') return value
        if (typeof value === 'string') {
            const parsed = parseFloat(value)
            return isNaN(parsed) ? 0 : parsed
        }
        if (typeof value === 'object' && value.value !== undefined) return extractNumber(value.value)
        if (typeof value === 'object' && value.count !== undefined) return extractNumber(value.count)
        return 0
    }

    const getCurrentMonthName = () => {
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ]
        return months[new Date().getMonth()]
    }

    const defaultLabels = {
        appointments: 'Scheduled',
        completed: 'Completed',
        cancelled: 'Cancelled',
        patients: 'Patients',
        revenue: 'Revenue',
        occupancy: 'Occupancy'
    }

    const finalLabels = { ...defaultLabels, ...labels }

    const data = {
        appointments: extractNumber(stats?.totalAppointments),
        completed: extractNumber(stats?.appointmentStats?.completed),
        cancelled: extractNumber(stats?.appointmentStats?.cancelled),
        patients: extractNumber(stats?.totalPatients),
        revenue: extractNumber(stats?.revenue?.monthly),
        occupancy: extractNumber(stats?.occupancyRate)
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {/* Slot 4: Patients/Clients */}
            <div className="card group hover:shadow-lg transition-shadow flex align-center justify-center">
                <div className="card-content p-4 flex align-center justify-center">
                    <div className="flex flex-col gap-2 flex align-center justify-center">
                        <div className="flex items-center justify-between gap-4">
                            <Users className="h-5 w-5 text-purple-600" />
                            <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                                Total
                            </span>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-purple-600">
                                {loading ? '...' : data.patients}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">{finalLabels.patients}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Slot 5: Revenue */}
            <div className="card group hover:shadow-lg transition-shadow flex align-center justify-center">
                <div className="card-content p-4 flex align-center justify-center">
                    <div className="flex flex-col gap-2 flex align-center justify-center">
                        <div className="flex items-center justify-between gap-4">
                            <DollarSign className="h-5 w-5 text-emerald-600" />
                            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                                {getCurrentMonthName()}
                            </span>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-emerald-600">
                                {loading ? '...' : data.revenue.toLocaleString('en-US')}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">{finalLabels.revenue}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Slot 6: Occupancy/Utilization */}
            <div className="card group hover:shadow-lg transition-shadow flex align-center justify-center">
                <div className="card-content p-4 flex align-center justify-center">
                    <div className="flex flex-col gap-2 flex align-center justify-center">
                        <div className="flex items-center justify-between gap-4">
                            <Percent className="h-5 w-5 text-green-600" />
                            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                {getCurrentMonthName()}
                            </span>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-green-600">
                                {loading ? '...' : `${data.occupancy}%`}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">{finalLabels.occupancy}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default KPIGrid
