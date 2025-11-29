import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Icons } from '../ui/SharedComponents';

const MapView = () => {
    const mapContainerRef = useRef(null);
    const [userLocation, setUserLocation] = useState(null);
    const [mapInstance, setMapInstance] = useState(null);

    // Sample Data
    const RESOURCES_LOCATIONS = [
        { id: 1, name: "DREAM Rehab Center", lat: 14.6091, lng: 121.0223, type: "rehab", desc: "Accredited Rehabilitation" },
        { id: 2, name: "Metro Skills Hub", lat: 14.6507, lng: 121.0271, type: "training", desc: "Free Vocational Training" },
        { id: 3, name: "Hope General Hospital", lat: 14.5995, lng: 120.9842, type: "rehab", desc: "Medical Detox Unit" },
        { id: 4, name: "Community Center", lat: 14.6200, lng: 121.0500, type: "training", desc: "Livelihood Programs" }
    ];

    useEffect(() => {
        // Initialize Map
        if (!mapInstance && mapContainerRef.current) {
            const map = L.map(mapContainerRef.current).setView([14.6091, 121.0223], 12); // Default Manila
            
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors'
            }).addTo(map);

            // Add Resource Markers
            RESOURCES_LOCATIONS.forEach(loc => {
                const color = loc.type === 'rehab' ? 'red' : 'blue';
                const markerHtml = `<div style="background-color: ${color}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`;
                const icon = L.divIcon({ className: 'custom-marker', html: markerHtml });
                
                L.marker([loc.lat, loc.lng], { icon }).addTo(map)
                    .bindPopup(`<b>${loc.name}</b><br>${loc.desc}`);
            });

            setMapInstance(map);

            // Get User Location
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (pos) => {
                        const { latitude, longitude } = pos.coords;
                        setUserLocation({ lat: latitude, lng: longitude });
                        map.setView([latitude, longitude], 14);
                        
                        const userIcon = L.divIcon({ 
                            className: 'user-marker', 
                            html: '<div style="background-color: #C5A028; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(197, 160, 40, 0.5);"></div>' 
                        });
                        L.marker([latitude, longitude], { icon: userIcon }).addTo(map).bindPopup("You are here").openPopup();
                    },
                    (err) => console.error("Location access denied"),
                    { enableHighAccuracy: true }
                );
            }

            // Cleanup function to remove map instance
            return () => {
                map.remove();
                setMapInstance(null);
            };
        }
    }, []);

    return (
        <div className="h-full flex flex-col relative">
            <div ref={mapContainerRef} className="flex-1 z-0" style={{ minHeight: '50%' }} />
            <div className="bg-white dark:bg-slate-900 p-4 rounded-t-3xl -mt-6 relative z-10 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] flex-1 overflow-y-auto pb-24">
                <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mb-4"></div>
                <h3 className="font-bold text-xl text-barong-navy dark:text-barong-cream mb-4 flex items-center gap-2 font-serif"><Icons.Map className="text-barong-gold" /> Nearby Resources</h3>
                <div className="space-y-3">
                    {RESOURCES_LOCATIONS.map(loc => (
                        <div key={loc.id} className="flex items-start gap-3 p-3 rounded-xl bg-barong-beige/50 dark:bg-slate-800 border border-barong-navy/5">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${loc.type === 'rehab' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                                {loc.type === 'rehab' ? <Icons.ShieldCheck size={18} /> : <Icons.BookOpen size={18} />}
                            </div>
                            <div>
                                <h4 className="font-bold text-barong-navy dark:text-barong-cream">{loc.name}</h4>
                                <p className="text-xs text-slate-500">{loc.desc}</p>
                                <button onClick={() => mapInstance?.flyTo([loc.lat, loc.lng], 16)} className="text-xs text-barong-gold font-bold mt-1 hover:underline">View on Map</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MapView;
