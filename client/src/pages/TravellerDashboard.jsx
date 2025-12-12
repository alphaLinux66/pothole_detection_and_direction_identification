import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, useMap, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import api from '../api';
import RouteOptionsPanel from '../components/RouteOptionsPanel';
import LocationInput from '../components/LocationInput';
import SeverityLegend from '../components/SeverityLegend';
import { useNavigate } from 'react-router-dom';

// Fix Icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Start/End Icons
const startIcon = new L.Icon({
    iconUrl: '/markers/green.png',
    shadowUrl: '/markers/shadow.png',
    iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});

const endIcon = new L.Icon({
    iconUrl: '/markers/red.png',
    shadowUrl: '/markers/shadow.png',
    iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});

const potholeIcon = new L.Icon({
    iconUrl: '/markers/orange.png',
    shadowUrl: '/markers/shadow.png',
    iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});

const TravellerDashboard = () => {
    const navigate = useNavigate();
    const [source, setSource] = useState('📍 My Location');
    const [destination, setDestination] = useState('');
    const [routes, setRoutes] = useState([]);
    const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [markers, setMarkers] = useState({ start: null, end: null });
    const [userLoc, setUserLoc] = useState(null);
    const [mobilePanelOpen, setMobilePanelOpen] = useState(false); // Mobile Bottom Sheet State

    // To store precise coords selected from autocomplete
    // If user types manually and doesn't select, we fallback to geocoding the string
    const [preciseCoords, setPreciseCoords] = useState({ start: null, end: null });

    // 1. Auto-Detect Location on Mount
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const coords = [position.coords.latitude, position.coords.longitude];
                    setUserLoc(coords);
                    setPreciseCoords(prev => ({ ...prev, start: coords }));
                    setMarkers(prev => ({ ...prev, start: coords }));
                },
                (error) => {
                    console.error("GPS Error:", error);
                    setSource('');
                }
            );
        }
    }, []);

    // Geocoding Helper (Fallback)
    const geocode = async (query) => {
        if (query === '📍 My Location' && userLoc) return userLoc;

        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
            const data = await res.json();
            if (data && data.length > 0) {
                return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
            }
        } catch (e) {
            console.error("Geocoding failed", e);
        }
        return null;
    };

    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        if (!source || !destination) return;

        setLoading(true);
        setRoutes([]);

        try {
            // 1. Determine Start Coords
            // Use precise selected coords if available, otherwise geocode string
            let startCoords = preciseCoords.start;
            if (!startCoords || source !== '📍 My Location') {
                // Double check if usage changed (e.g. user typed something else)
                // Just attempt geocode if we don't have a direct hit or if text changed significantly
                // For simplicity, always try geocode if 'precise' missing, or trust text
                if (!startCoords) startCoords = await geocode(source);
            }

            // 2. Determine End Coords
            let endCoords = preciseCoords.end;
            if (!endCoords) {
                endCoords = await geocode(destination);
            }

            if (!startCoords || !endCoords) {
                alert("Could not find one of the locations. Please check the spelling.");
                setLoading(false);
                return;
            }

            setMarkers({ start: startCoords, end: endCoords });

            // 3. Fetch Safe Routes
            const res = await api.post('/potholes/routes', {
                start: startCoords,
                end: endCoords
            });

            setRoutes(res.data);
            setSelectedRouteIndex(0);
            setMobilePanelOpen(true); // Auto-open on results

        } catch (err) {
            console.error("Route Error:", err);
            alert("Failed to calculate routes. Backend might be down or OSRM too busy.");
        } finally {
            setLoading(false);
        }
    };

    // Polyline Decoder function moved to bottom of file for shared usage

    return (
        <div className="h-screen w-screen flex flex-col bg-slate-100 relative overflow-hidden">

            {/* Search Bar - Floating */}
            <div className="absolute top-12 left-1/2 -translate-x-1/2 z-[1000] w-[90%] max-w-2xl bg-white/90 backdrop-blur-md border border-slate-200 p-2 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-2 items-center mt-4">

                <div className="flex-1 w-full flex items-center md:border-r border-slate-300 pr-2">
                    <LocationInput
                        placeholder="Start Place"
                        value={source}
                        onChange={setSource}
                        onSelect={(item) => {
                            setSource(item.display_name);
                            setPreciseCoords(prev => ({ ...prev, start: [item.lat, item.lng] }));
                        }}
                    />
                </div>

                <div className="flex-1 w-full flex items-center">
                    <LocationInput
                        placeholder="Destination (e.g. BMSCE)"
                        value={destination}
                        onChange={setDestination}
                        onSelect={(item) => {
                            setDestination(item.display_name);
                            setPreciseCoords(prev => ({ ...prev, end: [item.lat, item.lng] }));
                        }}
                    />
                </div>

                <button
                    onClick={handleSearch}
                    disabled={loading}
                    className="w-full md:w-auto bg-blue-600 hover:bg-blue-500 text-white px-8 py-2 rounded-xl font-bold transition-all disabled:opacity-50 shadow-lg"
                >
                    {loading ? 'Routing...' : 'Go'}
                </button>
            </div>

            {/* Main Map Area */}
            <div className="flex-1 relative z-0">
                <MapContainer center={[12.9716, 77.5946]} zoom={13} style={{ height: '100%', width: '100%', background: '#e2e8f0' }}>

                    {/* STANDARD LIGHT MAP TILES */}
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />

                    {/* Auto-Zoom Helper */}
                    <MapRecenter markers={markers} routes={routes} selectedRoute={routes[selectedRouteIndex]} />

                    {/* Render Routes */}
                    {/* Render Routes - Sort so selected is last (on top) */}
                    {routes
                        .map((route, originalIdx) => ({ route, originalIdx }))
                        .sort((a, b) => (a.originalIdx === selectedRouteIndex ? 1 : -1))
                        .map(({ route, originalIdx }) => {
                            const isSelected = originalIdx === selectedRouteIndex;
                            const decodedPath = decodePolyline(route.geometry);

                            // default base color (Risk based)
                            let riskColor = '#2563eb'; // Blue
                            if (route.stats.score > 15) riskColor = '#dc2626'; // Red
                            else if (route.stats.score > 5) riskColor = '#ca8a04'; // Dark Yellow

                            // Google Maps Style: Unselected = Gray, Selected = Colored
                            const displayColor = isSelected ? riskColor : '#94a3b8'; // slate-400
                            const displayWeight = isSelected ? 8 : 6;
                            const displayOpacity = isSelected ? 1.0 : 0.6;

                            return (
                                <Polyline
                                    key={originalIdx}
                                    positions={decodedPath}
                                    pathOptions={{
                                        color: displayColor,
                                        weight: displayWeight,
                                        opacity: displayOpacity,
                                        lineCap: 'round',
                                        lineJoin: 'round'
                                    }}
                                    eventHandlers={{
                                        click: (e) => {
                                            L.DomEvent.stopPropagation(e); // Prevent map click
                                            setSelectedRouteIndex(originalIdx);
                                        },
                                        mouseover: (e) => {
                                            if (!isSelected) {
                                                e.target.setStyle({ color: '#64748b', opacity: 0.9, weight: 7 }); // Darker gray on hover
                                            }
                                        },
                                        mouseout: (e) => {
                                            if (!isSelected) {
                                                e.target.setStyle({ color: '#94a3b8', opacity: 0.6, weight: 6 }); // Reset
                                            }
                                        }
                                    }}
                                />
                            );
                        })}

                    {/* Render Potholes for Selected Route */}
                    {routes[selectedRouteIndex]?.potholes?.map((pothole, idx) => (
                        <Marker
                            key={`pothole-${idx}`}
                            position={[pothole.lat, pothole.lng]}
                            icon={potholeIcon}
                        >
                            <Popup>
                                <div className="text-center">
                                    <h3 className="font-bold text-red-600">Pothole Found</h3>
                                    <p>Severity: {pothole.severity}</p>
                                    <p>Confidence: {(pothole.confidence * 100).toFixed(0)}%</p>
                                </div>
                            </Popup>
                        </Marker>
                    ))}

                    {markers.start && <Marker position={markers.start} icon={startIcon}><Popup>Start</Popup></Marker>}
                    {markers.end && <Marker position={markers.end} icon={endIcon}><Popup>Destination</Popup></Marker>}

                </MapContainer>
            </div>

            {/* Route Options Panel - Adaptive Layout */}
            {/* Desktop: Sidebar (Top-Left) | Mobile: Bottom Sheet */}
            <div
                className={`z-[1000] transition-transform duration-300 ease-in-out
                    md:absolute md:top-48 md:left-4 md:w-80 md:translate-y-0
                    fixed bottom-0 left-0 w-full rounded-t-3xl md:rounded-2xl
                    ${mobilePanelOpen ? 'translate-y-0' : 'translate-y-[85%] md:translate-y-0'}
                `}
            >
                {/* Mobile Handle / Toggle Area */}
                <div
                    className="md:hidden w-full h-8 flex items-center justify-center bg-[#0f172a]/95 rounded-t-3xl border-t border-slate-700/50 cursor-pointer"
                    onClick={() => setMobilePanelOpen(!mobilePanelOpen)}
                >
                    <div className="w-12 h-1.5 bg-slate-600 rounded-full"></div>
                </div>

                <RouteOptionsPanel
                    routes={routes}
                    selectedRouteIndex={selectedRouteIndex}
                    onSelectRoute={setSelectedRouteIndex}
                    className="h-[60vh] md:max-h-[calc(100vh-14rem)] md:h-auto rounded-none md:rounded-2xl border-t-0 md:border-t"
                />
            </div>


        </div>
    );
};

// --- Helper Component for Auto-Zoom ---
const MapRecenter = ({ markers, routes, selectedRoute }) => {
    const map = useMap();

    useEffect(() => {
        if (selectedRoute) {
            // Decode the selected route geometry and fit bounds
            try {
                const decodedPath = decodePolyline(selectedRoute.geometry);
                if (decodedPath && decodedPath.length > 0) {
                    const bounds = L.latLngBounds(decodedPath);
                    map.fitBounds(bounds, { padding: [50, 50] });
                    return;
                }
            } catch (e) {
                console.error("Error decoding route for zoom:", e);
            }
        }

        // Fallback: Fit to markers if no route selected or decoding failed
        if (markers.start && markers.end) {
            const bounds = L.latLngBounds([markers.start, markers.end]);
            map.fitBounds(bounds, { padding: [100, 100], maxZoom: 15 });
        } else if (markers.start) {
            map.flyTo(markers.start, 15);
        }
    }, [markers, routes, selectedRoute, map]);

    return null;
};

// Polyline Decoder (Moved outside for shared use)
function decodePolyline(str, precision) {
    var index = 0, lat = 0, lng = 0, coordinates = [], shift = 0, result = 0, byte = null, latitude_change, longitude_change, factor = Math.pow(10, precision || 5);
    while (index < str.length) {
        byte = null; shift = 0; result = 0;
        do {
            byte = str.charCodeAt(index++) - 63;
            result |= (byte & 0x1f) << shift;
            shift += 5;
        } while (byte >= 0x20);
        latitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));
        shift = result = 0;
        do {
            byte = str.charCodeAt(index++) - 63;
            result |= (byte & 0x1f) << shift;
            shift += 5;
        } while (byte >= 0x20);
        longitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));
        lat += latitude_change;
        lng += longitude_change;
        coordinates.push([lat / factor, lng / factor]);
    }
    return coordinates;
};

export default TravellerDashboard;
