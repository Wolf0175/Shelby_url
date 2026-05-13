// src/services/api.js
const BASE_URL = 'https://shelby-url-backend2.onrender.com/api';

// --- URL Service ---
export const urlService = {
  async shortenUrl(longUrl) {
    const token = localStorage.getItem('jwt_token');
    const headers = { 'Content-Type': 'application/json' };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${BASE_URL}/url/shorten`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({ url: longUrl })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.title || data.message || 'Failed to shorten URL.');
    return data;
  },

  async getMyLinks() {
    const token = localStorage.getItem('jwt_token');
    if (!token) throw new Error('You must be logged in to view your links.');

    const response = await fetch(`${BASE_URL}/url/my-links`, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      }
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch links.');
    return data;
  }
};

// --- User Service ---
export const userService = {
  async authenticate(endpoint, credentials) {
    try {
      const response = await fetch(`${BASE_URL}/user/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });

      let data;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        data = await response.json();
      } else {
        data = { message: await response.text() };
      }

      if (!response.ok) {
        // Handle ASP.NET Core Validation Errors beautifully
        if (data.errors) {
          const firstErrorKey = Object.keys(data.errors)[0];
          throw new Error(data.errors[firstErrorKey][0]);
        }
        throw new Error(data.message || 'Authentication failed. Please check your credentials.');
      }

      return data;
    } catch (error) {
      if (error.message.includes('Failed to fetch')) {
        throw new Error('Server is starting up (Cold Start). Please wait 30s and try again.');
      }
      throw error;
    }
  }
};