import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MovieList } from '../components/MovieList';


export function WatchlistPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-black">
        <MovieList onSelectList={(id) => navigate(`/watchlist/${id}`)} />
    </div>
  );
}
