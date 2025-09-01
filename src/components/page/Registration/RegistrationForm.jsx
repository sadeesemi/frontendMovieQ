import React, { useState, useEffect } from "react";
import { FaTimes, FaCheck, FaEye, FaEyeSlash } from "react-icons/fa";

export function RegistrationForm({ initialData, onComplete }) {
  const [formData, setFormData] = useState({
    fullName: "",
    dateOfBirth: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "Male"
  });

  // When initialData changes (or when component mounts), update formData.
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName) newErrors.fullName = "Full name is required";
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onComplete(formData);
    }
  };

  return (
    <div className="bg-white rounded-lg p-8 w-full shadow-md">
      <div className="flex justify-between items-center mb-6 mt-10 ml-40">
        <h2 className="text-2xl font-bold">REGISTER</h2>
        <span className="text-green-500 text-m">1 of 3</span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 ml-8 mb-10 pr-10 ">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            name="fullName"
            placeholder="Full name"
            className={`w-full p-3 border ${
              errors.fullName ? "border-red-500" : "border-gray-300"
            } rounded-md`}
            value={formData.fullName}
            onChange={handleInputChange}
          />
          {errors.fullName && (
            <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
          )}
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gender:
          </label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="gender"
                value="Male"
                checked={formData.gender === "Male"}
                onChange={handleInputChange}
                className="mr-2"
                aria-label="Male"
              />
              Male
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="gender"
                value="Female"
                checked={formData.gender === "Female"}
                onChange={handleInputChange}
                className="mr-2"
                aria-label="Female"
              />
              Female
            </label>
          </div>
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date Of Birth
          </label>
          <input
            type="date"
            name="dateOfBirth"
            className="w-full p-3 border border-gray-300 rounded-md"
            value={formData.dateOfBirth}
            onChange={handleInputChange}
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <div className="relative">
            <input
              type="email"
              name="email"
              className={`w-full p-3 border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } rounded-md`}
              value={formData.email}
              onChange={handleInputChange}
            />
            {formData.email && !errors.email && (
              <FaCheck className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" />
            )}
          </div>
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              className={`w-full p-3 border ${
                errors.password ? "border-red-500" : "border-gray-300"
              } rounded-md`}
              value={formData.password}
              onChange={handleInputChange}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {formData.password.length >= 8 && (
                <FaCheck className="text-green-500" />
              )}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">8+ characters</p>
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              className={`w-full p-3 border ${
                errors.confirmPassword ? "border-red-500" : "border-gray-300"
              } rounded-md`}
              value={formData.confirmPassword}
              onChange={handleInputChange}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {formData.password &&
                formData.password === formData.confirmPassword && (
                  <FaCheck className="text-green-500" />
                )}
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-gray-400"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-red-600 text-white py-3 rounded-md hover:bg-red-700 transition-colors font-semibold "
        >
          Next
        </button>
      </form>
    </div>
  );
}
