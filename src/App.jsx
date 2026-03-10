// src/App.jsx 

import React, { useState } from "react";
import {
    Routes,
    Route,
    Link,
    useParams,
} from "react-router-dom";
import { useTheme } from "./context/ThemeContext";

// Pages
import Home from "./pages/Home/Home";
import FilmDetail from "./pages/filmDetail/FilmDetail";
import Favorite from "./pages/favorite/Favorite";
import Cari from "./components/Cari/Cari";
import SeriesDetail from "./pages/seriesDetail/SeriesDetail";

// Components
import ListMovie from "./components/List/listMovie/ListMovie";
import ListSeries from "./components/List/listSeries/ListSeries";
import ListTrending from "./components/List/listTrending/ListTrending";
import ListNowPlaying from "./components/List/listNowPlaying/ListNowPlaying";

// Icons
import { FaTwitter, FaInstagram, FaGithub, FaHeart, FaHome, FaSearch } from 'react-icons/fa';


// Komponen untuk mendapatkan tahun saat ini
const FooterContent = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative mt-20 border-t border-white/5 bg-base-200/50 backdrop-blur-xl pt-16 pb-8 px-6 overflow-hidden">
            {/* Background Accent */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[1px] bg-gradient-to-r from-transparent via-red-600/50 to-transparent"></div>

            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
                    {/* Brand Section */}
                    <div className="flex flex-col items-center md:items-start space-y-4">
                        <Link to="/" className="text-3xl font-black tracking-tighter transition-transform hover:scale-105 inline-block">
                            <span className="text-base-content">Bios</span>
                            <span className="text-red-600">Kocak</span>
                        </Link>
                        <p className="text-sm font-medium opacity-50 text-center md:text-left leading-relaxed max-w-xs">
                            Experience the magic of cinema. Discover thousands of trending movies and series with premium quality data.
                        </p>
                    </div>

                    {/* Navigation Section */}
                    <div className="flex flex-col items-center space-y-6">
                        <h4 className="text-xs font-black uppercase tracking-[0.2em] opacity-30">Quick Navigation</h4>
                        <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4">
                            <Link to="/about" className="text-sm font-bold hover:text-red-600 transition-colors">About</Link>
                            <Link to="/privacy" className="text-sm font-bold hover:text-red-600 transition-colors">Privacy</Link>
                            <Link to="/contact" className="text-sm font-bold hover:text-red-600 transition-colors">Contact</Link>
                            <Link to="/api-status" className="text-sm font-bold hover:text-red-600 transition-colors">API Status</Link>
                        </nav>
                    </div>

                    {/* Social Section */}
                    <div className="flex flex-col items-center md:items-end space-y-6">
                        <h4 className="text-xs font-black uppercase tracking-[0.2em] opacity-30">Get Connected</h4>
                        <div className="flex gap-4">
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-red-600 rounded-xl transition-all hover:-translate-y-1">
                                <FaTwitter className="text-lg" />
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-red-600 rounded-xl transition-all hover:-translate-y-1">
                                <FaInstagram className="text-lg" />
                            </a>
                            <a href="https://github.com/your-username" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-red-600 rounded-xl transition-all hover:-translate-y-1">
                                <FaGithub className="text-lg" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] sm:text-xs">
                    <div className="flex flex-col items-center md:items-start gap-2">
                        <p className="font-bold opacity-30">
                            © {currentYear} BIOSKOCAK. ALL RIGHTS RESERVED.
                        </p>
                        <p className="font-medium opacity-20">
                            DATA PROVIDED BY <a href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer" className="hover:text-red-600 transition-colors">THE MOVIE DATABASE</a>.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/5">
                        <span className="opacity-40 font-bold uppercase tracking-widest text-[9px]">Built with</span>
                        <FaHeart className="text-red-600 animate-pulse" />
                        <span className="opacity-40 font-bold uppercase tracking-widest text-[9px]">by BiosKocak Team</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};



const FilmDetailWrapper = () => {
    const { id } = useParams();
    return <FilmDetail key={id} />;
};

function App() {
    const { theme } = useTheme();
    const [isMuted, setIsMuted] = useState(true);

    const toggleSound = () => {
        const iframe = document.getElementById("ytPlayer");
        if (!iframe) {
            setIsMuted(!isMuted);
            return;
        }
        const funcToCall = isMuted ? "unMute" : "mute";
        setTimeout(() => {
            iframe.contentWindow.postMessage(
                JSON.stringify({
                    event: "command",
                    func: funcToCall,
                    args: [],
                }),
                "*"
            );
        }, isMuted ? 50 : 0);
        setIsMuted(!isMuted);
    };

    return (
        <div className="min-h-screen transition-colors duration-300 bg-base-100 text-base-content">

            {/* HEADER (Floating over Hero) - Improved Mobile Layout */}
            <header className="absolute top-0 left-0 right-0 z-[100] px-4 md:px-8 py-6 flex justify-between items-center bg-gradient-to-b from-black/60 to-transparent">
                <Link to="/" className="text-xl md:text-2xl font-black tracking-tighter hover:scale-105 transition-transform">
                    <span className="text-white">Bios</span>
                    <span className="text-red-600">Kocak</span>
                </Link>

                <nav className="flex items-center gap-2 sm:gap-6 bg-base-200/50 sm:bg-transparent p-1 sm:p-0 rounded-2xl sm:rounded-none">
                    <Link to="/" className="flex items-center gap-2 px-3 py-2 sm:p-0 text-xs sm:text-base font-bold hover:text-red-600 transition-colors group">
                        <FaHome className="sm:hidden text-lg" />
                        <span className="hidden sm:block">Home</span>
                        <div className="hidden sm:block h-0.5 w-0 bg-red-600 group-hover:w-full transition-all duration-300" />
                    </Link>
                    <Link to="/favorite" className="flex items-center gap-2 px-3 py-2 sm:p-0 text-xs sm:text-base font-bold hover:text-red-600 transition-colors group">
                        <FaHeart className="sm:hidden text-lg" />
                        <span className="hidden sm:block">Favorite</span>
                        <div className="hidden sm:block h-0.5 w-0 bg-red-600 group-hover:w-full transition-all duration-300" />
                    </Link>
                    <Link to="/search" className="flex items-center gap-2 px-3 py-2 sm:p-0 text-xs sm:text-base font-bold hover:text-red-600 transition-colors group">
                        <FaSearch className="sm:hidden text-lg" />
                        <span className="hidden sm:block">Search</span>
                        <div className="hidden sm:block h-0.5 w-0 bg-red-600 group-hover:w-full transition-all duration-300" />
                    </Link>
                </nav>

                <div className="hidden md:block w-32" />
            </header>

            <main>
                <Routes>
                    <Route path="/" element={<Home isMuted={isMuted} toggleSound={toggleSound} />} />
                    <Route path="/film/:id" element={<FilmDetailWrapper />} />
                    <Route path="/series/:id" element={<SeriesDetail />} />
                    <Route path="/favorite" element={<Favorite />} />
                    <Route path="/search" element={<Cari />} />
                    <Route path="/movies" element={<ListMovie />} />
                    <Route path="/series" element={<ListSeries />} />
                    <Route path="/trending" element={<ListTrending />} />
                    <Route path="/now-playing" element={<ListNowPlaying />} />
                </Routes>
            </main>

            <FooterContent />
        </div>
    );
}

export default App;