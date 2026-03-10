import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaStar, FaHeart, FaCalendarAlt, FaGlobe, FaTag, FaIndustry, FaPlay, FaClock } from 'react-icons/fa';
import { IoIosArrowBack } from 'react-icons/io';
import RatingReview from "../../components/Detail/RatingReview/RatingReview";
import FloatingThemeButton from "../../components/common/FloatingThemeButton";
import MovieCard from "../../components/common/MovieCard";
import { motion } from "framer-motion";

const IMG_BASE = "https://image.tmdb.org/t/p/original";
const POSTER_BASE = "https://image.tmdb.org/t/p/w500";

const SeriesDetailView = ({ series, trailerKey, cast, similar, theme, handleFavorite, isFavorite }) => {
    const navigate = useNavigate();

    const themeClass = theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900";
    const detailBgClass = theme === "dark" ? "bg-gray-800/50 backdrop-blur-md" : "bg-white shadow-xl";
    const cardBgClass = theme === "dark" ? "bg-gray-700" : "bg-gray-200";

    const primaryBtnClass = "flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 md:py-4 md:px-8 rounded-2xl shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 text-sm md:text-base";
    const secondaryBtnClass = "flex items-center justify-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white font-bold py-3 px-6 md:py-4 md:px-8 rounded-2xl shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 text-sm md:text-base";

    return (
        <div className={`min-h-screen transition-colors duration-500 ${themeClass} overflow-x-hidden`}>

            {/* 1. HERO SECTION - FULL SCREEN CINEMATIC */}
            <div className="relative w-full h-screen">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    className="absolute inset-0 overflow-hidden bg-black"
                >
                    {/* Base Image Layer */}
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${IMG_BASE}${series.backdrop_path})` }}
                    />

                    {/* Video Background Layer */}
                    {trailerKey && (
                        <div className="absolute inset-0 pointer-events-none">
                            <iframe
                                className="absolute top-1/2 left-1/2 w-[115%] h-[115%] -translate-x-1/2 -translate-y-1/2 object-cover scale-[3.8] sm:scale-[1.35]"
                                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&loop=1&playlist=${trailerKey}&controls=0&modestbranding=1&showinfo=0&rel=0&iv_load_policy=3&enablejsapi=1&playsinline=1&origin=${window.location.origin}`}
                                title="Background Trailer"
                                allow="autoplay; encrypted-media"
                            />
                            <div className="absolute inset-0 bg-black/10"></div>
                        </div>
                    )}

                    {/* Cinematic Bottom Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-black/10"></div>
                </motion.div>

                {/* Top Nav Overlay - Snapped exactly below the floating navbar - Compact Version */}
                <div className="absolute top-20 inset-x-0 p-4 md:p-6 flex justify-between items-center z-40">
                    <motion.button
                        whileHover={{ x: -5 }}
                        onClick={() => navigate(-1)}
                        className="bg-black/20 backdrop-blur-md hover:bg-red-600/80 text-white px-3 py-1.5 md:px-6 md:py-3 rounded-lg md:rounded-2xl shadow-2xl transition-all flex items-center gap-1.5 md:gap-2 text-[10px] md:text-sm font-bold border border-white/10"
                    >
                        <IoIosArrowBack className="text-base md:text-xl" /> Back
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleFavorite}
                        className={`backdrop-blur-md border border-white/20 p-2.5 md:p-4 rounded-lg md:rounded-2xl transition-all shadow-2xl ${isFavorite ? 'bg-red-600/70 text-white border-red-500/50' : 'bg-black/20 text-white hover:bg-red-600/80'}`}
                    >
                        <FaHeart className="text-base md:text-xl" />
                    </motion.button>
                </div>

                {/* Hero Content */}
                <div className="absolute inset-x-0 bottom-0 px-6 md:px-16 pb-16 z-20">
                    <div className="flex flex-col md:flex-row gap-12 items-end">
                        <motion.div
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="hidden md:block w-72 flex-shrink-0"
                        >
                            <img
                                src={series.poster_path ? `${POSTER_BASE}${series.poster_path}` : "https://via.placeholder.com/500x750?text=No+Poster"}
                                alt={series.name}
                                className="w-full rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-4 border-white/10 transform rotate-3"
                            />
                        </motion.div>

                        <div className="flex-1">
                            <motion.h1
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="text-3xl md:text-8xl font-black text-white mb-4 md:mb-6 tracking-tighter drop-shadow-2xl"
                            >
                                {series.name}
                            </motion.h1>

                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="flex flex-wrap items-center gap-3 md:gap-6 text-white mb-6 md:mb-8"
                            >
                                <span className="flex items-center gap-1.5 md:gap-2 bg-yellow-500/20 backdrop-blur-md px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-yellow-500/30 text-yellow-400 font-bold text-xs md:text-base">
                                    <FaStar /> {series.vote_average?.toFixed(1)}
                                </span>
                                <span className="bg-white/10 backdrop-blur-md px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-white/10 font-bold text-xs md:text-base">
                                    {series.first_air_date ? new Date(series.first_air_date).getFullYear() : 'TBA'}
                                </span>
                                <span className="bg-red-600/20 backdrop-blur-md px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-red-600/30 text-red-400 font-bold uppercase tracking-widest text-[10px] md:text-xs">
                                    TV Series
                                </span>
                            </motion.div>

                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="flex flex-wrap gap-4"
                            >
                                {trailerKey ? (
                                    <a href={`https://www.youtube.com/watch?v=${trailerKey}`} target="_blank" rel="noopener noreferrer" className={primaryBtnClass}>
                                        <FaPlay /> Watch Trailer
                                    </a>
                                ) : (
                                    <button disabled className={`${primaryBtnClass} opacity-50`}>Trailer Unavailable</button>
                                )}
                                {series.homepage && (
                                    <a href={series.homepage} target="_blank" rel="noreferrer" className={secondaryBtnClass}>
                                        <FaGlobe /> Website
                                    </a>
                                )}
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. MAIN CONTENT AREA */}
            <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-30 pb-24">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* Left Column (Overview & Seasons) */}
                    <div className="lg:col-span-2 space-y-12">
                        <section className={`p-8 md:p-12 rounded-[2.5rem] ${detailBgClass}`}>
                            <h2 className="text-3xl font-black mb-6 flex items-center gap-3">
                                <span className="w-2 h-8 bg-red-600 rounded-full"></span>
                                Overview
                            </h2>
                            <p className="text-lg md:text-xl leading-relaxed opacity-80 font-medium">
                                {series.overview || "No overview available for this series."}
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 pt-12 border-t border-white/5">
                                <div className="space-y-4">
                                    <p className="flex items-center gap-4 text-sm font-bold opacity-60 uppercase tracking-widest"><FaCalendarAlt className="text-red-600" /> First Air Date</p>
                                    <p className="text-lg font-black">{series.first_air_date || 'TBA'}</p>
                                </div>
                                <div className="space-y-4">
                                    <p className="flex items-center gap-4 text-sm font-bold opacity-60 uppercase tracking-widest"><FaTag className="text-red-600" /> Status</p>
                                    <p className="text-lg font-black">{series.status}</p>
                                </div>
                                <div className="space-y-4">
                                    <p className="flex items-center gap-4 text-sm font-bold opacity-60 uppercase tracking-widest"><FaGlobe className="text-red-600" /> Language</p>
                                    <p className="text-lg font-black">{series.original_language?.toUpperCase()}</p>
                                </div>
                                <div className="space-y-4">
                                    <p className="flex items-center gap-4 text-sm font-bold opacity-60 uppercase tracking-widest"><FaIndustry className="text-red-600" /> Production</p>
                                    <p className="text-lg font-black truncate">{series.production_companies?.[0]?.name || 'N/A'}</p>
                                </div>
                            </div>
                        </section>

                        {/* Seasons Horizontal List */}
                        {series.seasons && (
                            <section>
                                <h2 className="text-3xl font-black mb-8 flex items-center gap-3">
                                    <span className="w-2 h-8 bg-red-600 rounded-full"></span>
                                    Seasons
                                </h2>
                                <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide">
                                    {series.seasons.map(season => (
                                        <div key={season.id} className="w-48 flex-shrink-0 group">
                                            <div className="relative rounded-3xl overflow-hidden shadow-2xl mb-4">
                                                <img
                                                    src={season.poster_path ? `${POSTER_BASE}${season.poster_path}` : "https://via.placeholder.com/300x450?text=No+Poster"}
                                                    alt={season.name}
                                                    className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <span className="bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-black italic">S{season.season_number}</span>
                                                </div>
                                            </div>
                                            <h4 className="font-black text-center truncate">{season.name}</h4>
                                            <p className="text-xs text-center opacity-50 font-bold">{season.episode_count} Episodes</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Casting */}
                        {cast.length > 0 && (
                            <section>
                                <h2 className="text-3xl font-black mb-8 flex items-center gap-3">
                                    <span className="w-2 h-8 bg-red-600 rounded-full"></span>
                                    Full Cast
                                </h2>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                                    {cast.slice(0, 8).map(c => (
                                        <div key={c.id} className={`p-4 rounded-3xl ${detailBgClass} transition-all hover:bg-black hover:text-white group`}>
                                            <img
                                                src={c.profile_path ? `${POSTER_BASE}${c.profile_path}` : "https://via.placeholder.com/200x300?text=No+Image"}
                                                alt={c.original_name}
                                                className="w-full h-40 object-cover rounded-2xl mb-4 grayscale group-hover:grayscale-0 transition-all duration-500"
                                            />
                                            <h4 className="font-bold text-sm truncate">{c.original_name}</h4>
                                            <p className="text-[10px] opacity-50 truncate">{c.character}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Right Column (Sidebar) */}
                    <div className="space-y-12">
                        {/* Rating Section */}
                        <section className={`p-8 rounded-[2.5rem] ${detailBgClass}`}>
                            <RatingReview seriesId={series.id} theme={theme} />
                        </section>

                        {/* Similar Recommendations */}
                        {similar.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-black mb-6">Recommendations</h2>
                                <div className="space-y-6">
                                    {similar.slice(0, 5).map(s => (
                                        <Link
                                            key={s.id}
                                            to={`/series/${s.id}`}
                                            className="flex gap-4 group"
                                        >
                                            <div className="w-24 h-36 flex-shrink-0 rounded-2xl overflow-hidden shadow-lg">
                                                <img
                                                    src={s.poster_path ? `${POSTER_BASE}${s.poster_path}` : "https://via.placeholder.com/200x300?text=No+Poster"}
                                                    alt={s.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                                                />
                                            </div>
                                            <div className="flex flex-col justify-center">
                                                <h4 className="font-black group-hover:text-red-600 transition-colors leading-tight mb-2">{s.name}</h4>
                                                <div className="flex items-center gap-2 text-xs font-bold opacity-50">
                                                    <FaStar className="text-yellow-500" />
                                                    {s.vote_average?.toFixed(1)}
                                                    <span>•</span>
                                                    {s.first_air_date ? new Date(s.first_air_date).getFullYear() : 'TBA'}
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </div>

            <FloatingThemeButton />
        </div>
    );
};

export default SeriesDetailView;