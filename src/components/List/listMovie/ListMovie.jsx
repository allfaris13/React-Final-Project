import React, { useEffect, useState } from "react";
import api from "../../../service/api";
import { useTheme } from "../../../context/ThemeContext";
import MovieCard from "../../common/MovieCard";
import { FaChevronLeft, FaChevronRight, FaSortAmountDown } from "react-icons/fa";

const ListMovie = () => {
    const [movies, setMovies] = useState([]);
    const [page, setPage] = useState(1);
    const [sortBy, setSortBy] = useState("release_date.desc");
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const { theme } = useTheme();

    const textPrimary = "text-base-content";
    const bgColor = "from-base-100";
    const btnClass = "bg-red-700 text-white";

    const fetchMovies = async () => {
        setLoading(true);
        try {
            const res = await api.get("/discover/movie", {
                params: {
                    page,
                    sort_by: sortBy,
                    include_adult: false,
                    language: "en-US",
                },
            });
            const filteredMovies = res.data.results.filter(item => item.adult !== true);
            setMovies(filteredMovies);
            setTotalPages(Math.min(res.data.total_pages, 500));
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchMovies();
    }, [page, sortBy]);

    const getSortLabel = (key) => {
        switch (key) {
            case "release_date.desc": return "Newest";
            case "release_date.asc": return "Oldest";
            case "vote_average.desc": return "Top Rated";
            case "popularity.desc": return "Popular";
            default: return "Sort By";
        }
    }

    const handleSortChange = (newSortBy) => {
        setPage(1);
        setSortBy(newSortBy);
    };

    const sortOptions = [
        { value: "release_date.desc", label: "Newest → Oldest" },
        { value: "release_date.asc", label: "Oldest → Newest" },
        { value: "vote_average.desc", label: "Top Rated" },
        { value: "popularity.desc", label: "Most Popular" },
    ];

    return (
        <div className="p-4 sm:p-6 md:p-8 container mx-auto">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-6 sm:mb-8 gap-4">
                <h2 className={`text-2xl sm:text-4xl font-black flex items-center gap-3 ${textPrimary} tracking-tighter`}>
                    <span className="w-2 h-8 bg-red-600 rounded-full"></span>
                    List Movies
                </h2>

                <div className="dropdown dropdown-end w-full sm:w-auto">
                    <div tabIndex={0} role="button" className="
                        btn btn-sm sm:btn-md border-2 border-red-700 
                        bg-transparent text-base-content w-full sm:w-auto
                        hover:bg-red-700 hover:text-white transition-all duration-300 rounded-xl
                    ">
                        <FaSortAmountDown className="mr-2" />
                        {getSortLabel(sortBy)}
                    </div>

                    <ul tabIndex={0} className="
                        dropdown-content z-[1] menu p-2 shadow-2xl rounded-2xl w-full sm:w-56 
                        bg-base-300 text-base-content mt-2 border border-white/5
                    ">
                        {sortOptions.map(option => (
                            <li key={option.value} className="mb-1">
                                <a
                                    onClick={() => handleSortChange(option.value)}
                                    className={`rounded-xl p-3 font-bold ${sortBy === option.value
                                            ? "bg-red-700 text-white"
                                            : "hover:bg-red-700/10 hover:text-red-600"
                                        }`}
                                >
                                    {option.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-80">
                    <span className="loading loading-spinner loading-lg text-red-600"></span>
                </div>
            ) : (
                <>
                    <div className="relative group">
                        <div className={`absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r ${bgColor} to-transparent pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity`} />
                        <div className={`absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l ${bgColor} to-transparent pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity`} />

                        <div className="overflow-x-auto scroll-smooth pb-6 px-2 sm:px-4 scrollbar-hide">
                            <div className="carousel w-full gap-4 sm:gap-6 pb-4 pt-4">
                                {movies.map(movie => (
                                    <MovieCard key={movie.id} item={movie} type="movie" />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center items-center mt-8 gap-4">
                        <button
                            disabled={page === 1 || loading}
                            onClick={() => setPage((p) => p - 1)}
                            className={`p-3 ${btnClass} rounded-xl disabled:opacity-20 hover:bg-black transition-all shadow-lg active:scale-90`}
                        >
                            <FaChevronLeft />
                        </button>
                        <span className={`font-black text-lg ${textPrimary} bg-base-300 px-6 py-2 rounded-xl border border-white/5`}>
                            {page} <span className="opacity-30 mx-2">/</span> {totalPages}
                        </span>
                        <button
                            disabled={page === totalPages || loading}
                            onClick={() => setPage((p) => p + 1)}
                            className={`p-3 ${btnClass} rounded-xl disabled:opacity-20 hover:bg-black transition-all shadow-lg active:scale-90`}
                        >
                            <FaChevronRight />
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default ListMovie;