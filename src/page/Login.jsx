import React, { useState } from 'react';
import { Header2 } from '../layouts/Header2';
import { Footer } from '../layouts/Footer';
import TheJungleBookImage from '../Images/Registerpic/TheJungleBook.jpeg';
import Image1 from '../Images/Registerpic/image1.jpg';
import { FaEye, FaEyeSlash, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import {jwtDecode } from 'jwt-decode';
import axios from 'axios';

function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  // Set cookie
  const setCookie = (name, value, days) => {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { username: '', password: '' };

    if (!formData.username) {
      newErrors.username = 'Email is required';
      valid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      valid = false;
    }

    setErrors(newErrors);

    if (valid) {
      handleLogin();
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        'https://localhost:7119/api/auth/login',
        {
          email: formData.username,
          password: formData.password,
        },
        { withCredentials: true }
      );

      const data = response.data;

      // Save access token and refresh token
      setCookie('token', data.accessToken, 7);
      localStorage.setItem('refreshToken', data.refreshToken);

      // Save role and email
      setCookie('role', data.role, 7);
      setCookie('email', data.email, 7);

      // Decode JWT for user claims
      const decoded = jwtDecode(data.accessToken);

      const userId =
        decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] ||
        decoded.nameid ||
        decoded.sub ||
        '';

      const email =
        decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] ||
        decoded.Email ||
        decoded.email ||
        '';

      const role =
        decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
        decoded.Role ||
        decoded.role ||
        '';

      const gender = decoded['Gender'] || decoded.gender || '';
      const fullName = decoded.FullName || decoded.fullname || decoded.fullName || '';
      const DateOfBirth = decoded.DateOfBirth || decoded.dateOfBirth || '';

      // Store in localStorage
      localStorage.setItem('userId', userId);
      localStorage.setItem('email', email);
      localStorage.setItem('role', role);
      localStorage.setItem('fullName', fullName);
      localStorage.setItem('dob', DateOfBirth);
      localStorage.setItem('gender', gender);

      navigate('/');
      window.location.reload();
    } catch (error) {
      console.error('Login error:', error);
      const msg =
        error.response?.data?.message || 'An error occurred during login. Please try again.';
      alert(msg);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(${TheJungleBookImage})` }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>

      <Header2 />

      <section className="flex flex-grow items-center justify-center py-16 relative z-10">
        <div className="flex w-3/4 h-[80vh] shadow-2xl rounded-lg overflow-hidden relative">
          <div
            className="w-1/2 relative bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${Image1})` }}
          >
            <img
              src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg"
              className="absolute inset-0 m-auto w-2/3 h-auto"
              alt="Illustration"
            />
          </div>

          <div className="w-1/2 flex flex-col items-center justify-start p-10 bg-green-50 relative">
            <button
              className="absolute top-4 right-4 text-black"
              onClick={() => window.history.back()}
            >
              <FaTimes size={20} />
            </button>

            <h2 className="text-4xl font-bold text-gray-800 lg:text-5xl mt-4">Welcome back!</h2>
            <p className="mt-4 text-xl text-gray-600 text-center">
              Enter your credentials below to access your account.
            </p>

            <div className="mt-12 w-3/4">
              <label className="block text-lg font-medium text-gray-700 mb-1">Email</label>
              <input
                type="text"
                name="username"
                placeholder="Email"
                className={`w-full px-4 py-3 border ${
                  errors.username ? 'border-red-500' : 'border-gray-300'
                } rounded-full focus:outline-none focus:ring-2 focus:ring-red-700`}
                value={formData.username}
                onChange={handleInputChange}
              />
              {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
            </div>

            <div className="mt-6 w-3/4">
              <label className="block text-lg font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Password"
                  className={`w-full px-4 py-3 border ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  } rounded-full focus:outline-none focus:ring-2 focus:ring-red-700`}
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            <button
              className="mt-8 w-3/4 px-6 py-3 bg-red-600 rounded-full hover:bg-red-700 flex items-center justify-center text-white transition"
              onClick={validateForm}
            >
              Login
            </button>

            <p className="mt-8 text-xl text-gray-600">
              Don't have an account?{' '}
              <a
                href="/register"
                className="text-green-600 font-semibold text-2xl hover:text-red-700"
              >
                Sign Up
              </a>
            </p>
          </div>
        </div>
      </section>

      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
}

export default Login;
