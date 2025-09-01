import React, { useState, useEffect } from "react";
import { Trash2, Eye, Bookmark } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL || "https://localhost:7119";

// Helper to get JWT token from cookies
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

export function Watched() {
  const [watchedMovies, setWatchedMovies] = useState([]);
  const [sortBy, setSortBy] = useState("modified");
  const [loading, setLoading] = useState(true);

  // Build full image URL
  const buildImageUrl = (imgPath) => {
    if (!imgPath) return "";
    if (imgPath.startsWith("http://") || imgPath.startsWith("https://")) return imgPath;
    const trimmed = imgPath.replace(/^\//, "");
    return `${API_BASE.replace(/\/$/, "")}/${trimmed}`;
  };

  // Fetch watched movies from backend
  useEffect(() => {
    const fetchWatchedMovies = async () => {
      try {
        const token = getCookie("token");
        if (!token) {
          alert("You must be logged in to view watched movies.");
          setLoading(false);
          return;
        }

        const response = await axios.get(`${API_BASE}/api/watchedmovies`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Map image paths
        const moviesWithImages = (response.data || []).map((movie) => ({
          ...movie,
          image: buildImageUrl(movie.image),
        }));

        setWatchedMovies(moviesWithImages);
      } catch (err) {
        console.error("Failed to fetch watched movies:", err);
        setWatchedMovies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWatchedMovies();
  }, []);

  // Sorting movies
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    let sortedMovies = [...watchedMovies];

    if (e.target.value === "title") {
      sortedMovies.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      sortedMovies.sort((a, b) => new Date(b.modified) - new Date(a.modified));
    }

    setWatchedMovies(sortedMovies);
  };

  // Unmark movie as watched
const handleUnwatch = async (movieId) => {
  if (!window.confirm("Are you sure you want to unmark this movie as watched?")) return;

  try {
    const token = getCookie("token");
    if (!token) return;

    // 1. Unmark movie as watched
    await axios.delete(`${API_BASE}/api/watchedmovies/${movieId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // 2. Delete user review if exists
    try {
      await axios.delete(`${API_BASE}/api/reviews/${movieId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (reviewErr) {
      console.warn("No review to delete or delete failed:", reviewErr);
    }

    // 3. Update state
    setWatchedMovies((prev) => prev.filter((m) => m.id !== movieId));
  } catch (err) {
    console.error("Failed to unmark movie:", err);
    alert("Could not unmark movie as watched.");
  }
};


  return (
    <div className="bg-black min-h-screen flex flex-col">
      <div className="flex-grow">
        <div className="container mx-auto px-6 py-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-white">
              Movies Watched: {watchedMovies.length}
            </h1>

            <div className="flex items-center space-x-6">
              {/* Sorting Dropdown */}
              <div className="relative flex items-center text-gray-400 cursor-pointer">
                <span className="mr-2">Sort by:</span>
                <select
                  className="bg-transparent text-gray-400 text-sm cursor-pointer outline-none"
                  value={sortBy}
                  onChange={handleSortChange}
                >
                  <option value="modified">Modified</option>
                  <option value="title">Title</option>
                </select>
              </div>
            </div>
          </div>

          <hr className="border-gray-500 mb-6" />

          {/* Movie Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {watchedMovies.map((movie) => (
              <div
                key={movie.id}
                className="group rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105 relative bg-gray-800"
              >
                <Link to={`/movie/${movie.id}`} className="block">
                  <div className="aspect-w-16 aspect-h-9">
                    {movie.image ? (
                      <img
                        src={movie.image}
                        alt={movie.title}
                        className="w-full h-64 object-cover"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "/placeholder-movie.png"; // fallback image
                        }}
                      />
                    ) : (
                      <div className="w-full h-64 bg-gray-900 flex items-center justify-center text-gray-500">
                        No Image
                      </div>
                    )}
                  </div>
                </Link>

                {/* Movie Title */}
                <div className="p-4 flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-white">{movie.title}</h2>

                  {/* Icons */}
                  <div className="flex space-x-4">
                    <button className="text-gray-400 hover:text-red-700">
                      <Bookmark size={24} />
                    </button>
                    <button className="text-gray-400 hover:text-red-700">
                      <Eye size={24} />
                    </button>
                    <button
                      onClick={() => handleUnwatch(movie.id)}
                      className="bg-red-500 text-white py-1 px-4 rounded-lg text-sm"
                    >
                      Unwatch
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* No Movies Message */}
          {watchedMovies.length === 0 && (
            <div className="text-center text-gray-300 py-16">
              <p className="text-xl mb-2">No watched movies yet</p>
              <p className="text-sm">Movies you mark as watched will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
