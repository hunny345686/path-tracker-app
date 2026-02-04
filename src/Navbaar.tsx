

export default function Navbaar() {
    return (

        <nav className="bg-white/80 backdrop-blur-md sticky top-0 border-b border-slate-200 px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3 justify-between w-full">
                <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-indigo-200 shadow-lg relative overflow-hidden group flex items-center justify-center">

                    <h2 className="text-2xl font-black tracking-tighter text-slate-800 mr-3">PATH<span className="text-indigo-50">TRACKER</span></h2>
                </div>
                <button className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full text-sm font-bold hover:bg-indigo-100 cursor-pointer transition-colors">Reset Data</button>
            </div>
        </nav>

    )

}