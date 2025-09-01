// src/components/page/Registration/RegistrationFlow.jsx
import React, { useState } from 'react';
import { registerUser } from '../../../api/register';
import { RegistrationForm } from './RegistrationForm';
import { MoviePreferences } from './MoviePreferences';
import { ViewingHabits } from './ViewingHabits';
import { SuccessModal } from './SuccessModal';

export function RegistrationFlow() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    registration: null,
    preferences: null,
    habits: null,
  });

  // Called when each step completes
  const handleStepComplete = async (stepData, stepKey) => {
    const updated = { ...formData, [stepKey]: stepData };
    setFormData(updated);

    if (stepKey === 'habits') {
      // Combine everything into one payload
      const payload = {
        fullName: updated.registration.fullName,
        gender: updated.registration.gender,
        dateOfBirth: updated.registration.dateOfBirth,
        preferredLanguages: updated.preferences.language,
        favoriteMovies: updated.preferences.favoriteMovies.join(', '),
        movieEraPreference: updated.preferences.era,
        movieWatchingFrequency: updated.habits.watchingHabits,
        enjoyRewatching: updated.habits.rewatchPreference,
        enjoyWatchingWithFamily: updated.habits.familyWatching,
        searchHistory: '',
        email: updated.registration.email,
        password: updated.registration.password,
      };

      try {
        await registerUser(payload);
        setShowSuccess(true);
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } catch (err) {
        alert('Registration failed: ' + err.message);
      }
    } else {
      setCurrentStep(s => s + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(s => s - 1);
  };

  return (
    <div className="w-full max-w-xl">
      {currentStep === 1 && (
        <RegistrationForm
          initialData={formData.registration}
          onComplete={data => handleStepComplete(data, 'registration')}
        />
      )}
      {currentStep === 2 && (
        <MoviePreferences
          initialData={formData.preferences}
          onComplete={data => handleStepComplete(data, 'preferences')}
          onBack={handleBack}
        />
      )}
      {currentStep === 3 && (
        <ViewingHabits
          initialData={formData.habits}
          onComplete={data => handleStepComplete(data, 'habits')}
          onBack={handleBack}
        />
      )}

      {showSuccess && <SuccessModal />}

      {/* Progress Indicator */}
      <div className="mt-6 flex justify-center gap-2">
        {[1, 2, 3].map(step => (
          <div
            key={step}
            className={`w-3 h-3 rounded-full ${
              step === currentStep
                ? 'bg-red-600'
                : step < currentStep
                ? 'bg-green-500'
                : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
