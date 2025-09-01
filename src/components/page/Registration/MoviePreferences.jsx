import React, { useState, useEffect } from 'react'; 
import { FaTimes, FaPlus } from 'react-icons/fa';  
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || "https://localhost:7119";

export function MoviePreferences({ initialData, onComplete, onBack }) {
  // Form state
  const [formData, setFormData] = useState({
    genres: ['Action', 'Thriller'],
    favoriteMovies: [],
    language: '',
    era: ''
  });

  const [allMovies, setAllMovies] = useState([]); // Movies from DB
  const [newMovie, setNewMovie] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Fetch movies from backend
  useEffect(() => {
    axios.get(`${API_BASE}/api/movies`)
      .then(res => setAllMovies(res.data.map(m => m.title))) // only titles
      .catch(err => console.error("Error fetching movies:", err));
  }, []);

  // When initialData is provided
  useEffect(() => {
    if (initialData) setFormData(initialData);
  }, [initialData]);

  const genres = [
    'Action', 'Comedy', 'Adventure', 'Horror',
    'Mystery', 'Drama', 'Romance', 'Thriller', 'Historical'
  ];

  const eras = [
    'Classic (Before 1980)',
    'Modern (1980-2000)',
    'Contemporary (2000-Present)'
  ];

  const languages = ['English', 'Korean', 'Tamil', 'French'];

  const toggleGenre = (genre) => {
    setFormData(prev => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter(g => g !== genre)
        : [...prev.genres, genre]
    }));
  };

  const isValidMovie = (movie) =>
    allMovies.some(dbMovie => dbMovie.toLowerCase() === movie.toLowerCase());

  const handleAddMovie = (e) => {
    e.preventDefault();
    const trimmedMovie = newMovie.trim();
    if (!trimmedMovie) return;

    if (!isValidMovie(trimmedMovie)) {
      setErrorMsg('This movie is not available in our system. Please select from suggestions.');
      return;
    }

    if (formData.favoriteMovies.find(movie => movie.toLowerCase() === trimmedMovie.toLowerCase())) {
      setErrorMsg('This movie is already added.');
      return;
    }

    setFormData(prev => ({
      ...prev,
      favoriteMovies: [...prev.favoriteMovies, trimmedMovie]
    }));
    setNewMovie('');
    setErrorMsg('');
    setShowSuggestions(false);
  };

  const handleRemoveMovie = (movieToRemove) => {
    setFormData(prev => ({
      ...prev,
      favoriteMovies: prev.favoriteMovies.filter(movie => movie !== movieToRemove)
    }));
  };

  const handleSelectSuggestion = (movie) => {
    if (!formData.favoriteMovies.includes(movie)) {
      setFormData(prev => ({
        ...prev,
        favoriteMovies: [...prev.favoriteMovies, movie]
      }));
    }
    setNewMovie('');
    setErrorMsg('');
    setShowSuggestions(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onComplete(formData);
  };

 
const filteredSuggestions = newMovie
  ? allMovies.filter(
      movie =>
        movie.toLowerCase().startsWith(newMovie.toLowerCase()) &&
        !formData.favoriteMovies.includes(movie)
    )
  : [];


  return (
    <div className="bg-white rounded-lg p-8 w-full shadow-md">
      <div className="flex justify-between items-center mb-6 mt-10 ml-40">
        <div>
          <h2 className="text-2xl font-bold ">PREFERENCES</h2>
          <span className="text-green-500 text-m ml-10">2 of 3</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 ml-8 mb-10 pr-10">
        {/* Favorite Genres */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Favorite Genres</h3>
          <div className="flex flex-wrap gap-2">
            {genres.map((genre) => (
              <button
                key={genre}
                type="button"
                onClick={() => toggleGenre(genre)}
                className={`px-4 py-2 rounded-full border ${
                  formData.genres.includes(genre)
                    ? 'bg-red-600 text-white border-red-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-red-600'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        {/* Favorite Movies */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Favorite Movies</h3>
          <div className="space-y-3">
            <div className="flex gap-2 relative">
              <input
                type="text"
                value={newMovie}
                onChange={(e) => {
                  setNewMovie(e.target.value);
                  setShowSuggestions(true);
                  setErrorMsg('');
                }}
                className="flex-1 p-3 border border-gray-300 rounded-md"
                placeholder="Add a favorite movie"
              />
              <button
                type="button"
                onClick={handleAddMovie}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                <FaPlus />
              </button>
              {showSuggestions && filteredSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-md z-10 max-h-48 overflow-y-auto">
                  {filteredSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      onClick={() => handleSelectSuggestion(suggestion)}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              )}
            </div>
            {errorMsg && (
              <p className="text-red-500 text-sm mt-1">{errorMsg}</p>
            )}

            <div className="space-y-2 overflow-y-auto max-h-48">
              {formData.favoriteMovies.map((movie, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                >
                  <span>{movie}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveMovie(movie)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Preferred Languages */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Preferred Languages</h3>
          <div className="border border-gray-300 rounded-md divide-y">
            {languages.map((language) => (
              <button
                key={language}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, language }))}
                className={`w-full p-3 text-left ${
                  formData.language === language
                    ? 'bg-red-600 text-white'
                    : 'hover:bg-gray-50'
                }`}
              >
                {language}
              </button>
            ))}
          </div>
        </div>

        {/* Movie Era Preference */}
        <div>
          <h3 className="text-lg font-semibold mb-3 mt-8">Movie Era Preference</h3>
          <div className="space-y-2">
            {eras.map((era) => (
              <button
                key={era}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, era }))}
                className={`w-full px-4 py-2 rounded-full border ${
                  formData.era === era
                    ? 'bg-red-600 text-white border-red-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-red-600'
                }`}
              >
                {era}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={onBack}
            className="w-1/2 bg-gray-200 text-gray-800 py-3 rounded-md hover:bg-gray-300 transition-colors font-semibold"
          >
            Back
          </button>
          <button
            type="submit"
            className="w-1/2 bg-red-600 text-white py-3 rounded-md hover:bg-red-700 transition-colors font-semibold"
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
}
