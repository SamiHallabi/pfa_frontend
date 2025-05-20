
import React, { useState, useEffect, useContext } from 'react';
import { Navigate, Link } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../../contexts/UserContext';
import './Profile.css';

const UserProfile = () => {
    const { user, updateUser } = useContext(UserContext);
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [userForm, setUserForm] = useState({
        fullName: '',
        email: ''
    });

    useEffect(() => {
        if (!user) return;

        // Initialize form with current user data
        setUserForm({
            fullName: user.fullName || '',
            email: user.email || ''
        });

        // Fetch user's reservations
        const fetchReservations = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/reservations/user/${user.id}`);
                console.log('Updated reservations samii:', response);
                setReservations(response?.data  || []);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching reservations:', error);
                setError('Failed to load your reservations.');
                setLoading(false);
            }
        };

        fetchReservations();
    }, [user]);

    if (!user) {
        return <Navigate to="/login" />;
    }

    const handleInputChange = (e) => {
        setUserForm({
            ...userForm,
            [e.target.name]: e.target.value
        });
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            const updatedUser = { ...user, ...userForm };
            const response = await axios.put(`http://localhost:8080/api/users/${user.id}`, updatedUser);
            updateUser(response.data);
            setEditMode(false);
        } catch (error) {
            console.error('Error updating profile:', error);
            setError('Failed to update profile.');
        }
    };

    const handleCancelReservation = async (reservationCode) => {
        if (window.confirm('Are you sure you want to cancel this reservation?')) {
            try {
                await axios.post(`http://localhost:8080/api/reservations/cancel/${reservationCode}`);

                // Remove the cancelled reservation from state
                setReservations(reservations.filter(res => res.reservationCode !== reservationCode));
            } catch (error) {
                console.error('Error cancelling reservation:', error);
                alert('Failed to cancel reservation. It may be too late to cancel (less than 24h before the show).');
            }
        }
    };

    const downloadInvoice = (reservationCode) => {
        window.location.href = `http://localhost:8080/api/reservations/invoice/${reservationCode}`;
    };

    return (
        <div className="profile-page">
            <div className="profile-container">
                <h1>My Profile</h1>

                {error && <div className="alert alert-danger">{error}</div>}

                <div className="profile-section">
                    <h2>Personal Information</h2>
                    {editMode ? (
                        <form onSubmit={handleUpdateProfile} className="profile-form">
                            <div className="form-group">
                                <label htmlFor="fullName">Full Name</label>
                                <input
                                    type="text"
                                    id="fullName"
                                    name="fullName"
                                    value={userForm?.fullName}
                                    onChange={handleInputChange}
                                    className="form-control"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={userForm?.email}
                                    onChange={handleInputChange}
                                    className="form-control"
                                    required
                                />
                            </div>
                            <div className="profile-actions">
                                <button type="submit" className="btn">Save Changes</button>
                                <button type="button" className="btn btn-secondary" onClick={() => setEditMode(false)}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="profile-info">
                            <div className="info-group">
                                <p className="info-label">Username:</p>
                                <p className="info-value">{user?.username}</p>
                            </div>
                            <div className="info-group">
                                <p className="info-label">Full Name:</p>
                                <p className="info-value">{user?.fullName}</p>
                            </div>
                            <div className="info-group">
                                <p className="info-label">Email:</p>
                                <p className="info-value">{user?.email}</p>
                            </div>
                            <div className="info-group">
                                <p className="info-label">Account Type:</p>
                                <p className="info-value">{user?.role}</p>
                            </div>
                            <button onClick={() => setEditMode(true)} className="btn">
                                Edit Profile
                            </button>
                        </div>
                    )}
                </div>

                <div className="profile-section">
                    <h2>My Reservations</h2>
                    {loading ? (
                        <p>Loading your reservations...</p>
                    ) : reservations?.length > 0 ? (
                        <div className="reservations-list">
                            {reservations?.map(reservation => {
                                const showDate = new Date(reservation?.show?.date);
                                const canCancel = showDate?.getTime() > Date.now() + (24 * 60 * 60 * 1000); // 24h before show
                                console.log(showDate);
                                return (
                                    <div key={reservation?.id} className="reservation-item">
                                        <div className="reservation-header">
                                            <h3>{reservation?.show?.title}</h3>
                                            <span className="reservation-code">Code: {reservation?.reservationCode}</span>
                                        </div>
                                        <div className="reservation-details">
                                            <p>

                                                <strong>Date & Time:</strong> {showDate.toLocaleDateString('en-US', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                            </p>
                                            <p>
                                                <strong>Seats:</strong> {reservation?.seats?.map(seat =>
                                                `Row ${seat?.rowNumber}, Seat ${seat?.seatNumber}`
                                            ).join('; ')}
                                            </p>
                                            <p><strong>Total Price:</strong> €{reservation?.totalPrice?.toFixed(2)}</p>
                                        </div>
                                        <div className="reservation-actions">
                                            <button onClick={() => downloadInvoice(reservation?.reservationCode)} className="btn">
                                                Download Invoice
                                            </button>
                                            {canCancel && (
                                                <button
                                                    onClick={() => handleCancelReservation(reservation?.reservationCode)}
                                                    className="btn btn-secondary"
                                                >
                                                    Cancel Reservation
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p>You don't have any reservations yet. <Link to="/shows">Browse shows</Link> to make a reservation.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserProfile;