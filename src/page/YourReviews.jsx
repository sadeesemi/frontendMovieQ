import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Star,
  Clock,
  Calendar,
  Edit,
  Trash2,
  Check,
  X,
} from "lucide-react";
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL || "https://localhost:7119";

// Helper to get token from cookies
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

// Helper to build full image URL
const buildImageUrl = (imgPath) => {
  if (!imgPath) return "";
  if (imgPath.startsWith("http://") || imgPath.startsWith("https://")) {
    return imgPath;
  }
  const trimmed = imgPath.replace(/^\/+/, "");
  return `${API_BASE.replace(/\/$/, "")}/${trimmed}`;
};

export default function YourReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editText, setEditText] = useState("");
  const [editRating, setEditRating] = useState(0);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const token = getCookie("token");
        if (!token) return;
        const resp = await axios.get(`${API_BASE}/api/reviews/my-reviews`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReviews(resp.data || []);
      } catch (err) {
        console.error("Failed to fetch user reviews:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  // Save updated review
  const handleSaveEdit = async (review) => {
    try {
      const token = getCookie("token");
      await axios.put(
        `${API_BASE}/api/reviews/${review.movieId}`,
        { comment: editText, rating: editRating },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReviews(
        reviews.map((r) =>
          r.reviewID === review.reviewID
            ? { ...r, comment: editText, rating: editRating }
            : r
        )
      );
      setEditingReviewId(null);
      setEditText("");
      setEditRating(0);
    } catch (err) {
      console.error("Error saving review:", err);
    }
  };

  // Delete review
  const handleDelete = async (review) => {
    try {
      const token = getCookie("token");
      await axios.delete(`${API_BASE}/api/reviews/${review.movieId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReviews(reviews.filter((r) => r.reviewID !== review.reviewID));
    } catch (err) {
      console.error("Error deleting review:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Loading your reviews...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Link to="/" className="text-gray-400 hover:text-white mr-4">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-3xl font-bold">Your Reviews & Ratings</h1>
          </div>
        </div>

        {reviews.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              You haven't reviewed any movies yet.
            </p>
            <Link
              to="/"
              className="inline-block mt-4 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Discover Movies to Review
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {reviews.map((review) => (
              <div
                key={review.reviewID}
                className="bg-gray-900 rounded-lg overflow-hidden"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Movie Poster */}
                  <div className="md:w-48 flex-shrink-0">
                    <Link to={`/movie/${review.movieId}`}>
                      <img
                        src={buildImageUrl(review.movieImage)}
                        alt={review.movieTitle}
                        className="w-full h-full object-cover"
                      />
                    </Link>
                  </div>

                  {/* Review Content */}
                  <div className="p-6 flex-grow">
                    <Link
                      to={`/movie/${review.movieId}`}
                      className="text-xl font-bold hover:text-red-500 transition-colors"
                    >
                      {review.movieTitle}
                    </Link>
                    <div className="flex items-center mt-2 text-sm text-gray-400">
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {review.movieYear}
                      </span>
                      <span className="mx-3">•</span>
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {review.movieDuration}
                      </span>
                    </div>

                    {/* If editing */}
                    {editingReviewId === review.reviewID ? (
                      <div className="mt-4">
                        <textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="w-full border border-gray-600 bg-black text-white p-2 rounded-lg mb-3"
                          rows={3}
                        />
                        <div className="flex items-center gap-2 mb-3">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              onClick={() => setEditRating(star)}
                              className={`w-6 h-6 cursor-pointer ${
                                star <= editRating
                                  ? "text-yellow-400"
                                  : "text-gray-600"
                              }`}
                            />
                          ))}
                        </div>
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleSaveEdit(review)}
                            className="flex items-center bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg"
                          >
                            <Check className="w-4 h-4 mr-1" /> Save
                          </button>
                          <button
                            onClick={() => setEditingReviewId(null)}
                            className="flex items-center bg-gray-700 hover:bg-gray-800 px-4 py-2 rounded-lg"
                          >
                            <X className="w-4 h-4 mr-1" /> Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        {/* Show review */}
                        <div className="flex items-center mt-3">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-5 h-5 ${
                                i < review.rating
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-600"
                              }`}
                            />
                          ))}
                          <span className="ml-2 text-sm text-gray-400">
                            Your rating
                          </span>
                        </div>
                        <p className="mt-4 text-gray-300">{review.comment}</p>
                        <div className="mt-4 text-sm text-gray-500">
                          Reviewed on{" "}
                          {new Date(review.date).toLocaleDateString()}
                        </div>

                        {/* Edit/Delete buttons */}
                        <div className="flex gap-4 mt-3">
                          <button
                            onClick={() => {
                              setEditingReviewId(review.reviewID);
                              setEditText(review.comment);
                              setEditRating(review.rating);
                            }}
                            className="flex items-center text-blue-400 hover:text-blue-500"
                          >
                            <Edit className="w-4 h-4 mr-1" /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(review)}
                            className="flex items-center text-red-400 hover:text-red-500"
                          >
                            <Trash2 className="w-4 h-4 mr-1" /> Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
