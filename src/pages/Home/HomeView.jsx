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
      <div className="flex flex-col justify-center items-center h-screen bg-base-100">
        <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-6"></div>
        <p className="text-xl font-black tracking-widest uppercase opacity-40 animate-pulse">Initializing Cinema</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-base-100 text-base-content overflow-x-hidden">
      {/* 🎬 HERO SECTION - PREMIUM OVERHAUL */}
      <section className="relative h-[85vh] md:h-screen w-full overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={trailerKey || 'backdrop'}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 z-0"
          >
            {trailerKey ? (
              <div className="relative w-full h-full scale-110">
                <iframe
                  id="ytPlayer"
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&loop=1&playlist=${trailerKey}&controls=0&modestbranding=1&showinfo=0&rel=0&iv_load_policy=3&enablejsapi=1&origin=${window.location.origin}`}
                  title="Hero Trailer"
                  allow="autoplay; encrypted-media"
                />
                <div className="absolute inset-0 bg-black/40"></div>
              </div>
            ) : (
              <div
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${IMG_BASE_URL}${trendingMovie?.backdrop_path})` }}
              />
            )}

            {/* Gradients for depth */}
            <div className="absolute inset-0 bg-gradient-to-r from-base-100 via-base-100/30 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-base-100 via-transparent to-black/30"></div>
          </motion.div>
        </AnimatePresence>

        {/* Hero Overlay Content */}
        <div className="absolute inset-0 z-10 flex flex-col justify-center px-6 md:px-20 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                #Trending Today
              </span>
              <span className="bg-white/10 backdrop-blur-md text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-white/10">
                ⭐ {trendingMovie?.vote_average?.toFixed(1)}
              </span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black text-white mb-6 leading-tight tracking-tighter drop-shadow-2xl">
              {trendingMovie?.title}
            </h1>

            <p className="text-lg md:text-xl text-gray-300 mb-10 line-clamp-3 font-medium drop-shadow-lg leading-relaxed max-w-2xl">
              {trendingMovie?.overview}
            </p>

            <div className="flex flex-wrap gap-5">
              <Link
                to={`/film/${trendingMovie?.id}`}
                className="bg-red-600 hover:bg-white hover:text-red-600 text-white font-black text-lg px-10 py-4 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 shadow-[0_20px_40px_rgba(220,38,38,0.3)] transform hover:-translate-y-1 active:scale-95"
              >
                <FaPlay className="text-sm" /> Watch Now
              </Link>
              <Link
                to={`/film/${trendingMovie?.id}`}
                className="bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 text-white font-black text-lg px-10 py-4 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 shadow-xl transform hover:-translate-y-1 active:scale-95"
              >
                <FaInfoCircle className="text-sm" /> Details
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Bottom scroll hint or accent */}
        <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-base-100 to-transparent z-20"></div>
      </section>

      {/* 🎞️ LIST SECTIONS - CLEANER LAYOUT */}
      <div className="relative z-30 -mt-24 md:-mt-40 space-y-24 pb-32">
        <ListTrending />
        <ListNowPlaying />
        <ListMovie />
        <ListSeries />
      </div>

      {/* 🎛️ PREMIUM FLOATING CONTROLS */}
      <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-4">
        {/* Sound Toggle */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleSound}
          className="p-5 rounded-2xl text-white shadow-2xl bg-red-600 border border-white/20 transition-all duration-300 transform hover:shadow-red-600/40"
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <FaVolumeMute className="text-xl" /> : <FaVolumeUp className="text-xl" />}
        </motion.button>

        {/* Theme Toggle */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleTheme}
          className={`p-5 rounded-2xl text-white shadow-2xl border transition-all duration-300 ${theme === "dark"
              ? "bg-gray-800 border-gray-700 hover:bg-gray-700 shadow-black/40"
              : "bg-yellow-500 border-yellow-400 hover:bg-yellow-600 shadow-yellow-500/20 text-gray-900"
            }`}
          title={theme === "dark" ? "Light Mode" : "Dark Mode"}
        >
          {theme === "dark" ? <FaSun className="text-xl" /> : <FaMoon className="text-xl" />}
        </motion.button>
      </div>
    </div>
  );
};

export default HomeView;
