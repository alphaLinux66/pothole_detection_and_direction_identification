import React from 'react';
import { useNavigate } from 'react-router-dom';

const UserActionCards = () => {
    const navigate = useNavigate();

    return (
        <section className="relative z-10 w-full py-12">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">

                    {/* --- Card A: Reporter --- */}
                    <div
                        onClick={() => navigate('/reporter')}
                        className="group relative cursor-pointer animate-fade-in-up delay-100"
                    >
                        {/* Glow Effect */}
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-3xl blur opacity-30 group-hover:opacity-75 transition duration-500"></div>

                        <div className="relative h-full bg-white/5 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 flex flex-col items-center text-center hover:bg-white/10 transition-all transform group-hover:-translate-y-1 shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]">
                            <div className="w-20 h-20 mb-6 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full flex items-center justify-center border border-blue-500/30 group-hover:scale-110 transition-transform duration-500">
                                <svg className="w-10 h-10 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>

                            <h3 className="text-3xl font-bold text-white mb-3">Report a Pothole</h3>
                            <p className="text-slate-400 mb-8 flex-grow">
                                Upload images and mark potholes to help improve road safety for everyone in your community.
                            </p>

                            <button className="px-8 py-3 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 bg-[length:200%_auto] animate-gradient-x text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 group-hover:shadow-cyan-500/40 transition-all w-full">
                                Start Reporting
                            </button>
                        </div>
                    </div>

                    {/* --- Card B: Traveller --- */}
                    <div
                        onClick={() => navigate('/traveller')}
                        className="group relative cursor-pointer animate-fade-in-up delay-200"
                    >
                        {/* Glow Effect */}
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-violet-500 rounded-3xl blur opacity-30 group-hover:opacity-75 transition duration-500"></div>

                        <div className="relative h-full bg-white/5 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 flex flex-col items-center text-center hover:bg-white/10 transition-all transform group-hover:-translate-y-1 shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]">
                            <div className="w-20 h-20 mb-6 bg-gradient-to-br from-purple-500/20 to-violet-500/20 rounded-full flex items-center justify-center border border-purple-500/30 group-hover:scale-110 transition-transform duration-500">
                                <svg className="w-10 h-10 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 7m0 13V7" />
                                </svg>
                            </div>

                            <h3 className="text-3xl font-bold text-white mb-3">Find Safe Routes</h3>
                            <p className="text-slate-400 mb-8 flex-grow">
                                View alternate routes, avoid high-severity potholes, and ensure a smooth journey.
                            </p>

                            <button className="px-8 py-3 bg-gradient-to-r from-purple-600 via-violet-500 to-purple-600 bg-[length:200%_auto] animate-gradient-x text-white font-bold rounded-xl shadow-lg shadow-purple-500/20 group-hover:shadow-violet-500/40 transition-all w-full">
                                Find Routes
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default UserActionCards;
