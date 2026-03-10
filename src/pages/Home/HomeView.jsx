import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { FaVolumeUp, FaVolumeMute, FaMoon, FaSun, FaPlay, FaInfoCircle } from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";

import ListMovie from "../../components/List/listMovie/ListMovie";
import ListSeries from "../../components/List/listSeries/ListSeries";
import ListTrending from "../../components/List/listTrending/ListTrending";
import ListNowPlaying from "../../components/List/listNowPlaying/ListNowPlaying";

const HomeView = ({
  trendingMovie,
  trailerKey,
  loading,
  isMuted,
  toggleSound,
}) => {
  const { theme, toggleTheme } = useTheme();
  const IMG_BASE_URL = "https://image.tmdb.org/t/p/original";

  useEffect(() => {
    const iframe = document.getElementById("ytPlayer");
    if (!iframe) return;

    const funcToCall = isMuted ? "mute" : "unMute";
    iframe.contentWindow?.postMessage(
      JSON.stringify({
        event: "command",
        func: funcToCall,
        args: [],
      }),
      "*"
    );
  }, [isMuted]);

  if (loading)
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-base-100 p-6">
        <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-6"></div>
        <p className="text-xl font-black tracking-widest uppercase opacity-40 animate-pulse text-center">Initializing Cinema</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-base-100 text-base-content overflow-x-hidden">
      {/* 🎬 HERO SECTION - RESPONSIVE OPTIMIZATION */}
      <section className="relative h-[70vh] sm:h-[85vh] md:h-screen w-full overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={trailerKey || 'backdrop'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 z-0"
          >
            {trailerKey ? (
              <div className="relative w-full h-full scale-[1.8] sm:scale-[1.2] md:scale-110">
                <iframe
                  id="ytPlayer"
                  className="absolute inset-0 w-full h-full pointer-events-none object-cover"
                  src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&loop=1&playlist=${trailerKey}&controls=0&modestbranding=1&showinfo=0&rel=0&iv_load_policy=3&enablejsapi=1&origin=${window.location.origin}`}
                  title="Hero Trailer"
                  allow="autoplay; encrypted-media"
                />
                <div className="absolute inset-0 bg-black/20"></div>
              </div>
            ) : (
              <div
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${IMG_BASE_URL}${trendingMovie?.backdrop_path})` }}
              />
            )}

            {/* Optimized Gradients for Text Legibility - Subtler approach */}
            <div className="absolute inset-0 bg-gradient-to-r from-base-100/60 via-base-100/10 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-base-100 via-transparent to-black/20"></div>
          </motion.div>
        </AnimatePresence>

        {/* Hero Overlay Content */}
        <div className="absolute inset-0 z-10 flex flex-col justify-start pt-24 sm:pt-32 md:justify-center md:pt-0 px-4 sm:px-10 md:px-20 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="max-w-2xl sm:mt-0"
          >
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <span className="bg-red-600 text-white text-[9px] sm:text-[10px] font-black px-2 sm:px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                #Trending Now
              </span>
              <span className="bg-white/10 backdrop-blur-md text-white text-[9px] sm:text-[10px] font-black px-2 sm:px-3 py-1 rounded-full uppercase tracking-widest border border-white/10">
                ⭐ {trendingMovie?.vote_average?.toFixed(1)}
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-white mb-4 sm:mb-6 leading-tight tracking-tighter drop-shadow-2xl line-clamp-2">
              {trendingMovie?.title}
            </h1>

            <p className="text-sm sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-10 line-clamp-3 font-medium drop-shadow-lg leading-relaxed max-w-xl opacity-90">
              {trendingMovie?.overview}
            </p>

            <div className="flex flex-wrap gap-3 sm:gap-5">
              <a
                href={trailerKey ? `https://www.youtube.com/watch?v=${trailerKey}` : `https://www.youtube.com/results?search_query=${encodeURIComponent(trendingMovie?.title || trendingMovie?.name)} trailer`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-red-600 hover:bg-white hover:text-red-600 text-white font-black text-sm sm:text-lg px-6 py-3 sm:px-10 sm:py-4 rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 sm:gap-3 transition-all duration-300 shadow-xl transform active:scale-95"
              >
                <FaPlay className="text-[10px] sm:text-sm" /> Watch Now
              </a>
              <Link
                to={`/film/${trendingMovie?.id}`}
                className="bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 text-white font-black text-sm sm:text-lg px-6 py-3 sm:px-10 sm:py-4 rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 sm:gap-3 transition-all duration-300 transform active:scale-95"
              >
                <FaInfoCircle className="text-[10px] sm:text-sm" /> Details
              </Link>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 w-full h-24 sm:h-32 bg-gradient-to-t from-base-100 to-transparent z-20"></div>
      </section>

      {/* 🎞️ LIST SECTIONS - ADJUSTED NEGATIVE MARGINS */}
      <div className="relative z-30 -mt-16 sm:-mt-24 md:-mt-40 space-y-12 sm:space-y-20 md:space-y-24 pb-20 sm:pb-32">
        <ListTrending />
        <ListNowPlaying />
        <ListMovie />
        <ListSeries />
      </div>

      {/* 🎛️ RESPONSIVE FLOATING CONTROLS */}
      <div className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50 flex flex-col gap-3 sm:gap-4">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={toggleSound}
          className="p-3.5 sm:p-5 rounded-xl sm:rounded-2xl text-white shadow-2xl bg-red-600 border border-white/10 transition-all active:shadow-none"
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <FaVolumeMute className="text-lg sm:text-xl" /> : <FaVolumeUp className="text-lg sm:text-xl" />}
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={toggleTheme}
          className={`p-3.5 sm:p-5 rounded-xl sm:rounded-2xl text-white shadow-2xl border transition-all ${theme === "dark"
            ? "bg-gray-800 border-gray-700 active:bg-gray-900"
            : "bg-yellow-500 border-yellow-400 active:bg-yellow-600 text-gray-900"
            }`}
          title={theme === "dark" ? "Light Mode" : "Dark Mode"}
        >
          {theme === "dark" ? <FaSun className="text-lg sm:text-xl" /> : <FaMoon className="text-lg sm:text-xl" />}
        </motion.button>
      </div>
    </div>
  );
};

export default HomeView;
