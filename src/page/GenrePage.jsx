// src/pages/GenrePage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Eye, Bookmark, Edit, Trash2 } from 'lucide-react';

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

const GenrePage = () => {
  const { genreId } = useParams();
  const [movies, setMovies] = useState([]);
  const [genreName, setGenreName] = useState('');
  const [loading, setLoading] = useState(true);
  const role = getCookie('role');

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);

        const numericId = Number(genreId);
        if (isNaN(numericId)) throw new Error('Invalid genre ID');

        const response = await fetch(`https://localhost:7119/api/Movies/genre/${numericId}`);
        if (!response.ok) throw new Error('Failed to fetch movies');

        const data = await response.json();
        setMovies(data);

        if (data.length > 0 && data[0].genres.length > 0) {
          setGenreName(
            data[0].genres[0].trim().replace(/\b\w/g, (c) => c.toUpperCase())
          );
        } else {
          setGenreName('Unknown');
        }
      } catch (error) {
        console.error(error);
        setMovies([]);
        setGenreName('Unknown');
      } finally {
        setLoading(false);
      }
    };

    if (genreId) fetchMovies();
  }, [genreId]);

  if (!genreId || isNaN(Number(genreId))) {
    return <div className="text-white p-4">Invalid genre ID.</div>;
  }

  if (loading) return <div className="text-white p-4">Loading...</div>;

  if (!loading && movies.length === 0) {
    return <div className="text-white p-4">No movies found in this genre.</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="flex justify-between items-center mb-4">
          <div className="text-3xl font-bold">{genreName} Movies</div>
          <div className="text-sm -mb-4">Total Movies: {movies.length}</div>
        </div>

        <div className="border-t border-white mb-8"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {movies.map((movie) => (
            <div
              key={movie.movieID}
              className="group rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105 relative bg-gray-800"
            >
              <Link to={`/movie/${movie.movieID}`}>
                <img
                  src={`https://localhost:7119${movie.image}`}
                  alt={movie.title}
                  className="w-full h-64 object-cover"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/placeholder-movie.png";
                  }}
                />
              </Link>

              <div className="p-4 flex justify-between items-center">
                <h2 className="text-xl font-semibold">{movie.title}</h2>

                {role === 'Admin' ? (
                  <div className="flex space-x-4">
                    <button className="text-blue-600 hover:text-blue-700">
                      <Edit size={24} />
                    </button>
                    <button className="text-red-500 hover:text-red-700">
                      <Trash2 size={24} />
                    </button>
                  </div>
                ) : (
                  <div className="flex space-x-4">
                    <button className="text-gray-400 hover:text-red-700">
                      <Bookmark size={24} />
                    </button>
                    <button className="text-gray-400 hover:text-red-700">
                      <Eye size={24} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GenrePage;
