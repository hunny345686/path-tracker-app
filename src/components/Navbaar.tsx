import UserDeatilForm from './UserDetailForm';
import { blrLocations } from "../data/defaultRoutes.js";
import type { RouteData } from '../types/types.js';

interface NavProps {
    setDeliveries: React.Dispatch<React.SetStateAction<RouteData[]>>;
    setRoute: React.Dispatch<React.SetStateAction<RouteData[]>>;
    setActiveTab: (tab: string) => void;
}

export default function Navbaar({ setDeliveries, setRoute, setActiveTab }: NavProps) {
    return (
        <nav className="bg-[#0f0f0f] sticky top-0 px-4 py-2 z-[2000] flex items-center justify-between h-14">
            {/* LEFT SECTION: Hamburger & Logo */}
            <div className="flex items-center gap-4 min-w-[200px]">
                <button className="p-2 hover:bg-[#272727] rounded-full text-white transition-colors">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                        <path d="M21 6H3V5h18v1zm0 5H3v1h18v-1zm0 6H3v1h18v-1z" />
                    </svg>
                </button>

                <div
                    className="flex items-center gap-1 cursor-pointer group"
                    onClick={() => window.location.reload()}
                >
                    <div className="relative">
                        <svg viewBox="0 0 24 24" width="30" height="30" fill="#FF0000">
                            <path d="M23.5 6.2c-.3-1.1-1.1-1.9-2.2-2.2C19.3 3.5 12 3.5 12 3.5s-7.3 0-9.3.5c-1.1.3-1.9 1.1-2.2 2.2C0 8.2 0 12 0 12s0 3.8.5 5.8c.3 1.1 1.1 1.9 2.2 2.2 2 1 9.3 1 9.3 1s7.3 0 9.3-1c1.1-.3 1.9-1.1 2.2-2.2.5-2 .5-5.8.5-5.8s0-3.8-.5-5.8z" />
                            <path d="M9.5 15.5l6.5-3.5-6.5-3.5v7z" fill="white" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold tracking-tighter text-white font-sans flex items-center">
                        PathTracker <span className="text-[10px] text-[#aaaaaa] ml-1 font-normal self-start mt-1 uppercase">IN</span>
                    </h2>
                </div>
            </div>

            {/* MIDDLE SECTION: Search Bar Area */}
            <div className="hidden md:flex flex-1 max-w-[720px] items-center gap-4 ml-10">
                <div className="flex-1">
                    <UserDeatilForm setDeliveries={setDeliveries} />
                </div>
                <button className="p-2.5 bg-[#181818] hover:bg-[#272727] rounded-full text-white transition-colors">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                        <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                        <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                    </svg>
                </button>
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

                <button className="p-2 hover:bg-[#272727] rounded-full text-white">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                        <path d="M14 10H3v2h11v-2zm0-4H3v2h11V6zm4 8v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM3 18h7v-2H3v2z" />
                    </svg>
                </button>

                <button className="p-2 hover:bg-[#272727] rounded-full text-white relative">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                        <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
                    </svg>
                    <span className="absolute top-1.5 right-1.5 bg-[#FF0000] text-[10px] text-white px-1 rounded-full border border-[#0f0f0f]">
                        9+
                    </span>
                </button>

                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-bold text-white cursor-pointer ml-2">
                    G
                </div>
            </div>
        </nav>
    );
}