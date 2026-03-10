import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import api from "../../service/api";
import MovieCard from "../common/MovieCard";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearch, FaFilter, FaChevronLeft, FaChevronRight, FaCompass } from "react-icons/fa";

const CATEGORY_STORAGE_KEY = "lastSearchCategory";

const Cari = () => {
    const { theme } = useTheme();
    const [searchParams, setSearchParams] = useSearchParams();

    const urlQuery = searchParams.get('query') || "";
    const urlType = searchParams.get('type');
    const urlPage = parseInt(searchParams.get('page')) || 1;

    const savedCategory = localStorage.getItem(CATEGORY_STORAGE_KEY) || "movie";

    const query = urlQuery;
    const searchType = urlType || savedCategory;
    const currentPage = urlPage;

    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const isInitialLoad = !query.trim();
    const isDark = theme === "dark";

    const fetchInitialData = useCallback(async (typeToFetch, pageToFetch) => {
        let actualType = typeToFetch === 'multi' ? 'movie' : typeToFetch;
        setLoading(true);
        try {
            const res = await api.get(`/${actualType}/popular`, {
                params: { language: "en-US", page: pageToFetch, adult: false },
            });
            const filteredResults = res.data.results.filter(item => item.adult !== true);
            setResults(filteredResults || []);
            setTotalPages(Math.min(res.data.total_pages, 500));
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, []);

    const executeSearch = useCallback(async (pageToFetch, currentSearchType) => {
        if (!query.trim()) return;
        setLoading(true);
        try {
            const res = await api.get(`/search/${currentSearchType}`, {
                params: { query, language: "en-US", page: pageToFetch, include_adult: false },
            });
            let searchResults = currentSearchType === 'multi'
                ? res.data.results.filter(item => item.media_type !== 'person')
                : res.data.results;

            searchResults = searchResults.filter(item => item.adult !== true);
            setTotalPages(Math.min(res.data.total_pages, 500));
            setResults(searchResults || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [query]);

    useEffect(() => {
        if (!urlType && !urlQuery) {
            setSearchParams({ type: savedCategory, page: 1 }, { replace: true });
        }
    }, [urlType, urlQuery, savedCategory, setSearchParams]);

    useEffect(() => {
        if (isInitialLoad) {
            fetchInitialData(searchType, currentPage);
        } else {
            executeSearch(currentPage, searchType);
        }
    }, [searchType, currentPage, isInitialLoad, fetchInitialData, executeSearch]);

    const handleQueryChange = (e) => {
        const newQuery = e.target.value;
        const newParams = { type: searchType, page: 1 };
        if (newQuery.trim()) newParams.query = newQuery;
        setSearchParams(newParams, { replace: true });
    }

    const handleCategoryChange = (newType) => {
        localStorage.setItem(CATEGORY_STORAGE_KEY, newType);
        const newParams = { type: newType, page: 1 };
        if (query.trim()) newParams.query = query.trim();
        setSearchParams(newParams);
        setIsFilterOpen(false);
    }

    const updatePage = (newPage) => {
        const newParams = { type: searchType, page: newPage };
        if (query.trim()) newParams.query = query.trim();
        setSearchParams(newParams);
    };

    return (
        <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-500`}>
            {/* SEARCH HEADER */}
            <div className={`sticky top-[72px] z-30 p-4 sm:p-6 ${isDark ? 'bg-gray-900/80' : 'bg-white/80'} backdrop-blur-xl border-b border-white/5`}>
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-grow w-full">
                        <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-red-600 opacity-50" />
                        <input
                            type="text"
                            placeholder="Discover movies, series, and more..."
                            value={query}
                            onChange={handleQueryChange}
                            className={`w-full pl-12 pr-6 py-4 rounded-2xl md:rounded-[2rem] outline-none transition-all border-2 
                                ${isDark
                                    ? 'bg-gray-800 border-white/5 focus:border-red-600 focus:bg-gray-700 text-white'
                                    : 'bg-gray-100 border-gray-200 focus:border-red-600 focus:bg-white text-gray-900'
                                } font-semibold shadow-xl`}
                        />
                    </div>

                    <button
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className="flex items-center gap-2 bg-red-600 text-white px-8 py-4 rounded-2xl font-black shadow-lg hover:bg-black transition-all w-full md:w-auto justify-center"
                    >
                        <FaFilter /> Filters
                    </button>
                </div>

                {/* EXPANDABLE FILTERS */}
                <AnimatePresence>
                    {isFilterOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="max-w-7xl mx-auto overflow-hidden"
                        >
                            <div className="pt-6 flex flex-wrap gap-3">
                                {[
                                    { type: 'multi', label: 'All Results' },
                                    { type: 'movie', label: 'Movies Only' },
                                    { type: 'tv', label: 'TV Series Only' }
                                ].map(cat => (
                                    <button
                                        key={cat.type}
                                        onClick={() => handleCategoryChange(cat.type)}
                                        className={`px-6 py-2 rounded-full font-bold transition-all border-2 
                                            ${searchType === cat.type
                                                ? 'bg-red-600 border-red-600 text-white'
                                                : isDark ? 'border-white/10 text-gray-400 hover:border-red-600' : 'border-gray-200 text-gray-600 hover:border-red-600'
                                            }`}
                                    >
                                        {cat.label}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="max-w-7xl mx-auto p-4 sm:p-8">
                {/* RESULTS INFO */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-red-600/20 rounded-2xl flex items-center justify-center border border-red-600/10">
                        <FaCompass className="text-2xl text-red-600" />
                    </div>
                    <div>
                        <h2 className={`text-2xl sm:text-3xl font-black tracking-tighter ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {isInitialLoad ? 'Popular Content' : `Results for "${query}"`}
                        </h2>
                        <p className="text-xs sm:text-sm font-bold opacity-40 uppercase tracking-widest mt-1">
                            Halaman {currentPage} <span className="mx-1">/</span> {totalPages}
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 opacity-30">
                        <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-6"></div>
                        <p className="text-xl font-black italic tracking-widest uppercase">Scanning Cinema</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-8">
                            {results.length > 0 ? (
                                results.map(item => (
                                    <MovieCard
                                        key={item.id}
                                        item={item}
                                        type={item.media_type || (searchType === 'tv' ? 'series' : 'movie')}
                                    />
                                ))
                            ) : (
                                !loading && query.trim() && (
                                    <div className="col-span-full py-32 text-center opacity-30">
                                        <FaSearch className="text-6xl mx-auto mb-6" />
                                        <h3 className="text-2xl font-black italic">No results found for your journey.</h3>
                                        <p className="font-medium mt-2">Try different keywords or filters.</p>
                                    </div>
                                )
                            )}
                        </div>

                        {/* PAGINATION */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center mt-16 gap-4">
                                <button
                                    onClick={() => updatePage(currentPage - 1)}
                                    disabled={currentPage === 1 || loading}
                                    className="p-4 bg-red-600 text-white rounded-2xl shadow-xl disabled:opacity-20 hover:bg-black transition-all active:scale-90"
                                >
                                    <FaChevronLeft />
                                </button>
                                <span className={`font-black text-lg ${isDark ? 'text-white bg-gray-800' : 'text-gray-900 bg-white'} px-8 py-3 rounded-2xl shadow-xl border border-white/5`}>
                                    {currentPage} <span className="opacity-30 mx-2">/</span> {totalPages}
                                </span>
                                <button
                                    onClick={() => updatePage(currentPage + 1)}
                                    disabled={currentPage === totalPages || loading}
                                    className="p-4 bg-red-600 text-white rounded-2xl shadow-xl disabled:opacity-20 hover:bg-black transition-all active:scale-90"
                                >
                                    <FaChevronRight />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Cari;