import React from 'react';

const StatisticsSection = () => {
    return (
        <section className="py-20 relative z-10 w-full overflow-hidden">
            {/* Dark Red Ambient Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[20%] right-[-10%] w-[40vw] h-[40vw] bg-red-900/10 rounded-full blur-[120px]"></div>
            </div>

            <div className="container mx-auto px-6 relative">
                <div className="flex flex-col md:flex-row gap-12 items-center">

                    {/* Text Column */}
                    <div className="md:w-1/3">
                        <div className="inline-block px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full text-red-400 text-xs font-bold tracking-widest uppercase mb-6">
                            Critical Alert
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                            The <span className="text-red-500">Silent Killer</span> <br />
                            on Indian Roads.
                        </h2>
                        <p className="text-slate-400 leading-relaxed mb-8">
                            Unreported road damages account for a significant percentage of annual accidents. Early detection is not just convenience—it's lifesaving.
                        </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                            {
                                val: "3,564",
                                label: "Deaths in 2020 alone",
                                sub: "Due to potholes",
                                icon: "💀",
                            },
                            {
                                val: "40%",
                                label: "Increase in accidents",
                                sub: "Since 2017",
                                icon: "📈",
                            },
                            {
                                val: "13k+",
                                label: "Serious Injuries",
                                sub: "Annually reported",
                                icon: "🚑",
                            },
                            {
                                val: "10",
                                label: "Deaths Per Day",
                                sub: "National Average",
                                icon: "⏱️",
                            }
                        ].map((stat, idx) => (
                            <div key={idx} className="p-6 bg-slate-900/80 border border-red-500/10 hover:border-red-500/30 rounded-2xl transition-all hover:bg-red-900/10 group">
                                <div className="flex justify-between items-start mb-4">
                                    <span className="text-3xl filter grayscale group-hover:grayscale-0 transition-all">{stat.icon}</span>
                                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                                </div>
                                <div className="text-3xl font-black text-white mb-1">{stat.val}</div>
                                <div className="text-sm font-bold text-red-400 mb-1">{stat.label}</div>
                                <div className="text-xs text-slate-500">{stat.sub}</div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
};

export default StatisticsSection;
