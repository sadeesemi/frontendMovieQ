import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ChevronLeft } from 'lucide-react';

import actionImg from '../Images/Genrepic/Action.png';
import comedyImg from '../Images/Genrepic/Comedy.png';
import adventureImg from '../Images/Genrepic/Adventure.png';
import horrorImg from '../Images/Genrepic/Horror.png';
import mysteryImg from '../Images/Genrepic/Mystery.png';
import dramaImg from '../Images/Genrepic/Drama.png';
import romanceImg from '../Images/Genrepic/Romance.png';
import thrillerImg from '../Images/Genrepic/Thriller.png';
import historicalImg from '../Images/Genrepic/History.png';

export default function GenreSection() {
  const scrollContainerRef = useRef(null);
  const [genres, setGenres] = useState([]);
  const [error, setError] = useState(null);

  const genreImages = {
    Action: actionImg,
    Comedy: comedyImg,
    Adventure: adventureImg,
    Horror: horrorImg,
    Mystery: mysteryImg,
    Drama: dramaImg,
    Romance: romanceImg,
    Thriller: thrillerImg,
    History: historicalImg,
  };

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollTo({
        left:
          scrollContainerRef.current.scrollLeft +
          (direction === 'right' ? scrollAmount : -scrollAmount),
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch('https://localhost:7119/api/Genres');
        if (!response.ok) {
          throw new Error(`Failed to fetch genres: ${response.status}`);
        }
        const data = await response.json();
        console.log("Fetched genres:", data); // ✅ Debug log
        setGenres(data);
      } catch (error) {
        console.error('Fetch error:', error);
        setError(error.message);
      }
    };

    fetchGenres();
  }, []);

  if (error) {
    return <div className="text-red-500 p-4">Error loading genres: {error}</div>;
  }

  return (
    <div className="min-h-[50vh] bg-black text-white mt-24">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-8 ml-2">Genres</h1>

        <div className="relative">
          {/* Left Arrow */}
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-gray-800 rounded-full p-2 hover:bg-gray-700 transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>

          {/* Genre Scroll Container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-16 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {genres.map((genre) =>
              genre.genreID ? (
                <Link
                  key={genre.genreID}
                  to={`/genre/${genre.genreID}`}
                  className="flex-none relative group"
                >
                  <div className="w-48 h-72 relative rounded-lg overflow-hidden">
                    <img
                      src={genreImages[genre.name.trim()] || actionImg}
                      alt={genre.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <h2 className="text-xl font-bold text-white">{genre.name}</h2>
                    </div>
                  </div>
                </Link>
              ) : null
            )}
          </div>

          {/* Right Arrow */}
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-gray-800 rounded-full p-2 hover:bg-gray-700 transition-colors"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
