import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaStar, FaPlay } from "react-icons/fa";

const IMG_BASE_URL = "https://image.tmdb.org/t/p/w500";

const MovieCard = ({ item, type = "movie" }) => {
    const [imageError, setImageError] = useState(false);

    const title = item.title || item.name || item.original_title || item.original_name;
    const rating = item.vote_average?.toFixed(1) || "N/A";
    const overview = item.overview || "No description available.";
    const year = item.release_date
        ? new Date(item.release_date).getFullYear()
        : (item.first_air_date ? new Date(item.first_air_date).getFullYear() : "");

    const linkPath = type === "movie" || item.media_type === "movie"
        ? `/film/${item.id}`
        : `/series/${item.id}`;

    const label = type === "movie" || item.media_type === "movie" ? "Movie" : "Series";

    const posterSrc = item.poster_path
        ? `${IMG_BASE_URL}${item.poster_path}`
        : null;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -5 }}
            className="carousel-item w-48 sm:w-56 md:w-64 group relative rounded-xl sm:rounded-2xl overflow-hidden shadow-xl bg-gray-900 aspect-[2/3] flex-shrink-0"
        >
            <Link to={linkPath} className="w-full h-full relative block">
                {(!posterSrc || imageError) ? (
                    <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex flex-col items-center justify-center p-4 sm:p-6 text-center border border-gray-700">
                        <div className="text-3xl sm:text-4xl opacity-20 mb-3 sm:mb-4">🎬</div>
                        <h3 className="text-sm sm:text-lg font-bold text-gray-400 line-clamp-3 leading-tight">{title}</h3>
                        <p className="text-[10px] sm:text-xs text-gray-500 mt-2 italic px-2">Poster not available</p>
                    </div>
                ) : (
                    <img
                        src={posterSrc}
                        alt={title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={() => setImageError(true)}
                        loading="lazy"
                    />
                )}

                {/* Badge Overlay - Responsive sized */}
                <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-20 flex flex-col gap-1 sm:gap-1.5 pointer-events-none">
                    <span className="bg-red-600/90 backdrop-blur-md text-[8px] sm:text-[10px] font-black px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-white uppercase tracking-wider shadow-lg">
                        {label}
                    </span>
                    {rating !== "N/A" && (
                        <span className="bg-black/60 backdrop-blur-md text-[8px] sm:text-[10px] font-black px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-yellow-400 flex items-center gap-1 shadow-lg w-fit border border-white/5">
                            ⭐ {rating}
                        </span>
                    )}
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300"></div>

                {/* Responsive Info Overlays */}
                <div className="absolute inset-x-0 bottom-0 p-3 sm:p-5 translate-y-6 sm:translate-y-8 group-hover:translate-y-0 transition-transform duration-300 ease-out z-10">
                    <h3 className="text-base sm:text-xl font-black text-white leading-tight line-clamp-2 drop-shadow-md mb-2 group-hover:mb-3">
                        {title}
                    </h3>

                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                        <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs text-gray-300 mb-2 sm:mb-3">
                            <span className="bg-white/10 px-1.5 py-0.5 rounded backdrop-blur-sm font-bold">{year}</span>
                            <span className="flex items-center gap-1 font-bold"><FaPlay className="text-[8px] sm:text-[10px] text-red-500" /> Watch</span>
                        </div>
                        <p className="text-[9px] sm:text-[11px] text-gray-300/80 leading-relaxed line-clamp-3 mb-1 font-medium italic">
                            {overview}
                        </p>
                    </div>
                </div>

                <div className="absolute -bottom-10 -right-10 w-20 h-20 bg-red-600 rounded-full blur-[35px] opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
            </Link>
        </motion.div>
    );
};

export default MovieCard;
