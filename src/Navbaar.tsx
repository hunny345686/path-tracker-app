
const blrLocations = [
    { id: 1, product: 'Sushi Platter', address: 'Koramangala 5th Block', lat: 12.9352, lng: 77.6245 },
    { id: 2, product: 'Electronics Box', address: 'HSR Layout Sector 2', lat: 12.9141, lng: 77.6411 },
    { id: 3, product: 'Office Supplies', address: 'Whitefield (ITPL)', lat: 12.9698, lng: 77.7500 },
    { id: 4, product: 'Groceries', address: 'Jayanagar 4th Block', lat: 12.9250, lng: 77.5938 },
    { id: 5, product: 'Birthday Cake', address: 'MG Road Metro', lat: 12.9750, lng: 77.6067 },
    { id: 6, product: 'Coffee Beans', address: 'Malleshwaram', lat: 12.9988, lng: 77.5703 },
];

export default function Navbaar({ setDeliveries, setRoute, setActiveTab }) {
    return (
        <nav className="bg-white/80 backdrop-blur-md sticky top-0 border-b border-slate-200 px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3 justify-between w-full">
                <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-indigo-200 shadow-lg relative overflow-hidden group flex items-center justify-center">

                    <h2 className="text-2xl font-black tracking-tighter text-slate-800 mr-3">PATH<span className="text-indigo-50">TRACKER</span></h2>
                </div>
                <button onClick={() => {
                    setDeliveries(blrLocations);
                    setRoute([]);
                    setActiveTab('list');
                }} className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full text-sm font-bold hover:bg-indigo-100 cursor-pointer transition-colors">Reset Data</button>
            </div>
        </nav>
    )
}