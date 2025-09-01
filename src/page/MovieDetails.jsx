// src/pages/MovieDetails.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, Clock, Calendar, Bookmark, User, Check } from "lucide-react";
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL || "https://localhost:7119";

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

export default function MovieDetails() {
  const { movieId } = useParams();
  const navigate = useNavigate();

  const [movieData, setMovieData] = useState(null);
  const [userName, setUserName] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [userReview, setUserReview] = useState(null);
  const [watched, setWatched] = useState(false);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedWatchlistId, setSelectedWatchlistId] = useState(null);
  const [added, setAdded] = useState(false);
  const [watchlists, setWatchlists] = useState([]);

  const role = getCookie("role");

  const buildImageUrl = (imgPath) => {
    if (!imgPath) return "";
    if (imgPath.startsWith("http://") || imgPath.startsWith("https://")) return imgPath;
    const trimmed = imgPath.replace(/^\//, "");
    return `${API_BASE.replace(/\/$/, "")}/${trimmed}`;
  };

  const mapMovieData = (data) => ({
    id: data.movieID ?? data.id,
    title: data.title ?? data.name ?? "",
    duration: data.duration ?? data.runningTime ?? "",
    image: data.image ? buildImageUrl(data.image) : "",
    language: data.language ?? data.Language ?? "",
    year: data.releaseDate ? new Date(data.releaseDate).getFullYear() : data.year ?? "",
    synopsis: data.description ?? data.synopsis ?? "",
    country: data.country ?? "",
    director: data.director ?? data.production ?? "",
    cast: data.castMembers
      ? data.castMembers.split(",").map((c) => c.trim())
      : Array.isArray(data.cast) ? data.cast : [],
    rating: data.rating ?? 0,
    genres: data.genres
      ? Array.isArray(data.genres)
        ? data.genres
        : data.genres.split(",").map((g) => g.trim())
      : data.movieGenres
      ? data.movieGenres.map((g) => g.name ?? g.genre ?? String(g))
      : [],
    reviews: data.reviews ?? [],
  });

  // Fetch movie
  useEffect(() => {
    const storedFullName = localStorage.getItem("fullName");
    if (storedFullName) setUserName(storedFullName);

    if (!movieId) {
      setMovieData(null);
      setLoading(false);
      return;
    }

    let mounted = true;
    setLoading(true);
    axios
      .get(`${API_BASE}/api/Movies/${movieId}`)
      .then((resp) => {
        if (!mounted) return;
        setMovieData(mapMovieData(resp.data));
      })
      .catch((err) => {
        console.error("Failed to fetch movie:", err);
        setMovieData(null);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => (mounted = false);
  }, [movieId]);

  // Fetch watchlists
  useEffect(() => {
    const fetchWatchlists = async () => {
      const token = getCookie("token");
      if (!token) return;
      try {
        const resp = await axios.get(`${API_BASE}/api/watchlists`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWatchlists(Array.isArray(resp.data) ? resp.data : []);
      } catch (err) {
        console.error("Failed to fetch watchlists:", err);
      }
    };
    fetchWatchlists();
  }, []);

  // Check watched status
  useEffect(() => {
    const checkWatchedStatus = async () => {
      const token = getCookie("token");
      if (!token || !movieData) return;
      try {
        const resp = await axios.get(`${API_BASE}/api/watchedmovies`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const watchedList = Array.isArray(resp.data) ? resp.data : [];
        const isWatched = watchedList.some((m) => String(m.id) === String(movieData.id));
        setWatched(isWatched);
      } catch (err) {
        console.error("Failed to check watched status:", err);
      }
    };
    checkWatchedStatus();
  }, [movieData]);

  // Local review detection
  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (movieData && storedEmail) {
      const foundReview = (movieData.reviews || []).find(
        (r) => r.userEmail === storedEmail
      );
      setUserReview(foundReview || null);
      setHasReviewed(!!foundReview);
    }
  }, [movieData]);

  // Check if movie already in watchlist
  useEffect(() => {
    if (!movieData || !watchlists.length) return;
    const inList = watchlists.some((w) =>
      (w.movies || []).some((m) => String(m.id) === String(movieData.id))
    );
    setAdded(inList);
  }, [movieData, watchlists]);

  const handleMarkAsWatched = async () => {
    if (!movieData) return;
    const token = getCookie("token");
    if (!token) return alert("You must be logged in to mark as watched.");

    try {
      await axios.post(`${API_BASE}/api/watchedmovies/${movieData.id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updatedLists = watchlists.map((list) => ({
        ...list,
        movies: (list.movies || []).filter((m) => String(m.id) !== String(movieData.id)),
      }));
      setWatchlists(updatedLists);
      setInWatchlist(false);
      setWatched(true);
      alert("Movie marked as watched ✅");
    } catch (err) {
      console.error(err);
      alert("Failed to mark movie as watched");
    }
  };

  const handleAddToWatchlistClick = () => setShowDropdown(true);

  const handleSelectWatchlist = async (watchlistId) => {
    setSelectedWatchlistId(watchlistId);
    const token = getCookie("token");
    if (!token) return alert("Login required");
    if (!movieData) return;

    try {
      await axios.post(
        `${API_BASE}/api/watchlists/${watchlistId}/add-movie/${movieData.id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAdded(true);
      setShowDropdown(false);
    } catch (err) {
      console.error(err);
      alert("Could not add movie to watchlist");
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    const token = getCookie("token");
    if (!token) return alert("Login required");
    if (!comment.trim() || !rating) return alert("Provide rating & comment");

    try {
      await axios.post(
        `${API_BASE}/api/reviews/${movieData.id}`,
        { comment, rating },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const resp = await axios.get(`${API_BASE}/api/movies/${movieData.id}`);
      const mapped = mapMovieData(resp.data);
      setMovieData(mapped);
      const storedEmail = localStorage.getItem("email");
      const foundReview = mapped.reviews.find(r => r.userEmail === storedEmail);
      setUserReview(foundReview || null);
      setHasReviewed(!!foundReview);
      setComment("");
      setRating(0);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert("Could not submit review");
    }
  };

  const handleSubmitEditReview = async (e) => {
    e.preventDefault();
    const token = getCookie("token");
    if (!token) return alert("Login required");

    try {
      await axios.put(`${API_BASE}/api/reviews/${movieData.id}`, { comment, rating }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const resp = await axios.get(`${API_BASE}/api/movies/${movieData.id}`);
      const mapped = mapMovieData(resp.data);
      setMovieData(mapped);
      const storedEmail = localStorage.getItem("email");
      const foundReview = mapped.reviews.find(r => r.userEmail === storedEmail);
      setUserReview(foundReview || null);
      setHasReviewed(!!foundReview);
      setComment("");
      setRating(0);
      setIsEditing(false);
      alert("Review updated.");
    } catch (err) {
      console.error(err);
      alert("Could not update review");
    }
  };

  const handleDeleteReview = async () => {
    const token = getCookie("token");
    if (!token) return alert("Login required");
    if (!window.confirm("Delete your review?")) return;

    try {
      await axios.delete(`${API_BASE}/api/reviews/${movieData.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMovieData((prev) => ({
        ...prev,
        reviews: prev.reviews.filter((r) => r.userEmail !== localStorage.getItem("email")),
      }));
      setHasReviewed(false);
      setUserReview(null);
      alert("Review deleted.");
    } catch (err) {
      console.error(err);
      alert("Could not delete review.");
    }
  };

  const handleDeleteMovie = async () => {
    if (!movieData) return;
    if (!window.confirm("Are you sure you want to delete this movie?")) return;
    setDeleting(true);
    try {
      await axios.delete(`${API_BASE}/api/Movies/${movieData.id}`);
      alert("Movie deleted successfully.");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Could not delete movie");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading movie details...</div>;
  }

  if (!movieData) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div>
          <p>Movie not found.</p>
          <button onClick={() => navigate(-1)} className="mt-4 px-4 py-2 bg-gray-800 rounded">Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-12">
        <Link to="/" className="inline-flex items-center text-gray-400 hover:text-white mb-8">
          <ArrowLeft className="w-5 h-5 mr-2" /> Back
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="md:col-span-1">
            {movieData.image ? (
              <img
                src={movieData.image}
                alt={movieData.title}
                className="w-full rounded-lg shadow-lg mb-8"
                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "/placeholder-movie.png"; }}
              />
            ) : (
              <div className="w-full h-80 bg-gray-900 rounded-lg mb-8 flex items-center justify-center">
                <span className="text-gray-500">No image</span>
              </div>
            )}
          </div>

          <div className="md:col-span-2 space-y-6">
            <h1 className="text-5xl font-bold mb-4">{movieData.title}</h1>

            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {movieData.genres.map((genre) => (
                  <span key={genre} className="px-4 py-2 bg-red-600 rounded-full text-sm">{genre}</span>
                ))}
              </div>

              <div className="flex flex-col space-y-2">
                {role === "Admin" ? (
                  <>
                    <button onClick={() => navigate(`/edit-movie/${movieId}`)} className="px-4 py-2 bg-blue-600 text-black rounded-md hover:bg-blue-700 transition-colors">Edit Movie</button>
                    <button onClick={handleDeleteMovie} disabled={deleting} className="px-4 py-2 bg-red-700 text-white rounded-md hover:bg-red-800 transition-colors">
                      {deleting ? "Deleting..." : "Delete Movie"}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleMarkAsWatched}
                      className={`px-4 py-2 rounded-md flex items-center justify-center transition-colors ${watched ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}
                      disabled={watched}
                    >
                      {watched ? <><Check className="w-5 h-5 mr-2" /> Watched</> : "Mark as Watched"}
                    </button>

                    <div className="relative flex items-center">
                      <button
                        onClick={handleAddToWatchlistClick}
                        className={`w-48 px-4 py-2 rounded-md flex items-center justify-center transition-colors ${added ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"}`}
                        disabled={added}
                      >
                        {!added && <Bookmark className="w-5 h-5 mr-2" />}
                        {added ? "Added ✅" : "Add to Watchlist"}
                      </button>

                      {showDropdown && !added && watchlists.length > 0 && (
                        <select
                          value=""
                          onChange={(e) => handleSelectWatchlist(Number(e.target.value))}
                          className="absolute top-full left-0 mt-2 px-2 py-2 rounded bg-gray-800 text-white"
                        >
                          <option value="" disabled>Select watchlist</option>
                          {watchlists.map((w) => (
                            <option key={w.watchListID} value={w.watchListID}>{w.listName}</option>
                          ))}
                        </select>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <span className="flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-lg" /> {movieData.year || "N/A"}
              </span>
              <span className="flex items-center">
                <Clock className="w-5 h-5 mr-2 text-lg" /> {movieData.duration || "N/A"}
              </span>
              <span className="flex items-center">
                {[...Array(5)].map((_, index) => (
                  <Star
                    key={index}
                    className={`w-6 h-6 ${
                      index < Math.floor(movieData.rating || 0) ? "text-yellow-400 fill-current" : "text-gray-600"
                    }`}
                  />
                ))}
                <span className="ml-2 text-yellow-400">{movieData.rating ?? 0}</span>
              </span>
            </div>

            <p className="text-gray-300 mb-4 leading-relaxed text-lg">{movieData.synopsis}</p>

            <div className="space-y-4 text-lg">
              <p>
                <strong>Language:</strong> {movieData.language || "N/A"}
              </p>
              <p>
                <strong>Country:</strong> {movieData.country || "N/A"}
              </p>
              <p>
                <strong>Production / Director:</strong> {movieData.director || "N/A"}
              </p>
              <p>
                <strong>Cast:</strong> {movieData.cast?.length ? movieData.cast.join(", ") : "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Reviews: only if watched & not admin */}
{watched && role !== "Admin" && (
  <div className="mt-12 w-full">
    <h2 className="text-2xl font-bold mb-6">Reviews</h2>

    {hasReviewed && !isEditing ? (
      <div className="bg-gray-900 rounded-lg p-6 mb-12 w-full">
        <h3 className="text-xl font-semibold mb-2">Your Review</h3>
        <p className="text-gray-300 mb-4">{userReview?.comment}</p>

        {/* ✅ Show created date for your review */}
        {userReview?.createdAt && (
          <p className="text-xs text-gray-500 mb-4">
            Posted on{" "}
            {new Date(userReview.createdAt).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>
        )}

        <button
          onClick={() => {
            setIsEditing(true);
            if (userReview) {
              setRating(userReview.rating);
              setComment(userReview.comment);
            }
          }}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Edit Review
        </button>
        <button
          onClick={handleDeleteReview}
          className="ml-4 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
        >
          Delete Review
        </button>
      </div>
    ) : (
      <form
        onSubmit={isEditing ? handleSubmitEditReview : handleSubmitReview}
        className="bg-gray-900 rounded-lg p-6 w-full mb-8"
      >
        <h3 className="text-xl font-semibold mb-4">
          {isEditing ? "Edit" : "Add"} Your Review
        </h3>

        <div className="mb-4">
          <label className="block text-gray-400 text-sm mb-2">Your Name</label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full bg-gray-800 rounded-lg p-2 text-white"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-400 text-sm mb-2">Your Review</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full bg-gray-800 rounded-lg p-2 text-white"
            required
          />
        </div>

        <div className="mb-4 flex items-center">
          <span className="text-gray-400 mr-4">Rating:</span>
          {[...Array(5)].map((_, index) => (
            <Star
              key={index}
              className={`w-6 h-6 cursor-pointer ${
                index < (hoveredRating || rating)
                  ? "text-yellow-400"
                  : "text-gray-600"
              }`}
              onMouseEnter={() => setHoveredRating(index + 1)}
              onMouseLeave={() => setHoveredRating(0)}
              onClick={() => setRating(index + 1)}
            />
          ))}
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          {isEditing ? "Update Review" : "Submit Review"}
        </button>
      </form>
    )}
  </div>
)}

{/* All reviews */}
<div className="mt-8">
  <h2 className="text-2xl font-bold mb-6">All Reviews</h2>
  {(movieData.reviews || []).length === 0 ? (
    <p className="text-gray-400">No reviews yet.</p>
  ) : (
    (movieData.reviews || []).map((review, index) => (
      <div
        key={index}
        className="bg-gray-900 rounded-lg p-6 mb-4 text-lg"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <User className="w-5 h-5 mr-2 text-gray-400" />
            <p className="text-lg font-semibold">{review.userName}</p>
          </div>
          <div className="flex items-center">
            {[...Array(5)].map((_, starIndex) => (
              <Star
                key={starIndex}
                className={`w-4 h-4 ${
                  starIndex < Math.floor(review.rating)
                    ? "text-yellow-400 fill-current"
                    : "text-gray-600"
                }`}
              />
            ))}
          </div>
        </div>
        <p className="text-gray-300 mt-2">{review.comment}</p>

        {/* ✅ Show formatted createdAt */}
        {review.createdAt && (
          <p className="text-xs text-gray-500 mt-2">
            {new Date(review.createdAt).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>
        )}
      </div>
    ))
  )}
</div>

      </div>
    </div>
  );
}
