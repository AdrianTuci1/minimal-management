import React from 'react'
import StatsFunnel from './StatsFunnel'

const ConversionFunnelCard = ({ funnelData = [], labels = {} }) => {
    return (
        <div className="card h-full flex flex-col">
            <div className="card-header pb-2">
                <h3 className="card-title font-medium text-lg">{labels.funnelTitle || "Conversion Funnel"}</h3>
            </div>
            <div className="card-content flex-1 flex items-center justify-center">
                <div className="w-full">
                    <StatsFunnel data={funnelData} />
                </div>
            </div>
        </div>
    )
}

export default ConversionFunnelCard
