import React, { useEffect, useState } from "react";
import api from "../../../service/api";
import { useTheme } from "../../../context/ThemeContext";
import MovieCard from "../../common/MovieCard";

const ListNowPlaying = () => {
    const [nowPlaying, setNowPlaying] = useState([]);
    const [loading, setLoading] = useState(true);
    const { theme } = useTheme();

    const textPrimary = "text-base-content";
    const bgColor = "from-base-100";

    useEffect(() => {
        const fetchNowPlaying = async () => {
            setLoading(true);
            try {
                const res = await api.get("/movie/now_playing", {
                    params: { include_adult: false, language: "en-US" },
                });
                const filteredMovies = res.data.results.filter(item => item.adult !== true);
                setNowPlaying(filteredMovies);
            } catch (err) {
                console.error(err);
            }
            setLoading(false);
        };
        fetchNowPlaying();
    }, []);

    return (
        <div className="p-4 container mx-auto">
            <h2 className={`text-3xl font-bold flex items-center gap-2 mb-6 ${textPrimary}`}>
                🎞️ Now Playing
            </h2>

            {loading ? (
                <div className="flex justify-center items-center h-80">
                    <span className="loading loading-spinner loading-lg text-red-600"></span>
                </div>
            ) : (
                <div className="relative">
                    <div className={`absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r ${bgColor} to-transparent pointer-events-none z-10`} />
                    <div className={`absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l ${bgColor} to-transparent pointer-events-none z-10`} />

                    <div className="overflow-x-auto scroll-smooth pb-4 px-4 scrollbar-hide">
                        <div className="carousel w-full space-x-6 pb-4 pt-4">
                            {nowPlaying.map(movie => (
                                <MovieCard key={movie.id} item={movie} type="movie" />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ListNowPlaying;