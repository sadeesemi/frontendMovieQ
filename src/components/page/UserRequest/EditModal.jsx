import React, { useState, useEffect, useRef } from 'react';
import { X, Camera, Trash2, Upload } from 'lucide-react';
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'https://localhost:7119';

const EditModal = ({ isOpen, onClose, movie, onSave, token }) => {
  const [formData, setFormData] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [posterPreview, setPosterPreview] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const availableGenres = [
    'Action', 'Adventure', 'Mystery', 'Romance', 'Historical',
    'Comedy', 'Horror', 'Drama', 'Thriller', 'Sci-Fi', 'Fantasy'
  ];

  // Build full image URL
  const buildImageUrl = (imgPath) => {
    if (!imgPath) return '';
    if (imgPath.startsWith('http://') || imgPath.startsWith('https://')) return imgPath;
    const trimmed = imgPath.replace(/^\//, '');
    return `${API_BASE.replace(/\/$/, "")}/${trimmed}`;
  };

  // Populate formData when movie changes
  useEffect(() => {
    if (!movie) return;

    setFormData({
      title: movie.movieTitle || movie.title || '',
      genres: Array.isArray(movie.genres)
        ? movie.genres
        : movie.genres
          ? movie.genres.split(',').map(g => g.trim())
          : [],
      year: movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : '',
      duration: movie.duration || '',
      rating: movie.rating || '',
      description: movie.description || '',
      country: movie.country || 'Other',
      language: movie.language || 'Other',
      production: movie.director || movie.production || '',
      cast: movie.castMembers || movie.cast || ''
    });

    setPosterPreview(buildImageUrl(movie.image || movie.poster));
    setSelectedImage(null);
  }, [movie]);

  if (!isOpen || !formData) return null;

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const payload = new FormData();
    payload.append('MovieTitle', formData.title || '');
    payload.append('Language', formData.language || '');
    payload.append('Duration', formData.duration || '');
    payload.append('Genres', Array.isArray(formData.genres) ? formData.genres.join(',') : '');

    if (formData.year) {
      payload.append('ReleaseDate', `${formData.year}-01-01T00:00:00Z`);
    } else {
      payload.append('ReleaseDate', '');
    }

    payload.append('Description', formData.description || '');
    payload.append('Country', formData.country || '');
    payload.append('Director', formData.production || '');
    payload.append('CastMembers', formData.cast || '');
    if (selectedImage instanceof File) {
      payload.append('Image', selectedImage);
    }

    await axios.put(`${API_BASE}/api/request/${movie.requestID}`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // 🔥 tell parent to refresh
    if (onSave) await onSave();

    onClose();
  } catch (err) {
    console.error('Failed to save edits:', err);
    alert('Failed to save changes. Check console for details.');
  }
};



  // Genre handlers
  const handleGenreToggle = (genre) => {
    if (formData.genres.includes(genre)) {
      setFormData({ ...formData, genres: formData.genres.filter(g => g !== genre) });
    } else {
      setFormData({ ...formData, genres: [...formData.genres, genre] });
    }
  };

  const handleRemoveGenre = (genre) => {
    setFormData({ ...formData, genres: formData.genres.filter(g => g !== genre) });
  };

  // Image handlers
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      alert('File too large (max 10MB).');
      return;
    }
    setSelectedImage(file);
    setPosterPreview(URL.createObjectURL(file));
  };

  const triggerFileInput = (e) => {
    e?.preventDefault();
    fileInputRef.current?.click();
  };

  const removeImage = (e) => {
    e?.preventDefault();
    setSelectedImage(null);
    setPosterPreview('');
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      handleFileSelect({ target: { files: e.dataTransfer.files } });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">← Back</button>
            <h2 className="text-xl font-bold text-white">Edit Movie</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 flex flex-col lg:flex-row gap-6">
            {/* Poster */}
            <div className="lg:w-1/3">
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
              {posterPreview ? (
                <div className="relative group">
                  <img src={posterPreview} alt="Poster" className="rounded-lg shadow-lg w-full" />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition flex items-center justify-center rounded-lg">
                    <div className="opacity-0 group-hover:opacity-100 flex space-x-3">
                      <button onClick={triggerFileInput} className="bg-blue-600 p-2 rounded-full">
                        <Camera className="w-5 h-5 text-white" />
                      </button>
                      <button onClick={removeImage} className="bg-red-600 p-2 rounded-full">
                        <Trash2 className="w-5 h-5 text-white" />
                      </button>
                    </div>
                  </div>
                  <button onClick={triggerFileInput} className="mt-4 w-full bg-blue-600 text-white py-2 rounded">
                    <Upload className="inline-block mr-2 w-4 h-4" /> Replace Image
                  </button>
                </div>
              ) : (
                <div
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={triggerFileInput}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${dragActive ? 'border-blue-500 bg-blue-500 bg-opacity-10' : 'border-gray-600 hover:border-gray-500'}`}
                >
                  <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                  <p className="mt-2 text-white">Upload poster (PNG/JPG, &lt;10MB)</p>
                </div>
              )}
            </div>

            {/* Form Fields */}
            <div className="lg:w-2/3 space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Genres */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Genres</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.genres.map((genre) => (
                    <span key={genre} className="bg-red-600 text-white px-3 py-1 rounded-full text-sm flex items-center space-x-2">
                      <span>{genre}</span>
                      <button type="button" onClick={() => handleRemoveGenre(genre)} className="text-white hover:text-gray-300">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {availableGenres.map((genre) => (
                      <label key={genre} className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.genres.includes(genre)}
                          onChange={() => handleGenreToggle(genre)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span className="text-gray-300">{genre}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Year, Duration, Rating */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Year</label>
                  <input
                    type="number"
                    value={formData.year || ''}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value ? parseInt(e.target.value) : '' })}
                    className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Duration</label>
                  <input
                    type="text"
                    value={formData.duration || ''}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="2h 32min"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Rating</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={formData.rating || ''}
                    onChange={(e) => setFormData({ ...formData, rating: e.target.value ? parseFloat(e.target.value) : '' })}
                    className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea
                  rows={5}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  required
                />
              </div>

              {/* Country & Language */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Country</label>
                  <select
                    value={formData.country || ''}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="India">India</option>
                    <option value="South Korea">South Korea</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Language</label>
                  <select
                    value={formData.language || ''}
                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                    className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="English">English</option>
                    <option value="Korean">Korean</option>
                    <option value="Tamil">Tamil</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Production */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Production</label>
                <input
                  type="text"
                  value={formData.production || ''}
                  onChange={(e) => setFormData({ ...formData, production: e.target.value })}
                  className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Cast */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Cast</label>
                <textarea
                  rows={3}
                  value={formData.cast || ''}
                  onChange={(e) => setFormData({ ...formData, cast: e.target.value })}
                  className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Actor names separated by commas"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-between p-6 border-t border-gray-700">
            <button type="button" onClick={onClose} className="px-6 py-2 text-gray-300 hover:text-white transition-colors">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center space-x-2 transition-colors">
              <span>💾 Save</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;
