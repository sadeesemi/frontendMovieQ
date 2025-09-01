import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { MovieSearch } from "./MoviSearch";
import { Download, Plus, ChevronDown } from "lucide-react";
import { jsPDF } from "jspdf";
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL || "https://localhost:7119";

// Cookie utility
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

// Genre filter list
const GENRES = [
  "Comedy",
  "Drama",
  "Horror",
  "Action",
  "Adventure",
  "Thriller",
  "Mystery",
  "Romance",
  "History",
];

// Utility to fix image URLs
const buildImageUrl = (imgPath) => {
  if (!imgPath) return "";
  if (imgPath.startsWith("http://") || imgPath.startsWith("https://")) return imgPath;
  const trimmed = imgPath.replace(/^\//, "");
  return `${API_BASE.replace(/\/$/, "")}/${trimmed}`;
};

export function WatchlistDetail() {
  const location = useLocation();
  const { listName } = location.state || {};
  const { id } = useParams();
  const navigate = useNavigate();

  const [movies, setMovies] = useState([]);
  const [showMovieSearch, setShowMovieSearch] = useState(false);
  const [genreFilter, setGenreFilter] = useState("");
  const [isGenreDropdownOpen, setIsGenreDropdownOpen] = useState(false);

  // Fetch watchlist and movies
  const fetchWatchlist = useCallback(async () => {
    try {
      const token = getCookie("token");
      const res = await axios.get(`${API_BASE}/api/watchlists`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const list = res.data.find((w) => w.watchListID === parseInt(id, 10));
      if (list) {
        const mapped = list.movies.map((m) => ({
          id: m.movieID,
          title: m.title,
          year: m.releaseDate ? new Date(m.releaseDate).getFullYear() : "N/A",
          image: buildImageUrl(m.image),
          rating: m.averageRating || 0,
          duration: m.duration,
          genres: m.genres || [],
          synopsis: m.description,
        }));
        setMovies(mapped);
      }
    } catch (err) {
      console.error("Failed to fetch watchlist", err);
    }
  }, [id]);

  useEffect(() => {
    fetchWatchlist();
  }, [fetchWatchlist]);

  const handleRemoveFromWatchlist = async (movieId) => {
    try {
      const token = getCookie("token");
      await axios.delete(`${API_BASE}/api/watchlists/${id}/remove-movie/${movieId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchWatchlist();
    } catch (err) {
      console.error("Failed to remove movie", err);
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Watchlist: " + (listName || "Watchlist"), 20, 10);
    let y = 20;
    movies.forEach((movie) => {
      y += 10;
      doc.text(`${movie.title} (${movie.year}) - Rating: ${movie.rating}`, 20, y);
    });
    doc.save("watchlist.pdf");
  };

 const filteredMovies = genreFilter
  ? movies.filter((movie) =>
      movie.genres.some(
        (g) => g.toLowerCase().trim() === genreFilter.toLowerCase().trim()
      )
    )
  : movies;
  return (
    <div className="bg-black min-h-screen text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-6 bg-gray-700 h-32">
        <div>
          <button
            onClick={() => navigate("/watchlist")}
            className="text-gray-400 hover:text-white mb-4"
          >
            ← Back to lists
          </button>
          <h1 className="text-3xl font-bold ml-8">{listName || "Watchlist"}</h1>
        </div>
        <div className="flex items-center space-x-4">
          <button onClick={handleDownloadPDF} className="text-gray-400 hover:text-white">
            <Download className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowMovieSearch(true)}
            className="bg-red-600 text-white px-4 py-2 rounded-md flex items-center space-x-2 hover:bg-red-700"
          >
            <Plus className="w-5 h-5" />
            <span>Add Movies</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between mb-2 ml-24 mr-40 mt-10">
        <span className="text-gray-400">
          You Want To Watch {movies.length} {movies.length === 1 ? "Movie" : "Movies"}
        </span>

        <div className="relative">
          <button
            onClick={() => setIsGenreDropdownOpen(!isGenreDropdownOpen)}
            className="flex items-center space-x-2 text-gray-400 hover:text-white"
          >
            <span>{genreFilter || "Genre"}</span>
            <ChevronDown className="w-4 h-4" />
          </button>

          {isGenreDropdownOpen && (
            <div className="absolute z-10 bg-gray-800 text-white rounded shadow-md mt-2 w-40">
              <button
                onClick={() => {
                  setGenreFilter("");
                  setIsGenreDropdownOpen(false);
                }}
                className="block w-full px-4 py-2 text-left hover:bg-gray-700"
              >
                All Genres
              </button>
              {GENRES.map((genre) => (
                <button
                  key={genre}
                  onClick={() => {
                    setGenreFilter(genre);
                    setIsGenreDropdownOpen(false);
                  }}
                  className="block w-full px-4 py-2 text-left hover:bg-gray-700"
                >
                  {genre}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Movie List */}
      <div className="space-y-6 ml-24 mr-40 mt-10">
        {filteredMovies.length === 0 && (
          <div className="text-gray-400">No movies found for selected genre.</div>
        )}
        {filteredMovies.map((movie) => (
          <div
            key={movie.id}
            onClick={() => navigate(`/movie/${movie.id}`)}
            className="flex space-x-4 p-12 bg-gray-900 rounded-lg mb-7 cursor-pointer hover:bg-gray-800 transition"
          >
            <img
              src={movie.image}
              alt={movie.title}
              className="w-24 h-36 object-cover rounded-md"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">{movie.title}</h3>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFromWatchlist(movie.id);
                  }}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                >
                  Remove from Watchlist
                </button>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-400 mt-2">
                <span>{movie.year}</span>
                <span>{movie.duration}</span>
                <span>★ {movie.rating}</span>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                {movie.genres.map((genre) => (
                  <span
                    key={genre}
                    className="text-sm bg-zinc-800 px-2 py-1 rounded text-gray-400"
                  >
                    {genre}
                  </span>
                ))}
              </div>
              <p className="text-gray-400 mt-4 text-sm">{movie.synopsis}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Add Movie Modal */}
      {showMovieSearch && (
        <MovieSearch
          watchlistId={id}
          onClose={() => setShowMovieSearch(false)}
          onAddMovieSuccess={fetchWatchlist}
        />
      )}
    </div>
  );
}
