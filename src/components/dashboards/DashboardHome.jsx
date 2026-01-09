import { useState, useEffect } from 'react'
import { useStatistics } from '../../hooks/useStatistics.js'
import { useHealthRepository } from '../../hooks/useHealthRepository'
import { useAppointments } from '../../hooks/useAppointments.js'

import KPIGrid from './KPIGrid'
import WebsiteBookingsCard from './WebsiteBookingsCard'
import DoctorProgressCard from './DoctorProgressCard'
import ActivityOverview from './ActivityOverview'

const DashboardHome = () => {
  const {
    businessStatistics,
    recentActivities,
    loading,
  } = useStatistics()
  const { isOffline } = useHealthRepository()
  const { appointments } = useAppointments()
  const [doctorProgressFromDB, setDoctorProgressFromDB] = useState([])

  // Calculate doctor progress from today's appointments
  useEffect(() => {
    if (!appointments || appointments.length === 0) {
      setDoctorProgressFromDB([])
      return
    }

    // Filter today's appointments
    const today = new Date()
    const todayStr = today.toISOString().split('T')[0]

    const todaysAppointments = appointments.filter(appointment => {
      const appointmentDate = appointment.date
        ? (appointment.date.split('T')[0])
        : null
      return appointmentDate === todayStr
    })

    if (todaysAppointments.length === 0) {
      setDoctorProgressFromDB([])
      return
    }

    // Group by doctor
    const doctorStats = {}

    todaysAppointments.forEach(appointment => {
      const doctorName = typeof appointment.doctor === 'string'
        ? appointment.doctor
        : appointment.doctor?.name || appointment.doctor?.medicName || appointment.medicName || 'Unknown Doctor'

      if (!doctorStats[doctorName]) {
        doctorStats[doctorName] = {
          total: 0,
          completed: 0
        }
      }

      doctorStats[doctorName].total++

      if (appointment.status === 'completed') {
        doctorStats[doctorName].completed++
      }
    })

    const progressData = Object.entries(doctorStats).map(([doctorName, stats]) => ({
      doctor: doctorName,
      appointments: stats.total,
      progress: stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0
    }))

    setDoctorProgressFromDB(progressData)
  }, [appointments])

  // Helpers
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

  // Derived Data for Props
  const getDoctorProgress = () => {
    if (!doctorProgressFromDB || doctorProgressFromDB.length === 0) {
      return []
    }
    return doctorProgressFromDB.map((doc, index) => ({
      ...doc,
      fill: `var(--chart-${(index % 5) + 1})`
    }))
  }

  const getPopularTreatments = () => {
    if (isOffline) return []
    if (!Array.isArray(businessStatistics?.popularTreatments) || businessStatistics.popularTreatments.length === 0) {
      return []
    }
    return businessStatistics.popularTreatments.map(item => ({
      treatment: typeof item.treatment === 'string' ? item.treatment : (item.treatment?.name || 'Treatment'),
      count: extractNumber(item.count)
    }))
  }

  const getWebsiteBookings = () => extractNumber(businessStatistics?.websiteBookings)

  const getClinicRating = () => ({
    average: extractNumber(businessStatistics?.clinicRating?.average),
    totalReviews: extractNumber(businessStatistics?.clinicRating?.totalReviews)
  })

  const getSmsStats = () => ({
    sent: extractNumber(businessStatistics?.smsStats?.sent),
    limit: extractNumber(businessStatistics?.smsStats?.limit),
    percentage: extractNumber(businessStatistics?.smsStats?.percentage)
  })

  // Data for Funnel
  const funnelData = [
    { label: 'Total Appointments', value: extractNumber(businessStatistics?.totalAppointments), color: 'bg-blue-500' },
    { label: 'Confirmed', value: extractNumber(businessStatistics?.totalAppointments) - extractNumber(businessStatistics?.appointmentStats?.cancelled) - extractNumber(businessStatistics?.appointmentStats?.absent), color: 'bg-indigo-500' },
    { label: 'Completed', value: extractNumber(businessStatistics?.appointmentStats?.completed), color: 'bg-emerald-500' },
    { label: 'Reviews', value: extractNumber(businessStatistics?.clinicRating?.totalReviews), color: 'bg-amber-500' }
  ]

  return (
    <div className="space-y-6">
      {/* 1. Main KPI Grid */}
      <KPIGrid stats={businessStatistics} loading={loading} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 2. Website Bookings & Metrics */}
        <WebsiteBookingsCard
          bookings={getWebsiteBookings()}
          rating={getClinicRating()}
          smsStats={getSmsStats()}
          distributionData={getPopularTreatments()}
        />

        {/* 3. Doctor Progress & Treatments */}
        <DoctorProgressCard
          doctorData={getDoctorProgress()}
          popularTreatments={getPopularTreatments()}
          isOffline={isOffline}
        />

        {/* 4. Activity Overview (Heatmap + Funnel) */}
        <ActivityOverview
          recentActivities={recentActivities}
          funnelData={funnelData}
          loading={loading}
        />
      </div>
    </div>
  )
}

export default DashboardHome
