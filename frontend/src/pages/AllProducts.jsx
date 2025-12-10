import React, { useState, useEffect, useMemo } from "react";
import {
    Filter,
    ChevronDown,
    Star,
    ShoppingCart,
    Heart,
    X,
    Home,
    ChevronRight,
    SlidersHorizontal,
} from "lucide-react";

import { productData } from "../tempData";
import CategoryFilter from "../components/CategoryFilter";
import ProductCard from "../components/ProductCard";
import { Link, useParams } from "react-router-dom";
import Navbar from "../sections/Navbar";
import ProductModal from "../components/ProductModal";

export default function AllProducts() {
    const categoryName = null;

    const [selectedCategory, setSelectedCategory] = useState(categoryName || "All");
    const [maxPrice, setMaxPrice] = useState(500);
    const [sortOption, setSortOption] = useState("recommended");
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    // Derived Data
    const categories = useMemo(() => [...new Set(productData.map((p) => p.category))], []);

    const priceRange = useMemo(() => {
        const prices = productData.map((p) => p.price);
        return { min: Math.min(...prices), max: Math.max(...prices) + 50 };
    }, []);

    const filteredProducts = useMemo(() => {
        let result = productData;

        if (selectedCategory !== "All") {
            result = result.filter((p) => p.category === selectedCategory);
        }

        result = result.filter((p) => p.price <= maxPrice);

        switch (sortOption) {
            case "priceLowHigh":
                return [...result].sort((a, b) => a.price - b.price);
            case "priceHighLow":
                return [...result].sort((a, b) => b.price - a.price);
            case "rating":
                return [...result].sort((a, b) => b.rating - a.rating);
            default:
                return result;
        }
    }, [selectedCategory, maxPrice, sortOption]);

    useEffect(() => {
        if (categoryName) setSelectedCategory(categoryName);
    }, [categoryName]);

    return (
        <div className="bg-gray-50 min-h-screen font-sans selection:bg-indigo-100 selection:text-indigo-900">
            <Navbar />

            {/* 2. Page Header & Breadcrumbs */}
            <div className="bg-white border-b border-gray-200 sticky top-16 z-30 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    {/* Breadcrumb */}
                    <nav className="flex items-center text-sm text-gray-500 mb-4 animate-in fade-in slide-in-from-top-2 duration-500">
                        <Link
                            to="/"
                            className="hover:text-indigo-600 flex items-center gap-1 transition-colors"
                        >
                            <Home size={14} /> Home
                        </Link>
                        <ChevronRight size={14} className="mx-2 text-gray-300" />
                        <a href="#" className="hover:text-indigo-600 transition-colors">
                            Shop
                        </a>
                        <ChevronRight size={14} className="mx-2 text-gray-300" />
                        <span className="font-medium text-gray-900 bg-gray-100 px-2 py-0.5 rounded-md">
                            {selectedCategory === "All" ? "All Products" : selectedCategory}
                        </span>
                    </nav>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                            {selectedCategory === "All" ? "All Products" : `${selectedCategory}`}
                        </h1>

                        <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-gray-500 hidden sm:inline-block bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                                {filteredProducts.length} results
                            </span>

                            {/* Sort Dropdown */}
                            <div className="relative group">
                                <select
                                    value={sortOption}
                                    onChange={(e) => setSortOption(e.target.value)}
                                    className="appearance-none bg-white border border-gray-200 text-gray-700 py-2 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm font-medium cursor-pointer hover:border-gray-300 transition-all shadow-sm"
                                >
                                    <option value="recommended">Recommended</option>
                                    <option value="priceLowHigh">Price: Low to High</option>
                                    <option value="priceHighLow">Price: High to Low</option>
                                    <option value="rating">Best Rating</option>
                                </select>
                                <ChevronDown
                                    size={16}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-hover:text-indigo-600 transition-colors"
                                />
                            </div>

                            {/* Mobile Filter Toggle */}
                            <button
                                onClick={() => setIsMobileFiltersOpen(true)}
                                className="lg:hidden p-2 text-gray-700 bg-white border border-gray-200 rounded-lg hover:border-indigo-600 hover:text-indigo-600 transition-all shadow-sm"
                            >
                                <SlidersHorizontal size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Main Content Area */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Desktop Sidebar */}
                    <aside className="hidden lg:block w-64 shrink-0 ">
                        <div className="sticky top-40 animate-in slide-in-from-left duration-700">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <div className="flex items-center gap-2 mb-6 text-gray-900 pb-4 border-b border-gray-100">
                                    <Filter size={20} className="text-indigo-600" />
                                    <h2 className="font-bold text-lg">Filters</h2>
                                </div>
                                <CategoryFilter
                                    selectedCategory={selectedCategory}
                                    setSelectedCategory={setSelectedCategory}
                                    maxPrice={maxPrice}
                                    setMaxPrice={setMaxPrice}
                                    categories={categories}
                                    priceRange={priceRange}
                                    className="fixed"
                                />
                            </div>
                        </div>
                    </aside>

                    {/* Mobile Filter Drawer */}
                    {isMobileFiltersOpen && (
                        <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
                            <div
                                className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
                                onClick={() => setIsMobileFiltersOpen(false)}
                            />
                            <div className="relative w-full max-w-xs bg-white h-full shadow-2xl p-6 overflow-y-auto animate-in slide-in-from-right duration-300">
                                <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
                                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                        <Filter size={20} className="text-indigo-600" /> Filters
                                    </h2>
                                    <button
                                        onClick={() => setIsMobileFiltersOpen(false)}
                                        className="p-2 hover:bg-red-50 hover:text-red-600 rounded-full transition-colors"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>
                                <CategoryFilter
                                    selectedCategory={selectedCategory}
                                    setSelectedCategory={setSelectedCategory}
                                    maxPrice={maxPrice}
                                    setMaxPrice={setMaxPrice}
                                    categories={categories}
                                    priceRange={priceRange}
                                />
                                <div className="sticky bottom-0 bg-white pt-4 mt-8 border-t border-gray-100">
                                    <button
                                        onClick={() => setIsMobileFiltersOpen(false)}
                                        className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-xl hover:bg-indigo-700 active:scale-95 transition-all shadow-lg shadow-indigo-200"
                                    >
                                        Show {filteredProducts.length} Results
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Product Grid */}
                    <main className="flex-1">
                        {filteredProducts.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm text-center animate-in fade-in zoom-in duration-300">
                                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                                    <Search size={32} className="text-gray-300" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                    No matches found
                                </h3>
                                <p className="text-gray-500 max-w-md mx-auto mb-8">
                                    We couldn't find any products matching your current filters. Try
                                    adjusting your price range or selecting a different category.
                                </p>
                                <button
                                    onClick={() => {
                                        setSelectedCategory("All");
                                        setMaxPrice(priceRange.max);
                                    }}
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-all hover:shadow-lg active:scale-95"
                                >
                                    <X size={18} /> Clear all filters
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                {filteredProducts.map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                        onViewDetails={(p) => setSelectedProduct(p)}
                                    />
                                ))}
                            </div>
                        )}
                    </main>

                    {selectedProduct && (
                        <ProductModal
                            product={selectedProduct}
                            onClose={() => setSelectedProduct(null)}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
