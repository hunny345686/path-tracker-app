import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom Marker Function
const createMarkerIcon = (number, isHub = false) => {
    const iconContent = isHub
        ? `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="white" stroke-width="2"><path d="M5.5 17.5L2 14l3.5-3.5M2 14h13.5M17 6H7a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2z"/><circle cx="17.5" cy="17.5" r="2.5"/><circle cx="6.5" cy="17.5" r="2.5"/></svg>`
        : `<span style="color: white; font-weight: bold; font-size: 12px;">${number}</span>`;

    return L.divIcon({
        html: `
            <div style="display: flex; align-items: center; justify-content: center; position: relative;">
                <div style="
                    width: 32px; height: 32px; 
                    background: ${isHub ? 'linear-gradient(135deg, #0ea5e9, #2563eb)' : '#1e293b'}; 
                    border: 2px solid white; 
                    border-radius: 50%; 
                    display: flex; align-items: center; justify-content: center;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.5);
                ">
                    ${iconContent}
                </div>
            </div>`,
        className: 'custom-pin',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
    });
};

export default function MapComponent({ HUB_START, route, deliveries }) {
    return (
        <div className="lg:col-span-8 bg-[#0f172a]  overflow-hidden h-[600px] ">
            <MapContainer
                center={[12.9716, 77.5946]}
                zoom={12}
                className="h-full w-full"
            >

                <TileLayer
                    url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
                    attribution='&copy; Stadia Maps'
                />
                {/* Hub Marker */}
                <Marker position={[HUB_START.lat, HUB_START.lng]} icon={createMarkerIcon(0, true)}>
                    <Popup>
                        <div style={{ color: '#000' }}><strong>Base:</strong> Indiranagar</div>
                    </Popup>
                </Marker>

                {/* Delivery Markers */}
                {(route.length > 0 ? route.slice(1) : deliveries).map((d, i) => (
                    <Marker key={d.id} position={[d.lat, d.lng]} icon={createMarkerIcon(i + 1)}>
                        <Popup>
                            <div style={{ color: '#000' }}>
                                <strong>{d.product}</strong><br />
                                {d.address}
                            </div>
                        </Popup>
                    </Marker>
                ))}

                {/* Neon Path */}
                {route.length > 1 && (
                    <Polyline
                        positions={route.map(p => [p.lat, p.lng])}
                        color="#22d3ee"
                        weight={4}
                        opacity={0.9}
                    />
                )}
            </MapContainer>
        </div>
    );
}