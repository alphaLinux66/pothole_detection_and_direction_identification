import React, { useState, useEffect, useRef } from 'react';

const LocationInput = ({ placeholder, value, onChange, onSelect }) => {
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const wrapperRef = useRef(null);

    // Close dropdown if clicked outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    const handleInput = async (e) => {
        const val = e.target.value;
        onChange(val);

        if (val.length > 2) {
            try {
                const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(val)}&addressdetails=1&limit=5`);
                const data = await res.json();
                setSuggestions(data);
                setShowSuggestions(true);
            } catch (err) {
                console.error("Autocomplete error:", err);
            }
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    const handleSelect = (item) => {
        onChange(item.display_name); // Set text to full address
        setShowSuggestions(false);
        if (onSelect) {
            // Pass lat/lon back
            onSelect({
                lat: parseFloat(item.lat),
                lng: parseFloat(item.lon),
                display_name: item.display_name
            });
        }
    };

    return (
        <div className="relative flex-1" ref={wrapperRef}>
            <input
                className="w-full bg-transparent border-none outline-none text-slate-800 px-4 py-2 placeholder-slate-400 font-medium"
                placeholder={placeholder}
                value={value}
                onChange={handleInput}
                onFocus={() => {
                    // Show suggestions again if we have them
                    if (suggestions.length > 0) setShowSuggestions(true);
                }}
            />

            {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 w-full bg-white rounded-xl shadow-xl mt-2 border border-slate-100 overflow-hidden z-[2000] text-left">
                    {suggestions.map((item, idx) => (
                        <div
                            key={idx}
                            onClick={() => handleSelect(item)}
                            className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-slate-50 last:border-none transition-colors"
                        >
                            <p className="text-sm font-semibold text-slate-700 truncate">{item.display_name.split(',')[0]}</p>
                            <p className="text-xs text-slate-500 truncate">{item.display_name}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LocationInput;
