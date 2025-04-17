
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

// Create axios instance with base configuration
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Shows API
export const getShows = () => api.get('/shows');
export const getShowById = (id) => api.get(`/shows/${id}`);
export const getUpcomingShows = () => api.get('/shows/upcoming');
export const getShowsByGenre = (genre) => api.get(`/shows/genre/${genre}`);
export const searchShows = (title) => api.get(`/shows/search?title=${encodeURIComponent(title)}`);
export const createShow = (showData) => api.post('/shows', showData);
export const updateShow = (id, showData) => api.put(`/shows/${id}`, showData);
export const deleteShow = (id) => api.delete(`/shows/${id}`);

// Seats API
export const getSeatsForShow = (showId) => api.get(`/seats/show/${showId}`);
export const getAvailableSeatsForShow = (showId) => api.get(`/seats/show/${showId}/available`);
export const updateSeatAvailability = (seatId, available) =>
    api.put(`/seats/${seatId}/availability?available=${available}`);
export const createSeatsForShow = (showId, rows, seatsPerRow) =>
    api.post(`/seats/create-for-show/${showId}?rows=${rows}&seatsPerRow=${seatsPerRow}`);

// Reservations API
export const createReservation = (reservationData) => api.post('/reservations', reservationData);
export const getReservationByCode = (code) => api.get(`/reservations/code/${code}`);
export const getUserReservations = (userId) => api.get(`/reservations/user/${userId}`);
export const cancelReservation = (code) => api.post(`/reservations/cancel/${code}`);
export const generateInvoice = (code) => api.get(`/reservations/invoice/${code}`, { responseType: 'blob' });

// User API
export const registerUser = (userData) => api.post('/users/register', userData);
export const loginUser = (credentials) => api.post('/users/login', credentials);
export const getUserById = (id) => api.get(`/users/${id}`);
export const updateUser = (id, userData) => api.put(`/users/${id}`, userData);

export default {
    getShows,
    getShowById,
    getUpcomingShows,
    getShowsByGenre,
    searchShows,
    createShow,
    updateShow,
    deleteShow,
    getSeatsForShow,
    getAvailableSeatsForShow,
    updateSeatAvailability,
    createSeatsForShow,
    createReservation,
    getReservationByCode,
    getUserReservations,
    cancelReservation,
    generateInvoice,
    registerUser,
    loginUser,
    getUserById,
    updateUser
};