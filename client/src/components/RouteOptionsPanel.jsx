import React from 'react';

const RouteOptionsPanel = ({ routes, selectedRouteIndex, onSelectRoute, className = '' }) => {
    if (!routes || routes.length === 0) return null;

    // Find indices for Safest and Fastest
    // Fastest is usually index 0 from OSRM, but let's confirm
    const fastestIndex = routes.reduce((iMin, x, i, arr) => x.duration < arr[iMin].duration ? i : iMin, 0);

    // Safest = Lowest Score
    const safestIndex = routes.reduce((iMin, x, i, arr) => x.stats.score < arr[iMin].stats.score ? i : iMin, 0);

    return (
        <div className={`overflow-y-auto bg-[#0f172a]/95 backdrop-blur-xl border border-slate-700/50 shadow-2xl p-4 flex flex-col gap-4 ${className}`}>
            <h3 className="text-lg font-bold text-white border-b border-white/10 pb-2 flex justify-between items-center">
                <span>Suggested Routes</span>
                <span className="text-xs font-normal text-slate-400">{routes.length} options</span>
            </h3>

            {routes.map((route, idx) => {
                const isSelected = selectedRouteIndex === idx;
                const score = route.stats.score;

                // Color Logic
                let riskColor = 'text-blue-400';
                let riskLabel = 'Low Risk';
                let borderColor = 'border-blue-500/30 bg-blue-500/10';

                if (score > 15) {
                    riskColor = 'text-red-400';
                    riskLabel = 'High Risk';
                    borderColor = 'border-red-500/30 bg-red-500/10';
                } else if (score > 5) {
                    riskColor = 'text-yellow-400';
                    riskLabel = 'Medium Risk';
                    borderColor = 'border-yellow-500/30 bg-yellow-500/10';
                }

                // Badges
                const isFastest = idx === fastestIndex;
                const isSafest = idx === safestIndex;

                return (
                    <div
                        key={idx}
                        onClick={() => onSelectRoute(idx)}
                        className={`relative p-4 rounded-xl border-2 transition-all cursor-pointer group
                            ${isSelected
                                ? 'border-blue-500 bg-blue-600/20 shadow-lg ring-1 ring-blue-500/50'
                                : 'border-slate-800 bg-slate-900/60 hover:border-slate-600 hover:bg-slate-800'
                            }
                        `}
                    >
                        {/* Highlights */}
                        <div className="absolute -top-3 left-3 flex gap-2">
                            {isSafest && (
                                <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    SAFEST
                                </span>
                            )}
                            {isFastest && (
                                <span className="bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                    FASTEST
                                </span>
                            )}
                        </div>

                        {/* Header */}
                        <div className="flex justify-between items-start mb-3 mt-2">
                            <span className="text-slate-200 font-bold text-lg">Route {idx + 1}</span>
                            <span className={`text-xs font-bold px-2 py-1 rounded-md border ${borderColor} ${riskColor}`}>
                                {riskLabel}
                            </span>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-2 text-sm text-slate-400 mb-4 bg-black/20 p-2 rounded-lg">
                            <div>
                                <span className="block text-[10px] uppercase tracking-wider text-slate-500">Est. Time</span>
                                <span className="text-white font-mono text-base">{(route.duration / 60).toFixed(0)} min</span>
                            </div>
                            <div>
                                <span className="block text-[10px] uppercase tracking-wider text-slate-500">Distance</span>
                                <span className="text-white font-mono text-base">{(route.distance / 1000).toFixed(1)} km</span>
                            </div>
                        </div>

                        {/* Pothole Counts */}
                        <div>
                            <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Pothole Severity Count</p>
                            <div className="flex gap-2 text-xs">
                                <div className="flex-1 flex items-center justify-center gap-1 bg-red-900/30 border border-red-500/20 px-2 py-1 rounded">
                                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                    <span className="text-white font-bold">{route.stats.high}</span>
                                </div>
                                <div className="flex-1 flex items-center justify-center gap-1 bg-yellow-900/30 border border-yellow-500/20 px-2 py-1 rounded">
                                    <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                                    <span className="text-white font-bold">{route.stats.medium}</span>
                                </div>
                                <div className="flex-1 flex items-center justify-center gap-1 bg-green-900/30 border border-green-500/20 px-2 py-1 rounded">
                                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                    <span className="text-white font-bold">{route.stats.low}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default RouteOptionsPanel;
