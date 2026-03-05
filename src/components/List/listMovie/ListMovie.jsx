import React, { useEffect, useState } from "react";
import api from "../../../service/api";
import { useTheme } from "../../../context/ThemeContext";
import MovieCard from "../../common/MovieCard";

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
            case "release_date.desc": return "Terbaru → Terlama";
            case "release_date.asc": return "Terlama → Terbaru";
            case "vote_average.desc": return "Rating Tertinggi";
            case "popularity.desc": return "Paling Populer";
            default: return "Sort By";
        }
    }

    const handleSortChange = (newSortBy) => {
        setPage(1);
        setSortBy(newSortBy);
    };

    const sortOptions = [
        { value: "release_date.desc", label: "Terbaru → Terlama" },
        { value: "release_date.asc", label: "Terlama → Terbaru" },
        { value: "vote_average.desc", label: "Rating Tertinggi" },
        { value: "popularity.desc", label: "Paling Populer" },
    ];

    return (
        <div className="p-4 container mx-auto">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <h2 className={`text-3xl font-bold flex items-center gap-2 ${textPrimary}`}>
                    🎬 List Movies
                </h2>

                <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="
                        btn btn-sm text-sm border-2 border-red-700 
                        bg-transparent text-base-content 
                        hover:bg-red-700 hover:text-white transition duration-300
                    ">
                        {getSortLabel(sortBy)}
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-down" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z" />
                        </svg>
                    </div>

                    <ul tabIndex={0} className="
                        dropdown-content z-[1] menu p-2 shadow-xl rounded-box w-52 
                        bg-base-300 text-base-content 
                    ">
                        {sortOptions.map(option => (
                            <li key={option.value}>
                                <a
                                    onClick={() => handleSortChange(option.value)}
                                    className={
                                        sortBy === option.value
                                            ? "active bg-red-700 text-white"
                                            : "hover:bg-red-700 hover:text-white"
                                    }
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
                    <div className="relative">
                        <div className={`absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r ${bgColor} to-transparent pointer-events-none z-10`} />
                        <div className={`absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l ${bgColor} to-transparent pointer-events-none z-10`} />

                        <div className="overflow-x-auto scroll-smooth pb-4 px-4 scrollbar-hide">
                            <div className="carousel w-full space-x-6 pb-4 pt-4">
                                {movies.map(movie => (
                                    <MovieCard key={movie.id} item={movie} type="movie" />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center mt-6 gap-2">
                        <button
                            disabled={page === 1 || loading}
                            onClick={() => setPage((p) => p - 1)}
                            className={`px-3 py-1 ${btnClass} rounded disabled:opacity-50 hover:bg-red-800 transition`}
                        >
                            Prev
                        </button>
                        <span className={`font-bold flex items-center ${textPrimary}`}>
                            {page} / {totalPages}
                        </span>
                        <button
                            disabled={page === totalPages || loading}
                            onClick={() => setPage((p) => p + 1)}
                            className={`px-3 py-1 ${btnClass} rounded disabled:opacity-50 hover:bg-red-800 transition`}
                        >
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default ListMovie;