import React, { useRef, useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { ChevronRight, ChevronLeft } from "lucide-react";

const API_BASE = process.env.REACT_APP_API_URL || "https://localhost:7119";

// ✅ Helper to build correct image URLs
const buildImageUrl = (imgPath) => {
  if (!imgPath) return "/placeholder-movie.png";
  if (imgPath.startsWith("http://") || imgPath.startsWith("https://")) return imgPath;
  const trimmed = imgPath.replace(/^\//, "");
  return `${API_BASE.replace(/\/$/, "")}/${trimmed}`;
};

export function MovieSection({ title, movies }) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 350;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const checkScroll = () => {
      if (scrollRef.current) {
        setCanScrollLeft(scrollRef.current.scrollLeft > 0);
        setCanScrollRight(
          scrollRef.current.scrollLeft < scrollRef.current.scrollWidth - scrollRef.current.clientWidth
        );
      }
    };

    if (scrollRef.current) {
      checkScroll();
      scrollRef.current.addEventListener("scroll", checkScroll);
    }

    return () => {
      if (scrollRef.current) {
        scrollRef.current.removeEventListener("scroll", checkScroll);
      }
    };
  }, [movies]);

  return (
    <section className="bg-black py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-bold text-white">{title}</h3>
        </div>

        <div className="relative">
          {canScrollLeft && (
            <button
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-gray-800 p-3 rounded-full z-10 hover:bg-gray-700 transition"
              onClick={() => scroll("left")}
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
          )}

          <div
            ref={scrollRef}
            className="flex gap-16 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {movies.map((movie) => (
              <Link
                key={movie.id || movie.movieID}
                to={`/movie/${movie.id || movie.movieID}`}
                className="flex-none relative group"
              >
                <div className="w-48 h-72 relative rounded-lg overflow-hidden">
                  <img
                    src={buildImageUrl(movie.image)}
                    alt={movie.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "/placeholder-movie.png";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <h2 className="text-xl font-bold text-white">{movie.title}</h2>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {canScrollRight && (
            <button
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-gray-800 p-3 rounded-full z-10 hover:bg-gray-700 transition"
              onClick={() => scroll("right")}
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
