import React from 'react';

const SeverityLegend = () => {
    return (
        <div className="absolute top-20 right-4 rounded-full bg-white/90 backdrop-blur-md border border-slate-200 shadow-lg px-3 py-1.5 flex items-center gap-3 z-[1000] scale-90 sm:scale-100 origin-top-right">
            <span className="text-[10px] uppercase font-bold text-slate-500 mr-1 hidden sm:inline-block">Severity</span>

            <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-sm"></span>
                <span className="text-[10px] font-bold text-slate-700">Hi</span>
            </div>

            <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 shadow-sm"></span>
                <span className="text-[10px] font-bold text-slate-700">Med</span>
            </div>

            <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-sm"></span>
                <span className="text-[10px] font-bold text-slate-700">Low</span>
            </div>
        </div>
    );
};

export default SeverityLegend;
