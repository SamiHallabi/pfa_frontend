
import React, { useState, useEffect, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../../contexts/UserContext';
import './Admin.css';

const AdminDashboard = () => {
    const { user } = useContext(UserContext);
    const [activeTab, setActiveTab] = useState('shows');
    const [shows, setShows] = useState([]);
    const [users, setUsers] = useState([]);
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [showForm, setShowForm] = useState({
        title: '',
        description: '',
        date: '',
        duration: '',
        genre: '',
        price: '',
        imageUrl: ''
    });

    const [selectedShow, setSelectedShow] = useState(null);
    const [seatSetup, setSeatSetup] = useState({
        rows: 10,
        seatsPerRow: 12
    });

    useEffect(() => {
        if (!user || user.role !== 'ADMIN') return;

        fetchShows();
        fetchUsers();
        fetchReservations();
    }, [user]);

    const fetchShows = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/shows');
            // setShows(response.data);
            setShows(response.data || [])
            console.log('Updated shows:', response.data);

            setLoading(false);
        } catch (error) {
            console.error('Error fetching shows:', error);
            setError('Failed to load shows.');
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const fetchReservations = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/reservations');
            setReservations(response.data);
        } catch (error) {
            console.error('Error fetching reservations:', error);
        }
    };

    const handleShowFormChange = (e) => {
        setShowForm({
            ...showForm,
            [e.target.name]: e.target.value
        });
    };

    const handleCreateShow = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/shows', showForm);
            setShows([...shows, response.data]);
            setSelectedShow(response.data);

            // Reset form
            setShowForm({
                title: '',
                description: '',
                date: '',
                duration: '',
                genre: '',
                price: '',
                imageUrl: ''
            });

            alert('Show created successfully! Now you can set up seats for this show.');
        } catch (error) {
            console.error('Error creating show:', error);
            alert('Failed to create show.');
        }
    };

    const handleSeatSetupChange = (e) => {
        setSeatSetup({
            ...seatSetup,
            [e.target.name]: parseInt(e.target.value)
        });
    };

    const handleCreateSeats = async (e) => {
        e.preventDefault();
        if (!selectedShow) {
            alert('Please select a show first.');
            return;
        }

        try {
            await axios.post(
                `http://localhost:8080/api/seats/create-for-show/${selectedShow.id}`,
                null,
                { params: { rows: seatSetup.rows, seatsPerRow: seatSetup.seatsPerRow } }
            );
            alert('Seats created successfully!');
        } catch (error) {
            console.error('Error creating seats:', error);
            alert('Failed to create seats.');
        }
    };

    const deleteShow = async (id) => {
        if (window.confirm('Are you sure you want to delete this show? This will also delete all associated reservations.')) {
            try {
                await axios.delete(`http://localhost:8080/api/shows/${id}`);
                setShows(shows?.filter(show => show.id !== id));

                if (selectedShow && selectedShow.id === id) {
                    setSelectedShow(null);
                }
            } catch (error) {
                console.error('Error deleting show:', error);
                alert('Failed to delete show.');
            }
        }
    };

    if (!user || user.role !== 'ADMIN') {
        return <Navigate to="/login" />;
    }

    return (
        <div className="admin-page">
            <h1>Admin Dashboard</h1>

            <div className="admin-tabs">
                <button
                    className={`tab-button ${activeTab === 'shows' ? 'active' : ''}`}
                    onClick={() => setActiveTab('shows')}
                >
                    Manage Shows
                </button>
                <button
                    className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
                    onClick={() => setActiveTab('users')}
                >
                    Users
                </button>
                <button
                    className={`tab-button ${activeTab === 'reservations' ? 'active' : ''}`}
                    onClick={() => setActiveTab('reservations')}
                >
                    Reservations
                </button>
            </div>

            {activeTab === 'shows' && (
                <div className="admin-content">
                    <div className="admin-section">
                        <h2>Create New Show</h2>
                        <form onSubmit={handleCreateShow} className="admin-form">
                            <div className="form-group">
                                <label htmlFor="title">Title</label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={showForm.title}
                                    onChange={handleShowFormChange}
                                    className="form-control"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="description">Description</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={showForm.description}
                                    onChange={handleShowFormChange}
                                    className="form-control"
                                    rows="4"
                                    required
                                ></textarea>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="date">Date & Time</label>
                                    <input
                                        type="datetime-local"
                                        id="date"
                                        name="date"
                                        value={showForm.date}
                                        onChange={handleShowFormChange}
                                        className="form-control"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="duration">Duration (minutes)</label>
                                    <input
                                        type="number"
                                        id="duration"
                                        name="duration"
                                        value={showForm.duration}
                                        onChange={handleShowFormChange}
                                        className="form-control"
                                        min="1"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="genre">Genre</label>
                                    <select
                                        id="genre"
                                        name="genre"
                                        value={showForm.genre}
                                        onChange={handleShowFormChange}
                                        className="form-control"
                                        required
                                    >
                                        <option value="">Select Genre</option>
                                        <option value="Comedy">Comedy</option>
                                        <option value="Drama">Drama</option>
                                        <option value="Musical">Musical</option>
                                        <option value="Tragedy">Tragedy</option>
                                        <option value="Opera">Opera</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="price">Price (€)</label>
                                    <input
                                        type="number"
                                        id="price"
                                        name="price"
                                        value={showForm.price}
                                        onChange={handleShowFormChange}
                                        className="form-control"
                                        min="0"
                                        step="0.01"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="imageUrl">Image URL</label>
                                <input
                                    type="url"
                                    id="imageUrl"
                                    name="imageUrl"
                                    value={showForm.imageUrl}
                                    onChange={handleShowFormChange}
                                    className="form-control"
                                    placeholder="https://example.com/image.jpg"
                                />
                            </div>
                            <button type="submit" className="btn">Create Show</button>
                        </form>
                    </div>

                    <div className="admin-section">
                        <h2>Set Up Seats for Show</h2>
                        <div className="form-group">
                            <label>Select Show</label>
                            <select
                                value={selectedShow ? selectedShow.id : ''}
                                onChange={(e) => {
                                    const showId = e.target.value;
                                    const show = shows?.find(s => s.id === parseInt(showId));
                                    setSelectedShow(show || null);
                                }}
                                className="form-control"
                            >
                                <option value="">Select a show</option>
                                {
                                    shows?.map(show => (
                                    <option key={show?.id} value={show?.id}>
                                        {show?.title} - {new Date(show?.date).toLocaleString()}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {selectedShow && (
                            <form onSubmit={handleCreateSeats} className="admin-form">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="rows">Number of Rows</label>
                                        <input
                                            type="number"
                                            id="rows"
                                            name="rows"
                                            value={seatSetup?.rows}
                                            onChange={handleSeatSetupChange}
                                            className="form-control"
                                            min="1"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="seatsPerRow">Seats per Row</label>
                                        <input
                                            type="number"
                                            id="seatsPerRow"
                                            name="seatsPerRow"
                                            value={seatSetup?.seatsPerRow}
                                            onChange={handleSeatSetupChange}
                                            className="form-control"
                                            min="1"
                                            required
                                        />
                                    </div>
                                </div>
                                <button type="submit" className="btn">Create Seats</button>
                            </form>
                        )}
                    </div>

                    <div className="admin-section">
                        <h2>Existing Shows</h2>

                        {loading ? (
                            <p>Loading shows...</p>
                        ) : shows?.length > 0 ? (

                            <div className="admin-table">
                                <table>
                                    <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Date & Time</th>
                                        <th>Genre</th>
                                        <th>Price</th>
                                        <th>Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {shows?.map(show => (
                                        <tr key={show?.id}>
                                            <td>{show?.title}</td>
                                            <td>{new Date(show?.date).toLocaleString()}</td>
                                            <td>{show?.genre}</td>
                                            <td>€{show?.price?.toFixed(2)}</td>
                                            <td>
                                                <button
                                                    onClick={() => setSelectedShow(show)}
                                                    className="btn-small"
                                                >
                                                    Set Up Seats
                                                </button>
                                                <button
                                                    onClick={() => deleteShow(show.id)}
                                                    className="btn-small btn-danger"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            console.log("shows sami =", shows, "type =", typeof shows, "Array?", Array.isArray(shows)),
                            <p>No shows available.</p>
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'users' && (
                <div className="admin-content">
                    <div className="admin-section">
                        <h2>User Management</h2>
                        {users?.length > 0 ? (
                            <div className="admin-table">
                                <table>
                                    <thead>
                                    <tr>
                                        <th>Username</th>
                                        <th>Full Name</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {users?.map(user => (
                                        <tr key={user?.id}>
                                            <td>{user?.username}</td>
                                            <td>{user?.fullName}</td>
                                            <td>{user?.email}</td>
                                            <td>{user?.role}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p>No users available.</p>
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'reservations' && (
                <div className="admin-content">
                    <div className="admin-section">
                        <h2>Reservation Management</h2>
                        {reservations?.length > 0 ? (
                            <div className="admin-table">
                                <table>
                                    <thead>
                                    <tr>
                                        <th>Code</th>
                                        <th>Show</th>
                                        <th>User</th>
                                        <th>Date</th>
                                        <th>Seats</th>
                                        <th>Total</th>
                                        <th>Status</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {reservations?.map(reservation => (
                                        <tr key={reservation?.id}>
                                            <td>{reservation?.reservationCode}</td>
                                            <td>{reservation?.show?.title}</td>
                                            <td>{reservation?.user?.fullName}</td>
                                            <td>{new Date(reservation?.reservationDate).toLocaleString()}</td>
                                            <td>{reservation?.seats?.length}</td>
                                            <td>€{reservation?.totalPrice?.toFixed(2)}</td>
                                            <td>{reservation?.confirmed ? 'Confirmed' : 'Pending'}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p>No reservations available.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;