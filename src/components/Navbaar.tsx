import UserDeatilForm from './UserDetailForm';
import { blrLocations } from "../data/data.js"

// Default locations updated with contact info

export default function Navbaar({ setDeliveries, setRoute, setActiveTab }) {
    return (
        <nav className="bg-slate-900/95 backdrop-blur-md sticky top-0 border-b border-slate-700 px-6 py-4 z-[2000]">
            <div className="max-w-7xl mx-auto flex flex-col gap-4">

                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg">
                            <h2 className="text-xl font-black tracking-tighter">PATH<span className="text-indigo-200">TRACKER</span></h2>
                        </div>
                    </div>

                    <button onClick={() => {
                        setDeliveries(blrLocations);
                        setRoute([]);
                        setActiveTab('list');
                    }} className="text-slate-400 hover:text-white text-xs font-medium underline">
                        Reset to Default
                    </button>
                </div>
                {/* USER INPUT FORM - EXPANDED FOR CONTACT INFO */}
                <UserDeatilForm setDeliveries={setDeliveries} />
            </div>
        </nav>
    );
}