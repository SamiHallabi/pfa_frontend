
import React from 'react';
import { Link } from 'react-router-dom';

import { createRoot } from 'react-dom/client';
import App from "./App";

const root = createRoot(document.getElementById('root'));
root.render(<App />);

const Index = () => {
    return (
        <div className="min-h-screen bg-gray-100">
            <div className="container mx-auto px-4 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Theater Reservations</h1>
                    <p className="text-xl text-gray-600 mb-8">Book your seats for the best performances in town</p>
                    <div className="flex justify-center">
                        <Link to="/shows" className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                            Browse Shows
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="text-3xl font-bold text-blue-600 mb-4">1</div>
                        <h2 className="text-xl font-semibold mb-2">Browse Shows</h2>
                        <p className="text-gray-600">Explore our selection of performances and choose the one you want to attend.</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="text-3xl font-bold text-blue-600 mb-4">2</div>
                        <h2 className="text-xl font-semibold mb-2">Select Seats</h2>
                        <p className="text-gray-600">Choose your preferred seats from our interactive seating plan.</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="text-3xl font-bold text-blue-600 mb-4">3</div>
                        <h2 className="text-xl font-semibold mb-2">Confirm Booking</h2>
                        <p className="text-gray-600">Complete the reservation process and receive your booking confirmation.</p>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-4">Upcoming Performances</h2>
                    <p className="text-gray-600 mb-4">Check out our featured shows and secure your tickets today!</p>
                    <div className="flex justify-center">
                        <Link to="/shows" className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                            View All Shows
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Index;