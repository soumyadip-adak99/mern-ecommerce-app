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
import { useParams } from "react-router-dom";

export default function CategoryPage() {
    const { categoryName } = useParams();

    const defaultCategory = categoryName;

    const [selectedCategory, setSelectedCategory] = useState("All");
    const [maxPrice, setMaxPrice] = useState(500);
    const [sortOption, setSortOption] = useState("recommended");
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

    // Derived Data
    const categories = useMemo(() => [...new Set(productData.map((p) => p.category))], []);

    // Calculate max price from data for the slider upper bound
    const priceRange = useMemo(() => {
        const prices = productData.map((p) => p.price);
        return { min: Math.min(...prices), max: Math.max(...prices) + 50 }; // Add buffer
    }, []);

    // Filter & Sort Logic
    const filteredProducts = useMemo(() => {
        let result = productData;

        // 1. Filter by Category
        if (selectedCategory !== "All") {
            result = result.filter((p) => p.category === selectedCategory);
        }

        // 2. Filter by Price
        result = result.filter((p) => p.price <= maxPrice);

        // 3. Sort
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

    // Handle default initial category simulation
    useEffect(() => {
        // In real app, this syncs with URL params
        // if (categoryName) setSelectedCategory(categoryName);
    }, []);

    return (
        <div className="bg-gray-50 min-h-screen font-sans">
            {/* Breadcrumb Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <nav className="flex items-center text-sm text-gray-500 mb-4">
                        <a
                            href="/"
                            className="hover:text-indigo-200 flex items-center gap-1 transition-colors text-[20px] bg-indigo-500 p-1 rounded-lg text-white"
                        >
                            <Home size={20} /> Home
                        </a>
                        <ChevronRight size={14} className="mx-2" />
                        <span className="font-medium text-gray-900">
                            {selectedCategory === "All" ? "Shop" : selectedCategory}
                        </span>
                    </nav>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                            {selectedCategory === "All" ? "All Products" : `${selectedCategory}`}
                        </h1>

                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-500 hidden sm:inline-block">
                                Showing {filteredProducts.length} results
                            </span>

                            {/* Sort Dropdown */}
                            <div className="relative group">
                                <select
                                    value={sortOption}
                                    onChange={(e) => setSortOption(e.target.value)}
                                    className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm font-medium cursor-pointer hover:border-gray-400 transition-colors"
                                >
                                    <option value="recommended">Recommended</option>
                                    <option value="priceLowHigh">Price: Low to High</option>
                                    <option value="priceHighLow">Price: High to Low</option>
                                    <option value="rating">Best Rating</option>
                                </select>
                                <ChevronDown
                                    size={16}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                                />
                            </div>

                            {/* Mobile Filter Toggle */}
                            <button
                                onClick={() => setIsMobileFiltersOpen(true)}
                                className="lg:hidden p-2 text-gray-600 hover:text-indigo-600 border border-gray-300 rounded-lg hover:border-indigo-600 transition-colors"
                            >
                                <SlidersHorizontal size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Desktop Sidebar Filters */}
                    <aside className="hidden lg:block w-64 shrink-0">
                        <div className="sticky top-8 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <div className="flex items-center gap-2 mb-6 text-gray-900">
                                <Filter size={20} />
                                <h2 className="font-bold text-lg">Filters</h2>
                            </div>
                            <CategoryFilter
                                selectedCategory={selectedCategory}
                                setSelectedCategory={setSelectedCategory}
                                maxPrice={maxPrice}
                                setMaxPrice={setMaxPrice}
                                categories={categories}
                                priceRange={priceRange}
                            />
                        </div>
                    </aside>

                    {/* Mobile Filter Drawer */}
                    {isMobileFiltersOpen && (
                        <div className="fixed inset-0 z-50 lg:hidden flex">
                            <div
                                className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                                onClick={() => setIsMobileFiltersOpen(false)}
                            />
                            <div className="relative w-full max-w-xs bg-white h-full shadow-2xl p-6 overflow-y-auto animate-in slide-in-from-left duration-300">
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-xl font-bold text-gray-900">Filters</h2>
                                    <button
                                        onClick={() => setIsMobileFiltersOpen(false)}
                                        className="p-2 hover:bg-gray-100 rounded-full"
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
                                <button
                                    onClick={() => setIsMobileFiltersOpen(false)}
                                    className="w-full mt-8 bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-colors"
                                >
                                    Show {filteredProducts.length} Results
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Product Grid */}
                    <main className="flex-1">
                        {filteredProducts.length === 0 ? (
                            <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 shadow-sm">
                                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                    <Filter size={24} className="text-gray-400" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">
                                    No products found
                                </h3>
                                <p className="text-gray-500 mb-6">
                                    We couldn't find any products matching your current filters. Try
                                    adjusting your price range or category.
                                </p>
                                <button
                                    onClick={() => {
                                        setSelectedCategory("All");
                                        setMaxPrice(priceRange.max);
                                    }}
                                    className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredProducts.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}
