import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTheme } from "../../context/ThemeContext";
import { removeFavorite } from "../../reducer/favoriteReducer";
import FloatingThemeButton from "../../components/common/FloatingThemeButton";
import MovieCard from "../../components/common/MovieCard";
import { motion, AnimatePresence } from "framer-motion";
import { FaTrash, FaBoxOpen, FaHeart } from "react-icons/fa";

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

    const isDark = theme === "dark";
    const bgPrimary = isDark ? "bg-gray-900" : "bg-gray-50";
    const textPrimary = isDark ? "text-white" : "text-gray-900";

    const renderSection = (items, title, type) => (
        <div className="mb-16 sm:mb-24 relative">
            <div className="flex items-center justify-between mb-8">
                <h3 className={`text-xl sm:text-3xl font-black ${textPrimary} flex items-center gap-3`}>
                    <span className="w-2 h-8 bg-red-600 rounded-full"></span>
                    {title}
                    <span className="text-sm font-bold opacity-30 ml-2 tracking-widest uppercase">({items.length} items)</span>
                </h3>
            </div>

            {items.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex flex-col items-center justify-center p-12 sm:p-20 rounded-[2rem] border-2 border-dashed ${isDark ? 'border-white/5 bg-gray-800/30' : 'border-gray-200 bg-gray-100/50'}`}
                >
                    <FaBoxOpen className="text-4xl sm:text-6xl opacity-20 mb-6" />
                    <p className="opacity-40 font-black italic text-lg sm:text-xl">Your collection for {title.toLowerCase()} is empty.</p>
                </motion.div>
            ) : (
                <div className="relative group">
                    <div className={`absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-${isDark ? 'gray-900' : 'gray-50'} to-transparent pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity`} />
                    <div className={`absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-${isDark ? 'gray-900' : 'gray-50'} to-transparent pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity`} />

                    <div className="overflow-x-auto scroll-smooth pb-8 px-2 sm:px-4 scrollbar-hide">
                        <div className="carousel w-full gap-4 sm:gap-8 pb-4 pt-4">
                            <AnimatePresence mode="popLayout">
                                {items.map((item) => (
                                    <motion.div
                                        key={`${type}-${item.id}`}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        className="relative group/fav flex-shrink-0"
                                    >
                                        <MovieCard item={item} type={type === "films" ? "movie" : "series"} />

                                        {/* Mobile Optimized Delete Button */}
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleRemove(item.id, type);
                                            }}
                                            className="absolute top-2 right-2 sm:-top-3 sm:-right-3 p-3 sm:p-4 bg-red-600 hover:bg-black text-white rounded-xl sm:rounded-2xl z-40 
                                                        opacity-100 sm:opacity-0 sm:group-hover/fav:opacity-100 transition-all duration-300 shadow-2xl border-4 border-base-100 sm:border-gray-900 transform hover:scale-110 active:scale-90"
                                            title="Remove from Favorites"
                                        >
                                            <FaTrash className="text-xs sm:text-sm" />
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
            <div className={`flex flex-col justify-center items-center min-h-screen ${bgPrimary} ${textPrimary}`}>
                <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-8 shadow-[0_0_30px_rgba(220,38,38,0.2)]"></div>
                <p className="text-xl font-black tracking-widest uppercase opacity-40 animate-pulse">Syncing Collection</p>
            </div>
        );
    }

    return (
        <div className={`relative min-h-screen ${bgPrimary} ${textPrimary} pt-12 sm:pt-20`}>
            <div className="max-w-7xl mx-auto px-6">
                <header className="mb-16 sm:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="w-16 h-1 w-24 bg-red-600 rounded-full mb-8 shadow-lg shadow-red-600/50"
                        />
                        <motion.h1
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-5xl sm:text-7xl md:text-8xl font-black mb-6 tracking-tighter"
                        >
                            Your <span className="text-red-600">Vault</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-base sm:text-xl opacity-60 font-medium max-w-2xl leading-relaxed"
                        >
                            A personalized collection of your favorite cinematic masterpieces. Curated by you, powered by BiosKocak.
                        </motion.p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-3 bg-red-600/10 px-6 py-3 rounded-2xl border border-red-600/20"
                    >
                        <FaHeart className="text-red-600 animate-bounce" />
                        <span className="font-black text-red-600 uppercase tracking-widest text-sm">
                            {films.length + series.length} Favorites
                        </span>
                    </motion.div>
                </header>

                {renderSection(films, "Movies", "films")}
                {renderSection(series, "TV Series", "series")}
            </div>

            <FloatingThemeButton />
        </div>
    );
};

export default FavoriteView;