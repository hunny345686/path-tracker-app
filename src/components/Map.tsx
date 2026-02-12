import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom Marker Function styled for YouTube
const createMarkerIcon = (number, isHub = false) => {
    // Hub looks like a YouTube Play Button, Deliveries look like Red Notification pings
    const iconContent = isHub
        ? `<svg viewBox="0 0 24 24" width="18" height="18" fill="white"><path d="M8 5v14l11-7z"/></svg>`
        : `<span style="color: white; font-weight: 900; font-size: 11px;">${number}</span>`;

    const bgColor = isHub ? '#FF0000' : '#272727';
    const borderColor = isHub ? 'white' : '#FF0000';
    const size = isHub ? 36 : 28;

    return L.divIcon({
        html: `
            <div style="
                width: ${size}px; height: ${size}px; 
                background: ${bgColor}; 
                border: 2px solid ${borderColor}; 
                border-radius: 50%; 
                display: flex; align-items: center; justify-content: center;
                box-shadow: 0 4px 12px rgba(0,0,0,0.5);
                transition: all 0.2s ease;
            ">
                ${iconContent}
            </div>`,
        className: 'youtube-marker',
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
    });
};

export default function MapComponent({ HUB_START, route, deliveries }) {
    // Custom style for Leaflet Popups to match Dark Mode
    const popupStyle = {
        backgroundColor: '#1a1a1a',
        color: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #333'
    };

    return (
        <div className="lg:col-span-8 bg-[#0f0f0f] overflow-hidden h-[600px] border border-white/5 rounded-2xl shadow-2xl">
            <MapContainer
                center={[12.9716, 77.5946]}
                zoom={12}
                className="h-full w-full"
                zoomControl={false} // Cleaner UI
            >
                <TileLayer
                    url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
                    attribution='&copy; Stadia Maps'
                />

                {/* Hub Marker (The Channel Logo) */}
                <Marker position={[HUB_START.lat, HUB_START.lng]} icon={createMarkerIcon(0, true)}>
                    <Popup>
                        <div className="p-1 font-sans">
                            <p className="text-[10px] font-bold text-[#FF0000] uppercase tracking-widest">Starting Point</p>
                            <p className="text-sm font-bold text-black">Main Hub: Indiranagar</p>
                        </div>
                    </Popup>
                </Marker>

                {/* Delivery Markers (The Video Stops) */}
                {(route.length > 0 ? route.slice(1) : deliveries).map((d, i) => (
                    <Marker key={d.id} position={[d.lat, d.lng]} icon={createMarkerIcon(i + 1)}>
                        <Popup>
                            <div className="p-1 font-sans">
                                <p className="text-[10px] font-bold text-[#aaaaaa] uppercase">Stop #{i + 1}</p>
                                <p className="text-sm font-bold text-black">{d.product}</p>
                                <p className="text-[11px] text-gray-600">{d.customerName}</p>
                            </div>
                        </Popup>
                    </Marker>
                ))}

                {/* YouTube Red Path */}
                {route.length > 1 && (
                    <>
                        {/* Glow effect for the path */}
                        <Polyline
                            positions={route.map(p => [p.lat, p.lng])}
                            color="#FF0000"
                            weight={8}
                            opacity={0.15}
                        />
                        {/* Main Path */}
                        <Polyline
                            positions={route.map(p => [p.lat, p.lng])}
                            color="#FF0000"
                            weight={3}
                            opacity={1}
                            dashArray="1, 10" // Optional: makes it look like a progress bar
                        />
                    </>
                )}
            </MapContainer>
        </div>
    );
}