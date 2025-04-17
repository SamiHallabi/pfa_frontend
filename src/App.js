
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Home from './components/pages/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ShowList from './components/shows/ShowList';
import ShowDetails from './components/shows/ShowDetails';
import SeatSelection from './components/reservation/SeatSelection';
import ReservationConfirmation from './components/reservation/ReservationConfirmation';
import UserProfile from './components/profile/UserProfile';
import AdminDashboard from './components/admin/AdminDashboard';

import './App.css';
import {UserProvider} from "./contexts/UserContext";

function App() {
  return (

      <Router>
        <UserProvider>
          <div className="App">
            <Navbar />
            <div className="container">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/shows" element={<ShowList />} />
                <Route path="/shows/:id" element={<ShowDetails />} />
                <Route path="/reservation/:showId" element={<SeatSelection />} />
                <Route path="/confirmation/:reservationCode" element={<ReservationConfirmation />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/admin" element={<AdminDashboard />} />
              </Routes>
            </div>
          </div>
        </UserProvider>
      </Router>
  );
}

export default App;