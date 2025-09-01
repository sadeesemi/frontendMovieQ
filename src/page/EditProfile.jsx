import { useState, useEffect } from "react";
import { FaCheck, FaEye, FaEyeSlash } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import axios from "axios";
import Cookies from "js-cookie"; // ✅ For reading cookie-based token

const EditProfile = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    gender: "",
    dateOfBirth: "",
    email: "",
    password: "", // optional reset
  });
  const [showPassword, setShowPassword] = useState(false);

  const token = Cookies.get("token"); // ✅ Get token from cookie

  useEffect(() => {
    if (!token) {
      console.error("No token found in cookies.");
      return;
    }

    axios
      .get("https://localhost:7119/api/user/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const { fullName, gender, dateOfBirth, email } = res.data;
        setFormData((prev) => ({
          ...prev,
          fullName,
          gender,
          dateOfBirth: dateOfBirth?.slice(0, 10) || "", // Format to yyyy-mm-dd
          email,
        }));
      })
      .catch((err) => {
        console.error("Error loading profile:", err);
        alert("Unauthorized or failed to load profile.");
      });
  }, [token]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .put("https://localhost:7119/api/user/profile", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        alert("Profile updated successfully!");
      })
      .catch((err) => {
        console.error("Update failed:", err);
        alert("Failed to update profile.");
      });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-black">
      <div className="bg-white p-12 rounded-2xl shadow-lg w-full max-w-lg">
        <h2 className="text-center text-2xl font-bold mb-6 text-black">EDIT PROFILE</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Full Name */}
          <div>
            <label className="block text-gray-600">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-black"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-gray-600">Gender:</label>
            <div className="flex items-center gap-4">
              {["Male", "Female"].map((g) => (
                <label key={g} className="flex items-center text-black">
                  <input
                    type="radio"
                    name="gender"
                    value={g}
                    checked={formData.gender === g}
                    onChange={handleChange}
                    className="mr-2 accent-red-600"
                  />
                  {g.charAt(0).toUpperCase() + g.slice(1)}
                </label>
              ))}
            </div>
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-gray-600">Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-black"
            />
          </div>

          {/* Email (read-only) */}
          <div>
            <label className="block text-gray-600">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              readOnly
              className="w-full px-3 py-2 border rounded-lg text-gray-500 bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* Password (optional) */}
          <div>
            <label className="block text-gray-600">Reset Password (optional)</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Leave empty if not changing"
                className="w-full px-3 py-2 border rounded-lg pr-10 focus:outline-none focus:ring-2 focus:ring-red-500 text-black"
              />
              {formData.password ? (
                <FaCheck className="absolute right-10 top-2 text-green-500" />
              ) : (
                <MdClose className="absolute right-10 top-3 text-red-500" />
              )}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2 text-gray-600"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
