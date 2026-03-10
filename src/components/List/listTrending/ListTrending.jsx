import React, { useEffect, useState } from "react";
import api from "../../../service/api";
import { useTheme } from "../../../context/ThemeContext";
import MovieCard from "../../common/MovieCard";

const ListTrending = () => {
    const [trending, setTrending] = useState([]);
    const [loading, setLoading] = useState(true);
    const { theme } = useTheme();

    const textPrimary = "text-base-content";
    const bgColor = "from-base-100";

    useEffect(() => {
        const fetchTrending = async () => {
            setLoading(true);
            try {
                const res = await api.get("/trending/all/day", {
                    params: { language: "en-US" },
                });
                setTrending(res.data.results.filter(item => item.media_type !== "person"));
            } catch (err) {
                console.error("Error fetching trending data:", err);
            }
            setLoading(false);
        };
        fetchTrending();
    }, []);

    return (
        <div className="p-4 sm:p-6 md:p-8 container mx-auto">
            <h2 className={`text-2xl sm:text-4xl font-black flex items-center gap-3 mb-6 sm:mb-8 ${textPrimary} tracking-tighter`}>
                <span className="w-2 h-8 bg-red-600 rounded-full"></span>
                Trending Now
            </h2>

            {loading ? (
                <div className="flex justify-center items-center h-80">
                    <span className="loading loading-spinner loading-lg text-red-600"></span>
                </div>
            ) : (
                <div className="relative group">
                    <div className={`absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r ${bgColor} to-transparent pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity`} />
                    <div className={`absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l ${bgColor} to-transparent pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity`} />

                    <div className="overflow-x-auto scroll-smooth pb-4 px-2 sm:px-4 scrollbar-hide">
                        <div className="carousel w-full gap-4 sm:gap-6 pb-4 pt-4">
                            {trending.map(item => (
                                <MovieCard key={item.id} item={item} type={item.media_type === "movie" ? "movie" : "series"} />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ListTrending;