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

export default function ProductCard({ product }) {
    return (
        <div className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col">
            <div className="relative h-56 overflow-hidden bg-gray-100">
                <img
                    src={product.image}
                    alt={product.product_name}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                {/* Badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                    {product.status === "OUT_OF_STOCK" && (
                        <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                            Sold Out
                        </span>
                    )}
                    {product.status === "COMING_SOON" && (
                        <span className="bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                            Coming Soon
                        </span>
                    )}
                </div>

                {/* Quick Action Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/50 to-transparent">
                    <button className="w-full bg-white text-gray-900 font-medium py-2 rounded-lg shadow-lg hover:bg-gray-50 flex items-center justify-center gap-2 text-sm">
                        <ShoppingCart size={16} />
                        Add to Cart
                    </button>
                </div>

                <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full text-gray-400 hover:text-red-500 hover:bg-white transition-colors">
                    <Heart size={18} />
                </button>
            </div>

            <div className="p-5 flex flex-col flex-grow">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">
                        {product.category}
                    </span>
                    <div className="flex items-center gap-1 text-amber-400 text-xs font-medium">
                        <Star size={12} fill="currentColor" />
                        <span className="text-gray-500 ml-1">
                            {product.rating} ({product.reviews})
                        </span>
                    </div>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">
                    {product.product_name}
                </h3>

                <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-grow">
                    {product.product_description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                    <span className="text-xl font-bold text-gray-900">
                        ${product.price.toFixed(2)}
                    </span>
                </div>
            </div>
        </div>
    );
}
