
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Home.css';

const Home = () => {
    const [upComingShows, setUpComingShows] = useState([]);
    const [loading, setLoading] = useState(true); // ✅ Added loading state
    console.log("upcomingShows =", upComingShows);
    useEffect(() => {
        axios.get('http://localhost:8080/api/shows/upcoming')
            .then(response => {
                setUpComingShows(response.data); // Check data format here
                if (Array.isArray(response.data)) {
                    setUpComingShows(response.data); // Set shows only if it's an array
                } else {
                    console.error("API response is not an array:", response.data);
                }
                setLoading(false); // ✅ Set loading to false after data is fetched
                console.log('Response headers:', response.headers);
                console.log('Type of data:', typeof response.data);
                console.log('Raw data:', response.data);
            })
            .catch(error => {
                console.error("Error fetching upcoming shows:", error);
                setLoading(false); // ✅ Set loading to false on error
            });
    }, []);

    return (
        <div className="home-page">
            <div className="hero-section">
                <div className="hero-content">
                    <h1>Welcome to Theater Reservations</h1>
                    <p>Book your seats for the best performances in town</p>
                    <Link to="/shows" className="btn">View All Shows</Link>
                </div>
            </div>

            <section className="upcoming-shows">
                <div className="container">
                    <h2 className="section-title">Upcoming Shows</h2>
                    {loading ? (
                        <p>Loading upcoming shows...</p>
                    ) : upComingShows?.length > 0 ? (
                        <div className="grid grid-3">
                            {upComingShows?.map(show => (
                                console.log("show =", show),
                                <div key={show.id} className="show-card">
                                    <div className="show-image">
                                        <img src={show.imageUrl || '/placeholder-show.jpg'} alt={show.title} />
                                    </div>
                                    <div className="show-info">
                                        <h3>{show.title}</h3>
                                        <p className="show-date">
                                            {new Date(show.date).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                        <Link to={`/shows/${show.id}`} className="btn show-btn">View Details</Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No upcoming shows at the moment.</p>
                    )}
                </div>
            </section>

            <section className="how-it-works">
                <div className="container">
                    <h2 className="section-title">How It Works</h2>
                    <div className="grid grid-3">
                        <div className="step-card">
                            <div className="step-number">1</div>
                            <h3>Browse Shows</h3>
                            <p>Explore our selection of performances and choose the one you want to attend.</p>
                        </div>
                        <div className="step-card">
                            <div className="step-number">2</div>
                            <h3>Select Seats</h3>
                            <p>Choose your preferred seats from our interactive seating plan.</p>
                        </div>
                        <div className="step-card">
                            <div className="step-number">3</div>
                            <h3>Confirm Booking</h3>
                            <p>Complete the reservation process and receive your booking confirmation.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
