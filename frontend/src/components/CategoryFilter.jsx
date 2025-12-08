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

export default function CategoryFilter({
    categories,
    selectedCategory,
    setSelectedCategory,
    maxPrice,
    setMaxPrice,
    priceRange,
}) {
    return (
        <div className="space-y-8">
            {/* Categories */}
            <div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
                    Categories
                </h3>
                <div className="space-y-2">
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <div
                            className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                                selectedCategory === "All"
                                    ? "bg-indigo-600 border-indigo-600"
                                    : "border-gray-300 group-hover:border-indigo-400"
                            }`}
                        >
                            {selectedCategory === "All" && (
                                <div className="w-2 h-2 bg-white rounded-full" />
                            )}
                        </div>
                        <input
                            type="radio"
                            name="category"
                            className="hidden"
                            checked={selectedCategory === "All"}
                            onChange={() => setSelectedCategory("All")}
                        />
                        <span
                            className={`text-sm ${
                                selectedCategory === "All"
                                    ? "text-indigo-700 font-medium"
                                    : "text-gray-600 group-hover:text-gray-900"
                            }`}
                        >
                            All Products
                        </span>
                    </label>

                    {categories.map((cat) => (
                        <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                            <div
                                className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                                    selectedCategory === cat
                                        ? "bg-indigo-600 border-indigo-600"
                                        : "border-gray-300 group-hover:border-indigo-400"
                                }`}
                            >
                                {selectedCategory === cat && (
                                    <div className="w-2 h-2 bg-white rounded-full" />
                                )}
                            </div>
                            <input
                                type="radio"
                                name="category"
                                className="hidden"
                                checked={selectedCategory === cat}
                                onChange={() => setSelectedCategory(cat)}
                            />
                            <span
                                className={`text-sm ${
                                    selectedCategory === cat
                                        ? "text-indigo-700 font-medium"
                                        : "text-gray-600 group-hover:text-gray-900"
                                }`}
                            >
                                {cat}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Price Filter */}
            <div className="pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                        Price Range
                    </h3>
                    <span className="text-xs font-medium text-gray-500">Up to ${maxPrice}</span>
                </div>

                <input
                    type="range"
                    min="0"
                    max={priceRange.max}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                    <span>$0</span>
                    <span>${priceRange.max}</span>
                </div>
            </div>
        </div>
    );
}
