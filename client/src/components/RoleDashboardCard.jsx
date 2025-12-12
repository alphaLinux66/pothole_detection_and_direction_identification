import React from 'react';
import { useNavigate } from 'react-router-dom';

const RoleDashboardCard = ({ role }) => {
    const navigate = useNavigate();

    const isReporter = role === 'REPORTER';

    // Config based on role
    const title = isReporter ? "Report a Pothole" : "Find Safe Routes";
    const desc = isReporter
        ? "Upload road images, mark pothole locations with precision, and contribute to safer journeys for everyone."
        : "View optimized routes, avoid high-severity roads, and travel smarter with our real-time AI guidance.";

    const btnText = isReporter ? "Start Reporting" : "Find Routes";
    const targetPath = isReporter ? "/reporter" : "/traveller";

    // Style Variations
    const gradient = isReporter
        ? "from-blue-600/20 to-cyan-600/20 border-cyan-500/30"
        : "from-purple-600/20 to-yellow-600/20 border-yellow-500/30";

    const iconColor = isReporter ? "text-cyan-400" : "text-yellow-400";
    const btnGradient = isReporter
        ? "bg-gradient-to-r from-blue-600 to-cyan-600 hover:shadow-cyan-500/30"
        : "bg-gradient-to-r from-purple-600 to-yellow-600 hover:shadow-yellow-500/30";

    const Icon = isReporter
        ? (
            <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        )
        : (
            <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 7m0 13V7" />
            </svg>
        );

    return (
        <div className="w-full h-screen flex items-center justify-center relative z-20">
            <div className={`relative w-full max-w-lg p-8 rounded-3xl border backdrop-blur-xl bg-gradient-to-tr ${gradient} shadow-2xl transform transition-transform hover:scale-[1.02]`}>

                {/* Neon Glow */}
                <div className={`absolute -inset-1 rounded-3xl blur opacity-20 bg-gradient-to-r ${isReporter ? 'from-cyan-400 to-blue-600' : 'from-yellow-400 to-purple-600'}`}></div>

                <div className="relative z-10 text-center">
                    <div className={`mx-auto mb-6 w-24 h-24 rounded-full bg-white/5 flex items-center justify-center ${iconColor} border border-white/10`}>
                        {Icon}
                    </div>

                    <h2 className="text-3xl font-black text-white mb-4">{title}</h2>
                    <p className="text-slate-300 text-lg mb-8 leading-relaxed">
                        {desc}
                    </p>

                    <button
                        onClick={() => navigate(targetPath)}
                        className={`w-full py-4 rounded-xl font-bold text-white text-lg shadow-lg transition-all transform active:scale-95 ${btnGradient}`}
                    >
                        {btnText}
                    </button>

                    <div className="mt-6 text-xs text-slate-500 font-mono uppercase tracking-widest">
                        {isReporter ? 'Authorized Access Only' : 'Optimized for Travel'}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoleDashboardCard;
