
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { UserContext } from '../../contexts/UserContext';
import './Reservation.css';

const SeatSelection = () => {
    const { showId } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(UserContext);

    const [show, setShow] = useState(null);
    const [seats, setSeats] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stompClient, setStompClient] = useState(null);

    useEffect(() => {
        // Redirect if not logged in
        if (!user) {
            navigate('/login');
            return;
        }

        // Fetch show details and seats
        fetchShowAndSeats();

        // Set up WebSocket connection for real-time updates
        const socket = new SockJS('http://localhost:8080/theater-websocket');
        const client = new Client({
            webSocketFactory: () => socket,
            onConnect: () => {
                console.log('WebSocket connection established');

                // Subscribe to seat updates for this show
                client.subscribe(`/topic/seats/${showId}`, (message) => {
                    const seatUpdate = JSON.parse(message.body);
                    updateSeatStatus(seatUpdate.seatId, seatUpdate.available);
                });
            },
            onStompError: (frame) => {
                console.error('WebSocket error:', frame);
            }
        });

        client.activate();
        setStompClient(client);

        // Clean up WebSocket connection on unmount
        return () => {
            if (client) {
                client.deactivate();
            }
        };
    }, [showId, user, navigate]);

    const fetchShowAndSeats = async () => {
        try {
            // Fetch show details
            const showResponse = await axios.get(`http://localhost:8080/api/shows/${showId}`);
            setShow(showResponse.data);

            // Fetch seats for the show
            const seatsResponse = await axios.get(`http://localhost:8080/api/seats/show/${showId}`);
            setSeats(seatsResponse.data);

            setLoading(false);
        } catch (error) {
            console.error('Error fetching show or seats:', error);
            setError('Failed to load seat information. Please try again later.');
            setLoading(false);
        }
    };

    const updateSeatStatus = (seatId, available) => {
        setSeats(seats.map(seat =>
            seat.id === seatId ? { ...seat, available } : seat
        ));
    };

    const handleSeatClick = (seat) => {
        if (!seat.available) {
            return; // Can't select an unavailable seat
        }

        const isSelected = selectedSeats.some(selectedSeat => selectedSeat.id === seat.id);

        if (isSelected) {
            setSelectedSeats(selectedSeats.filter(selectedSeat => selectedSeat.id !== seat.id));
        } else {
            setSelectedSeats([...selectedSeats, seat]);
        }
    };

    const handleReservation = async () => {
        if (selectedSeats.length === 0) {
            alert('Please select at least one seat.');
            return;
        }

        try {
            const seatIds = selectedSeats.map(seat => seat.id);

            // Create reservation
            const response = await axios.post('http://localhost:8080/api/reservations', {
                userId: user.id,
                showId: showId,
                seatIds: seatIds
            });

            // Notify other clients about seat updates via WebSocket
            if (stompClient && stompClient.connected) {
                seatIds.forEach(seatId => {
                    stompClient.publish({
                        destination: `/app/seat-update/${showId}`,
                        body: JSON.stringify({ seatId, available: false })
                    });
                });
            }

            // Navigate to confirmation page
            navigate(`/confirmation/${response.data.reservationCode}`);
        } catch (error) {
            console.error('Error creating reservation:', error);
            alert('Failed to create reservation. Please try again.');
        }
        // try {
        //     const seatIds = selectedSeats.map(seat => seat.id);
        //     const response = await axios.post('http://localhost:8080/api/reservations', {
        //         userId: user.id,
        //         showId: showId,
        //         seatIds: seatIds
        //     });
        //
        //     console.log("Reservation successful:", response.data);
        //     // Optionally show success message to user
        //
        // } catch (error) {
        //     console.error("Error creating reservation:", error);
        //
        //     // Check if backend sent a message
        //     const errorMessage = error.response?.data?.message
        //         || error.response?.data
        //         || "An unknown error occurred.";
        //
        //     alert("Reservation failed: " + errorMessage);
        // }

    };

    if (loading) {
        return <div className="loading">Loading seat information...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    if (!show) {
        return <div className="error-message">Show not found.</div>;
    }

    // Group seats by row for easier rendering
    const seatsByRow = seats.reduce((rows, seat) => {
        if (!rows[seat.rowNumber]) {
            rows[seat.rowNumber] = [];
        }
        rows[seat.rowNumber].push(seat);
        return rows;
    }, {});

    const totalPrice = show.price * selectedSeats.length;

    return (
        <div className="seat-selection-page">
            <h1>Select Your Seats</h1>
            <div className="show-info-banner">
                <h2>{show.title}</h2>
                <p className="show-datetime">
                    {new Date(show.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </p>
            </div>

            <div className="seat-selection-container">
                <div className="seat-map">
                    <div className="screen">Screen</div>

                    <div className="seats-container">
                        {Object.keys(seatsByRow).sort((a, b) => a - b).map(rowNumber => (
                            <div key={rowNumber} className="seat-row">
                                <div className="row-number">{rowNumber}</div>
                                {seatsByRow[rowNumber].sort((a, b) => a.seatNumber - b.seatNumber).map(seat => (
                                    <div
                                        key={seat.id}
                                        className={`seat ${!seat.available ? 'unavailable' : ''} ${
                                            selectedSeats.some(s => s.id === seat.id) ? 'selected' : ''
                                        }`}
                                        onClick={() => handleSeatClick(seat)}
                                    >
                                        {seat.seatNumber}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>

                    <div className="seat-legend">
                        <div className="legend-item">
                            <div className="seat-sample available"></div>
                            <span>Available</span>
                        </div>
                        <div className="legend-item">
                            <div className="seat-sample selected"></div>
                            <span>Selected</span>
                        </div>
                        <div className="legend-item">
                            <div className="seat-sample unavailable"></div>
                            <span>Unavailable</span>
                        </div>
                    </div>
                </div>

                <div className="reservation-summary">
                    <h3>Reservation Summary</h3>
                    {selectedSeats.length > 0 ? (
                        <>
                            <div className="selected-seats-list">
                                <h4>Selected Seats:</h4>
                                <ul>
                                    {selectedSeats.map(seat => (
                                        <li key={seat.id}>Row {seat.rowNumber}, Seat {seat.seatNumber}</li>
                                    ))}
                                </ul>
                            </div>
                            <div className="price-summary">
                                <p><strong>Price per seat:</strong> €{show.price.toFixed(2)}</p>
                                <p><strong>Number of seats:</strong> {selectedSeats.length}</p>
                                <p className="total-price"><strong>Total price:</strong> €{totalPrice.toFixed(2)}</p>
                            </div>
                            <button onClick={handleReservation} className="btn">
                                Confirm Reservation
                            </button>
                        </>
                    ) : (
                        <p>Please select at least one seat to continue.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SeatSelection;