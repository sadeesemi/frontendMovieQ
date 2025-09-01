import React from 'react';
import { RegistrationFlow } from '../components/page/Registration/RegistrationFlow';
import { Header2 } from '../layouts/Header2'; // Adjust the path as necessary
import { Footer } from '../layouts/Footer'; // Adjust the path as necessary
import TheJungleBookImage from '../Images/Registerpic/TheJungleBook.jpeg'; // Import image

function Register() {
  return (
    <div className="min-h-screen bg-black relative">
      {/* Background Image with 50% Visibility */}
      <div 
        className="absolute top-0 left-0 w-full h-full bg-cover bg-center opacity-50"
        style={{ backgroundImage: `url(${TheJungleBookImage})` }} // Use imported image here
      ></div>

      {/* Header */}
      <Header2 />

      {/* Main Form Section */}
      <main className="relative z-10 flex justify-center items-center px-4 py-8 pt-32"> 
        {/* pt-32 gives padding top to ensure the form doesn't overlap with the header */}
        <div className="w-full max-w-xl">
          <RegistrationFlow />
        </div>
      </main>

      {/* Footer */}
      <div className="relative z-20">
        <Footer />
      </div>
    </div>
  );
}

export default Register;
