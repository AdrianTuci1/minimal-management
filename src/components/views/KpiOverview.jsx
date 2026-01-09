import { useMemo } from 'react'
import KPIGrid from '../dashboards/KPIGrid'
import ActivityOverview from '../dashboards/ActivityOverview'
import AppointmentTrendsChart from '../dashboards/AppointmentTrendsChart'
import WebsiteBookingsCard from '../dashboards/WebsiteBookingsCard'
import WeeklyStatusChart from '../dashboards/WeeklyStatusChart'
import ConversionFunnelCard from '../dashboards/ConversionFunnelCard'

// Date demo pentru business statistics
const demoBusinessStatistics = {
  totalAppointments: 150,
  totalPatients: 423,
  appointmentStats: {
    completed: 120,
    cancelled: 15,
    pending: 15,
    absent: 47
  },
  revenue: {
    monthly: 12500,
  },
  websiteBookings: 200,
  clinicRating: {
    average: 4.8,
    totalReviews: 127
  },
  smsStats: {
    sent: 234,
    limit: 300,
    percentage: 78
  },
  occupancyRate: 85,
  popularTreatments: [
    { treatment: 'Scaling', count: 45 },
    { treatment: 'Filling', count: 38 },
    { treatment: 'Consultation', count: 67 },
    { treatment: 'Root Canal', count: 23 },
    { treatment: 'Whitening', count: 15 }
  ]
}

// Date demo pentru activități recente - GENERATED DENSE MOCK DATA
const generateDenseActivityData = () => {
  const activities = []
  const actions = ['appointment', 'treatment', 'payment', 'patient']
  const today = new Date()

  // Generate for last 7 days
  for (let i = 0; i < 7; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)

    // Random number of activities per day (between 20 and 50)
    const dailyCount = Math.floor(Math.random() * 30) + 20

    for (let j = 0; j < dailyCount; j++) {
      // Random hour between 8 and 20
      const hour = Math.floor(Math.random() * (20 - 8 + 1)) + 8
      const activityDate = new Date(date)
      activityDate.setHours(hour, 0, 0, 0)

      activities.push({
        activityType: actions[Math.floor(Math.random() * actions.length)],
        createdAt: activityDate.toISOString()
      })
    }
  }
  return activities
}

const denseRecentActivities = generateDenseActivityData()

// NEW: Demo data for Weekly Status (Mock)
const demoWeeklyStatus = [
  { day: 'Mon', completed: 18, cancelled: 2 },
  { day: 'Tue', completed: 22, cancelled: 1 },
  { day: 'Wed', completed: 19, cancelled: 3 },
  { day: 'Thu', completed: 25, cancelled: 1 },
  { day: 'Fri', completed: 20, cancelled: 4 },
  { day: 'Sat', completed: 15, cancelled: 2 },
  { day: 'Sun', completed: 8, cancelled: 0 },
]

// Date demo pentru progresul medicilor
const demoDoctorProgress = [
  { doctor: 'Dr. Maria Ionescu', appointments: 12, progress: 85, fill: 'var(--chart-1)' },
  { doctor: 'Dr. Ion Popescu', appointments: 8, progress: 75, fill: 'var(--chart-2)' },
  { doctor: 'Dr. Ana Georgescu', appointments: 10, progress: 90, fill: 'var(--chart-3)' },
  { doctor: 'Dr. Mihai Radu', appointments: 6, progress: 67, fill: 'var(--chart-4)' },
]

// Config Factory for Business Types
const getBusinessConfig = (type) => {
  const configs = {
    clinic: {
      kpiLabels: {
        appointments: 'Scheduled',
        completed: 'Completed',
        cancelled: 'Cancelled',
        patients: 'Patients',
        revenue: 'Revenue',
        occupancy: 'Occupancy'
      },
      doctorLabels: {
        progressTitle: "Metrics Distribution",
        progressLegend: "No data",
        treatmentsTitle: "Popular Treatments",
        treatmentsSubtitle: "Most requested treatments this month",
        noTreatments: "No data on popular treatments"
      },
      websiteLabels: {
        title: "Website Bookings",
        visitorsLabel: "Bookings",
        ratingLabel: "Rating",
        smsLabel: "SMS"
      },
      activityLabels: {
        title: "Activity Overview",
        densityTitle: "Activity Density (Last 7 Days)",
        funnelTitle: "Appointment Conversion",
        viewAll: "View All Activities"
      }
    },
    service: {
      kpiLabels: {
        appointments: 'Bookings',
        completed: 'Fulfilled',
        cancelled: 'Cancelled',
        patients: 'Clients',
        revenue: 'Revenue',
        occupancy: 'Usage'
      },
      doctorLabels: {
        progressTitle: "Performance Metrics",
        progressLegend: "No data",
        treatmentsTitle: "Popular Services",
        treatmentsSubtitle: "Most requested services this month",
        noTreatments: "No data on services"
      },
      websiteLabels: {
        title: "Online Bookings",
        visitorsLabel: "Requests",
        ratingLabel: "Feedback",
        smsLabel: "Notifications"
      },
      activityLabels: {
        title: "Recent Actions",
        densityTitle: "Action Density",
        funnelTitle: "Booking Conversion",
        viewAll: "View All Actions"
      }
    },
    retail: {
      kpiLabels: {
        appointments: 'Orders',
        completed: 'Delivered',
        cancelled: 'Returns',
        patients: 'Customers',
        revenue: 'Sales',
        occupancy: 'Inventory'
      },
      doctorLabels: {
        progressTitle: "Sales Metrics",
        progressLegend: "No data",
        treatmentsTitle: "Top Products",
        treatmentsSubtitle: "Best selling products this month",
        noTreatments: "No data on products"
      },
      websiteLabels: {
        title: "Online Orders",
        visitorsLabel: "Orders",
        ratingLabel: "Reviews",
        smsLabel: "Alerts"
      },
      activityLabels: {
        title: "Sales Activity",
        densityTitle: "Sales Density",
        funnelTitle: "Purchase Funnel",
        viewAll: "View All Sales"
      }
    }
  }

  return configs[type] || configs.clinic
}

const KpiOverview = ({ businessType = 'clinic' }) => {
  const config = getBusinessConfig(businessType)

  // Helper function to safely extract numeric value
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

  // Derived Data
  const getWebsiteBookings = () => extractNumber(demoBusinessStatistics?.websiteBookings)

  const getClinicRating = () => ({
    average: extractNumber(demoBusinessStatistics?.clinicRating?.average),
    totalReviews: extractNumber(demoBusinessStatistics?.clinicRating?.totalReviews)
  })

  const getSmsStats = () => ({
    sent: extractNumber(demoBusinessStatistics?.smsStats?.sent),
    limit: extractNumber(demoBusinessStatistics?.smsStats?.limit),
    percentage: extractNumber(demoBusinessStatistics?.smsStats?.percentage)
  })

  const getPopularTreatments = () => {
    if (!Array.isArray(demoBusinessStatistics?.popularTreatments)) return []
    return demoBusinessStatistics.popularTreatments.map((item, index) => ({
      treatment: typeof item.treatment === 'string' ? item.treatment : (item.treatment?.name || 'Item'),
      count: extractNumber(item.count)
    }))
  }

  // Data for Funnel - mapping for generic structure
  // For 'clinic' it uses appointments. For others we might need to map differently props in real app.
  // Using demo data as is for now.
  const funnelData = [
    { label: config.kpiLabels.appointments, value: extractNumber(demoBusinessStatistics?.totalAppointments), color: 'bg-blue-500' },
    { label: 'Waitlist', value: extractNumber(demoBusinessStatistics?.totalAppointments) * 0.8, color: 'bg-indigo-500' },
    { label: config.kpiLabels.completed, value: extractNumber(demoBusinessStatistics?.appointmentStats?.completed), color: 'bg-emerald-500' },
    { label: config.websiteLabels.ratingLabel, value: extractNumber(demoBusinessStatistics?.clinicRating?.totalReviews), color: 'bg-amber-500' }
  ]

  return (
    <div className="space-y-6">
      {/* Top Row: Trends Chart (2/3) + Stats Distribution (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AppointmentTrendsChart labels={{
            title: config.kpiLabels.appointments + " Trends",
            subtitle: "Daily status breakdown for " + config.kpiLabels.appointments
          }} />
        </div>

        <div className="lg:col-span-1">
          <WebsiteBookingsCard
            bookings={getWebsiteBookings()}
            rating={getClinicRating()}
            smsStats={getSmsStats()}
            distributionData={getPopularTreatments()}
            labels={config.websiteLabels}
          />
        </div>
      </div>

      {/* Bottom Row: 3 Equal Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Weekly Status (Realized vs Cancelled) */}
        <div className="lg:col-span-1">
          <WeeklyStatusChart data={demoWeeklyStatus} />
        </div>

        {/* Center: Activity Density (Rest of density) */}
        <div className="lg:col-span-1">
          <ActivityOverview
            recentActivities={denseRecentActivities}
            funnelData={[]} // No funnel here
            loading={false}
            labels={config.activityLabels}
          />
        </div>

        {/* Right: Funnel */}
        <div className="lg:col-span-1">
          <ConversionFunnelCard
            funnelData={funnelData}
            labels={config.activityLabels}
          />
        </div>
      </div>
    </div>
  )
}

export default KpiOverview
