// src/pages/AllMovies.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, Bookmark, Star } from "lucide-react";

const API_BASE = "https://localhost:7119";

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

const AllMovies = () => {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [year, setYear] = useState("");
  const [language, setLanguage] = useState("");
  const [country, setCountry] = useState("");

  // Watchlist
  const [watchlists, setWatchlists] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showWatchlistModal, setShowWatchlistModal] = useState(false);

  const role = getCookie("role");
  const token = getCookie("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/api/movies`);
        if (!res.ok) throw new Error("Failed to fetch movies");
        const data = await res.json();
        setMovies(data);
        setFilteredMovies(data);
      } catch (err) {
        console.error(err);
        setMovies([]);
        setFilteredMovies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  // Fetch user watchlists
  useEffect(() => {
    const fetchWatchlists = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/watchlist/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch watchlists");
        const data = await res.json();
        setWatchlists(data);
      } catch (err) {
        console.error(err);
        setWatchlists([]);
      }
    };

    if (role !== "Admin" && token) fetchWatchlists();
  }, [role, token]);

  // Filtering logic
  useEffect(() => {
    let result = [...movies];

if (year) {
    const yearNum = parseInt(year, 10);
    if (!isNaN(yearNum)) {
      result = result.filter((m) => m.year === yearNum);
    }
  }

    // Language filter
    if (language) {
      const lang = language.trim().toLowerCase();
      result = result.filter(
        (m) => m.language && m.language.trim().toLowerCase() === lang
      );
    }

    // Country filter
    if (country) {
      const ctry = country.trim().toLowerCase();
      result = result.filter(
        (m) => m.country && m.country.trim().toLowerCase() === ctry
      );
    }

    setFilteredMovies(result);
  }, [year, language, country, movies]);

  // Handle Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this movie?")) return;

    try {
      const res = await fetch(`${API_BASE}/api/movies/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to delete movie");
      setMovies((prev) => prev.filter((m) => m.movieID !== id));
    } catch (err) {
      console.error(err);
      alert("Error deleting movie");
    }
  };

  // Handle Add to Watchlist
  const handleAddToWatchlist = async (watchlistId) => {
    try {
      const res = await fetch(`${API_BASE}/api/watchlist/${watchlistId}/movies`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(selectedMovie.movieID),
      });

      if (!res.ok) throw new Error("Failed to add movie to watchlist");
      alert("Movie added to watchlist!");
      setShowWatchlistModal(false);
      setSelectedMovie(null);
    } catch (err) {
      console.error(err);
      alert("Error adding to watchlist");
    }
  };

  if (loading) return <div className="text-white p-4">Loading...</div>;

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="flex justify-between items-center mb-4">
          <div className="text-3xl font-bold">All Movies</div>
          <div className="text-sm -mb-4">
            Total Movies: {filteredMovies.length}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <input
            type="number"
            placeholder="Filter by Year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="px-3 py-2 rounded bg-gray-800 text-white"
          />

          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="px-3 py-2 rounded bg-gray-800 text-white"
          >
            <option value="">Select Language</option>
            <option value="English">English</option>
            <option value="Korean">Korean</option>
            <option value="Tamil">Tamil</option>
          </select>

          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="px-3 py-2 rounded bg-gray-800 text-white"
          >
            <option value="">Select Country</option>
            <option value="United States">United States</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="India">India</option>
            <option value="South Korea">South Korea</option>
          </select>

          <button
            onClick={() => {
              setYear("");
              setLanguage("");
              setCountry("");
            }}
            className="px-4 py-2 bg-red-600 rounded hover:bg-red-700"
          >
            Clear Filters
          </button>
        </div>

        {/* Movies Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
          {filteredMovies.map((movie) => (
            <div
              key={movie.movieID}
              className="group rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105 relative bg-gray-900"
            >
              <Link to={`/movie/${movie.movieID}`}>
                <img
                  src={`${API_BASE}${movie.image}`}
                  alt={movie.title}
                  className="w-full h-64 object-cover"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/placeholder-movie.png";
                  }}
                />
              </Link>

              <div className="p-4">
                <h2 className="text-lg font-semibold truncate">{movie.title}</h2>
               <div className="flex items-center text-sm text-gray-400 mt-1">
  {movie.year || "N/A"} • {movie.language || "Unknown"}
</div>


                {/* Rating */}
                <div className="flex items-center mt-2">
                  <Star className="w-4 h-4 text-yellow-400 mr-1" />
                  <span>{movie.rating && movie.rating > 0 ? movie.rating : "0"}</span>
                </div>

                {/* Genres */}
                {movie.genres && movie.genres.length > 0 && (
                  <div className="mt-2 text-xs text-gray-400">{movie.genres.join(", ")}</div>
                )}

                {/* Actions */}
                <div className="flex justify-between items-center mt-4">
                  {role === "Admin" ? (
                    <div className="flex space-x-3">
                      <button
                        onClick={() => navigate(`/edit-movie/${movie.movieID}`)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(movie.movieID)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  ) : (
                    <div className="flex space-x-4">
                      <button
                        className="text-gray-400 hover:text-red-700"
                        onClick={() => {
                          setSelectedMovie(movie);
                          setShowWatchlistModal(true);
                        }}
                      >
                        <Bookmark size={20} />
                      </button>
                      <Link to={`/movie/${movie.movieID}`}>
                        <button className="text-gray-400 hover:text-blue-500">
                          <Eye size={20} />
                        </button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Watchlist Modal */}
      {showWatchlistModal && selectedMovie && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center">
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-xl mb-4">
              Add <span className="font-bold">{selectedMovie.title}</span> to:
            </h2>
            <div className="space-y-2">
              {watchlists.length > 0 ? (
                watchlists.map((wl) => (
                  <button
                    key={wl.watchlistID}
                    onClick={() => handleAddToWatchlist(wl.watchlistID)}
                    className="w-full bg-gray-700 hover:bg-gray-600 py-2 px-4 rounded text-left"
                  >
                    {wl.name}
                  </button>
                ))
              ) : (
                <p className="text-gray-400">No watchlists available.</p>
              )}
            </div>
            <button
              className="mt-4 w-full bg-red-600 hover:bg-red-700 py-2 rounded"
              onClick={() => setShowWatchlistModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllMovies;
