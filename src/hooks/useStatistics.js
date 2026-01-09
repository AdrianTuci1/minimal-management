import { useState, useEffect } from 'react'

// Dummy Data
const MOCK_STATS = {
    websiteBookings: 124,
    clinicRating: {
        average: 4.8,
        totalReviews: 86
    },
    smsStats: {
        sent: 850,
        limit: 1000,
        percentage: 85
    },
    popularTreatments: [
        { treatment: "Consultations", count: 45 },
        { treatment: "Whitening", count: 32 },
        { treatment: "Implants", count: 28 },
        { treatment: "Braces", count: 19 },
    ],
    totalAppointments: 450,
    appointmentStats: {
        completed: 120,
        cancelled: 10,
        absent: 5
    }
}

export const useStatistics = () => {
    const [businessStatistics, setBusinessStatistics] = useState(MOCK_STATS)
    const [recentActivities, setRecentActivities] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        // Simulate fetch
        setLoading(true)
        setTimeout(() => {
            setBusinessStatistics(MOCK_STATS)
            setLoading(false)
        }, 500)
    }, [])

    return {
        businessStatistics,
        recentActivities,
        loading
    }
}
