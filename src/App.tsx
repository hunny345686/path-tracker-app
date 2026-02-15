import { useState } from 'react';
import 'leaflet/dist/leaflet.css';
import Navbaar from "./components/Navbaar";
import MapComponent from "./components/Map";
import TabComponnet from "./components/TabComponent";
import type { RouteData } from "./types/types"

const HUB_START = {
  lat: 12.9719,
  lng: 77.6412,
  address: 'Indiranagar (Hub)',
  id: 100,
  product: 'phone',
  customerName: 'Prem Songh',
  mobile: '9999999999',
};

const getDistance = (p1: RouteData, p2: RouteData) => Math.sqrt(Math.pow(p1.lat - p2.lat, 2) + Math.pow(p1.lng - p2.lng, 2));

function App() {
  const [deliveries, setDeliveries] = useState<RouteData[]>([]);
  const [route, setRoute] = useState<RouteData[]>([]);
  const [activeTab, setActiveTab] = useState<"list" | "route" | "pack">('list');

  const solveRoute = () => {
    const unvisited: RouteData[] = [...deliveries];
    const optimized: RouteData[] = [HUB_START];
    let current: RouteData = HUB_START;

    while (unvisited.length > 0) {
      let closest: number = 0;
      let minD = getDistance(current, unvisited[0]);
      console.log("Minimum destance", minD)
      for (let i = 1; i < unvisited.length; i++) {
        const d = getDistance(current, unvisited[i]);
        console.log(" destance", d)

        if (d < minD) { minD = d; closest = i; }
      }
      current = unvisited[closest];
      optimized.push(current);
      unvisited.splice(closest, 1);
    }
    setRoute(optimized);
    console.log("route", route)
    setActiveTab('pack');
  };


  // Changed background to Slate-950 (Near Black)
  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white font-sans selection:bg-red-500/30">
      <Navbaar setDeliveries={setDeliveries} setRoute={setRoute} setActiveTab={setActiveTab} />

      <div className="max-w-[1600px] mx-auto p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Main "Video" Area (The Map) */}
        <div className="lg:col-span-8 order-1 lg:order-1">
          <MapComponent HUB_START={HUB_START} route={route} deliveries={deliveries} />

          {/* "Video Info" Section below map */}
          <div className="mt-4 p-2">
            <h1 className="text-xl font-bold tracking-tight">Bengaluru Logistics Hub #1</h1>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center font-bold">P</div>
                <div>
                  <p className="text-sm font-bold">PathTracker Official</p>
                  <p className="text-xs text-slate-400">1.2M deliveries optimized</p>
                </div>
              </div>
              <button className="bg-white text-black px-4 py-2 rounded-full text-sm font-bold hover:bg-slate-200 transition-colors ml-auto">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* "Up Next" Sidebar (The Tabs/List) */}
        <div className="lg:col-span-4 order-2 lg:order-2 space-y-4">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button onClick={() => setActiveTab('list')}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'list' ? 'bg-white text-black' : 'bg-[#272727] text-white hover:bg-[#3f3f3f]'}`}>
              Orders Queue
            </button>
            <button onClick={() => setActiveTab('pack')} disabled={route.length === 0}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'pack' ? 'bg-white text-black' : 'bg-[#272727] text-white hover:bg-[#3f3f3f] disabled:opacity-20'}`}>
              Bag Arrangement
            </button>
          </div>

          <div className="bg-[#0f0f0f]">
            <TabComponnet
              activeTab={activeTab}
              deliveries={deliveries}
              setDeliveries={setDeliveries}
              solveRoute={solveRoute}
              route={route}
            />
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;