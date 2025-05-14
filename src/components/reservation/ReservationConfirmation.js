
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './Reservation.css';

const ReservationConfirmation = () => {
    const { reservationCode } = useParams();

    const [reservation, setReservation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReservation = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/reservations/code/${reservationCode}`);
                setReservation(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching reservation details:', error);
                setError('Failed to load reservation details. Please check your reservation code.');
                setLoading(false);
            }
        };

        fetchReservation();
    }, [reservationCode]);

    const downloadInvoice = () => {
        window.location.href = `http://localhost:8080/api/reservations/invoice/${reservationCode}`;
    };

    if (loading) {
        return <div className="loading">Loading reservation details...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    if (!reservation) {
        return <div className="error-message">Reservation not found.</div>;
    }
console.log("reservation ",reservation);
    return (
        <div className="confirmation-page">
            <div className="confirmation-container">
                <div className="confirmation-header">
                    <div className="success-icon">✓</div>
                    <h1>Reservation Confirmed!</h1>
                    <p>Thank you for your reservation. Your booking is now confirmed.</p>
                </div>

                <div className="confirmation-details">
                    <h2>Reservation Details</h2>
                    <div className="detail-group">
                        <p className="detail-label">Reservation Code:</p>
                        <p className="detail-value">{reservation.reservationCode}</p>
                    </div>
                    <div className="detail-group">
                        <p className="detail-label">Show:</p>
                        <p className="detail-value">{reservation?.show?.title}</p>
                    </div>
                    <div className="detail-group">
                        <p className="detail-label">Date & Time:</p>
                        <p className="detail-value">
                            {new Date(reservation?.show?.date).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </p>
                    </div>
                    <div className="detail-group">
                        <p className="detail-label">Number of Seats:</p>
                        <p className="detail-value">{reservation?.seats?.length}</p>
                    </div>
                    <div className="detail-group">
                        <p className="detail-label">Seats:</p>
                        <p className="detail-value">
                            {reservation?.seats?.map(seat => `Row ${seat.rowNumber}, Seat ${seat.seatNumber}`).join('; ')}
                        </p>
                    </div>
                    <div className="detail-group">
                        <p className="detail-label">Total Price:</p>
                        <p className="detail-value">€{reservation?.totalPrice?.toFixed(2)}</p>
                    </div>
                </div>

                <div className="confirmation-actions">
                    <button onClick={downloadInvoice} className="btn">
                        Download Invoice
                    </button>
                    <Link to="/profile" className="btn btn-secondary">
                        View All Reservations
                    </Link>
                </div>

                <div className="confirmation-footer">
                    <p>
                        A confirmation email has been sent to {reservation?.user?.email}.
                    </p>
                    <p>
                        You can cancel this reservation up to 24 hours before the show.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ReservationConfirmation;