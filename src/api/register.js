// src/api/register.js

export async function registerUser(userData) {
  try {
    const response = await fetch('https://localhost:7119/api/Auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      const message = errorData.message || 'Registration failed';
      throw new Error(message);
    }

    return await response.json();
  } catch (error) {
    console.error('Registration API Error:', error);
    throw error;
  }
}
