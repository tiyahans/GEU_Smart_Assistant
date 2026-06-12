import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5001"
});

// Request interceptor to automatically attach JWT tokens
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle expired or invalid JWT tokens (401 errors)
API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // If the server returns a 401 Unauthorized (expired or invalid token)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      
      // Force reload and redirect to login
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default API;