
export default function TabComponent({ activeTab, deliveries, setDeliveries, solveRoute, route }) {

    const removeDelivery = (id) => {
        setDeliveries(prev => prev.filter(item => item.id !== id));
    };

    return (
        <div className="p-4 max-h-[600px] overflow-y-auto custom-scrollbar bg-[#0f172a]">
            {activeTab === 'list' ? (
                <div className="space-y-4">
                    <div className="flex justify-between items-center mb-2 px-1">
                        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[2px]">
                            Pending Orders — {deliveries.length}
                        </h3>
                    </div>

                    {deliveries.length === 0 && (
                        <div className="text-center py-16 bg-slate-900/40 rounded-3xl border-2 border-dashed border-slate-800">
                            <p className="text-slate-500 text-sm">No active deliveries</p>
                            <p className="text-[10px] text-slate-600 uppercase mt-1">Add items in the navbar above</p>
                        </div>
                    )}

                    {deliveries.map(d => (
                        <div key={d.id} className="group p-4 bg-slate-900/50 rounded-2xl border border-slate-800 flex flex-col gap-3 transition-all hover:border-indigo-500/50 hover:shadow-[0_0_20px_rgba(79,70,229,0.1)]">
                            <div className="flex items-center gap-4">
                                <div className="bg-slate-800 w-12 h-12 rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                                    📦
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-slate-100 truncate">{d.product}</p>
                                    <p className="text-[10px] text-indigo-400 uppercase font-black tracking-wider mt-0.5">{d.customerName || 'Guest'}</p>
                                </div>

                                <button
                                    onClick={() => removeDelivery(d.id)}
                                    className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                                </button>
                            </div>

                            <div className="flex items-center justify-between bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/50">
                                <p className="text-[11px] text-slate-400 truncate max-w-[160px]">📍 {d.address}</p>

                                <a
                                    href={`tel:${d.mobile}`}
                                    className="flex items-center gap-1.5 px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-[10px] font-black uppercase tracking-wider hover:bg-indigo-500 transition-all active:scale-95 shadow-lg shadow-indigo-500/20"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l2.28-2.28a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                                    Call
                                </a>
                            </div>
                        </div>
                    ))}

                    {deliveries.length > 0 && (
                        <button onClick={solveRoute} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[2px] shadow-xl shadow-indigo-500/20 hover:bg-indigo-500 hover:-translate-y-0.5 transition-all mt-6 flex items-center justify-center gap-3">
                            <span>Optimize Route</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m18 8 4 4-4 4" /><path d="M2 12h20" /></svg>
                        </button>
                    )}
                </div>
            ) : (
                <div className="space-y-4">
                    {/* Dark Packing Guide Header */}
                    <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-6 rounded-3xl border border-indigo-500/20 shadow-2xl relative overflow-hidden mb-6">
                        <div className="relative z-10">
                            <p className="text-[10px] font-black uppercase tracking-[3px] text-indigo-400">Loading Order</p>
                            <h4 className="text-lg font-black mt-1 tracking-tight">LIFO (Last-In, First-Out)</h4>
                            <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                                Items at the bottom of the list should be placed at the **bottom of your bag**. They are delivered last.
                            </p>
                        </div>
                        <div className="absolute -right-4 -bottom-4 text-7xl opacity-10 rotate-12">🎒</div>
                    </div>

                    {[...route].slice(1).reverse().map((stop, idx) => {
                        const isFirstDelivery = idx === route.length - 2;
                        return (
                            <div key={idx} className="relative pl-10 border-l-2 border-dashed border-slate-800 py-3 ml-4">
                                <div className={`absolute -left-[13px] top-5 w-6 h-6 rounded-full border-4 border-[#0f172a] shadow-lg flex items-center justify-center text-[10px] font-black text-white
                                    ${isFirstDelivery ? 'bg-cyan-500 scale-125' : 'bg-slate-700'}`}>
                                    {route.length - 1 - idx}
                                </div>

                                <div className={`p-4 rounded-2xl border transition-all ${isFirstDelivery ? 'bg-cyan-500/10 border-cyan-500/50 ring-1 ring-cyan-500/20' : 'bg-slate-900/30 border-slate-800'}`}>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-sm font-bold text-slate-100">{stop.product}</p>
                                            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mt-0.5">{stop.customerName}</p>
                                        </div>
                                        <a href={`tel:${stop.mobile}`} className="p-2 bg-slate-800 rounded-lg text-cyan-400 hover:bg-cyan-500 hover:text-white transition-all">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l2.28-2.28a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                                        </a>
                                    </div>
                                    <p className="text-[11px] text-slate-500 mt-2 truncate">📍 {stop.address}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}