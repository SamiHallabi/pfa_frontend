import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useContext(UserContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="navbar">
            <div className="container navbar-container">
                <Link to="/" className="navbar-brand">
                    <h1>Theater Reservations</h1>
                </Link>
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <Link to="/" className="nav-link">Home</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/shows" className="nav-link">Shows</Link>
                    </li>
                    {user ? (
                        <>
                            <li className="nav-item">
                                <Link to="/profile" className="nav-link">My Profile</Link>
                            </li>
                            {user.role === 'ADMIN' && (
                                <li className="nav-item">
                                    <Link to="/admin" className="nav-link">Admin</Link>
                                </li>
                            )}
                            <li className="nav-item">
                                <button onClick={handleLogout} className="nav-link btn-link">
                                    Logout
                                </button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li className="nav-item">
                                <Link to="/login" className="nav-link">Login</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/register" className="nav-link">Register</Link>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;