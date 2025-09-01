import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { WatchlistDetail } from '../components/WatchlistDetail';


export function WatchlistDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-black">
    
        <WatchlistDetail
          title={`Watchlist ${id}`}
          onBack={() => navigate('/watchlist')}
        />
  
    </div>
  );
}
