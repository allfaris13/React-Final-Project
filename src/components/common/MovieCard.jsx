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
    
    // Correct routing path
    const linkPath = type === "movie" || item.media_type === "movie" 
        ? `/film/${item.id}` 
        : `/series/${item.id}`;
    
    const label = type === "movie" || item.media_type === "movie" ? "Movie" : "Series";

    // Handle poster path
    const posterSrc = item.poster_path 
        ? `${IMG_BASE_URL}${item.poster_path}` 
        : null;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -8 }}
            className="carousel-item w-64 group relative rounded-2xl overflow-hidden shadow-xl bg-gray-900 aspect-[2/3]"
        >
            <Link to={linkPath} className="w-full h-full relative block">
                {/* Image / Fallback */}
                {(!posterSrc || imageError) ? (
                    <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex flex-col items-center justify-center p-6 text-center border-2 border-gray-700 rounded-2xl">
                        <div className="text-4xl opacity-20 mb-4">🎬</div>
                        <h3 className="text-lg font-bold text-gray-400 line-clamp-3">{title}</h3>
                        <p className="text-xs text-gray-500 mt-2 italic px-2">Poster not available</p>
                        <div className="absolute inset-x-0 bottom-0 h-1 bg-red-600/30"></div>
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

                {/* Badge (Type & Rating) */}
                <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5 pointer-events-none">
                    <span className="bg-red-600/90 backdrop-blur-md text-[10px] font-bold px-2.5 py-1 rounded-full text-white uppercase tracking-wider shadow-lg">
                        {label}
                    </span>
                    {rating !== "N/A" && (
                        <span className="bg-black/60 backdrop-blur-md text-[10px] font-bold px-2.5 py-1 rounded-full text-yellow-400 flex items-center gap-1 shadow-lg w-fit">
                            ⭐ {rating}
                        </span>
                    )}
                </div>

                {/* Glassmorphism Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                
                {/* Info Text (Hover) */}
                <div className="absolute inset-0 flex flex-col justify-end p-5 translate-y-8 group-hover:translate-y-0 transition-transform duration-300 ease-out z-10">
                    <div className="flex justify-between items-start mb-2 group-hover:mb-3 transition-all">
                        <h3 className="text-xl font-black text-white leading-tight line-clamp-2 drop-shadow-md">
                            {title}
                        </h3>
                    </div>
                    
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                        <div className="flex items-center gap-3 text-xs text-gray-300 mb-3">
                            <span className="bg-white/10 px-2 py-0.5 rounded backdrop-blur-sm">{year}</span>
                            <span className="flex items-center gap-1"><FaPlay className="text-[10px] text-red-500" /> Watch</span>
                        </div>
                        <p className="text-[11px] text-gray-300 leading-relaxed line-clamp-3 mb-1 italic">
                            {overview}
                        </p>
                    </div>
                </div>

                {/* Corner Accent */}
                <div className="absolute -bottom-12 -right-12 w-24 h-24 bg-red-600 rounded-full blur-[40px] opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>
            </Link>
        </motion.div>
    );
};

export default MovieCard;
