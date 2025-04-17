import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Shows.css';

const ShowList = () => {


    const [shows, setShows] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        title: '',
        genre: '',
        maxPrice: ''

    });

    useEffect(() => {
        fetchShows().then(() => {});
    }, []);

    const fetchShows = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/shows');
            // setShows(response.data.shows);
            console.log('Updated shows:', response);
            setShows(response?.data?.shows || [])
            setLoading(false);
        } catch (error) {
            console.error('Error fetching shows:', error);
            setLoading(false);
        }
    };

    const handleFilterChange = e => {
        const { name, value } = e.target;
        setFilters({
            ...filters,
            [name]: value
        });
    };

    const applyFilters = async e => {
        e.preventDefault();
        setLoading(true);

        try {
            let url = 'http://localhost:8080/api/shows';

            if (filters.title) {
                url = `http://localhost:8080/api/shows/search?title=${filters.title}`;
            } else if (filters.genre) {
                url = `http://localhost:8080/api/shows/genre/${filters.genre}`;
            } else if (filters.maxPrice) {
                url = `http://localhost:8080/api/shows/price?maxPrice=${filters.maxPrice}`;
            }

            const response = await axios.get(url);
            setShows(response.data);
        } catch (error) {
            console.error('Error applying filters:', error);
        } finally {
            setLoading(false);
        }
    };

    const clearFilters = () => {
        setFilters({
            title: '',
            genre: '',
            maxPrice: ''
        });
        fetchShows().then(r =>{} );
    };
    // If data is loading
    if (loading) {
        return <p>Loading...</p>;
    }

    // If there's an error
    if (error) {
        return <p>{error}</p>;
    }

    //console.log("shows =", shows, "type =", typeof shows, "Array?", Array.isArray(shows));
    return (
        <div className="shows-page">
            <h1>Available Shows</h1>

            <div className="filters-section">
                <h2>Filter Shows</h2>
                <form onSubmit={applyFilters} className="filters-form">
                    <div className="form-group">
                        <label htmlFor="title">Show Title</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={filters.title}
                            onChange={handleFilterChange}
                            className="form-control"
                            placeholder="Search by title"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="genre">Genre</label>
                        <select
                            id="genre"
                            name="genre"
                            value={filters.genre}
                            onChange={handleFilterChange}
                            className="form-control"
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
                        <label htmlFor="maxPrice">Maximum Price</label>
                        <input
                            type="number"
                            id="maxPrice"
                            name="maxPrice"
                            value={filters.maxPrice}
                            onChange={handleFilterChange}
                            className="form-control"
                            min="0"
                            placeholder="Max price"
                        />
                    </div>
                    <div className="filter-buttons">
                        <button type="submit" className="btn">Apply Filters</button>
                        <button type="button" className="btn btn-secondary" onClick={clearFilters}>
                            Clear Filters
                        </button>
                    </div>
                </form>
            </div>

            {loading ? (
                <div className="loading">Loading shows...</div>
            ) : shows.length > 0 ? (
                <div className="shows-grid">
                    {shows.map(show => (
                        <div key={show.id} className="show-card">
                            <div className="show-image">
                                <img src={show.imageUrl || '/placeholder-show.jpg'} alt={show.title} />
                            </div>
                            <div className="show-info">
                                <h3>{show.title}</h3>
                                <p className="show-genre">{show.genre}</p>
                                <p className="show-date">
                                    {new Date(show.date).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                                <p className="show-price">€{show.price.toFixed(2)}</p>
                                <Link to={`/shows/${show.id}`} className="btn show-btn">View Details</Link>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="no-shows">No shows found matching your criteria.</div>
            )}
        </div>
    );
};

export default ShowList;