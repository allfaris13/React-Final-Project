// src/components/Detail/SeriesDetail/SeriesDetail.jsx (Container)

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useTheme } from "../../context/ThemeContext";
import { useDispatch, useSelector } from "react-redux";
import { addFavorite, removeFavorite } from "../../reducer/favoriteReducer";
import SeriesDetailView from "./SeriesDetailView"; // 👈 Import komponen tampilan

const SeriesDetail = () => {
  const { theme } = useTheme();
  const { id } = useParams();
  const [series, setSeries] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [cast, setCast] = useState([]);
  const [similar, setSimilar] = useState([]);
  const reduxDispatch = useDispatch();

  // Check if this series is in favorites
  const favorites = useSelector(state => state.favorite.series);
  const isFavorite = favorites.some(f => f.id === parseInt(id));

  useEffect(() => {
    const fetchSeries = async () => {
      try {
        // Fetch Detail Series
        const res = await axios.get(`https://api.themoviedb.org/3/tv/${id}`, {
          headers: {
            accept: "application/json",
            Authorization: "Bearer " + import.meta.env.VITE_KEY_TMDB,
          },
        });
        setSeries(res.data);

        // Fetch Trailer
        const trailerRes = await axios.get(`https://api.themoviedb.org/3/tv/${id}/videos`, {
          headers: {
            accept: "application/json",
            Authorization: "Bearer " + import.meta.env.VITE_KEY_TMDB,
          },
          params: { include_video_language: "en,null" }
        });
        const videos = trailerRes.data.results || [];
        const bestVideo = videos.filter(v => v.site === "YouTube").find(v => v.type === "Trailer") ||
          videos.filter(v => v.site === "YouTube").find(v => v.type === "Teaser") ||
          videos.find(v => v.site === "YouTube");
        setTrailerKey(bestVideo ? bestVideo.key : null);

        // Fetch Cast
        const castRes = await axios.get(`https://api.themoviedb.org/3/tv/${id}/credits`, {
          headers: {
            accept: "application/json",
            Authorization: "Bearer " + import.meta.env.VITE_KEY_TMDB,
          },
        });
        setCast(castRes.data.cast.slice(0, 10));

        // Fetch Similar
        const similarRes = await axios.get(`https://api.themoviedb.org/3/tv/${id}/similar`, {
          headers: {
            accept: "application/json",
            Authorization: "Bearer " + import.meta.env.VITE_KEY_TMDB,
          },
        });
        setSimilar(similarRes.data.results);
      } catch (err) {
        console.error("Gagal ambil data series:", err.message);
      }
    };

    fetchSeries();
  }, [id]);

  const handleFavorite = () => {
    if (series) {
      if (isFavorite) {
        reduxDispatch(removeFavorite(series.id, "series"));
      } else {
        reduxDispatch(addFavorite(series, "series"));
      }
    }
  };

  if (!series) {
    // Menampilkan loading di sini, di komponen Container
    return <p className="text-center text-white">Loading...</p>;
  }

  // Meneruskan semua data dan fungsi yang diperlukan ke komponen tampilan
  return (
    <SeriesDetailView
      series={series}
      trailerKey={trailerKey}
      cast={cast}
      similar={similar}
      theme={theme}
      handleFavorite={handleFavorite}
      isFavorite={isFavorite}
    />
  );
};

export default SeriesDetail;