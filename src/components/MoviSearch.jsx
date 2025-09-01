import React, { useState } from "react";
import { Search, X } from "lucide-react";
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL || "https://localhost:7119";

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

export function MovieSearch({ onClose, watchlistId, onAddMovieSuccess }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const buildImageUrl = (imgPath) => {
    if (!imgPath) return "";
    if (imgPath.startsWith("http://") || imgPath.startsWith("https://"))
      return imgPath;
    const trimmed = imgPath.replace(/^\//, "");
    return `${API_BASE.replace(/\/$/, "")}/${trimmed}`;
  };

  const getYear = (releaseDate) => {
    if (!releaseDate) return "";
    const date = new Date(releaseDate);
    return isNaN(date) ? "" : date.getFullYear();
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (!query.trim()) return setSearchResults([]);

    try {
      const res = await axios.get(
        `${API_BASE}/api/movies/search?query=${encodeURIComponent(query)}`
      );

      const moviesFromApi = res.data.map((movie) => ({
        id: movie.movieID,
        title: movie.title,
        image: buildImageUrl(movie.image),
        genres: movie.genres || [],
        year: getYear(movie.releaseDate),
        duration: movie.duration || "",
      rating:
  movie.averageRating !== undefined && movie.averageRating !== null
    ? (movie.averageRating === 0
        ? "0"
        : movie.averageRating.toFixed(1))
    : "N/A",
        synopsis: movie.description || "",
      }));

      setSearchResults(moviesFromApi);
    } catch (err) {
      console.error("Search failed:", err);
      setSearchResults([]);
    }
  };

  const handleAddToWatchlist = async (movieId) => {
    try {
      const token = getCookie("token");
      await axios.post(
        `${API_BASE}/api/watchlists/${watchlistId}/add-movie/${movieId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (onAddMovieSuccess) onAddMovieSuccess();
      onClose();
    } catch (err) {
      console.error("Failed to add movie to watchlist", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-zinc-900 rounded-lg p-6 w-full max-w-2xl relative max-h-[80vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold mb-6">Search Movies</h2>

        <div className="relative mb-6">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full bg-zinc-800 rounded-md px-4 py-2 pl-10 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
            placeholder="Search for movies..."
          />
          <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
        </div>

        <div className="flex-1 overflow-y-auto space-y-4">
          {searchResults.map((movie) => (
            <div
              key={movie.id}
              className="flex items-start space-x-4 p-4 bg-zinc-800 rounded-lg"
            >
              <img
                src={movie.image}
                alt={movie.title}
                className="w-24 h-36 object-cover rounded-md flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold truncate text-white">
                  {movie.title}
                </h3>
                <div className="flex items-center space-x-4 text-sm text-gray-400 mt-2">
                  <span>{movie.year}</span>
                  <span>{movie.duration}</span>

                  {/* ✅ Show average rating with stars */}
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={
                          movie.rating !== "N/A" && i < Math.round(movie.rating)
                            ? "text-yellow-400"
                            : "text-gray-600"
                        }
                      >
                        ★
                      </span>
                    ))}
                    <span> {movie.rating}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  {movie.genres.map((genre) => (
                    <span
                      key={genre}
                      className="text-sm bg-zinc-700 px-2 py-1 rounded"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
                <p className="text-gray-400 mt-2 text-sm line-clamp-2">
                  {movie.synopsis}
                </p>

                <button
                  onClick={() => handleAddToWatchlist(movie.id)}
                  className="mt-2 bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
                >
                  Add to Watchlist
                </button>
              </div>
            </div>
          ))}
          {searchQuery && searchResults.length === 0 && (
            <div className="text-center text-gray-400 py-8">
              No movies found matching your search.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
