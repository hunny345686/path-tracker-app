import { useState } from "react";

export default function UserDeatilForm({ setDeliveries, setActiveTab }) {
    const [newProduct, setNewProduct] = useState('');
    const [newAddress, setNewAddress] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [mobile, setMobile] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleAddDelivery = async (e) => {
        e.preventDefault();
        if (!newProduct || !newAddress || !customerName || !mobile) {
            return alert("Please fill all fields!");
        }

        setIsLoading(true);
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(newAddress)}`
            );
            const data = await response.json();

            if (data && data.length > 0) {
                const newEntry = {
                    id: Date.now(),
                    product: newProduct,
                    customerName: customerName,
                    mobile: mobile,
                    address: newAddress,
                    lat: parseFloat(data[0].lat),
                    lng: parseFloat(data[0].lon)
                };

                setDeliveries(prev => [...prev, newEntry]);

                // Reset form
                setNewProduct('');
                setNewAddress('');
                setCustomerName('');
                setMobile('');
                setActiveTab('list');
            } else {
                alert("Address not found. Try adding city/state.");
            }
        } catch (error) {
            console.error("Geocoding error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleAddDelivery}
            className="flex items-center flex-1 bg-[#121212] border border-[#303030] rounded-full overflow-hidden focus-within:border-[#1c62b9] transition-all"
        >
            {/* Input Group */}
            <div className="flex flex-1 items-center px-2">
                <input
                    type="text"
                    placeholder="Product..."
                    className="w-full bg-transparent text-white px-3 py-1.5 outline-none text-[13px] placeholder-[#888] border-r border-[#303030]"
                    value={newProduct}
                    onChange={(e) => setNewProduct(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Customer..."
                    className="w-full bg-transparent text-white px-4 py-1.5 outline-none text-[13px] placeholder-[#888] border-r border-[#303030]"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                />
                <input
                    type="tel"
                    placeholder="Mobile..."
                    className="w-full bg-transparent text-white px-4 py-1.5 outline-none text-[13px] placeholder-[#888] border-r border-[#303030]"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Delivery Address..."
                    className="w-[180%] bg-transparent text-white px-4 py-1.5 outline-none text-[13px] placeholder-[#888]"
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                />
            </div>

            {/* YouTube-style Search Button */}
            <button
                type="submit"
                disabled={isLoading}
                className="bg-[#222222] hover:bg-[#333333] px-6 py-2 border-l border-[#303030] text-[#f1f1f1] transition-colors disabled:opacity-50 flex items-center gap-2"
                title="Add Delivery"
            >
                {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                    <>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                        </svg>
                        <span className="text-xs font-bold uppercase tracking-tighter">Add</span>
                    </>
                )}
            </button>
        </form>
    );
}