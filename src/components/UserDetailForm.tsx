import { useState } from "react";

export default function UserDeatilForm() {
    const [newProduct, setNewProduct] = useState('');
    const [newAddress, setNewAddress] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [mobile, setMobile] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleAddDelivery = async (e) => {
        e.preventDefault();
        if (!newProduct || !newAddress || !customerName || !mobile) {
            return alert("Please fill all fields (Product, Name, Mobile, and Address)");
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

                // Clear all fields
                setNewProduct('');
                setNewAddress('');
                setCustomerName('');
                setMobile('');
                setActiveTab('list');
            } else {
                alert("Could not find that address. Please be more specific.");
            }
        } catch (error) {
            console.error("Geocoding error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (<form onSubmit={handleAddDelivery} className="grid grid-cols-1 md:grid-cols-5 gap-2 bg-slate-800 p-2 rounded-2xl border border-slate-700">
        <input
            type="text"
            placeholder="Product"
            className="bg-transparent text-white px-4 py-2 outline-none text-sm border-r border-slate-700"
            value={newProduct}
            onChange={(e) => setNewProduct(e.target.value)}
        />
        <input
            type="text"
            placeholder="Customer Name"
            className="bg-transparent text-white px-4 py-2 outline-none text-sm border-r border-slate-700"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
        />
        <input
            type="tel"
            placeholder="Mobile No."
            className="bg-transparent text-white px-4 py-2 outline-none text-sm border-r border-slate-700"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
        />
        <input
            type="text"
            placeholder="Delivery Address"
            className="bg-transparent text-white px-4 py-2 outline-none text-sm border-r border-slate-700 md:border-r-0"
            value={newAddress}
            onChange={(e) => setNewAddress(e.target.value)}
        />
        <button
            disabled={isLoading}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-xl text-sm font-bold transition-all disabled:opacity-50"
        >
            {isLoading ? 'Locating...' : 'Add Order +'}
        </button>
    </form>)
}