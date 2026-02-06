import { useState } from 'react';
import 'leaflet/dist/leaflet.css';
import Navbaar from "./Navbaar"
import Map from './components/map';


const HUB_START = { lat: 12.9719, lng: 77.6412, address: 'Indiranagar (Hub)' };

// --- Logic Helpers ---
const getDistance = (p1, p2) => Math.sqrt(Math.pow(p1.lat - p2.lat, 2) + Math.pow(p1.lng - p2.lng, 2));

function App() {
  const [deliveries, setDeliveries] = useState([]);
  const [route, setRoute] = useState([]);
  const [activeTab, setActiveTab] = useState('list'); // 'list' or 'pack'

  const solveRoute = () => {
    const unvisited = [...deliveries];
    const optimized = [HUB_START];
    let current = HUB_START;

    while (unvisited.length > 0) {
      let closest = 0;
      let minD = getDistance(current, unvisited[0]);
      for (let i = 1; i < unvisited.length; i++) {
        const d = getDistance(current, unvisited[i]);
        if (d < minD) { minD = d; closest = i; }
      }
      current = unvisited[closest];
      optimized.push(current);
      unvisited.splice(closest, 1);
    }
    setRoute(optimized);
    setActiveTab('pack');
  };
  return (
    <div className="min-h-screen text-slate-900">
      <Navbaar setDeliveries={setDeliveries} setRoute={setRoute} setActiveTab={setActiveTab} />
      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Left Sidebar: Controls & Packing */}
        <div className="lg:col-span-4 space-y-6">

          {/* Stats Card 
          <div className="bg-linear-to-br from-indigo-600 to-violet-700 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
            Subtle map pattern overlay in stats card too
            <p className="text-indigo-100 text-sm font-medium relative z-10">Efficiency Score</p>
            <h3 className="text-3xl font-bold mb-4 relative z-10">94% Optimal</h3>
            <div className="flex justify-between border-t border-white/20 pt-4 relative z-10">
              <div>
                <p className="text-xs text-indigo-100">Stops</p>
                <p className="font-bold">{deliveries.length}</p>
              </div>
              <div>
                <p className="text-xs text-indigo-100">Est. Time</p>
                <p className="font-bold">{deliveries.length * 12} mins</p>
              </div>
              <div>
                <p className="text-xs text-indigo-100">Petrol Saved</p>
                <p className="font-bold text-green-300">~1.2L</p>
              </div>
            </div>
          </div>
          */}

          {/* Dynamic Action Area */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex border-b">
              <button
                onClick={() => setActiveTab('list')}
                className={`flex-1 py-4 text-sm font-bold ${activeTab === 'list' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-400'}`}
              >
                Delivery List
              </button>
              <button
                onClick={() => setActiveTab('pack')}
                disabled={route.length === 0}
                className={`flex-1 py-4 text-sm font-bold ${activeTab === 'pack' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-400 disabled:opacity-30'}`}
              >
                Bag Arrangement
              </button>
            </div>

            <div className="p-4 max-h-[500px] overflow-y-auto">
              {activeTab === 'list' ? (
                <div className="space-y-3">
                  {deliveries.length === 0 && <p className="text-center text-slate-400 py-8">Click "Reset Data" to load Bangalore dummy data.</p>}
                  {deliveries.map(d => (
                    <div key={d.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
                      <div className="bg-white w-10 h-10 rounded-full flex items-center justify-center shadow-sm text-xl">📦</div>
                      <div>
                        <p className="text-sm font-bold">{d.product}</p>
                        <p className="text-xs text-slate-500">{d.address}</p>
                      </div>
                    </div>
                  ))}
                  {deliveries.length > 0 && (
                    <button
                      onClick={solveRoute}
                      className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-slate-800 transition-all mt-4 flex items-center justify-center gap-2"
                    >
                      <span>Calculate Best Path</span>

                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 mb-4">
                    <p className="text-xs text-blue-700 font-bold uppercase tracking-wider flex items-center gap-2">

                      Loading Strategy: LIFO
                    </p>
                    <p className="text-[11px] text-blue-600 mt-1">Pack the bag from bottom to top based on this order so the first stop is on top.</p>
                  </div>
                  {/* REVERSE THE ROUTE FOR PACKING ORDER */}
                  {[...route].slice(1).reverse().map((stop, idx) => (
                    <div key={idx} className="relative pl-10 border-l-[3px] border-dashed border-slate-200 py-3">
                      <div className={`absolute -left-[11px] top-5 w-5 h-5 rounded-full border-2 border-white shadow-sm flex items-center justify-center text-[10px] font-bold text-white
                        ${idx === 0 ? 'bg-orange-500' : idx === route.length - 2 ? 'bg-green-500' : 'bg-indigo-400'}`}>
                        {route.length - 1 - idx}
                      </div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        {idx === 0 ? 'Step 1: Put In First (Bottom of Bag)' : idx === route.length - 2 ? 'Final Step: Put In Last (Top of Bag)' : 'Next Item'}
                      </p>
                      <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                        <p className="text-sm font-bold flex items-center gap-2">
                          {stop.product}
                          {idx === route.length - 2 && <span className="text-[10px] bg-green-100 text-green-700 px-2 rounded-full">First Delivery!</span>}
                        </p>
                        <p className="text-xs text-slate-500 truncate">{stop.address}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <Map HUB_START={HUB_START} route={route} deliveries={deliveries} />
      </div>
    </div>
  )
}

export default App
