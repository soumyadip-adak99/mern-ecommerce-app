import React, { useState, useEffect, useRef } from "react";
import {
    ShoppingCart,
    Search,
    User,
    LogOut,
    Settings,
    ShoppingBag,
    Menu,
    ChevronDown,
    X,
    Heart,
    List,
} from "lucide-react";

import { Link } from "react-router-dom";

export default function Navbar() {
    // State Management
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Refs for closing dropdowns when clicking outside
    const cartRef = useRef(null);
    const profileRef = useRef(null);
    const categoryRef = useRef(null);
    const mobileMenuRef = useRef(null);

    // Close dropdowns on click outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (cartRef.current && !cartRef.current.contains(e.target)) setIsCartOpen(false);
            if (profileRef.current && !profileRef.current.contains(e.target))
                setIsProfileOpen(false);
            if (categoryRef.current && !categoryRef.current.contains(e.target))
                setIsCategoryOpen(false);
            if (
                mobileMenuRef.current &&
                !mobileMenuRef.current.contains(e.target) &&
                !e.target.closest("button")
            ) {
                // Optional: Close mobile menu on click outside if desired, though usually manual close is better for mobile
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Mock Categories
    const categories = [
        "Electronics",
        "Fashion",
        "Furniture",
        "Kitchen",
        "Lifestyle",
        "Sports",
        "Toys",
    ];

    return (
        <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* --- LEFT SECTION: Logo & Mobile Menu Trigger --- */}
                    <div className="flex items-center gap-4">
                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>

                        {/* Logo */}
                        <a href="/" className="flex items-center gap-2 group">
                            <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-md group-hover:bg-indigo-700 transition-colors">
                                <ShoppingBag size={20} />
                            </div>
                            <span className="text-xl font-bold text-gray-900 tracking-tight">
                                ShopHub
                            </span>
                        </a>
                    </div>

                    {/* --- CENTER SECTION: Desktop Navigation --- */}
                    <div className="hidden lg:flex items-center space-x-6">
                        <Link
                            to="/all-products"
                            className="text-gray-700 font-medium text-sm hover:text-indigo-600 px-3 py-2 rounded-md hover:bg-gray-50 transition-colors"
                        >
                            All Products
                        </Link>

                        {/* Categories Dropdown */}
                        <div
                            ref={categoryRef}
                            className="relative"
                            onMouseEnter={() => setIsCategoryOpen(true)}
                            onMouseLeave={() => setIsCategoryOpen(false)}
                        >
                            <button
                                className={`flex items-center gap-1 text-sm font-medium px-3 py-2 rounded-md transition-colors ${
                                    isCategoryOpen
                                        ? "text-indigo-600 bg-indigo-50"
                                        : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
                                }`}
                            >
                                Categories{" "}
                                <ChevronDown
                                    size={16}
                                    className={`transition-transform duration-200 ${
                                        isCategoryOpen ? "rotate-180" : ""
                                    }`}
                                />
                            </button>

                            {isCategoryOpen && (
                                <div className="absolute left-0 top-full mt-1 w-56 bg-white shadow-xl rounded-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                                    <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                        Browse By
                                    </div>
                                    {categories.map((cat) => (
                                        <Link
                                            key={cat}
                                            to={`/category/${cat.toLowerCase()}`}
                                            className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 hover:pl-6 transition-all"
                                        >
                                            {cat}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* --- RIGHT SECTION: Search, Cart, Profile --- */}
                    <div className="flex items-center gap-2 sm:gap-4">
                        {/* Desktop Search Bar */}
                        <div className="hidden sm:flex items-center bg-gray-100 rounded-full px-4 py-1.5 border border-transparent focus-within:border-indigo-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-100 transition-all w-48 lg:w-64">
                            <Search size={18} className="text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="bg-transparent border-none text-sm ml-2 w-full focus:outline-none placeholder-gray-400 text-gray-700"
                            />
                        </div>

                        {/* Mobile Search Toggle */}
                        <button
                            onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
                            className="sm:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <Search size={22} />
                        </button>

                        {/* Cart Dropdown */}
                        <div ref={cartRef} className="relative">
                            <button
                                onClick={() => setIsCartOpen(!isCartOpen)}
                                className={`p-2 rounded-full relative transition-colors ${
                                    isCartOpen
                                        ? "bg-indigo-50 text-indigo-600"
                                        : "text-gray-600 hover:bg-gray-100"
                                }`}
                            >
                                <ShoppingCart size={22} />
                                <span className="absolute top-0.5 right-0.5 h-4 w-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full shadow-sm ring-2 ring-white">
                                    3
                                </span>
                            </button>

                            {isCartOpen && (
                                <div className="absolute right-0 mt-3 w-72 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                                    <div className="p-5">
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="text-gray-500 text-sm font-medium">
                                                Total Amount
                                            </span>
                                            <span className="text-xl font-bold text-gray-900">
                                                $150.00
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-400 mb-4 text-center">
                                            Shipping & taxes calculated at checkout
                                        </p>
                                        <a
                                            href="/cart"
                                            className="block w-full bg-indigo-600 text-white text-center py-3 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                                        >
                                            View Cart & Checkout
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Profile Dropdown */}
                        <div ref={profileRef} className="relative">
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className={`flex items-center gap-2 p-1 rounded-full border border-gray-200 transition-all hover:shadow-sm ${
                                    isProfileOpen
                                        ? "ring-2 ring-indigo-100 border-indigo-200"
                                        : "hover:border-indigo-300"
                                }`}
                            >
                                <img
                                    className="h-8 w-8 rounded-full object-cover"
                                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80"
                                    alt="Profile"
                                />
                            </button>

                            {isProfileOpen && (
                                <div className="absolute right-0 mt-3 w-60 bg-white shadow-xl rounded-xl border border-gray-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                                    {/* Header */}
                                    <div className="px-5 py-4 border-b border-gray-50 bg-gray-50/50">
                                        <p className="font-semibold text-gray-900 text-sm">
                                            Jane Doe
                                        </p>
                                        <p className="text-xs text-gray-500 truncate">
                                            jane.doe@example.com
                                        </p>
                                    </div>

                                    {/* Menu Items */}
                                    <div className="p-1.5">
                                        <a
                                            href="/profile"
                                            className="flex items-center px-4 py-2.5 text-sm text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            <User size={16} className="mr-3 text-gray-400" /> My
                                            Profile
                                        </a>
                                        <a
                                            href="/orders"
                                            className="flex items-center px-4 py-2.5 text-sm text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            <List size={16} className="mr-3 text-gray-400" /> My
                                            Orders
                                        </a>
                                        <a
                                            href="/settings"
                                            className="flex items-center px-4 py-2.5 text-sm text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            <Settings size={16} className="mr-3 text-gray-400" />{" "}
                                            Settings
                                        </a>
                                    </div>

                                    <div className="border-t border-gray-100 p-1.5">
                                        <a
                                            href="/logout"
                                            className="flex items-center px-4 py-2.5 text-sm text-red-600 rounded-lg hover:bg-red-50 transition-colors group"
                                        >
                                            <LogOut
                                                size={16}
                                                className="mr-3 group-hover:text-red-700"
                                            />{" "}
                                            Sign Out
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* --- MOBILE SEARCH BAR (Expandable) --- */}
            <div
                className={`sm:hidden overflow-hidden transition-all duration-300 ease-in-out border-b border-gray-100 bg-gray-50 ${
                    isMobileSearchOpen ? "max-h-16 opacity-100" : "max-h-0 opacity-0"
                }`}
            >
                <div className="px-4 py-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            autoFocus={isMobileSearchOpen}
                            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm outline-none"
                            placeholder="Search products..."
                        />
                    </div>
                </div>
            </div>

            {/* --- MOBILE MENU (Dropdown/Drawer) --- */}
            {isMobileMenuOpen && (
                <div className="lg:hidden border-t border-gray-100 bg-white shadow-lg animate-in slide-in-from-top-5 duration-200">
                    <div className="px-4 py-2 space-y-1">
                        <a
                            href="/all-products"
                            className="block px-3 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                        >
                            All Products
                        </a>

                        <div className="px-3 py-2">
                            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                                Categories
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                {categories.map((cat) => (
                                    <a
                                        key={cat}
                                        href={`/category/${cat.toLowerCase()}`}
                                        className="px-3 py-2 text-sm text-gray-600 bg-gray-50 rounded-md hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                                    >
                                        {cat}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
