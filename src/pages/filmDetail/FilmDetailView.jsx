import React from "react";
import { useNavigate, Link } from "react-router-dom";
import RatingReview from "../../components/Detail/RatingReview/RatingReview";
import { useTheme } from "../../context/ThemeContext";
import FloatingThemeButton from "../../components/common/FloatingThemeButton";
import MovieCard from "../../components/common/MovieCard";
import { motion } from "framer-motion";
import { IoIosArrowBack } from "react-icons/io";
import { FaStar, FaPlay, FaGlobe, FaClock, FaHeart, FaCalendarAlt, FaTag, FaIndustry } from "react-icons/fa";

const IMG_BASE = "https://image.tmdb.org/t/p/original";
const POSTER_BASE = "https://image.tmdb.org/t/p/w500";

const FilmDetailView = ({ film, trailerKey, cast, similar, theme, handleFavorite, isFavorite }) => {
    const navigate = useNavigate();

    const themeClass = theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900";
    const detailBgClass = theme === "dark" ? "bg-gray-800/50 backdrop-blur-md" : "bg-white shadow-xl";

    const primaryBtnClass = "flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 md:py-4 md:px-8 rounded-2xl shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 text-sm md:text-base";
    const secondaryBtnClass = "flex items-center justify-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white font-bold py-3 px-6 md:py-4 md:px-8 rounded-2xl shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 text-sm md:text-base";

    const formatRuntime = (minutes) => {
        if (!minutes || minutes === 0) return 'N/A';
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return `${hours}h ${remainingMinutes}m`;
    };

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
                    {/* Base Image Layer - High Quality Fallback */}
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
                        style={{ backgroundImage: `url(${IMG_BASE}${film.backdrop_path})` }}
                    />

                    {/* Video Background Layer - YouTube Integration */}
                    {trailerKey && (
                        <div className="absolute inset-0 pointer-events-none">
                            <iframe
                                className="absolute top-1/2 left-1/2 w-[115%] h-[115%] -translate-x-1/2 -translate-y-1/2 object-cover scale-[3.8] sm:scale-[1.35]"
                                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&loop=1&playlist=${trailerKey}&controls=0&modestbranding=1&showinfo=0&rel=0&iv_load_policy=3&enablejsapi=1&playsinline=1&origin=${window.location.origin}`}
                                title="Background Trailer"
                                allow="autoplay; encrypted-media"
                            />
                            {/* Subtle dark overlay to blend video with UI */}
                            <div className="absolute inset-0 bg-black/10"></div>
                        </div>
                    )}

                    {/* Cinematic Bottom Gradient Overlay */}
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
                                src={film.poster_path ? `${POSTER_BASE}${film.poster_path}` : "https://via.placeholder.com/500x750?text=No+Poster"}
                                alt={film.title}
                                className="w-full rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-4 border-white/10 transform rotate-3"
                            />
                        </motion.div>

                        <div className="flex-1">
                            {film.tagline && (
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 0.8 }}
                                    className="text-red-500 font-black tracking-[0.3em] uppercase text-xs mb-4 drop-shadow-lg"
                                >
                                    {film.tagline}
                                </motion.p>
                            )}
                            <motion.h1
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="text-3xl md:text-8xl font-black text-white mb-4 md:mb-6 tracking-tighter drop-shadow-2xl"
                            >
                                {film.title}
                            </motion.h1>

                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="flex flex-wrap items-center gap-3 md:gap-6 text-white mb-6 md:mb-8"
                            >
                                <span className="flex items-center gap-1.5 md:gap-2 bg-yellow-500/20 backdrop-blur-md px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-yellow-500/30 text-yellow-400 font-bold text-xs md:text-base">
                                    <FaStar /> {film.vote_average?.toFixed(1)}
                                </span>
                                <span className="bg-white/10 backdrop-blur-md px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-white/10 font-bold text-xs md:text-base">
                                    {film.release_date ? new Date(film.release_date).getFullYear() : 'TBA'}
                                </span>
                                <span className="flex items-center gap-1.5 md:gap-2 bg-blue-500/20 backdrop-blur-md px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-blue-500/30 text-blue-400 font-bold text-xs md:text-base">
                                    <FaClock /> {formatRuntime(film.runtime)}
                                </span>
                                <span className="bg-red-600/20 backdrop-blur-md px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-red-600/30 text-red-400 font-bold uppercase tracking-widest text-[10px] md:text-xs">
                                    Movie
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
                                {film.homepage && (
                                    <a href={film.homepage} target="_blank" rel="noreferrer" className={secondaryBtnClass}>
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

                    {/* Left Column (Overview & Cast) */}
                    <div className="lg:col-span-2 space-y-12">
                        <section className={`p-8 md:p-12 rounded-[2.5rem] ${detailBgClass}`}>
                            <h2 className="text-3xl font-black mb-6 flex items-center gap-3">
                                <span className="w-2 h-8 bg-red-600 rounded-full"></span>
                                Synopsis
                            </h2>
                            <p className="text-lg md:text-xl leading-relaxed opacity-80 font-medium">
                                {film.overview || "No overview available for this film."}
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 pt-12 border-t border-white/5">
                                <div className="space-y-4">
                                    <p className="flex items-center gap-4 text-sm font-bold opacity-60 uppercase tracking-widest"><FaCalendarAlt className="text-red-600" /> Release Date</p>
                                    <p className="text-lg font-black">{film.release_date || 'TBA'}</p>
                                </div>
                                <div className="space-y-4">
                                    <p className="flex items-center gap-4 text-sm font-bold opacity-60 uppercase tracking-widest"><FaTag className="text-red-600" /> Status</p>
                                    <p className="text-lg font-black">{film.status}</p>
                                </div>
                                <div className="space-y-4">
                                    <p className="flex items-center gap-4 text-sm font-bold opacity-60 uppercase tracking-widest"><FaGlobe className="text-red-600" /> Language</p>
                                    <p className="text-lg font-black">{film.original_language?.toUpperCase()}</p>
                                </div>
                                <div className="space-y-4">
                                    <p className="flex items-center gap-4 text-sm font-bold opacity-60 uppercase tracking-widest"><FaIndustry className="text-red-600" /> Production</p>
                                    <p className="text-lg font-black truncate">{film.production_companies?.[0]?.name || 'N/A'}</p>
                                </div>
                            </div>
                        </section>

                        {/* Soundtrack Section */}
                        <section className={`p-8 md:p-12 rounded-[2.5rem] ${detailBgClass} border-l-8 border-red-600`}>
                            <h3 className="text-2xl font-black mb-6 flex items-center gap-3">
                                <span className="text-red-600 animate-pulse">🎵</span> Soundtrack (AI Generated)
                            </h3>
                            <audio controls className="w-full opacity-80">
                                <source src="/theConjuring.mp3" type="audio/mpeg" />
                                Browser anda tidak mendukung elemen audio.
                            </audio>
                        </section>

                        {/* Casting */}
                        {cast.length > 0 && (
                            <section>
                                <h2 className="text-3xl font-black mb-8 flex items-center gap-3">
                                    <span className="w-2 h-8 bg-red-600 rounded-full"></span>
                                    The Cast
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
                            <RatingReview filmId={film.id} theme={theme} />
                        </section>

                        {/* Similar Recommendations */}
                        {similar.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-black mb-6">Recommendations</h2>
                                <div className="space-y-6">
                                    {similar.slice(0, 5).map(s => (
                                        <Link
                                            key={s.id}
                                            to={`/film/${s.id}`}
                                            className="flex gap-4 group"
                                        >
                                            <div className="w-24 h-36 flex-shrink-0 rounded-2xl overflow-hidden shadow-lg">
                                                <img
                                                    src={s.poster_path ? `${POSTER_BASE}${s.poster_path}` : "https://via.placeholder.com/200x300?text=No+Poster"}
                                                    alt={s.title}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                                                />
                                            </div>
                                            <div className="flex flex-col justify-center">
                                                <h4 className="font-black group-hover:text-red-600 transition-colors leading-tight mb-2">{s.title}</h4>
                                                <div className="flex items-center gap-2 text-xs font-bold opacity-50">
                                                    <FaStar className="text-yellow-500" />
                                                    {s.vote_average?.toFixed(1)}
                                                    <span>•</span>
                                                    {s.release_date ? new Date(s.release_date).getFullYear() : 'TBA'}
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

export default FilmDetailView;
