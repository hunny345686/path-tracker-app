export default function TabComponent({ activeTab, deliveries, setDeliveries, solveRoute, route }) {

    const removeDelivery = (id) => {
        setDeliveries(prev => prev.filter(item => item.id !== id));
    };

    // --- GOOGLE MAPS EXPORT LOGIC ---
    const exportToGoogleMaps = () => {
        if (route.length < 2) return;

        // Origin is the Hub (Start)
        const origin = `${route[0].lat},${route[0].lng}`;
        // Destination is the last delivery in the optimized path
        const destination = `${route[route.length - 1].lat},${route[route.length - 1].lng}`;
        // Waypoints are everything in between, joined by a pipe |
        const intermediateWaypoints = route.slice(1, -1)
            .map(p => `${p.lat},${p.lng}`)
            .join('|');

        const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&waypoints=${intermediateWaypoints}&travelmode=driving`;

        window.open(googleMapsUrl, '_blank');
    };

    return (
        <div className="p-4 max-h-[600px] overflow-y-auto custom-scrollbar bg-[#0f0f0f]">
            {activeTab === 'list' ? (
                <div className="space-y-4">
                    <div className="flex justify-between items-center mb-2 px-1">
                        <h3 className="text-[11px] font-bold text-[#aaaaaa] uppercase tracking-wider">
                            Pending Orders — {deliveries.length}
                        </h3>
                    </div>

                    {deliveries.length === 0 && (
                        <div className="text-center py-16 bg-[#1a1a1a] rounded-xl border border-[#333]">
                            <p className="text-[#aaaaaa] text-sm">No videos... err, deliveries in queue</p>
                        </div>
                    )}

                    {deliveries.map(d => (
                        <div key={d.id} className="group flex gap-3 p-1 rounded-xl transition-all hover:bg-[#272727]">
                            {/* Thumbnail Style Icon */}
                            <div className="w-32 h-20 bg-[#272727] flex-shrink-0 rounded-xl flex items-center justify-center text-2xl group-hover:bg-[#3f3f3f] transition-colors">
                                📦
                            </div>

                            {/* Content Info */}
                            <div className="flex-1 min-w-0 pr-2 relative">
                                <p className="text-sm font-bold text-white line-clamp-2 leading-tight mb-1">{d.product}</p>
                                <p className="text-[12px] text-[#aaaaaa] font-medium">{d.customerName || 'Guest'}</p>
                                <p className="text-[11px] text-[#aaaaaa] truncate mt-0.5">📍 {d.address}</p>

                                {/* Hover Action: Remove */}
                                <button
                                    onClick={() => removeDelivery(d.id)}
                                    className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 p-2 text-[#aaaaaa] hover:text-white transition-all"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                                </button>

                                <div className="mt-2">
                                    <a href={`tel:${d.mobile}`} className="text-[10px] font-bold text-blue-400 hover:bg-blue-400/10 px-2 py-1 rounded uppercase tracking-tighter">
                                        Contact Driver
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}

                    {deliveries.length > 0 && (
                        <button onClick={solveRoute} className="w-full bg-[#FF0000] text-white py-2.5 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-[#cc0000] transition-all mt-4 shadow-lg flex items-center justify-center gap-2">
                            <span>Optimize Playlist</span>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                        </button>
                    )}
                </div>
            ) : (
                <div className="space-y-4">
                    {/* Google Maps Export Button (YouTube Share Style) */}
                    <button
                        onClick={exportToGoogleMaps}
                        className="w-full bg-[#272727] hover:bg-[#3f3f3f] text-white py-2.5 rounded-full font-bold text-sm flex items-center justify-center gap-2 transition-colors border border-white/10"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" /></svg>
                        Share to Google Maps
                    </button>

                    <div className="bg-[#1a1a1a] p-4 rounded-xl border border-white/5 relative overflow-hidden">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#FF0000]">Packing Protocol</p>
                        <h4 className="text-sm font-bold mt-1 text-white">LIFO Queue (Bottom to Top)</h4>
                        <p className="text-[11px] text-[#aaaaaa] mt-1 leading-tight">
                            The last item in this list goes into your bag first.
                        </p>
                    </div>

                    <div className="space-y-2">
                        {[...route].slice(1).reverse().map((stop, idx) => {
                            const isNextUp = idx === route.length - 2;
                            return (
                                <div key={idx} className={`flex items-center gap-3 p-2 rounded-lg ${isNextUp ? 'bg-white/10 ring-1 ring-white/20' : 'bg-transparent hover:bg-white/5'}`}>
                                    <span className="text-[10px] font-bold text-[#aaaaaa] w-4">{idx + 1}</span>
                                    <div className="w-14 h-10 bg-[#272727] rounded-lg flex-shrink-0 flex items-center justify-center text-lg">
                                        📦
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold text-white truncate">{stop.product}</p>
                                        <p className="text-[10px] text-[#aaaaaa] uppercase font-bold">{stop.customerName}</p>
                                    </div>
                                    {isNextUp && <span className="text-[9px] bg-[#FF0000] text-white px-1.5 py-0.5 rounded font-black uppercase">Next Up</span>}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}