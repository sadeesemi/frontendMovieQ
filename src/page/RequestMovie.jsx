import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, X, Upload, Camera, Trash2 } from 'lucide-react';
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || "https://localhost:7119";

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

const RequestMovie = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [errors, setErrors] = useState({});
  const [movieData, setMovieData] = useState({
    title: '', posterImage: null, posterPreview: '',
    year: '', duration: '', description: '',
    country: '', language: '', production: '', cast: ''
  });
  const [selectedGenres, setSelectedGenres] = useState([]);

  const availableGenres = [
    'Action', 'Comedy', 'Adventure', 'Horror', 'Mystery',
    'Drama', 'Romance', 'Thriller', 'Historical'
  ];

  const handleInputChange = (field, value) => {
    setMovieData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: "" })); // clear error when typing
  };

  const handleImageUpload = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setMovieData(prev => ({ ...prev, posterImage: file, posterPreview: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) handleImageUpload(file);
  };

  const handleDrag = (e) => {
    e.preventDefault(); e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleDrop = (e) => {
    e.preventDefault(); e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleImageUpload(file);
  };

  const triggerFileInput = () => fileInputRef.current?.click();
  const removeImage = () => {
    setMovieData(prev => ({ ...prev, posterImage: null, posterPreview: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleGenreToggle = (genre) => {
    setSelectedGenres(prev =>
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
  };

  const removeGenre = (genre) => {
    setSelectedGenres(prev => prev.filter(g => g !== genre));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!movieData.title.trim()) newErrors.title = "Title is required";
    if (!movieData.year.trim() || !/^\d{4}$/.test(movieData.year)) {
      newErrors.year = "Valid year (YYYY) is required";
    }
    if (!movieData.duration.trim()) newErrors.duration = "Duration is required";
    if (!movieData.description.trim()) newErrors.description = "Description is required";
    if (!movieData.language.trim()) newErrors.language = "Language is required";
    if (!movieData.country.trim()) newErrors.country = "Country is required";
    if (selectedGenres.length === 0) newErrors.genres = "At least one genre is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("MovieTitle", movieData.title);
      formData.append("Language", movieData.language || "");
      formData.append("Duration", movieData.duration || "");
      formData.append("Genres", selectedGenres.join(","));
      formData.append("Description", movieData.description || "");
      formData.append("Country", movieData.country || "");
      formData.append("Director", movieData.production || "");
      formData.append("CastMembers", movieData.cast || "");
      formData.append("ReleaseDate", movieData.year ? `${movieData.year}-01-01` : new Date().toISOString());
      if (movieData.posterImage) {
        formData.append("Image", movieData.posterImage);
      }
      const token = getCookie("token");

      await axios.post(`${API_BASE}/api/request`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      alert("Movie request submitted!");
      navigate("/");
    } catch (error) {
      console.error("Failed to submit request:", error);
      alert("Failed to submit request.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-8 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <Link to="/" className="flex items-center space-x-2 text-slate-400 hover:text-white">
          <ArrowLeft className="w-5 h-5" /><span>Back</span>
        </Link>
        <h1 className="text-3xl font-bold">Request New Movie</h1>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Poster */}
        <div className="lg:col-span-1">
          <div className="bg-slate-800 rounded-lg p-6">
            <label className="block text-sm font-medium mb-4">Movie Poster</label>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
            {movieData.posterPreview ? (
              <div className="relative group">
                <img src={movieData.posterPreview} alt="Poster" className="w-full rounded-lg shadow-lg group-hover:scale-105 transition-transform"/>
                <div className="absolute inset-0 bg-black bg-opacity-60 flex-col items-center justify-center hidden group-hover:flex rounded-lg">
                  <button onClick={triggerFileInput} className="bg-blue-600 p-3 rounded-full m-1">
                    <Camera className="w-5 h-5 text-white"/>
                  </button>
                  <button onClick={removeImage} className="bg-red-600 p-3 rounded-full m-1">
                    <Trash2 className="w-5 h-5 text-white"/>
                  </button>
                </div>
              </div>
            ) : (
              <div onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag}
                onDrop={handleDrop} onClick={triggerFileInput}
                className={`border-2 border-dashed p-8 text-center cursor-pointer transition-colors ${dragActive ? 'border-blue-500 bg-blue-500 bg-opacity-10' : 'border-slate-600 hover:border-slate-500'}`}
              >
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-4"/>
                <p className="text-white font-medium">Upload movie poster</p>
                <p className="text-slate-400 text-sm">Drag & drop or click to select</p>
              </div>
            )}
          </div>
        </div>
        {/* Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title */}
          <div className="bg-slate-800 p-6 rounded-lg">
            <label className="block text-sm font-medium mb-2">Title *</label>
            <input type="text" value={movieData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Movie Title"
              className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg"
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>
          {/* Genres */}
          <div className="bg-slate-800 p-6 rounded-lg">
            <label className="block text-sm font-medium mb-4">Genres *</label>
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedGenres.length > 0 ? (
                selectedGenres.map(g => (
                  <span key={g} className="bg-red-600 text-white px-3 py-1 rounded-full flex items-center space-x-1 text-sm">
                    <span>{g}</span>
                    <button onClick={() => removeGenre(g)}><X className="w-3 h-3"/></button>
                  </span>
                ))
              ) : (
                <p className="text-slate-400 text-sm">No genres selected</p>
              )}
            </div>
            {errors.genres && <p className="text-red-500 text-sm">{errors.genres}</p>}
            <div className="grid grid-cols-2 gap-3">
              {availableGenres.map(g => (
                <label key={g} className="flex items-center space-x-2">
                  <input type="checkbox" checked={selectedGenres.includes(g)}
                    onChange={() => handleGenreToggle(g)}
                    className="w-4 h-4 text-red-600 bg-slate-700" />
                  <span className="text-sm">{g}</span>
                </label>
              ))}
            </div>
          </div>
          {/* Year & Duration */}
          <div className="bg-slate-800 p-6 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Year *</label>
                <input type="text" value={movieData.year}
                  onChange={(e) => handleInputChange('year', e.target.value)}
                  placeholder="e.g., 2024"
                  className="w-full bg-slate-700 text-white px-3 py-2 rounded-lg"
                />
                {errors.year && <p className="text-red-500 text-sm">{errors.year}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Duration *</label>
                <input type="text" value={movieData.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                  placeholder="e.g., 2h 30min"
                  className="w-full bg-slate-700 text-white px-3 py-2 rounded-lg"
                />
                {errors.duration && <p className="text-red-500 text-sm">{errors.duration}</p>}
              </div>
            </div>
          </div>
          {/* Description */}
          <div className="bg-slate-800 p-6 rounded-lg">
            <label className="block text-sm font-medium mb-2">Description *</label>
            <textarea rows={4} value={movieData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Movie synopsis..."
              className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg"
            />
            {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
          </div>
          {/* Language & Country */}
          <div className="bg-slate-800 p-6 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Language *</label>
                <select value={movieData.language}
                  onChange={(e) => handleInputChange('language', e.target.value)}
                  className="w-full bg-slate-700 text-white px-3 py-2 rounded-lg"
                >
                  <option value="">Select</option>
                  <option>English</option>
                  <option>Korean</option>
                  <option>Tamil</option>
                </select>
                {errors.language && <p className="text-red-500 text-sm">{errors.language}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Country *</label>
                <select value={movieData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  className="w-full bg-slate-700 text-white px-3 py-2 rounded-lg"
                >
                  <option value="">Select Country</option>
                  <option>United States</option>
                  <option>United Kingdom</option>
                  <option>India</option>
                </select>
                {errors.country && <p className="text-red-500 text-sm">{errors.country}</p>}
              </div>
            </div>
          </div>
          {/* Director & Cast */}
          <div className="bg-slate-800 p-6 rounded-lg">
            <label className="block text-sm font-medium mb-2">Director / Production</label>
            <input type="text" value={movieData.production}
              onChange={(e) => handleInputChange('production', e.target.value)}
              placeholder="Production or director"
              className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg"
            />
            <label className="block text-sm font-medium mb-2 mt-4">Cast</label>
            <textarea rows={2} value={movieData.cast}
              onChange={(e) => handleInputChange('cast', e.target.value)}
              placeholder="Main cast..."
              className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg"
            />
          </div>
          {/* Actions */}
          <div className="flex justify-between pt-6">
            <Link to="/" className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg">
              Cancel
            </Link>
            <button onClick={handleSave} disabled={isLoading}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:opacity-50 text-white rounded-lg flex items-center space-x-2">
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4"/>
                  <span>Request Movie</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestMovie;
