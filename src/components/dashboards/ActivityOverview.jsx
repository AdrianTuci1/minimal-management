import React from 'react'
import { Activity } from 'lucide-react'
import ActivityHeatmap from './ActivityHeatmap'
import StatsFunnel from './StatsFunnel'

const ActivityOverview = ({ recentActivities, funnelData, loading, labels = {} }) => {

    // Default Labels
    const defaultLabels = {
        title: "Activity Overview",
        densityTitle: "Activity Density (Last 7 Days)",
        funnelTitle: "Appointment Conversion",
        viewAll: "View All Activities"
    }

    const finalLabels = { ...defaultLabels, ...labels }

    return (
        <div className="card">
            <div className="card-header">
                <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    <h3 className="card-title">{finalLabels.title}</h3>
                </div>
            </div>
            <div className="card-content">
                {loading ? (
                    <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                ) : (
                    <div className="max-h-[700px] overflow-visible pr-2">
                        <div className="flex flex-col gap-6 h-full">
                            {/* Heatmap Section */}
                            <div>
                                <h4 className="text-sm font-medium mb-3 text-muted-foreground">{finalLabels.densityTitle}</h4>
                                <ActivityHeatmap activities={recentActivities || []} />
                            </div>

                            {/* Funnel Section Removed - Moved to ConversionFunnelCard */}
                        </div>
                    </div>
                )}
            </div>
            <div className="card-footer">
                <button className="btn btn-outline btn-sm w-full">
                    {finalLabels.viewAll}
                </button>
            </div>
        </div>
    )
}

export default ActivityOverview
