import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    ArrowLeft,
    Loader2,
    ShoppingBag,
    MapPin,
    CreditCard,
    CheckCircle,
    Plus,
    Truck,
    ShieldCheck,
    AlertCircle,
} from "lucide-react";

// Check these paths against your folder structure image:
import { getProductById } from "../features/product/ProductAction";
import { createOrder } from "../features/orders/orderAction";
import { resetOrderState } from "../features/appFeatures/orderSlice";

// --- Utility: Load Razorpay Script ---
const loadRazorpayScript = (src) => {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

// --- Utility: Currency Formatter ---
const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(price);
};

function CheckoutPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // 1. Local State
    const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState("COD");
    const [isProcessing, setIsProcessing] = useState(false); // Local loading state for Razorpay interaction

    // 2. Redux State
    const { product, isLoading: productLoading } = useSelector((state) => state.product);
    const { user } = useSelector((state) => state.auth);
    // Ensure 'order' matches the key in your store.js configuration
    const { isLoading: orderLoading } = useSelector((state) => state.order);

    const safeUser = user || JSON.parse(localStorage.getItem("user")) || {};
    const addresses = safeUser.address || [];

    // 3. Initial Fetch
    useEffect(() => {
        if (id) {
            dispatch(getProductById(id));
        }
        window.scrollTo(0, 0);

        // Reset order state on mount/unmount to prevent stale success states
        return () => {
            dispatch(resetOrderState());
        };
    }, [id, dispatch]);

    // --- HANDLERS ---

    const handlePlaceOrder = async () => {
        // Validation
        if (!addresses || addresses.length === 0) {
            alert("Please add a shipping address to proceed.");
            return;
        }

        const selectedAddress = addresses[selectedAddressIndex];
        if (!selectedAddress) {
            alert("Please select a valid address.");
            return;
        }

        const baseOrderData = {
            address: selectedAddress._id,
            payment_mode: paymentMethod,
        };

        try {
            // --- CASE 1: Cash On Delivery ---
            if (paymentMethod === "COD") {
                const resultAction = await dispatch(
                    createOrder({
                        id: product._id,
                        orderData: {
                            ...baseOrderData,
                            payment_status: "PENDING",
                        },
                    })
                ).unwrap(); // .unwrap() allows us to catch errors and get payload immediately

                // Logic to find the ID based on common backend responses
                // It checks if the ID is at the root or inside an 'order' object
                const newOrderId =
                    resultAction._id || resultAction.order?._id || resultAction.data?._id;

                if (newOrderId) {
                    dispatch(resetOrderState());
                    navigate(`/product-checkout/success/${newOrderId}`);
                } else {
                    console.error("Order ID missing in response:", resultAction);
                    alert("Order placed, but could not redirect. Check Order History.");
                }
            }

            // --- CASE 2: Online Payment (Razorpay) ---
            else if (paymentMethod === "ONLINE") {
                setIsProcessing(true);
                const isScriptLoaded = await loadRazorpayScript(
                    "https://checkout.razorpay.com/v1/checkout.js"
                );

                if (!isScriptLoaded) {
                    alert("Razorpay SDK failed to load. Please check your internet connection.");
                    setIsProcessing(false);
                    return;
                }

                const options = {
                    key: import.meta.env.VITE_RAZORPAY_API,
                    amount: product.price * 100, // Amount in paisa
                    currency: "INR",
                    name: "ShopHub Store",
                    description: `Order for ${product.product_name}`,
                    image: product.image,
                    user: {
                        name: `${safeUser.first_name} ${safeUser.last_name}`,
                        email: safeUser.email,
                        contact: selectedAddress.phone_number,
                    },
                    theme: { color: "#4f46e5" },
                    handler: async function (response) {
                        try {
                            // Payment Successful at Razorpay, now create order in Backend
                            const resultAction = await dispatch(
                                createOrder({
                                    id: product._id,
                                    orderData: {
                                        ...baseOrderData,
                                        payment_status: "PAID",
                                        payment_id: response.razorpay_payment_id, // Save transaction ID
                                    },
                                })
                            ).unwrap();

                            const newOrderId =
                                resultAction._id ||
                                resultAction.order?._id ||
                                resultAction.data?._id;

                            if (newOrderId) {
                                dispatch(resetOrderState());
                                navigate(`/product-checkout/success/${id}`);
                            } else {
                                alert("Order created, but ID missing. Please check Profile.");
                            }
                        } catch (err) {
                            alert(
                                "Payment successful but order creation failed. Please contact support."
                            );
                            console.error(err);
                        } finally {
                            setIsProcessing(false);
                        }
                    },
                    modal: {
                        ondismiss: function () {
                            setIsProcessing(false);
                        },
                    },
                };

                const paymentObject = new window.Razorpay(options);
                paymentObject.open();
            }
        } catch (error) {
            console.error("Order failed:", error);
            alert(error.message || error || "Something went wrong while placing the order.");
            setIsProcessing(false);
        }
    };

    // --- Loading State ---
    if (productLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-indigo-600">
                <Loader2 className="h-12 w-12 animate-spin mb-4" />
                <p className="font-medium text-gray-600">Fetching product details...</p>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
                <p className="font-medium text-gray-600">Product not found.</p>
                <Link to="/" className="mt-4 text-indigo-600 hover:underline">
                    Go Home
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20 font-sans">
            {/* Header Background */}
            <div className="bg-indigo-600 h-48 w-full absolute top-0 left-0 z-0 shadow-md"></div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-8">
                <Link
                    to={`/products`} // Redirect back to specific product details
                    className="inline-flex items-center gap-2 text-indigo-100 hover:text-white font-medium mb-8 transition-colors"
                >
                    <ArrowLeft size={20} /> Back to Product
                </Link>

                <h1 className="text-3xl font-bold text-white mb-8">Checkout</h1>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* --- LEFT COLUMN: INPUTS --- */}
                    <div className="flex-1 space-y-6">
                        {/* 1. Address Selection */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                                <MapPin className="text-indigo-600" size={20} /> Shipping Address
                            </h2>

                            <div className="space-y-4">
                                {addresses.length > 0 ? (
                                    addresses.map((addr, index) => (
                                        <div
                                            key={index}
                                            onClick={() => setSelectedAddressIndex(index)}
                                            className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                                                selectedAddressIndex === index
                                                    ? "border-indigo-600 bg-indigo-50/30 ring-1 ring-indigo-600"
                                                    : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50"
                                            }`}
                                        >
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-bold text-gray-900">
                                                        {addr.name || safeUser.first_name}{" "}
                                                        <span className="text-gray-500 font-normal text-sm">
                                                            ({addr.type || "Home"})
                                                        </span>
                                                    </p>
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        {addr.house_no},{" "}
                                                        {addr.landmark ? `${addr.landmark}, ` : ""}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        {addr.city}, {addr.state} - {addr.pin_code}
                                                    </p>
                                                    <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
                                                        Phone:{" "}
                                                        <span className="text-gray-900 font-medium">
                                                            {addr.phone_number}
                                                        </span>
                                                    </p>
                                                </div>
                                                {selectedAddressIndex === index && (
                                                    <CheckCircle
                                                        className="text-indigo-600 fill-indigo-100"
                                                        size={24}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                                        <p className="text-gray-500 text-sm mb-3">
                                            No delivery addresses found.
                                        </p>
                                        <button
                                            onClick={() => navigate("/profile/address")}
                                            className="text-indigo-600 font-bold text-sm hover:underline"
                                        >
                                            + Add New Address
                                        </button>
                                    </div>
                                )}

                                {addresses.length > 0 && (
                                    <button
                                        onClick={() => navigate("/profile/address")}
                                        className="flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-800 mt-2 transition-colors"
                                    >
                                        <Plus size={16} /> Add New Address
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* 2. Payment Method */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                                <CreditCard className="text-indigo-600" size={20} /> Payment Method
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* COD */}
                                <div
                                    onClick={() => setPaymentMethod("COD")}
                                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-3 ${
                                        paymentMethod === "COD"
                                            ? "border-indigo-600 bg-indigo-50/30"
                                            : "border-gray-200 hover:border-indigo-300"
                                    }`}
                                >
                                    <div
                                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                            paymentMethod === "COD"
                                                ? "border-indigo-600"
                                                : "border-gray-300"
                                        }`}
                                    >
                                        {paymentMethod === "COD" && (
                                            <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full" />
                                        )}
                                    </div>
                                    <span className="font-bold text-gray-700">
                                        Cash on Delivery
                                    </span>
                                </div>

                                {/* Online */}
                                <div
                                    onClick={() => setPaymentMethod("ONLINE")}
                                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-3 ${
                                        paymentMethod === "ONLINE"
                                            ? "border-indigo-600 bg-indigo-50/30"
                                            : "border-gray-200 hover:border-indigo-300"
                                    }`}
                                >
                                    <div
                                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                            paymentMethod === "ONLINE"
                                                ? "border-indigo-600"
                                                : "border-gray-300"
                                        }`}
                                    >
                                        {paymentMethod === "ONLINE" && (
                                            <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full" />
                                        )}
                                    </div>
                                    <span className="font-bold text-gray-700">
                                        Pay Online (UPI/Card)
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- RIGHT COLUMN: ORDER SUMMARY --- */}
                    <div className="w-full lg:w-[400px]">
                        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-6 sticky top-6">
                            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6">
                                <ShoppingBag className="text-indigo-600" size={20} /> Order Summary
                            </h2>

                            {/* Product Info */}
                            <div className="flex gap-4 mb-6 pb-6 border-b border-gray-100">
                                <div className="h-20 w-20 shrink-0 rounded-lg bg-gray-100 border border-gray-200 p-1">
                                    <img
                                        src={product.image}
                                        alt={product.product_name}
                                        className="h-full w-full object-contain mix-blend-multiply"
                                    />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 line-clamp-2 text-sm leading-snug">
                                        {product.product_name}
                                    </h3>
                                    <p className="text-gray-500 text-xs mt-1">Quantity: 1</p>
                                    <p className="text-indigo-600 font-bold mt-1 text-base">
                                        {formatPrice(product.price)}
                                    </p>
                                </div>
                            </div>

                            {/* Calculations */}
                            <div className="space-y-3 text-sm mb-6">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>{formatPrice(product.price)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span className="text-green-600 font-medium">Free</span>
                                </div>
                                <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-lg text-gray-900">
                                    <span>Total Amount</span>
                                    <span>{formatPrice(product.price)}</span>
                                </div>
                            </div>

                            {/* Trust Badges */}
                            <div className="grid grid-cols-2 gap-2 mb-6 text-[10px] text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                <div className="flex flex-col items-center gap-1 text-center">
                                    <ShieldCheck size={18} className="text-green-600" />
                                    <span>100% Secure Payment</span>
                                </div>
                                <div className="flex flex-col items-center gap-1 text-center">
                                    <Truck size={18} className="text-blue-600" />
                                    <span>Fast & Free Delivery</span>
                                </div>
                            </div>

                            {/* Action Button */}
                            <button
                                onClick={handlePlaceOrder}
                                disabled={orderLoading || isProcessing || addresses.length === 0}
                                className={`w-full py-4 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2
                                    ${
                                        orderLoading || isProcessing || addresses.length === 0
                                            ? "bg-indigo-400 cursor-not-allowed"
                                            : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                                    }`}
                            >
                                {orderLoading || isProcessing ? (
                                    <>
                                        <Loader2 className="animate-spin h-5 w-5" /> Processing...
                                    </>
                                ) : (
                                    "Place Order"
                                )}
                            </button>

                            {addresses.length === 0 && (
                                <p className="text-red-500 text-xs text-center mt-3 font-medium bg-red-50 py-1 px-2 rounded">
                                    Please add a shipping address to proceed.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CheckoutPage;
