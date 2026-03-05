import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTheme } from "../../context/ThemeContext";
import { removeFavorite } from "../../reducer/favoriteReducer";
import FloatingThemeButton from "../../components/common/FloatingThemeButton";
import MovieCard from "../../components/common/MovieCard";
import { motion, AnimatePresence } from "framer-motion";
import { FaTrash, FaBoxOpen } from "react-icons/fa";

const FavoriteView = () => {
    const dispatch = useDispatch();
    const { films, series } = useSelector((state) => state.favorite);
    const { theme } = useTheme();

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 600);
        return () => clearTimeout(timer);
    }, []);

    const handleRemove = (id, type) => {
        const typeText = type === "films" ? "movie" : "series";
        if (window.confirm(`Yakin menghapus ${typeText} ini dari favorit?`)) {
            dispatch(removeFavorite(id, type));
        }
    };

    const bgPrimary = "bg-base-100";
    const textPrimary = "text-base-content";
    const accentColor = "text-red-600";

    const renderSection = (items, title, type) => (
        <div className="mb-16 relative">
            <div className="flex items-center justify-between mb-8">
                <h3 className={`text-2xl font-black ${textPrimary} flex items-center gap-3`}>
                    <span className="w-2 h-8 bg-red-600 rounded-full"></span>
                    {title}
                    <span className="text-sm font-medium opacity-50 ml-2">({items.length} items)</span>
                </h3>
            </div>

            {items.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center p-12 bg-base-200/50 rounded-3xl border-2 border-dashed border-base-300"
                >
                    <FaBoxOpen className="text-4xl opacity-20 mb-4" />
                    <p className="opacity-40 font-medium">No items added to favorites yet.</p>
                </motion.div>
            ) : (
                <div className="relative">
                    <div className="overflow-x-auto scroll-smooth pb-8 px-4 scrollbar-hide">
                        <div className="carousel w-full space-x-8 pb-4 pt-4">
                            <AnimatePresence mode="popLayout">
                                {items.map((item) => (
                                    <motion.div
                                        key={`${type}-${item.id}`}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                                        className="relative group"
                                    >
                                        <MovieCard item={item} type={type === "films" ? "movie" : "series"} />

                                        {/* Premium Delete Button */}
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleRemove(item.id, type);
                                            }}
                                            className="absolute -top-3 -right-3 p-3 bg-red-600 hover:bg-black text-white rounded-2xl z-40 
                                                        opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-xl border-4 border-base-100 transform hover:scale-110"
                                            title="Remove from Favorites"
                                        >
                                            <FaTrash className="text-xs" />
                                        </button>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    if (loading) {
        return (
            <div className={`flex justify-center items-center min-h-screen ${bgPrimary} ${textPrimary}`}>
                <div className="flex flex-col items-center">
                    <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-6"></div>
                    <p className="text-xl font-black tracking-widest uppercase opacity-50">Loading Collections</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`relative min-h-screen ${bgPrimary} ${textPrimary} pt-12`}>
            <div className="max-w-7xl mx-auto px-6">
                <header className="mb-16">
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-5xl md:text-7xl font-black mb-4 tracking-tighter"
                    >
                        My <span className="text-red-600">Favorites</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg opacity-60 font-medium max-w-2xl"
                    >
                        Your curated list of must-watch movies and series. Everything you love, all in one place.
                    </motion.p>
                </header>

                {renderSection(films, "Movies", "films")}
                {renderSection(series, "Series", "series")}
            </div>

            <FloatingThemeButton />
        </div>
    );
};

export default FavoriteView;