import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Film, ChevronRight, Check, Star, X } from 'lucide-react';
import { FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';   // recommender service
const MOVIES_API = process.env.REACT_APP_MOVIES_API || 'https://localhost:7119/api/movies';
const IMAGE_BASE = process.env.REACT_APP_IMAGE_URL || 'https://localhost:7119';

const MoviePicker = () => {
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const [genres, setGenres] = useState([
    { name: 'Action', selected: false },
    { name: 'Comedy', selected: false },
    { name: 'Adventure', selected: false },
    { name: 'Horror', selected: false },
    { name: 'Mystery', selected: false },
    { name: 'Drama', selected: false },
    { name: 'Romance', selected: false },
    { name: 'Thriller', selected: false },
    { name: 'Historical', selected: false },
  ]);

  const [languages] = useState(['English', 'Korean', 'Tamil']);
  const [eras] = useState(['Classic (Before 1980)', 'Modern (1980-2000)', 'Contemporary (2000-Present)']);

  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [era, setEra] = useState('');
  const [filteredMovies, setFilteredMovies] = useState([]);

  const [allMovies, setAllMovies] = useState([]);
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [newMovie, setNewMovie] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Validation state
  const [formErrors, setFormErrors] = useState({});

  // Fetch all movies for suggestions
  useEffect(() => {
    axios.get(MOVIES_API, { withCredentials: false })
      .then(res => {
        const titles = res.data.map(m => m.title.trim());
        setAllMovies(titles);
      })
      .catch(err => console.error("Error fetching movies:", err));

 
  }, []);

  // Build image URL
  const buildImageUrl = (imgPath) => {
    if (!imgPath) return '/placeholder-movie.png';
    if (imgPath.startsWith('http://') || imgPath.startsWith('https://')) return imgPath;
    return `${IMAGE_BASE}/${imgPath.replace(/^\//, '')}`;
  };

  // Favorite movie handlers
  const isValidMovie = (movie) => allMovies.some(dbMovie => dbMovie.toLowerCase() === movie.toLowerCase());

  const handleAddMovie = () => {
    const trimmedMovie = newMovie.trim();
    if (!trimmedMovie) return;
    if (!isValidMovie(trimmedMovie)) {
      setErrorMsg('Movie not available. Choose from suggestions.');
      return;
    }
    if (favoriteMovies.find(m => m.toLowerCase() === trimmedMovie.toLowerCase())) {
      setErrorMsg('Movie already added.');
      return;
    }
    setFavoriteMovies([...favoriteMovies, trimmedMovie]);
    setNewMovie('');
    setErrorMsg('');
    setShowSuggestions(false);
  };

  const handleRemoveMovie = (movie) => setFavoriteMovies(favoriteMovies.filter(m => m !== movie));
  const handleSelectSuggestion = (movie) => {
    if (!favoriteMovies.includes(movie)) setFavoriteMovies([...favoriteMovies, movie]);
    setNewMovie('');
    setErrorMsg('');
    setShowSuggestions(false);
  };

  const filteredSuggestions = newMovie
    ? allMovies.filter(
        movie => movie.toLowerCase().startsWith(newMovie.toLowerCase()) && !favoriteMovies.includes(movie)
      )
    : [];

  // Filter movies API with validation
  const filterMovies = async () => {
    const selectedGenres = genres.filter(g => g.selected).map(g => g.name);

    // Validation checks
    const errors = {};
    if (selectedGenres.length === 0) errors.genres = "Please select at least one genre.";
    if (favoriteMovies.length === 0) errors.favorites = "Please add at least one favorite movie.";
    if (!era) errors.era = "Please select a movie era.";

    setFormErrors(errors);

    // Stop if there are errors
    if (Object.keys(errors).length > 0) return;

    const filters = { genres: selectedGenres, language: selectedLanguage, era, favoriteMovies };

    try {
      const response = await axios.post(`${API_BASE}/recommend`, filters);
      setFilteredMovies(response.data.results);
      setShowResults(true);
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };

  // Render results
  if (showResults) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto py-12">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Recommended Movies</h1>
            <button
              onClick={() => { setShowResults(false); setShowFilters(true); }}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg flex items-center"
            >
              Adjust Filters
            </button>
          </div>

          {filteredMovies.length === 0 ? (
            <div className="text-center py-16">
              <h2 className="text-2xl font-semibold mb-4">No movies found</h2>
              <p className="text-gray-400">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredMovies.map((movie) => (
                <div
                  key={movie.movieID}
                  className="bg-gray-800 rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => navigate(`/movie/${movie.movieID}`)}
                >
                  <img
                    src={buildImageUrl(movie.image)}
                    alt={movie.title}
                    className="w-full h-48 object-cover"
                    onError={(e) => e.currentTarget.src = '/placeholder-movie.png'}
                  />
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-semibold">{movie.title}</h3>
                      <div className="flex items-center bg-red-600 px-2 py-1 rounded">
                        <Star size={16} className="mr-1" />
                        <span>{movie.score ? movie.score.toFixed(2) : '—'}</span>
                      </div>
                    </div>
                    <p className="text-gray-400 mb-2">{movie.year} • {movie.language}</p>
                    <div className="flex flex-wrap gap-2">
                      {movie.genres.map((genre) => (
                        <span key={genre} className="bg-gray-700 px-2 py-1 rounded-full text-sm">{genre}</span>
                      ))}
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

  // Render filters
  return (
    <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1585951237318-9ea5e175b891?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80')] bg-cover">
      {!showFilters ? (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black/50 text-white px-4">
          <h1 className="text-5xl font-bold mb-6 flex items-center">
            Find Your Perfect Movie! <Film className="ml-2" />
          </h1>
          <p className="text-xl text-center max-w-2xl mb-8">
            Let our smart recommendation system suggest movies based on your taste.
          </p>
          <button
            onClick={() => setShowFilters(true)}
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg text-xl font-semibold flex items-center transition-all"
          >
            Add Filters <ChevronRight className="ml-2" />
          </button>
        </div>
      ) : (
        <div className="min-h-screen bg-black/75 backdrop-blur-sm text-white p-12">
          <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-md rounded-xl shadow-2xl p-16">
            
            {/* Genres */}
            <h2 className="text-2xl font-bold mb-6">Favorite Genres</h2>
            <div className="grid grid-cols-3 gap-3 mb-2">
              {genres.map((genre, index) => (
                <button
                  key={index}
                  onClick={() => {
                    const newGenres = [...genres];
                    newGenres[index].selected = !newGenres[index].selected;
                    setGenres(newGenres);
                  }}
                  className={`p-3 rounded-lg flex items-center justify-between transition-all ${genre.selected ? 'bg-red-600 hover:bg-red-700' : 'bg-white/20 hover:bg-white/30'}`}
                >
                  {genre.name}
                  {genre.selected && <Check size={20} />}
                </button>
              ))}
            </div>
            {formErrors.genres && <p className="text-red-500 text-sm mb-4">{formErrors.genres}</p>}

            {/* Favorite Movies */}
            <h2 className="text-2xl font-bold mb-3">Favorite Movies</h2>
            <div className="space-y-3 mb-2">
              <div className="flex gap-2 relative">
                <input
                  type="text"
                  value={newMovie}
                  onChange={(e) => { setNewMovie(e.target.value); setShowSuggestions(true); setErrorMsg(''); }}
                  placeholder="Add a favorite movie"
                  className="flex-1 p-3 border border-gray-300 rounded-md text-black"
                />
                <button type="button" onClick={handleAddMovie} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                  <FaPlus />
                </button>
                {showSuggestions && filteredSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-md z-10 max-h-48 overflow-y-auto text-black">
                    {filteredSuggestions.map((suggestion, idx) => (
                      <div key={idx} onClick={() => handleSelectSuggestion(suggestion)} className="p-2 hover:bg-gray-200 cursor-pointer">
                        {suggestion}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {favoriteMovies.map((movie, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-md text-black">
                    <span>{movie}</span>
                    <button onClick={() => handleRemoveMovie(movie)} className="text-red-600 hover:text-red-700">
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            {formErrors.favorites && <p className="text-red-500 text-sm mb-4">{formErrors.favorites}</p>}

            {/* Language */}
            <h2 className="text-2xl font-bold mb-4">Preferred Languages</h2>
            <div className="bg-white/20 rounded-lg mb-8">
              {languages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => setSelectedLanguage(lang)}
                  className={`w-full p-3 text-left transition-all ${selectedLanguage === lang ? 'bg-red-600' : 'hover:bg-white/10'} ${lang !== languages[languages.length - 1] ? 'border-b border-white/10' : ''}`}
                >
                  {lang}
                </button>
              ))}
            </div>

            {/* Era */}
            <h2 className="text-2xl font-bold mb-4">Movie Era Preference</h2>
            <div className="grid grid-cols-1 gap-3 mb-2">
              {eras.map((eraOption) => (
                <button
                  key={eraOption}
                  onClick={() => setEra(eraOption)}
                  className={`p-3 rounded-lg flex items-center justify-between transition-all ${era === eraOption ? 'bg-red-600 hover:bg-red-700' : 'bg-white/20 hover:bg-white/30'}`}
                >
                  {eraOption}
                </button>
              ))}
            </div>
            {formErrors.era && <p className="text-red-500 text-sm mb-4">{formErrors.era}</p>}

            {/* Buttons */}
            <div className="flex justify-center gap-6 mt-6">
              <button onClick={() => setShowFilters(false)} className="bg-transparent border-2 border-white/30 text-white px-6 py-3 rounded-lg hover:bg-white/20">
                Back
              </button>
              <button onClick={filterMovies} className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg">
                Show Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MoviePicker;
