import React from 'react';
import { Instagram, Facebook, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-800 py-12 mt-32">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          <div className="flex space-x-6">
            <a href="#" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">Terms of Service</a>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-300 hover:text-white transition-colors">
              <Instagram className="w-6 h-6" />
            </a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">
              <Facebook className="w-6 h-6" />
            </a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">
              <Twitter className="w-6 h-6" />
            </a>
          </div>
          <div className="text-gray-300">© 2024 MovieQuest</div>
        </div>
      </div>
    </footer>
  );
}
