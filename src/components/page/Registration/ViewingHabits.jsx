import React, { useState, useEffect } from "react";

const watchingHabits = [
  "I watch movies daily",
  "A few times a week",
  "Occasionally on weekends",
];

export function ViewingHabits({ initialData, onComplete, onBack }) {
  const [formData, setFormData] = useState({
    watchingHabits: "",
    rewatchPreference: false,
    latestReleases: false,
    familyWatching: false,
    termsAccepted: false,
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData); // Restore previous data when navigating back
    }
  }, [initialData]);

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.watchingHabits)
      newErrors.watchingHabits = "Please select your watching habits";
    if (!formData.termsAccepted)
      newErrors.termsAccepted = "You must accept the terms and conditions";

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
    <div className="bg-white rounded-lg p-12 w-full">
      <div className="flex justify-between items-center mb-8 mt-12 ml-32">
        <div>
          <h2 className="text-3xl font-bold">VIEWING HABITS</h2>
          <span className="text-green-500 text-lg ml-16">3 of 3</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label className="block text-lg font-medium mb-4">
            How often do you watch movies?
          </label>
          <div className="space-y-3">
            {watchingHabits.map((habit) => (
              <label key={habit} className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="watchingHabits"
                  value={habit}
                  checked={formData.watchingHabits === habit}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      watchingHabits: e.target.value,
                    }))
                  }
                  className="text-red-500 focus:ring-red-500"
                />
                <span className="text-lg">{habit}</span>
              </label>
            ))}
          </div>
          {errors.watchingHabits && (
            <p className="text-red-500 text-sm mt-2">{errors.watchingHabits}</p>
          )}
        </div>

        <div className="space-y-4">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={formData.rewatchPreference}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  rewatchPreference: e.target.checked,
                }))
              }
              className="rounded text-red-500 focus:ring-red-500"
            />
            <span className="text-lg">
              Do you enjoy rewatching your favorite movies?
            </span>
          </label>


          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={formData.familyWatching}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  familyWatching: e.target.checked,
                }))
              }
              className="rounded text-red-500 focus:ring-red-500"
            />
            <span className="text-lg">
              Do you enjoy watching movies with family?
            </span>
          </label>
        </div>

        <div className="pt-6 border-t border-gray-300">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={formData.termsAccepted}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  termsAccepted: e.target.checked,
                }))
              }
              className="rounded text-red-500 focus:ring-red-500"
            />
            <span className="text-lg">
              I agree to the{" "}
              <a href="#" className="text-red-500 hover:text-red-400">
                Terms & Conditions
              </a>{" "}
              and{" "}
              <a href="#" className="text-red-500 hover:text-red-400">
                Privacy Policy
              </a>
            </span>
          </label>
          {errors.termsAccepted && (
            <p className="text-red-500 text-sm mt-2">{errors.termsAccepted}</p>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-6 pb-8 pt-4">
          <button
            type="button"
            onClick={() => onBack(formData)}
            className="w-1/2 bg-gray-200 text-gray-800 py-4 rounded-md hover:bg-gray-300 transition-colors text-lg font-semibold"
          >
            Back
          </button>
          <button
            type="submit"
            className="w-1/2 bg-red-600 text-white py-4 rounded-md hover:bg-red-700 transition-colors text-lg font-semibold"
          >
            Complete Registration
          </button>
        </div>
      </form>
    </div>
  );
}
