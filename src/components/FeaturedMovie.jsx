import React from 'react';
import { Star, Plus, Check } from 'lucide-react';

export function FeaturedMovie({ movie }) {
  return (
    <div className="relative h-[600px] w-full">
      <div className="absolute inset-0">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-end pb-16">
        <div className="max-w-2xl">
          <h1 className="text-5xl font-bold mb-4">{movie.title}</h1>
          
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex items-center">
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              <span className="ml-1">{movie.rating}</span>
            </div>
            <span>{movie.releaseDate}</span>
            <span>{movie.runtime}</span>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {movie.genres.map((genre) => (
              <span
                key={genre}
                className="px-3 py-1 bg-gray-800/80 rounded-full text-sm"
              >
                {genre}
              </span>
            ))}
          </div>
          
          <p className="text-gray-300 mb-8 line-clamp-3">
            {movie.overview}
          </p>
          
          <div className="flex space-x-4">
            <button className="px-6 py-3 bg-red-600 rounded-full hover:bg-red-700 flex items-center">
              <Check className="w-5 h-5 mr-2" />
              Add to Watched
            </button>
            <button className="px-6 py-3 border-2 border-white rounded-full hover:bg-white/10 flex items-center">
              <Plus className="w-5 h-5 mr-2" />
              Add to Watchlist
            </button>
          </div>
        </div>
      </div>
      
      {/* Dot Navigation */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        <button className="w-2 h-2 rounded-full bg-red-600" />
        <button className="w-2 h-2 rounded-full bg-gray-500 hover:bg-red-600" />
        <button className="w-2 h-2 rounded-full bg-gray-500 hover:bg-red-600" />
      </div>
    </div>
  );
}