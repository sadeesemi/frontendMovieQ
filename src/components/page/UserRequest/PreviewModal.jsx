
import React from 'react';
import { X, Calendar, Clock, Globe, Star } from 'lucide-react';

const API_BASE = 'https://localhost:7119'; // match your backend

const PreviewModal = ({ isOpen, onClose, movie }) => {
  if (!isOpen || !movie) return null;

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'bg-yellow-500 text-yellow-900';
      case 'approved': return 'bg-green-500 text-green-900';
      case 'rejected': return 'bg-red-500 text-red-900';
      default: return 'bg-gray-500 text-gray-900';
    }
  };

  // Ensure genres is an array
  const genresArray = Array.isArray(movie.genres)
    ? movie.genres
    : typeof movie.genres === 'string'
      ? movie.genres.split(',').map(g => g.trim())
      : [];

  // Build full image URL
  const buildImageUrl = (imgPath) => {
    if (!imgPath) return '';
    if (imgPath.startsWith('http://') || imgPath.startsWith('https://')) return imgPath;
    const trimmed = imgPath.replace(/^\//, '');
    return `${API_BASE.replace(/\/$/, '')}/${trimmed}`;
  };

  
  const formatYear = (dateStr) => {
    if (!dateStr) return 'Unknown';
    const date = new Date(dateStr);
    return isNaN(date) ? 'Unknown' : date.getFullYear();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">Movie Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Poster */}
            <div className="lg:w-1/3">
              <img
                src={buildImageUrl(movie.image || movie.poster)}
                alt={movie.movieTitle || movie.title}
                className="w-full rounded-lg shadow-lg"
              />
            </div>

            {/* Details */}
            <div className="lg:w-2/3 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-white">{movie.movieTitle || movie.title}</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(movie.status)}`}>
                  {movie.status}
                </span>
              </div>

              {/* Genres */}
              <div className="flex flex-wrap gap-2">
                {genresArray.map((genre) => (
                  <span
                    key={genre}
                    className="px-3 py-1 bg-blue-600 text-blue-100 rounded-full text-sm"
                  >
                    {genre}
                  </span>
                ))}
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center space-x-2 text-gray-300">
                  <Calendar className="w-4 h-4" />
                   <span>{formatYear(movie.releaseDate)}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-300">
                  <Clock className="w-4 h-4" />
                  <span>{movie.duration}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-300">
                  <Globe className="w-4 h-4" />
                  <span>{movie.language}</span>
                </div>
                {movie.rating > 0 && (
                  <div className="flex items-center space-x-2 text-gray-300">
                    <Star className="w-4 h-4" />
                    <span>{movie.rating}/10</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Description</h4>
                <p className="text-gray-300 leading-relaxed">{movie.description}</p>
              </div>

              {/* Production Details */}
              <div className="space-y-3">
                <div>
                  <span className="text-gray-400 font-medium">Country: </span>
                  <span className="text-gray-300">{movie.country}</span>
                </div>
                <div>
                  <span className="text-gray-400 font-medium">Director: </span>
                  <span className="text-gray-300">{movie.director}</span>
                </div>
                <div>
                  <span className="text-gray-400 font-medium">Cast: </span>
                  <span className="text-gray-300">{movie.castMembers}</span>
                </div>
                <div>
                  <span className="text-gray-400 font-medium">Requested by: </span>
                  <span className="text-gray-300">{movie.user?.userName || 'Unknown'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-700">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;
