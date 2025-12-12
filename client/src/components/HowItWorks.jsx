import React, { useState } from 'react';

const HowItWorks = () => {
    return (
        <section id="how-it-works" className="py-20 relative z-10 w-full bg-slate-900/40 backdrop-blur-md border-t border-white/5">
            <div className="container mx-auto px-6">
                <div className="mb-16 text-center">
                    <span className="text-purple-400 font-mono text-xs uppercase tracking-[0.2em] mb-3 block">System Architecture</span>
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                        How It <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">Works</span>
                    </h2>
                    <p className="text-slate-400 max-w-2xl mx-auto">
                        End-to-end intelligent road monitoring pipeline using decentralized data collection.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {[
                        {
                            step: "01",
                            title: "Data Capture",
                            desc: "Users capture road video data via mobile app mounts.",
                            icon: (
                                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            )
                        },
                        {
                            step: "02",
                            title: "AI Engine",
                            desc: "YOLOv8 neural networks analyze frames for damages.",
                            icon: (
                                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                                </svg>
                            )
                        },
                        {
                            step: "03",
                            title: "Geo-Mapping",
                            desc: "Damage severity is mapped with precise GPS coords.",
                            icon: (
                                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            )
                        },
                        {
                            step: "04",
                            title: "Alert System",
                            desc: "Live alerts sent to travellers for safe routing.",
                            icon: (
                                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                            )
                        }
                    ].map((item, idx) => (
                        <div key={idx} className="group relative">
                            <div className="absolute inset-0 bg-purple-600/5 rounded-2xl transform group-hover:scale-105 transition-transform duration-500"></div>
                            <div className="relative p-8 border border-white/5 rounded-2xl h-full backdrop-blur-sm bg-slate-900/60 hover:border-purple-500/30 transition-colors">
                                <div className="absolute -top-6 -left-4 text-7xl font-black text-slate-800/30 select-none z-0">
                                    {item.step}
                                </div>
                                <div className="relative z-10">
                                    <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-purple-900/50 group-hover:scale-110 transition-transform">
                                        {item.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed">
                                        {item.desc}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* --- INTERFACE PREVIEW (Screenshots) --- */}
                <div className="mt-24">
                    <div className="text-center mb-12">
                        <h3 className="text-2xl font-bold text-white mb-4">Experience the Platform</h3>
                        <p className="text-slate-400">Intuitive interfaces designed for both reporters and travellers.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        {/* Reporter View */}
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
                            <div className="relative border border-white/10 rounded-2xl overflow-hidden shadow-2xl bg-slate-900">
                                <div className="absolute top-0 left-0 right-0 h-8 bg-slate-800 flex items-center px-4 space-x-2 border-b border-white/5">
                                    <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                                    <span className="text-xs text-slate-500 font-mono ml-4">reporter_dashboard.exe</span>
                                </div>
                                <img src="/demo/reporter.png" alt="Reporter Dashboard" className="w-full h-auto mt-8 opacity-90 hover:opacity-100 transition-opacity" />
                            </div>
                            <p className="text-center text-slate-400 mt-4 text-sm font-mono">Reporter: Log Potholes & Verify Data</p>
                        </div>

                        {/* Traveller View */}
                        <div className="relative group mt-8 md:mt-0">
                            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
                            <div className="relative border border-white/10 rounded-2xl overflow-hidden shadow-2xl bg-slate-900">
                                <div className="absolute top-0 left-0 right-0 h-8 bg-slate-800 flex items-center px-4 space-x-2 border-b border-white/5">
                                    <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                                    <span className="text-xs text-slate-500 font-mono ml-4">traveller_nav.app</span>
                                </div>
                                <img src="/traveller_nav_update.jpg" alt="Traveller Map" className="w-full h-auto mt-8 opacity-90 hover:opacity-100 transition-opacity" />
                            </div>
                            <p className="text-center text-slate-400 mt-4 text-sm font-mono">Traveller: Safe Route Navigation</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
