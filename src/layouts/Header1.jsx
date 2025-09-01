import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, User, Star, FilmIcon, UserCog, LogIn, Bell } from 'lucide-react';
import Headroom from 'react-headroom';

const API_BASE = 'https://localhost:7119';

const removeCookie = (name) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

const getCookie = (name) => {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
};


const handleLogout = () => {
  removeCookie('token');
  removeCookie('role');
  removeCookie('email');
  window.location.href = '/login';
};

const buildImageUrl = (imgPath) => {
  if (!imgPath) return '';
  if (imgPath.startsWith('http://') || imgPath.startsWith('https://')) return imgPath;
  const trimmed = imgPath.replace(/^\//, '');
  return `${API_BASE.replace(/\/$/, '')}/${trimmed}`;
};

const getYear = (releaseDate) => {
  if (!releaseDate) return '';
  const date = new Date(releaseDate);
  return isNaN(date) ? '' : date.getFullYear();
};

export function Header1() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMovies, setFilteredMovies] = useState([]);
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(event.target) &&
        searchRef.current && !searchRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
        setFilteredMovies([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const [unreadCount, setUnreadCount] = useState(0);

// Fetch unread notification count
useEffect(() => {
  const fetchUnreadCount = async () => {
    try {
      const token = getCookie('token');
      if (!token) return;

      const res = await fetch(`${API_BASE}/api/notification/unread-count`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setUnreadCount(data.count);
      }
    } catch (err) {
      console.error('Failed to fetch unread notifications count:', err);
    }
  };

  fetchUnreadCount();

  // Optional: make this available globally to update from NotificationPage
  window.updateUnreadCount = (delta) => {
    setUnreadCount((prev) => Math.max(0, prev + delta));
  };
}, []);


  const handleSearch = async (event) => {
  const query = event.target.value;
  setSearchQuery(query);

  if (query.trim() === '') {
    setFilteredMovies([]);
    return;
  }

  try {
    const response = await fetch(
      `${API_BASE}/api/movies/search?query=${encodeURIComponent(query)}`
    );
    if (!response.ok) {
      console.error('Error fetching movies:', response.statusText);
      setFilteredMovies([]);
      return;
    }

     const data = await response.json();
const moviesFromApi = data.map((movie) => ({
  id: movie.movieID,
  title: movie.title.trim(),
  image: buildImageUrl(movie.image),
  genres: movie.genres || [],
  year: movie.year ?? getYear(movie.releaseDate), // ✅ use Year directly if available
  duration: movie.duration || '',
  rating: movie.averageRating ?? 0,
}));


    setFilteredMovies(moviesFromApi);
  } catch (error) {
    console.error('Failed to fetch movies:', error);
    setFilteredMovies([]);
  }
};


  const handleAddToSearchHistory = async (title) => {
    const token = getCookie('token');
    if (!token) return;

    try {
      await fetch(`${API_BASE}/api/user/add-search-history`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(title),
      });
    } catch (error) {
      console.error('Failed to update search history:', error);
    }
  };

  return (
    <Headroom>
      <nav className="bg-gray-800 p-4 w-full z-50">
        <div className="container mx-auto flex items-center">
          {/* Logo */}
          <div className="flex items-center space-x-8">
            <h1 className="text-2xl font-bold">
              <span className="text-black border-2 border-[#B11123] bg-[#B11123] text-white px-2 py-1">Movie</span>
              <span className="text-[#B11123] pl-2">Quest</span>
            </h1>
          </div>

          {/* Navigation */}
          <div className="hidden md:flex items-center space-x-6 ml-20">
            <Link to="/" className="text-white hover:text-red-400 transition-colors">Home</Link>
            <div className="h-6 border-l border-gray-500"></div>
            <Link to="/moviepicker" className="text-white hover:text-red-400 transition-colors">MoviePicker</Link>
            <div className="h-6 border-l border-gray-500"></div>
            <Link to="/review" className="text-white hover:text-red-400 transition-colors">Reviews</Link>
            <div className="h-6 border-l border-gray-500"></div>
            <Link to="/watchlist" className="text-white hover:text-red-400 transition-colors">Watchlist</Link>
            <div className="h-6 border-l border-gray-500"></div>
            <Link to="/watched" className="text-white hover:text-red-400 transition-colors">Watched</Link>
          </div>

          {/* Search, Notifications, User */}
          <div className="flex items-center space-x-4 ml-auto">
            {/* Search Input */}
            <div className="relative ml-10" ref={searchRef}>
              <input
                type="text"
                placeholder="Search movies..."
                className="bg-gray-700 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 w-[550px]"
                value={searchQuery}
                onChange={handleSearch}
              />
              <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />

              {/* Search Results */}
              {filteredMovies.length > 0 && (
                <div className="absolute mt-2 w-[550px] bg-gray-800 text-white rounded-lg shadow-lg max-h-80 overflow-y-auto z-50">
                  {filteredMovies.map((movie) => (
                    <Link
                      to={`/movie/${movie.id}`}
                      key={movie.id}
                      className="flex items-start p-2 border-b border-gray-700 hover:bg-gray-700"
                      onClick={() => handleAddToSearchHistory(movie.title)}
                    >
                      <img src={movie.image} alt={movie.title} className="w-16 h-20 rounded-md mr-3 object-cover" />
                      <div className="flex flex-col">
                        <h3 className="text-lg font-semibold">{movie.title}</h3>
                        <p className="text-sm text-gray-400">{movie.genres.join(' • ')}</p>
                        <p className="text-sm text-gray-400">
                          {movie.year} {movie.duration && `| ${movie.duration}`} | ⭐ {movie.rating}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

<Link
  to="/notifications"
  className="relative text-white hover:text-red-400 transition-colors"
>
  <Bell className="w-6 h-6" />
  {unreadCount > 0 && (
    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
      {unreadCount}
    </span>
  )}
</Link>


            {/* User Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="text-white hover:text-red-400 transition-colors focus:outline-none"
              >
                <User className="w-6 h-6" />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg py-2 border border-gray-700 z-50">
                  <Link to="/your-review" className="flex items-center px-4 py-2 text-white hover:bg-gray-700 transition-colors">
                    <Star className="w-4 h-4 mr-2" />
                    Your Ratings & Reviews
                  </Link>
                  <Link to="/all-movies" className="flex items-center px-4 py-2 text-white hover:bg-gray-700 transition-colors">
                                      <FilmIcon className="w-4 h-4 mr-2" />
                                      Movies
                                    </Link>
                  <Link to="/request-movie" className="flex items-center px-4 py-2 text-white hover:bg-gray-700 transition-colors">
                    <FilmIcon className="w-4 h-4 mr-2" />
                    Request Movie
                  </Link>
                  <Link to="/edit-profile" className="flex items-center px-4 py-2 text-white hover:bg-gray-700 transition-colors">
                    <UserCog className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Link>
                  <div className="border-t border-gray-700 my-1"></div>
                  <Link
                    to="#"
                    onClick={handleLogout}
                    className="flex items-center px-4 py-2 text-white hover:bg-gray-700 transition-colors"
                  >
                    <LogIn className="w-4 h-4 mr-2 rotate-180" />
                    Logout
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </Headroom>
  );
}
