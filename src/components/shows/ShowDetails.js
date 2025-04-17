import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../../contexts/UserContext';
import './Shows.css';

const ShowDetails = () => {
    const { id } = useParams();
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    const [show, setShow] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchShow = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/shows/${id}`);
                setShow(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching show details:', error);
                setError('Failed to load show details. Please try again later.');
                setLoading(false);
            }
        };

        fetchShow();
    }, [id]);

    const handleReservationClick = () => {
        if (!user) {
            if (window.confirm('You need to be logged in to make a reservation. Would you like to log in now?')) {
                navigate('/login');
            }
        } else {
            navigate(`/reservation/${id}`);
        }
    };

    if (loading) {
        return <div className="loading">Loading show details...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    if (!show) {
        return <div className="error-message">Show not found.</div>;
    }

    const showDate = new Date(show.date);
    const formattedDate = showDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const formattedTime = showDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });

    return (
        <div className="show-details-page">
            <div className="show-details-container">
                <div className="show-details-image">
                    <img src={show.imageUrl || '/placeholder-show.jpg'} alt={show.title} />
                </div>
                <div className="show-details-info">
                    <h1>{show.title}</h1>
                    <div className="show-meta">
                        <span className="show-genre">{show.genre}</span>
                        <span className="show-duration">{show.duration} min</span>
                        <span className="show-price">€{show.price.toFixed(2)}</span>
                    </div>

                    <div className="show-date-time">
                        <p><strong>Date:</strong> {formattedDate}</p>
                        <p><strong>Time:</strong> {formattedTime}</p>
                    </div>

                    <div className="show-description">
                        <h3>About the Show</h3>
                        <p>{show.description || 'No description available.'}</p>
                    </div>

                    <div className="show-actions">
                        <button onClick={handleReservationClick} className="btn">
                            Reserve Seats
                        </button>
                        <Link to="/shows" className="btn btn-secondary">
                            Back to Shows
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShowDetails;