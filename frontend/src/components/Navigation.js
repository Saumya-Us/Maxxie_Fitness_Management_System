import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/navigation.css';

function Navigation() {
    const navigate = useNavigate();
    const isAdmin = localStorage.getItem('isAdmin') === 'true';

    const handleAdminClick = () => {
        if (isAdmin) {
            navigate('/admin/appointments');
        } else {
            navigate('/admin/login');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('isAdmin');
        navigate('/');
    };

    return (
        <nav className="navigation">
            <div className="nav-container">
                <Link to="/" className="nav-logo">
                    FitLife
                </Link>
                <div className="nav-links">
                    <Link to="/" className="nav-link">Home</Link>
                    <Link to="/my-appointments" className="nav-link">My Sessions</Link>
                    <Link to="/book-appointment" className="nav-link">Book Session</Link>
                    <button 
                        onClick={handleAdminClick} 
                        className="nav-link admin-link"
                    >
                        {isAdmin ? 'Admin Panel' : 'Admin Login'}
                    </button>
                    {isAdmin && (
                        <button 
                            onClick={handleLogout} 
                            className="nav-link logout-link"
                        >
                            Logout
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navigation; 