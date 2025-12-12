import React from 'react';

const SeveritySelector = ({ value, onChange }) => {
    const levels = [
        { id: 'Low', color: 'bg-green-500', border: 'border-green-500' },
        { id: 'Medium', color: 'bg-yellow-500', border: 'border-yellow-500' },
        { id: 'High', color: 'bg-red-500', border: 'border-red-500' },
    ];

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">Severity Level</label>
            <div className="flex gap-4">
                {levels.map((level) => (
                    <button
                        key={level.id}
                        type="button"
                        onClick={() => onChange(level.id)}
                        className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-center gap-2 font-semibold ${value === level.id
                                ? `${level.border} ${level.color} bg-opacity-20 text-white shadow-[0_0_15px_rgba(0,0,0,0.3)] transform scale-[1.02]`
                                : 'border-slate-700 bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 hover:border-slate-600'
                            }`}
                    >
                        <span className={`w-3 h-3 rounded-full ${level.color}`}></span>
                        {level.id}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default SeveritySelector;
