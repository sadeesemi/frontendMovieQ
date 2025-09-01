import React from 'react';
import { X, Calendar, Clock, Star, MapPin, Globe, User, Users } from 'lucide-react';

const MoviePreviewModal = ({ isOpen, onClose, movieData }) => {
  if (!isOpen) return null;

  const renderStars = rating => {
    const num = Math.min(parseFloat(rating) || 0, 5);
    const full = Math.floor(num);
    const half = num % 1 >= 0.5;
    const empty = Math.max(0, 5 - full - (half ? 1 : 0));

    return (
      <div className="flex items-center space-x-1">
        {[...Array(full)].map((_, i) => <Star key={`full-${i}`} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
        {half && (
          <div className="relative" key="half">
            <Star className="w-4 h-4 text-gray-400" />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            </div>
          </div>
        )}
        {[...Array(empty)].map((_, i) => <Star key={`empty-${i}`} className="w-4 h-4 text-gray-400" />)}
        <span className="ml-2 text-white font-medium">{rating || 'N/A'}</span>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-2xl font-bold">Movie Preview</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Poster & Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="aspect-[2/3] bg-slate-800 rounded-lg overflow-hidden">
              {movieData.posterPreview ? (
                <img src={movieData.posterPreview} alt="poster" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                  <User className="w-16 h-16 mb-4" />
                  <p>No poster</p>
                </div>
              )}
            </div>
            <div className="md:col-span-2 space-y-4">
              <h1 className="text-4xl font-bold">{movieData.title || 'Untitled'}</h1>
              <div className="flex flex-wrap gap-2">
                {movieData.genres.map((g, idx) => (
                  <span key={idx} className="bg-red-600 text-white px-4 py-1 rounded-full text-sm">{g}</span>
                ))}
              </div>
              <div className="flex items-center gap-6 text-slate-300">
                {movieData.year && <><Calendar className="w-4 h-4" /><span>{movieData.year}</span></>}
                {movieData.duration && <><Clock className="w-4 h-4" /><span>{movieData.duration}</span></>}
                {movieData.rating && <>{renderStars(movieData.rating)}</>}
              </div>
              {movieData.description && <p className="text-slate-300">{movieData.description}</p>}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {movieData.language && <div><Globe /><span className="ml-2">{movieData.language}</span></div>}
                {movieData.country && <div><MapPin /><span className="ml-2">{movieData.country}</span></div>}
                {movieData.production && <div><User /><span className="ml-2">{movieData.production}</span></div>}
                {movieData.cast && <div><Users /><span className="ml-2">{movieData.cast}</span></div>}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end p-6 border-t border-slate-700">
          <button onClick={onClose} className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg">
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};

export default MoviePreviewModal;
