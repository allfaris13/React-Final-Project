import React, { useEffect, useReducer } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import FilmDetailView from "./FilmDetailView";
import { detailReducer, initialState } from "../../reducer/detailReducer";
import { useDispatch, useSelector } from "react-redux";
import { addFavorite, removeFavorite } from "../../reducer/favoriteReducer";
import { useTheme } from "../../context/ThemeContext";

const FilmDetail = () => {
    const { id } = useParams();
    const [state, localDispatch] = useReducer(detailReducer, initialState);
    const reduxDispatch = useDispatch();
    const { theme } = useTheme();
    const { film, trailerKey, cast, similar, loading, error } = state;

    // Check if this film is in favorites
    const favorites = useSelector(state => state.favorite.films);
    const isFavorite = favorites.some(f => f.id === parseInt(id));

    const API_BASE_URL = "https://api.themoviedb.org/3/movie";
    const API_KEY = import.meta.env.VITE_KEY_TMDB;
    const authHeaders = {
        accept: "application/json",
        Authorization: "Bearer " + API_KEY,
    };

    useEffect(() => {
        const fetchFilmData = async () => {
            localDispatch({ type: "LOADING" });
            try {
                const [detailRes, videosRes, creditsRes, similarRes] = await Promise.all([
                    axios.get(`${API_BASE_URL}/${id}`, { headers: authHeaders }),
                    axios.get(`${API_BASE_URL}/${id}/videos`, {
                        headers: authHeaders,
                        params: { include_video_language: "en,null" }
                    }),
                    axios.get(`${API_BASE_URL}/${id}/credits`, { headers: authHeaders }),
                    axios.get(`${API_BASE_URL}/${id}/similar`, { headers: authHeaders }),
                ]);

                const videos = videosRes.data.results || [];
                const bestVideo = videos.filter(v => v.site === "YouTube").find(v => v.type === "Trailer") ||
                    videos.filter(v => v.site === "YouTube").find(v => v.type === "Teaser") ||
                    videos.find(v => v.site === "YouTube");
                const trailerKeyFound = bestVideo ? bestVideo.key : null;

                localDispatch({
                    type: "SUCCESS",
                    payload: {
                        film: detailRes.data,
                        trailerKey: trailerKeyFound,
                        cast: creditsRes.data.cast,
                        similar: similarRes.data.results,
                    },
                });
            } catch (err) {
                console.error("❌ Gagal fetch detail film:", err);
                localDispatch({ type: "ERROR", payload: err.message });
            }
        };

        if (id) fetchFilmData();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [id]);

    const handleFavorite = () => {
        if (film) {
            if (isFavorite) {
                reduxDispatch(removeFavorite(film.id, "films"));
            } else {
                reduxDispatch(addFavorite({ ...film, media_type: 'movie' }, "films"));
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center bg-base-100">
                <div className="w-16 h-16 border-4 border-red-700 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-xl font-bold tracking-widest uppercase opacity-50">Preparing Cinema</p>
            </div>
        );
    }

    if (error) return <p className="text-center text-red-500 py-20 font-bold">Error: {error}. Please refresh.</p>;
    if (!film) return null;

    return (
        <FilmDetailView
            film={film}
            trailerKey={trailerKey}
            cast={cast || []}
            similar={similar || []}
            theme={theme}
            handleFavorite={handleFavorite}
            isFavorite={isFavorite}
        />
    );
};

export default FilmDetail;