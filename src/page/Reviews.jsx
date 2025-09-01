// src/pages/Reviews.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL || "https://localhost:7119";

const Reviews = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("token="))
          ?.split("=")[1];

        const response = await axios.get(
          `${API_BASE}/api/reviews/with-reviews`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setMovies(response.data);
      } catch (err) {
        console.error("Failed to fetch movies with reviews:", err);
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) {
    return <div className="text-white text-center py-16">Loading movies...</div>;
  }

  return (
    <div className="bg-black min-h-screen flex flex-col">
      <div className="flex-grow">
        <div className="container mx-auto px-6 py-8">
          {/* Movie Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
            {movies.map((movie) => (
              <div
                key={movie.movieID}
                className="group rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105 relative bg-gray-800"
              >
                {/* ✅ Link to MovieDetails page */}
                <Link to={`/movie/${movie.movieID}`} className="block">
                  <div className="aspect-w-16 aspect-h-9">
                    <img
                      src={
                        movie.image
                          ? `https://localhost:7119${movie.image}`
                          : "/placeholder-movie.png"
                      }
                      alt={movie.title}
                      className="w-full h-64 object-cover"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "/placeholder-movie.png";
                      }}
                    />
                  </div>
                </Link>

                <div className="p-4 flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-white">
                    {movie.title}
                  </h2>
                  {/* ✅ Show number of reviews */}
                  <span className="text-gray-300 text-sm">
                    {movie.reviews?.length || 0} Reviews
                  </span>
                </div>
              </div>
            ))}
          </div>

          {movies.length === 0 && (
            <div className="text-center text-gray-300 py-16">
              <p className="text-xl mb-2">No movies available</p>
              <p className="text-sm">Movies will appear here once added</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reviews;
