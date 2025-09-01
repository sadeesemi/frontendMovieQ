import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, Calendar, Clock } from 'lucide-react';
import TheJungleBook from '../Images/Heropic/TheJungleBook.jpeg';
import Moana from '../Images/Heropic/Moana.jpg';
import LionKing from '../Images/Heropic/LionKing.jpg';
import LostCityOfZ from '../Images/Heropic/LostCityOfZ.jpg'; 

const featuredMovies = [
  {
    id: 1,
    title: 'The Jungle Book',
    image: TheJungleBook,
    genres: ['Drama', 'Adventure', 'Fantasy'],
    year: '2016',
    duration: '1:48:00',
    rating: '8.5',
    description: 'The Jungle Book (2016) follows Mowgli, a boy raised by wolves, as he flees from the tiger Shere Khan. Guided by Bagheera and Baloo, he embarks on a journey of self-discovery, facing jungle dangers and learning where he truly belongs.',
  },
  {
    id: 2,
    title: 'Moana',
    image: Moana,
    genres: ['Adventure', 'Fantasy', 'Comedy'],
    year: '2016',
    duration: '1:47:00',
    rating: '8.8',
    description: '*Moana* follows a young Polynesian girl, Moana, who sets sail to find the demigod Maui and restore the Heart of Te Fiti to save her island. Along the way, she discovers her inner strength and embraces her destiny as a leader.',
  },
  {
    id: 3,
    title: 'The Lion King',
    image: LionKing,
    genres: ['Adventure', 'Drama'],
    year: '2019',
    duration: '2:42:00',
    rating: '8.6',
    description: "Simba, a young lion prince, flees after his father Mufasa's death, which he believes is his fault. He grows up with Timon and Pumbaa but returns to reclaim his throne from his treacherous uncle Scar. The film explores Simba’s journey of self-discovery, responsibility, and restoring balance to the Pride Lands.",
  },
  {
    id: 4, // Add the new movie
    title: 'The Lost City of Z',
    image: LostCityOfZ,
    genres: ['Adventure', 'Drama'],
    year: '2016',
    duration: '2:21:00',
    rating: '6.6',
    description: 'The Lost City of Z (2016) is based on the true story of British explorer Percy Fawcett, who travels to the Amazon jungle in search of an ancient city. Despite facing danger and skepticism, Fawcett remains determined to uncover the mystery of the lost civilization.',
  },
];

export function HeroSection() {
  const [currentMovie, setCurrentMovie] = useState(0);
  const movie = featuredMovies[currentMovie];

  const goToPrevious = () => {
    setCurrentMovie((prev) => (prev === 0 ? featuredMovies.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentMovie((prev) => (prev === featuredMovies.length - 1 ? 0 : prev + 1));
  };

  // Auto-Navigation Effect
  useEffect(() => {
    const interval = setInterval(() => {
      goToNext();
    }, 5000);

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [currentMovie]);

  return (
    <div className="relative h-[720px] mt-0">
      <div className="absolute inset-0 w-full h-full transition-opacity duration-500">
        <img
          src={movie.image}
          alt={movie.title}
          className="w-full h-full object-cover brightness-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark to-transparent" />

        {/* Navigation Arrows */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-primary transition-colors group"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-8 h-8 group-hover:scale-110 transition-transform" />
        </button>
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-primary transition-colors group"
          aria-label="Next slide"
        >
          <ChevronRight className="w-8 h-8 group-hover:scale-110 transition-transform" />
        </button>

        {/* Movie Details */}
        <div className="absolute bottom-0 left-0 pl-36 pb-24 space-y-4 w-full ">
          <h2 className="text-5xl font-bold text-white mb-10">{movie.title}</h2>

          {/* Genres & Ratings Row */}
          <div className="flex justify-start items-center space-x-6">
            {/* Genres */}
            <div className="flex space-x-3">
              {movie.genres.map((genre) => (
                <span key={genre} className="px-6 py-2 bg-[#ffffff] text-black rounded-full text-base font-medium">
                  {genre}
                </span>
              ))}
            </div>

            {/* Movie Info (Release Date, Duration, IMDb Rating) */}
            <div className="flex space-x-6 text-gray-300 items-center">
              <span className="flex items-center">
                <Calendar className="w-5 h-5 text-white mr-2" /> {movie.year}
              </span>
              <span className="flex items-center">
                <Clock className="w-5 h-5 text-white mr-2" /> {movie.duration}
              </span>
              <span className="flex items-center text-white ">
                <Star className="w-5 h-5 fill-white mr-1" /> {movie.rating}
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-300 max-w-2xl mt-10">{movie.description}</p>

          {/* Buttons (Aligned to Right & Bigger) */}
          <div className="absolute bottom-36 right-40 flex space-x-6">
            <button className="px-8 py-3 text-lg bg-primary text-white rounded-lg bg-[#B11123] hover:bg-[#390303] transition-colors">
              Mark as Watched
            </button>
            <button className="px-8 py-3 text-lg border-4 border-[#390303] text-white rounded-lg hover:bg-[#390303] hover:text-dark transition-colors">
              Add to Watchlist
            </button>
          </div>
        </div>
      </div>

      {/* Carousel Navigation Dots */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {featuredMovies.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentMovie(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentMovie === index ? 'bg-primary w-6' : 'bg-gray-400 hover:bg-gray-300'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
