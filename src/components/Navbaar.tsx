import UserDeatilForm from './UserDetailForm';
import { blrLocations } from "../data/defaultRoutes.js";
import type { RouteData } from '../types/types.js';
import { Menu, Motorbike } from 'lucide-react';

interface NavProps {
    setDeliveries: React.Dispatch<React.SetStateAction<RouteData[]>>;
    setRoute: React.Dispatch<React.SetStateAction<RouteData[]>>;
    setActiveTab: (tab: string) => void;
}

export default function Navbaar({ setDeliveries, setRoute, setActiveTab }: NavProps) {
    return (
        <nav className="bg-[#0f0f0f] sticky top-0 px-4 py-2 z-2000 flex items-center justify-between h-14">
            {/* LEFT SECTION: Hamburger & Logo */}
            <div className="flex items-center gap-4 min-w-[200px]">
                <button className="p-2 hover:bg-[#272727] rounded-full text-white transition-colors">
                    <Menu />
                </button>
                <div
                    className="flex items-center gap-1 cursor-pointer group"
                    onClick={() => window.location.reload()}
                >
                    <div className="relative">
                        <Motorbike className='bg-red-600; fill-red-600 text-red-600' />
                    </div>
                    <h2 className="text-xl font-bold tracking-tighter text-white font-sans flex items-center">
                        PathTracker <span className="text-[10px] text-red-600 ml-1 font-normal self-start mt-1 uppercase">IN</span>
                    </h2>
                </div>
            </div>

            {/* MIDDLE SECTION: Search Bar Area */}
            <div className="hidden md:flex flex-1 items-center gap-4 ml-10">
                <div className="flex-1">
                    <UserDeatilForm setDeliveries={setDeliveries} setActiveTab={setActiveTab} />
                </div>
            </div>

            {/* RIGHT SECTION: Tools & Profile */}
            <div className="flex items-center gap-2 md:gap-4 min-w-[200px] justify-end">
                <button
                    onClick={() => {
                        setDeliveries(blrLocations);
                        setRoute([]);
                        setActiveTab('list');
                    }}
                    className="hidden lg:block text-sm font-bold text-blue-400 hover:bg-blue-400/10 px-3 py-2 rounded-full transition-colors"
                >
                    RESET DATA
                </button>
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-bold text-white cursor-pointer ml-2">
                    P
                </div>
            </div>
        </nav>
    );
}