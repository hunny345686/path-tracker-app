import { useState } from 'react';
import 'leaflet/dist/leaflet.css';
import Navbaar from "./components/Navbaar";
import MapComponent from "./components/Map";
import TabComponnet from "./components/TabComponent";

const HUB_START = { lat: 12.9719, lng: 77.6412, address: 'Indiranagar (Hub)' };

const getDistance = (p1, p2) => Math.sqrt(Math.pow(p1.lat - p2.lat, 2) + Math.pow(p1.lng - p2.lng, 2));

function App() {
  const [deliveries, setDeliveries] = useState([]);
  const [route, setRoute] = useState([]);
  const [activeTab, setActiveTab] = useState('list');

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
    // Changed background to Slate-950 (Near Black)
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-indigo-500/30">

      {/* Navbar will inherit dark from your previous update */}
      <Navbaar setDeliveries={setDeliveries} setRoute={setRoute} setActiveTab={setActiveTab} />

      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Left Sidebar: Controls & Packing */}
        <div className="lg:col-span-4 space-y-6">

          {/* Action Area with Dark Glass Effect */}
          <div className="bg-[#0f172a] rounded-3xl border border-slate-800 shadow-2xl overflow-hidden backdrop-blur-xl">
            <div className="flex border-b border-slate-800 bg-slate-900/50">
              <button
                onClick={() => setActiveTab('list')}
                className={`flex-1 py-5 text-xs uppercase tracking-widest font-black transition-all ${activeTab === 'list'
                  ? 'text-indigo-400 border-b-2 border-indigo-500 bg-indigo-500/5'
                  : 'text-slate-500 hover:text-slate-300'
                  }`}
              >
                Orders Queue
              </button>
              <button
                onClick={() => setActiveTab('pack')}
                disabled={route.length === 0}
                className={`flex-1 py-5 text-xs uppercase tracking-widest font-black transition-all ${activeTab === 'pack'
                  ? 'text-cyan-400 border-b-2 border-cyan-500 bg-cyan-500/5'
                  : 'text-slate-500 hover:text-slate-300 disabled:opacity-20'
                  }`}
              >
                Bag Arrangement
              </button>
            </div>

            {/* Passing setDeliveries so the "Remove" function works */}
            <TabComponnet
              activeTab={activeTab}
              deliveries={deliveries}
              setDeliveries={setDeliveries}
              solveRoute={solveRoute}
              route={route}
            />
          </div>

          {/* Optional: Status Card */}
          <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-6 rounded-3xl shadow-lg shadow-indigo-500/20 text-white">
            <h4 className="text-sm font-bold opacity-80 uppercase tracking-tight">Active Fleet</h4>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-black">1</span>
              <span className="text-sm opacity-80">Rider Online</span>
            </div>
          </div>

        </div>

        {/* Map Section */}
        <div className="lg:col-span-8">
          <MapComponent HUB_START={HUB_START} route={route} deliveries={deliveries} />
        </div>

      </div>
    </div>
  );
}

export default App;