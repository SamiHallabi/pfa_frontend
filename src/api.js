import axios from 'axios';

const API_URL = "http://localhost:8080/api/users"; // Your backend URL

// Axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    }
});

// Register User
export const registerUser = (userData) => {
    return api.post('/register', userData);
};

// Login User
export const loginUser = (credentials) => {
    return api.post('/login', credentials);
};

// Fetch all users
export const getAllUsers = () => {
    return api.get('/');
};

export default api;
