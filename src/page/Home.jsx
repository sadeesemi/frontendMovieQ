// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import { HeroSection } from "../components/HeroSection";
import GenreSection from "../components/GenreSection";
import { MovieSection } from "../components/MovieSection";
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL || "https://localhost:7119";

// Helper for correct image URLs
const buildImageUrl = (imgPath) => {
  if (!imgPath) return "";
  if (imgPath.startsWith("http://") || imgPath.startsWith("https://")) return imgPath;
  const trimmed = imgPath.replace(/^\//, "");
  return `${API_BASE.replace(/\/$/, "")}/${trimmed}`;
};

function Home() {
  const [popularMovies, setPopularMovies] = useState([]);
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [loadingRecommended, setLoadingRecommended] = useState(true);

  // Replace this with actual logged-in user ID
  const userId = localStorage.getItem("userId") || "defaultUserId";

  useEffect(() => {
    // Fetch Top Rated Movies
    axios
      .get(`${API_BASE}/api/movies/toprated`)
      .then((res) =>
        setPopularMovies(res.data.map((m) => ({ ...m, image: buildImageUrl(m.image) })))
      )
      .catch((err) => console.error("Error fetching top rated movies:", err));

    // Fetch Recommended Movies for logged-in user
    setLoadingRecommended(true);
    axios
      .get(`${API_BASE}/api/movies/recommended/${userId}`)
      .then((res) =>
        setRecommendedMovies(
          res.data.map((m) => ({ ...m, image: buildImageUrl(m.image) }))
        )
      )
      .catch((err) => console.error("Error fetching recommended movies:", err))
      .finally(() => setLoadingRecommended(false));
  }, [userId]);

  return (
    <div className="min-h-screen bg-black text-white">
      <HeroSection />
      <GenreSection />

      {/* Recommended Movies Section */}
      {loadingRecommended ? (
        <p className="text-center my-6 text-gray-400">Loading recommended movies...</p>
      ) : (
        <MovieSection title="Recommended Movies" movies={recommendedMovies} />
      )}

      {/* Popular Movies Section */}
      <MovieSection title="Popular Movies" movies={popularMovies} />
    </div>
  );
}

export default Home;
