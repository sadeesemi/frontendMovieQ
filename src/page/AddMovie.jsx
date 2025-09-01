import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  X,
  Plus,
  Star,
  Upload,
  Camera,
  Trash2,
  Eye
} from 'lucide-react';
import axios from 'axios';
import MoviePreviewModal from '../components/page/AddMovie/MoviePreviewModal';

const AddMovie = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const [movieData, setMovieData] = useState({
    title: '',
    posterImage: null,
    posterPreview: '',
    genres: [],
    year: '',
    duration: '',
    rating: '',
    description: '',
    country: '',
    language: '',
    production: '',
    cast: ''
  });

  const [newGenre, setNewGenre] = useState('');
  const [selectedGenres, setSelectedGenres] = useState([]);

  const availableGenres = [
    'Action', 'Comedy', 'Adventure', 'Horror', 'Mystery',
    'Drama', 'Romance', 'Thriller', 'Historical'
  ];

  const handleInputChange = (field, value) => {
    setMovieData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setMovieData(prev => ({
          ...prev,
          posterImage: file,
          posterPreview: e.target?.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) handleImageUpload(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleImageUpload(file);
  };

  const removeImage = () => {
    setMovieData(prev => ({ ...prev, posterImage: null, posterPreview: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  const handleGenreToggle = (genre) => {
    setSelectedGenres(prev =>
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
  };

  const addCustomGenre = () => {
    const gen = newGenre.trim();
    if (gen && !selectedGenres.includes(gen)) {
      setSelectedGenres(prev => [...prev, gen]);
      setNewGenre('');
    }
  };

  const removeGenre = (genre) => {
    setSelectedGenres(prev => prev.filter(g => g !== genre));
  };

  const handleSave = async () => {
    if (!movieData.title.trim()) {
      alert('Please enter a movie title');
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append('Title', movieData.title);
    formData.append('Duration', movieData.duration);
    formData.append('Language', movieData.language);
    formData.append('Year', movieData.year);
    formData.append('Rating', movieData.rating);
    formData.append('Description', movieData.description);
    formData.append('Country', movieData.country);
    formData.append('Production', movieData.production);
    formData.append('Cast', movieData.cast);
    if (movieData.posterImage) {
      formData.append('PosterImage', movieData.posterImage);
    }
    selectedGenres.forEach((genre, index) => {
      formData.append(`Genres[${index}]`, genre);
    });

    try {
      const response = await axios.post(
        'https://localhost:7119/api/Movies', 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      console.log('Movie added:', response.data);
      navigate('/');
    } catch (error) {
      console.error('Error adding movie:', error);
      alert('Failed to add movie');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setMovieData({
      title: '',
      posterImage: null,
      posterPreview: '',
      genres: [],
      year: '',
      duration: '',
      rating: '',
      description: '',
      country: '',
      language: '',
      production: '',
      cast: ''
    });
    setSelectedGenres([]);
    setNewGenre('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handlePreview = () => setShowPreview(true);

  return (
    <div className="container mx-auto px-6 py-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Link
          to="/"
          className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </Link>
        <h1 className="text-3xl font-bold">Add New Movie</h1>
      </div>

      {/* Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Poster Uploader */}
        <div className="lg:col-span-1">
          <div className="bg-slate-800 rounded-lg p-6">
            <label className="block text-sm font-medium mb-4">Movie Poster</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />

            {movieData.posterPreview ? (
              <div className="relative group">
                <img
                  src={movieData.posterPreview}
                  alt="Poster Preview"
                  className="w-full rounded-lg shadow-lg transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-opacity flex items-center justify-center rounded-lg">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-3">
                    <button
                      onClick={triggerFileInput}
                      className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full"
                      title="Replace"
                    >
                      <Camera className="w-5 h-5" />
                    </button>
                    <button
                      onClick={removeImage}
                      className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full"
                      title="Remove"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="mt-4">
                  <button
                    onClick={triggerFileInput}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg flex items-center justify-center space-x-2"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload New Image</span>
                  </button>
                </div>
              </div>
            ) : (
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={triggerFileInput}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  dragActive
                    ? 'border-blue-500 bg-blue-500 bg-opacity-10'
                    : 'border-slate-600 hover:border-slate-500'
                }`}
              >
                <div className="flex flex-col items-center space-y-4">
                  <div className="bg-slate-700 p-4 rounded-full">
                    <Upload className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-white font-medium mb-1">
                    Upload movie poster
                  </p>
                  <p className="text-slate-400 text-sm">
                    Drag and drop or click to browse
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Details Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title Input */}
          <div className="bg-slate-800 p-6 rounded-lg">
            <label className="block text-sm font-medium mb-2">Title *</label>
            <input
              type="text"
              value={movieData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Movie Title"
              className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Genres */}
          <div className="bg-slate-800 p-6 rounded-lg">
            <label className="block text-sm font-medium mb-4">Genres</label>
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedGenres.length ? (
                selectedGenres.map(g => (
                  <span key={g} className="bg-red-600 text-white px-3 py-1 rounded-full flex items-center space-x-1 text-sm">
                    <span>{g}</span>
                    <button onClick={() => removeGenre(g)}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))
              ) : (
                <p className="text-slate-400 text-sm">No genres selected</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {availableGenres.map(g => (
                <label key={g} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedGenres.includes(g)}
                    onChange={() => handleGenreToggle(g)}
                    className="w-4 h-4 text-red-600 bg-slate-700 border-slate-600 rounded"
                  />
                  <span className="text-sm">{g}</span>
                </label>
              ))}
            </div>
         
          </div>

          {/* Other Details */}
          <div className="bg-slate-800 p-6 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Year</label>
                <input
                  type="text"
                  value={movieData.year}
                  onChange={(e) => handleInputChange('year', e.target.value)}
                  placeholder="e.g., 2024"
                  className="w-full bg-slate-700 px-3 py-2 rounded-lg border border-slate-600 text-white focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Duration</label>
                <input
                  type="text"
                  value={movieData.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                  placeholder="e.g., 2h 30min"
                  className="w-full bg-slate-700 px-3 py-2 rounded-lg border border-slate-600 text-white focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Rating</label>
                <div className="relative">
                  <input
                    type="text"
                    value={movieData.rating}
                    onChange={(e) => handleInputChange('rating', e.target.value)}
                    placeholder="e.g., 8.5"
                    className="w-full bg-slate-700 px-3 py-2 rounded-lg border border-slate-600 text-white pr-8 focus:ring-2 focus:ring-red-500"
                  />
                  <Star className="absolute right-3 top-1/2 w-4 h-4 text-yellow-500 -translate-y-1/2" />
                </div>
              </div>
            </div>
          </div>

          {/* Description + Extra */}
          <div className="space-y-6">
            <div className="bg-slate-800 p-6 rounded-lg">
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                rows={4}
                value={movieData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Movie synopsis..."
                className="w-full bg-slate-700 px-4 py-3 rounded-lg border border-slate-600 text-white focus:ring-2 focus:ring-red-500 resize-none"
              />
            </div>
            <div className="bg-slate-800 p-6 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Language</label>
                  <select
                    value={movieData.language}
                    onChange={(e) => handleInputChange('language', e.target.value)}
                    className="w-full bg-slate-700 px-3 py-2 rounded-lg border border-slate-600 text-white focus:ring-2 focus:ring-red-500"
                  >
                    <option value="">Select</option>
                    <option>English</option>
                    <option>Korean</option><option>Tamil</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Country</label>
                  <select
                    value={movieData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    className="w-full bg-slate-700 px-3 py-2 rounded-lg border border-slate-600 text-white focus:ring-2 focus:ring-red-500"
                  >
                     <option value="">Select Country</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="India">India</option>
                    <option value="South Korea">South Korea</option>

                  </select>
                </div>
              </div>
            </div>
            <div className="bg-slate-800 p-6 rounded-lg">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Production</label>
                  <input
                    type="text"
                    value={movieData.production}
                    onChange={(e) => handleInputChange('production', e.target.value)}
                    placeholder="Production or director"
                    className="w-full bg-slate-700 px-4 py-2 rounded-lg border border-slate-600 text-white focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Cast</label>
                  <textarea
                    rows={2}
                    value={movieData.cast}
                    onChange={(e) => handleInputChange('cast', e.target.value)}
                    placeholder="Main cast..."
                    className="w-full bg-slate-700 px-4 py-3 rounded-lg border border-slate-600 text-white focus:ring-2 focus:ring-red-500 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-between pt-6">
              <div className="flex gap-4">
                <button
                  onClick={handlePreview}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center space-x-2"
                >
                  <Eye className="w-4 h-4" />
                  <span>Preview</span>
                </button>
                <button
                  onClick={resetForm}
                  className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg"
                >
                  Reset
                </button>
              </div>
              <div className="flex gap-4">
                <Link
                  to="/"
                  className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg"
                >
                  Cancel
                </Link>
                <button
                  onClick={handleSave}
                  disabled={isLoading || !movieData.title.trim()}
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:opacity-50 text-white rounded-lg flex items-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Adding...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Add Movie</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      <MoviePreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        movieData={{
          ...movieData,
          genres: selectedGenres
        }}
      />
    </div>
  );
};

export default AddMovie;
