import React from 'react';
import { Link } from 'react-router-dom';
import Headroom from 'react-headroom';

export function Header2() {
  return (
    <Headroom> {/* Sticky header */}
      <nav className="bg-gray-800 p-4 w-full z-50">
        <div className="container mx-auto flex items-center">
          {/* MovieQuest Logo */}
          <div className="flex items-center space-x-8">
            <h1 className="text-2xl font-bold">
              <span className="text-black border-2 border-[#B11123] bg-[#B11123] text-white px-2 py-1">Movie</span>
              <span className="text-[#B11123] pl-2">Quest</span>
            </h1>
          </div>
        </div>
      </nav>
    </Headroom>
  );
}
