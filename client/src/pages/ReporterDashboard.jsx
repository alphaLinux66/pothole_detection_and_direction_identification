import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, Popup } from 'react-leaflet';
import api from '../api';
import SeveritySelector from '../components/SeveritySelector';
import { useNavigate } from 'react-router-dom';

// Component to handle map clicks and markers
const LocationHandler = ({ location, setLocation }) => {
    const map = useMapEvents({
        click(e) {
            setLocation({ lat: e.latlng.lat, lng: e.latlng.lng });
        },
    });

    // Fly to location when it changes (e.g. from GPS)
    useEffect(() => {
        if (location) {
            map.flyTo([location.lat, location.lng], 15);
        }
    }, [location, map]);

    return location ? (
        <Marker position={[location.lat, location.lng]}>
            <Popup>Report Location</Popup>
        </Marker>
    ) : null;
};

const ReporterDashboard = () => {
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [location, setLocation] = useState(null);
    const [severity, setSeverity] = useState('');
    const [potholes, setPotholes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [locLoading, setLocLoading] = useState(false);

    // Initial Data Fetch
    const fetchPotholes = async () => {
        try {
            const res = await api.get('/potholes/mine');
            setPotholes(res.data);
        } catch (err) {
            console.error("Fetch error:", err);
        }
    };

    useEffect(() => {
        fetchPotholes();
        detectLocation();
    }, []);

    // Geolocation Logic
    const detectLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            return;
        }

        setLocLoading(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
                setLocLoading(false);
            },
            (error) => {
                console.error("GPS Error:", error);
                setLocLoading(false);
                // Don't alert aggressively on load, user can set manually
            }
        );
    };

    // File Handler
    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (selected) {
            setFile(selected);
            setPreviewUrl(URL.createObjectURL(selected));
        }
    };

    // Submit Logic
    const handleUpload = async (e) => {
        e.preventDefault();

        // Validation with Warnings
        if (!file) {
            alert('⚠️ Please upload an image of the pothole.');
            return;
        }
        if (!location) {
            alert('⚠️ Please set a location on the map.');
            return;
        }
        if (!severity) {
            alert('⚠️ Please select a severity level.');
            return;
        }

        const formData = new FormData();
        formData.append('image', file);
        formData.append('lat', location.lat);
        formData.append('lng', location.lng);
        formData.append('severity', severity);

        setLoading(true);
        try {
            await api.post('/potholes/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            // Success State
            alert('✅ Pothole reported successfully!');
            fetchPotholes();

            // Reset Form
            setFile(null);
            setPreviewUrl(null);
            setSeverity('');
            // Keep location as user might report nearby again
        } catch (err) {
            console.error("Upload error:", err);
            alert('❌ Failed to report pothole.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#030712] text-white pt-24 pb-10 px-4 relative">

            {/* Background Gradients */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[100px]"></div>
            </div>

            <div className="container mx-auto relative z-10 max-w-6xl">
                <div className="flex flex-col-reverse lg:flex-row gap-8 mb-10">

                    {/* Left Column: Report Form (Bottom on Mobile, Left on Desktop) */}
                    <div className="w-full lg:w-1/3 bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-2xl h-fit">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                                New Report
                            </h2>
                            <div className="animate-pulse w-2 h-2 rounded-full bg-green-500"></div>
                        </div>

                        <form onSubmit={handleUpload} className="space-y-6">
                            {/* Image Upload */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-300">Evidence</label>
                                <div className="border-2 border-dashed border-slate-700 hover:border-blue-500 rounded-xl p-4 transition-colors text-center relative cursor-pointer group bg-slate-900/50">
                                    <input
                                        type="file"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        accept="image/*"
                                    />
                                    {previewUrl ? (
                                        <div className="relative h-40">
                                            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                                                <span className="text-sm font-medium">Change Image</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="py-8">
                                            <svg className="w-10 h-10 mx-auto text-slate-500 mb-2 group-hover:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <span className="text-sm text-slate-400">Click to upload image</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Severity Selector */}
                            <SeveritySelector value={severity} onChange={setSeverity} />

                            {/* Location Display */}
                            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">Coordinates</span>
                                    {locLoading && <span className="text-xs text-blue-400 animate-pulse">Locating...</span>}
                                </div>
                                <div className="font-mono text-lg text-white truncate">
                                    {location ? `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}` : <span className="text-slate-500">Waiting for map...</span>}
                                </div>
                                <button type="button" onClick={detectLocation} className="text-xs text-blue-400 hover:text-blue-300 mt-2 flex items-center gap-1 underline decoration-dashed">
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    Re-center GPS
                                </button>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                        Uploading...
                                    </span>
                                ) : 'Submit Report'}
                            </button>
                        </form>
                    </div>

                    {/* Right Column: Map (Top on Mobile, Right on Desktop) */}
                    <div className="w-full lg:w-2/3 h-[45vh] lg:h-auto min-h-[400px] bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-white/10 relative">
                        <MapContainer
                            center={[20.5937, 78.9629]} // Default India
                            zoom={5}
                            style={{ height: '100%', width: '100%' }}
                            className="z-0"
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <LocationHandler location={location} setLocation={setLocation} />
                        </MapContainer>

                        {/* Overlay Hint */}
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 z-[400] text-sm text-slate-200 pointer-events-none w-max max-w-[90%] text-center">
                            📍 Click map to set signal
                        </div>
                    </div>
                </div>

                {/* Bottom Section: My Reports */}
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8 shadow-xl">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                        Past Assignments
                    </h3>

                    {potholes.length === 0 ? (
                        <div className="text-center py-12 text-slate-500 border-2 border-dashed border-slate-800 rounded-xl">
                            No reports submitted yet.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {potholes.map((p) => (
                                <div key={p.id} className="group bg-slate-800/40 border border-slate-700/50 rounded-2xl overflow-hidden hover:bg-slate-800/60 transition-all hover:border-slate-600">
                                    <div className="h-40 overflow-hidden relative">
                                        <img src={`http://localhost:3000${p.image_url}`} alt="Evidence" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                        <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-bold shadow-md
                                            ${p.severity === 'High' ? 'bg-red-500 text-white' :
                                                p.severity === 'Medium' ? 'bg-yellow-500 text-black' :
                                                    'bg-green-500 text-white'}`}>
                                            {p.severity}
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="text-xs text-slate-400 font-mono">
                                                lat: {p.lat ? p.lat.toFixed(4) : 'N/A'}<br />
                                                lng: {p.lng ? p.lng.toFixed(4) : 'N/A'}
                                            </div>
                                            <div className="text-right">
                                                <div className="text-xs text-slate-500">{new Date(p.created_at).toLocaleDateString()}</div>
                                            </div>
                                        </div>
                                        <div className="mt-3 flex items-center justify-between">
                                            <span className="text-xs font-semibold px-2 py-1 bg-slate-700 rounded text-slate-300">
                                                Confidence: {(p.confidence * 100).toFixed(1)}%
                                            </span>
                                            <span className={`w-2 h-2 rounded-full ${p.detected ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`}></span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReporterDashboard;
