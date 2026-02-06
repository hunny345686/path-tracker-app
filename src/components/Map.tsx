import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
// Custom Numbered Pin for Map
const createMarkerIcon = (number, isHub = false) => L.divIcon({
    html: `<div class="flex items-center justify-center w-8 h-8 rounded-full border-2 border-white shadow-lg font-bold text-sm 
           ${isHub ? 'bg-orange-500' : 'bg-indigo-600'} text-white">
           ${isHub ? '★' : number}
           </div>`,
    className: 'custom-pin',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
});

// const createMarkerIcon = (number, isHub = false) => L.icon({
//     iconUrl: './public/delivery.png',
//     shadowUrl: 'leaf-shadow.png',

//     iconSize: [16, 95], // size of the icon
//     shadowSize: [50, 64], // size of the shadow
//     iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
//     shadowAnchor: [4, 62],  // the same for the shadow
//     popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
// });
export default function Map({ HUB_START, route, deliveries }) {

    {/* Right Area: Map */ }
    return (
        <div className="lg:col-span-8 bg-white rounded-4xl border-4 border-white shadow-2xl overflow-hidden h-[600px] sticky top-28" >
            <MapContainer center={[12.95, 77.65]} zoom={12} className="h-full w-full">
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                {/* Start Hub */}
                <Marker position={[HUB_START.lat, HUB_START.lng]} icon={createMarkerIcon(0, true)}>
                    <Popup><p className="font-bold">Base: Indiranagar</p></Popup>
                </Marker>

                {/* Delivery Markers */}
                {(route.length > 0 ? route.slice(1) : deliveries).map((d, i) => (
                    <Marker key={d.id} position={[d.lat, d.lng]} icon={createMarkerIcon(i + 1)}>
                        <Popup>
                            <div className="p-1">
                                <p className="font-bold border-b pb-1 mb-1">{d.product}</p>
                                <p className="text-xs">{d.address}</p>
                            </div>
                        </Popup>
                    </Marker>
                ))}

                {route.length > 1 && (
                    <Polyline positions={route.map(p => [p.lat, p.lng])} color="#4F46E5" weight={5} opacity={0.8} dashArray="12, 12" />
                )}
            </MapContainer>
        </div >
    )
}