import React, { useState, useEffect } from "react";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

function CartPage() {
    const navigate = useNavigate();

    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);

    console.log();

    useEffect(() => {
        try {
            const storedData = localStorage.getItem("cart_item");
            if (storedData) {
                const parsedData = JSON.parse(storedData);
                // Ensure data is strictly an array before setting state
                setCartItems(Array.isArray(parsedData) ? parsedData : []);
            } else {
                setCartItems([]);
            }
        } catch (error) {
            console.error("Error parsing cart data:", error);
            setCartItems([]);
        } finally {
            setLoading(false);
        }
    }, []);

    // --- 2. Update Helper (Syncs State & LocalStorage) ---
    const updateCart = (newItems) => {
        setCartItems(newItems);
        localStorage.setItem("cart-item", JSON.stringify(newItems));

        // Optional: Dispatch event so Navbar updates immediately
        window.dispatchEvent(new Event("storage"));
    };

    // --- 3. Handlers ---
    const handleRemoveItem = (id) => {
        const updatedItems = cartItems.filter((item) => item._id !== id);
        updateCart(updatedItems);
    };

    const handleQuantityChange = (id, change) => {
        const updatedItems = cartItems.map((item) => {
            if (item._id === id) {
                const newQuantity = (item.quantity || 1) + change;
                return { ...item, quantity: Math.max(1, newQuantity) };
            }
            return item;
        });
        updateCart(updatedItems);
    };

    const subtotal = cartItems.reduce((acc, item) => {
        const price = Number(item.price) || 0;
        const qty = Number(item.quantity) || 1;
        return acc + price * qty;
    }, 0);

    const shipping = 0;
    const total = subtotal + shipping;

    if (loading) return null; // Or return a loading spinner

    if (cartItems.length === 0) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center bg-white px-4">
                <div className="bg-gray-50 p-6 rounded-full mb-6">
                    <ShoppingBag size={64} className="text-gray-300" strokeWidth={1.5} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
                <p className="text-gray-500 mb-8 max-w-md text-center">
                    Looks like you haven't added anything to your cart yet. Go ahead and explore our
                    top categories.
                </p>
                <Link
                    to="/products"
                    className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
                >
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50 py-12 font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Page Header */}
                <div className="flex items-center gap-2 mb-8 text-sm text-gray-500">
                    <Link
                        to="/products"
                        className="hover:text-indigo-600 flex items-center gap-1 transition-colors"
                    >
                        <ArrowLeft size={16} /> Continue Shopping
                    </Link>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                    {/* --- LEFT COLUMN: CART ITEMS --- */}
                    <div className="lg:col-span-8">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            {/* Header Row (Desktop) */}
                            <div className="hidden sm:grid grid-cols-12 gap-4 p-6 border-b border-gray-100 bg-gray-50/50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                <div className="col-span-6">Product</div>
                                <div className="col-span-2 text-center">Quantity</div>
                                <div className="col-span-2 text-right">Price</div>
                                <div className="col-span-2 text-right">Total</div>
                            </div>

                            {/* Items List */}
                            <div className="divide-y divide-gray-100">
                                {cartItems.map((item) => (
                                    <div
                                        key={item._id}
                                        className="p-6 transition-colors hover:bg-gray-50/30"
                                    >
                                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                                            {/* Product Info */}
                                            <div className="sm:col-span-6 flex items-center gap-4">
                                                <div className="h-20 w-20 shrink-0 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400">
                                                    {/* Use optional chaining safely */}
                                                    {item.image ? (
                                                        <img
                                                            src={item.image}
                                                            alt={item.name}
                                                            className="h-full w-full object-cover rounded-lg"
                                                        />
                                                    ) : (
                                                        <ShoppingBag size={24} />
                                                    )}
                                                </div>
                                                <div>
                                                    <h3 className="text-sm font-semibold text-gray-900 mb-1">
                                                        {item.name}
                                                    </h3>
                                                    <p className="text-xs text-gray-500 mb-2">
                                                        Category: Electronics
                                                    </p>
                                                    <button
                                                        onClick={() => handleRemoveItem(item._id)}
                                                        className="text-xs text-red-500 hover:text-red-700 font-medium flex items-center gap-1 transition-colors"
                                                    >
                                                        <Trash2 size={12} /> Remove
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Quantity Controls */}
                                            <div className="sm:col-span-2 flex justify-between sm:justify-center items-center">
                                                <span className="sm:hidden text-xs font-medium text-gray-500">
                                                    Qty:
                                                </span>
                                                <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1 border border-gray-200">
                                                    <button
                                                        onClick={() =>
                                                            handleQuantityChange(item._id, -1)
                                                        }
                                                        className="p-1 hover:bg-white hover:shadow-sm rounded-md transition-all text-gray-600 disabled:opacity-50"
                                                        disabled={(item.quantity || 1) <= 1}
                                                    >
                                                        <Minus size={14} />
                                                    </button>
                                                    <span className="text-sm font-semibold w-4 text-center">
                                                        {item.quantity || 1}
                                                    </span>
                                                    <button
                                                        onClick={() =>
                                                            handleQuantityChange(item._id, 1)
                                                        }
                                                        className="p-1 hover:bg-white hover:shadow-sm rounded-md transition-all text-gray-600"
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Price (Single) */}
                                            <div className="hidden sm:block sm:col-span-2 text-right text-sm text-gray-600">
                                                ₹{(Number(item.price) || 0).toLocaleString()}
                                            </div>

                                            {/* Price (Total) */}
                                            <div className="sm:col-span-2 flex justify-between sm:block text-right">
                                                <span className="sm:hidden text-sm font-medium text-gray-500">
                                                    Total:
                                                </span>
                                                <span className="text-sm font-bold text-gray-900">
                                                    ₹
                                                    {(
                                                        (Number(item.price) || 0) *
                                                        (item.quantity || 1)
                                                    ).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* --- RIGHT COLUMN: SUMMARY --- */}
                    <div className="lg:col-span-4">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-24">
                            <h2 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h2>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Subtotal</span>
                                    <span className="font-medium text-gray-900">
                                        ₹{subtotal.toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Shipping Estimate</span>
                                    <span className="font-medium text-gray-900">
                                        {shipping === 0 ? (
                                            <span className="text-green-600">Free</span>
                                        ) : (
                                            `₹${shipping}`
                                        )}
                                    </span>
                                </div>
                                {/* <div className="flex justify-between text-sm text-gray-600">
                                    <span>Tax Estimate (18%)</span>
                                    <span className="font-medium text-gray-900">
                                        ₹{tax.toFixed(0).toLocaleString()}
                                    </span>
                                </div> */}

                                <div className="border-t border-gray-100 pt-4 mt-4">
                                    <div className="flex justify-between items-end">
                                        <span className="text-base font-bold text-gray-900">
                                            Order Total
                                        </span>
                                        <span className="text-xl font-bold text-indigo-600">
                                            ₹{total.toFixed(0).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate("/checkout")}
                                className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-3.5 px-6 rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 hover:shadow-xl hover:-translate-y-0.5"
                            >
                                Checkout <ArrowRight size={18} />
                            </button>

                            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500 bg-gray-50 py-3 rounded-lg">
                                <ShieldCheck size={16} className="text-gray-400" />
                                <span>Secure SSL Encrypted Transaction</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CartPage;
