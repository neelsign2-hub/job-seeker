// API configuration utility
const getBaseURL = () => {
  const url = import.meta.env.VITE_BACKEND_HOST;
  
  if (!url) {
    console.warn('VITE_BACKEND_HOST environment variable is not set. Using default.');
    return 'http://localhost:5001';
  }
  
  return url;
};

export const BASE_URL = getBaseURL();

// Token management utilities
export const getToken = () => {
  return localStorage.getItem("TOKEN");
};

export const getUserEmail = () => {
  return localStorage.getItem("EMAIL");
};

export const getUserRole = () => {
  return localStorage.getItem("ROLE");
};

export const setUserData = (token, email, role) => {
  localStorage.setItem("TOKEN", token);
  localStorage.setItem("EMAIL", email);
  localStorage.setItem("ROLE", role);
};

export const clearUserData = () => {
  localStorage.removeItem("TOKEN");
  localStorage.removeItem("EMAIL");
  localStorage.removeItem("ROLE");
};

export const isAuthenticated = () => {
  return !!getToken();
};

// API Headers helper
export const getAuthHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};
