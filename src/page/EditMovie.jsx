import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Save, X, Plus, Upload, Camera, Trash2
} from 'lucide-react';

const API_BASE = process.env.REACT_APP_API_URL || 'https://localhost:7119';

export default function EditMovie() {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const baseGenres = [
    'Action', 'Comedy', 'Adventure', 'Horror', 'Mystery',
    'Drama', 'Romance', 'Thriller', 'Historical'
  ];

  const [movieData, setMovieData] = useState(null);
  const [availableGenres, setAvailableGenres] = useState(baseGenres);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [newGenre, setNewGenre] = useState('');
  const [dragActive, setDragActive] = useState(false);

  // raw File object when user selects a new file
  const [selectedFile, setSelectedFile] = useState(null);

  // helper to normalize image paths returned by backend
  const normalizeImage = (imgPath) => {
    if (!imgPath) return '';
    if (/^https?:\/\//i.test(imgPath)) return imgPath;
    if (imgPath.startsWith('/')) return `${API_BASE}${imgPath}`;
    return `${API_BASE}/${imgPath}`;
  };

  useEffect(() => {
    if (!movieId) return;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/Movies/${movieId}`);
        if (!res.ok) throw new Error(`Failed to load movie (status ${res.status})`);
        const data = await res.json();

        // castMembers might be array or comma-separated string depending on backend
        const castString = Array.isArray(data.castMembers)
          ? data.castMembers.join(', ')
          : (typeof data.castMembers === 'string' ? data.castMembers : '');

        const genresArr = Array.isArray(data.genres) ? data.genres.map(g => g.trim()) : [];

        setMovieData({
          title: data.title || '',
          duration: data.duration || '',
          description: data.description || '',
          country: data.country || '',
          language: data.language || '',
          production: data.director || data.production || '',
          cast: castString,
          rating: data.ratings != null ? String(data.ratings) : '',
          year: data.releaseDate ? new Date(data.releaseDate).getFullYear().toString() : (data.year || ''),
          image: data.image || '',
          posterPreview: normalizeImage(data.image)
        });

        setSelectedGenres(genresArr);
        setAvailableGenres(Array.from(new Set([...baseGenres, ...genresArr])));
      } catch (err) {
        console.error(err);
        alert('Could not load movie. Redirecting.');
        navigate('/');
      }
    })();
  }, [movieId, navigate]);

  // flexible change handler supporting event or (name, value)
  const handleInputChange = (eOrName, maybeValue) => {
    if (!movieData) return;
    if (typeof eOrName === 'string') {
      setMovieData(prev => ({ ...prev, [eOrName]: maybeValue }));
    } else {
      const e = eOrName;
      const { name, value } = e.target;
      setMovieData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleGenreToggle = (genre) => {
    setSelectedGenres(prev => prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]);
  };

  const addCustomGenre = () => {
    const g = newGenre.trim();
    if (!g) return;
    if (!availableGenres.includes(g)) setAvailableGenres(prev => [...prev, g]);
    if (!selectedGenres.includes(g)) setSelectedGenres(prev => [...prev, g]);
    setNewGenre('');
  };

  const removeGenre = (genre) => setSelectedGenres(prev => prev.filter(g => g !== genre));

  const handleFileSelect = (e) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      alert('File too large (max 10MB).');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setMovieData(prev => ({
        ...prev,
        posterPreview: reader.result,
        image: '' // clear backend URL when user picks a local File
      }));
    };
    reader.readAsDataURL(file);
    setSelectedFile(file);
  };

  const triggerFileInput = (e) => {
    e && e.preventDefault();
    fileInputRef.current && fileInputRef.current.click();
  };

  const removeImage = (e) => {
    e && e.preventDefault();
    setSelectedFile(null);
    setMovieData(prev => ({ ...prev, posterPreview: '', image: '' }));
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect({ target: { files: e.dataTransfer.files }});
    }
  };

  const handleCancel = () => navigate(`/movie/${movieId}`);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!movieData) return;

    // basic validation
    if (!movieData.title.trim()) {
      alert('Title is required');
      return;
    }

    const form = new FormData();
    form.append('Title', movieData.title || '');
    form.append('Duration', movieData.duration || '');
    form.append('Description', movieData.description || '');
    form.append('Country', movieData.country || '');
    form.append('Language', movieData.language || '');
    form.append('Production', movieData.production || '');
    form.append('Cast', movieData.cast || '');
    form.append('Rating', movieData.rating || '');
    form.append('Year', movieData.year || '');
    // append genres as repeated fields
    selectedGenres.forEach(g => form.append('Genres', g));

    // append file only when user selected a new file
    if (selectedFile) {
      form.append('PosterImage', selectedFile);
    }

    try {
      const res = await fetch(`${API_BASE}/api/Movies/${movieId}`, {
        method: 'PUT',
        body: form
      });
      if (!res.ok) {
        const text = await res.text().catch(() => null);
        throw new Error(`Update failed: ${res.status} ${text || ''}`);
      }
      alert('Saved successfully!');
      navigate(`/movie/${movieId}`);
    } catch (err) {
      console.error(err);
      alert('Update failed. See console for details.');
    }
  };

  if (!movieData) return null;

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="flex justify-between mb-8">
        <button onClick={handleCancel} className="flex items-center text-gray-400 hover:text-white">
          <ArrowLeft className="w-5 h-5 mr-2" /> Back
        </button>
        <h2 className="text-3xl font-bold text-white">Edit Movie</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Poster Upload */}
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileSelect}
            />
            {movieData.posterPreview ? (
              <div className="relative group">
                <img
                  src={movieData.posterPreview}
                  alt="Poster"
                  className="rounded-lg shadow-lg w-full"
                />
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

          {/* Meta fields */}
          <div className="lg:col-span-2 space-y-6">
            <Field label="Title" name="title" value={movieData.title} onChange={handleInputChange} required />

            {/* Genre selector */}
            <div className="bg-gray-800 p-4 rounded-lg">
              <label className="block mb-2 text-sm text-gray-300">Genres</label>
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedGenres.map(g => (
                  <span key={g} className="bg-red-600 text-white px-3 py-1 rounded-full flex items-center">
                    {g}
                    <button onClick={() => removeGenre(g)} className="ml-2">
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3 max-h-40 overflow-y-auto mb-4">
                {availableGenres.map(g => (
                  <label key={g} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedGenres.includes(g)}
                      onChange={() => handleGenreToggle(g)}
                      className="form-checkbox text-blue-600"
                    />
                    <span className="text-sm text-white">{g}</span>
                  </label>
                ))}
              </div>
          
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Field label="Year" name="year" value={movieData.year} onChange={handleInputChange} required />
              <Field label="Duration" name="duration" value={movieData.duration} onChange={handleInputChange} required />
          
            </div>

            <textarea
              name="description"
              value={movieData.description}
              onChange={handleInputChange}
              rows={8}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
              placeholder="Enter movie description..."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Country</label>
                <select
                  name="country"
                  value={movieData.country}
                  onChange={handleInputChange}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                   <option value="">Select Country</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="India">India</option>
                    <option value="South Korea">South Korea</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Language</label>
                <select
                  name="language"
                  value={movieData.language}
                  onChange={handleInputChange}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="">Select Language</option>
                  <option value="English">English</option>
                  <option value="Korean">Korean</option>
                  <option value="Tamil">Tamil</option>
                </select>
              </div>
            </div>

            <Field label="Production" name="production" value={movieData.production} onChange={handleInputChange} />
            <Textarea label="Cast " name="cast" value={movieData.cast} onChange={handleInputChange} rows={3} />

            <div className="flex justify-end space-x-4 border-t pt-6 border-gray-700">
              <button type="button" onClick={handleCancel} className="text-gray-400 hover:text-white px-6 py-2">Cancel</button>
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded flex items-center space-x-2">
                <Save className="w-5 h-5" /><span>Save</span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

// Helper components
function Field({ label, name, type = 'text', value, onChange, ...rest }) {
  return (
    <div>
      <label className="block text-sm text-gray-300 mb-2">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full bg-gray-700 text-white px-4 py-2 rounded"
        {...rest}
      />
    </div>
  );
}

function Textarea({ label, name, value, onChange, rows = 3 }) {
  return (
    <div>
      <label className="block text-sm text-gray-300 mb-2">{label}</label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows={rows}
        className="w-full bg-gray-700 text-white px-4 py-2 rounded resize-none"
      />
    </div>
  );
}
