import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/session.css';

function ViewSessions() {
    const navigate = useNavigate();
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState({ message: '', type: '' });
    const [search, setSearch] = useState('');

    const handleGoBack = () => {
        navigate('/admin/appointments');
    };

    useEffect(() => {
        fetchSessions();
    }, []);

    const fetchSessions = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:5000/api/sessions');
            if (response.data.success) {
                setSessions(response.data.data);
                setLoading(false);
            } else {
                throw new Error(response.data.message || 'Failed to fetch sessions');
            }
        } catch (error) {
            console.error('Error fetching sessions:', error);
            setNotification({
                message: error.response?.data?.message || error.message || 'Error fetching sessions. Please try again later.',
                type: 'error'
            });
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this session?')) {
            try {
                const response = await axios.delete(`http://localhost:5000/api/sessions/${id}`);
                if (response.data.success) {
                    setNotification({
                        message: 'Session deleted successfully',
                        type: 'success'
                    });
                    fetchSessions();
                } else {
                    throw new Error(response.data.message || 'Failed to delete session');
                }
            } catch (error) {
                console.error('Error deleting session:', error);
                setNotification({
                    message: error.response?.data?.message || error.message || 'Error deleting session. Please try again later.',
                    type: 'error'
                });
            }
        }
    };

    const handleEdit = (id) => {
        navigate(`/admin/edit-session/${id}`);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleDownload = () => {
        try {
            // Filter sessions based on search term
            const filteredSessions = sessions.filter(session =>
                session.sessionName.toLowerCase().includes(search.toLowerCase()) ||
                session.description.toLowerCase().includes(search.toLowerCase()) ||
                session.location.toLowerCase().includes(search.toLowerCase())
            );

            // Create a temporary div to hold the content
            const printDiv = document.createElement('div');
            printDiv.id = 'printSection';
            printDiv.style.padding = '40px';
            printDiv.style.fontFamily = 'Arial, sans-serif';
            printDiv.style.backgroundColor = '#ffffff';

            // Add header with logo and title
            const header = document.createElement('div');
            header.style.display = 'flex';
            header.style.alignItems = 'center';
            header.style.marginBottom = '30px';
            header.style.borderBottom = '2px solid #4CAF50';
            header.style.paddingBottom = '20px';

            const logoText = document.createElement('div');
            logoText.style.fontSize = '24px';
            logoText.style.fontWeight = 'bold';
            logoText.style.color = '#4CAF50';
            logoText.textContent = 'Max Fitness Club';
            header.appendChild(logoText);

            const titleDiv = document.createElement('div');
            titleDiv.style.marginLeft = 'auto';
            titleDiv.style.textAlign = 'right';

            const title = document.createElement('h1');
            title.textContent = 'Sessions Report';
            title.style.fontSize = '28px';
            title.style.color = '#333';
            title.style.margin = '0';
            title.style.fontWeight = '600';

            const date = document.createElement('p');
            date.textContent = `Generated on: ${new Date().toLocaleDateString()}`;
            date.style.color = '#666';
            date.style.margin = '5px 0 0 0';
            date.style.fontSize = '14px';

            titleDiv.appendChild(title);
            titleDiv.appendChild(date);
            header.appendChild(titleDiv);
            printDiv.appendChild(header);

            // Add summary section
            const summary = document.createElement('div');
            summary.style.marginBottom = '30px';
            summary.style.padding = '15px';
            summary.style.backgroundColor = '#f8f9fa';
            summary.style.borderRadius = '8px';

            const summaryText = document.createElement('p');
            summaryText.innerHTML = `<strong>Total Sessions:</strong> ${filteredSessions.length}`;
            summaryText.style.margin = '0';
            summaryText.style.color = '#495057';
            summary.appendChild(summaryText);
            printDiv.appendChild(summary);

            // Create table
            const table = document.createElement('table');
            table.style.width = '100%';
            table.style.borderCollapse = 'collapse';
            table.style.marginBottom = '20px';
            table.style.boxShadow = '0 0 20px rgba(0, 0, 0, 0.1)';
            table.style.borderRadius = '8px';
            table.style.overflow = 'hidden';

            // Add table header
            const thead = document.createElement('thead');
            thead.innerHTML = `
                <tr style="background-color: #4CAF50; color: white;">
                    <th style="padding: 15px; text-align: left; border: none;">Session Name</th>
                    <th style="padding: 15px; text-align: left; border: none;">Description</th>
                    <th style="padding: 15px; text-align: left; border: none;">Date</th>
                    <th style="padding: 15px; text-align: left; border: none;">Time</th>
                    <th style="padding: 15px; text-align: left; border: none;">Location</th>
                </tr>
            `;
            table.appendChild(thead);

            // Add table body
            const tbody = document.createElement('tbody');
            filteredSessions.forEach((session, index) => {
                const tr = document.createElement('tr');
                tr.style.backgroundColor = index % 2 === 0 ? '#ffffff' : '#f8f9fa';
                tr.innerHTML = `
                    <td style="padding: 15px; border: none; border-bottom: 1px solid #dee2e6;">${session.sessionName}</td>
                    <td style="padding: 15px; border: none; border-bottom: 1px solid #dee2e6;">${session.description.length > 100 
                        ? session.description.substring(0, 100) + '...' 
                        : session.description}</td>
                    <td style="padding: 15px; border: none; border-bottom: 1px solid #dee2e6;">${formatDate(session.date)}</td>
                    <td style="padding: 15px; border: none; border-bottom: 1px solid #dee2e6;">${session.startingTime} - ${session.endingTime}</td>
                    <td style="padding: 15px; border: none; border-bottom: 1px solid #dee2e6;">${session.location}</td>
                `;
                tbody.appendChild(tr);
            });
            table.appendChild(tbody);
            printDiv.appendChild(table);

            // Add footer
            const footer = document.createElement('div');
            footer.style.marginTop = '30px';
            footer.style.paddingTop = '20px';
            footer.style.borderTop = '1px solid #dee2e6';
            footer.style.textAlign = 'center';
            footer.style.color = '#6c757d';
            footer.style.fontSize = '12px';
            footer.innerHTML = `
                <p>© ${new Date().getFullYear()} Max Fitness Club. All rights reserved.</p>
                <p>This is a computer-generated document.</p>
            `;
            printDiv.appendChild(footer);

            // Add the temporary div to the document
            document.body.appendChild(printDiv);

            // Print the div
            window.print();

            // Remove the temporary div after printing
            document.body.removeChild(printDiv);

            setNotification({
                message: 'Print dialog opened successfully. Select "Save as PDF" to download.',
                type: 'success'
            });
        } catch (error) {
            console.error('Error generating print view:', error);
            setNotification({
                message: 'Error generating print view. Please try again.',
                type: 'error'
            });
        }
    };

    const filteredSessions = sessions.filter(session =>
        session.sessionName.toLowerCase().includes(search.toLowerCase()) ||
        session.location.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="session-container">
            <div className="session-header">
                <button className="back-button" onClick={handleGoBack}>
                    Go Back
                </button>
                <h1>Manage Sessions</h1>
                <div className="header-actions">
                    <button 
                        className="download-button"
                        onClick={handleDownload}
                    >
                        Download Sessions
                    </button>
                    <button 
                        className="add-session-button"
                        onClick={() => navigate('/admin/add-session')}
                    >
                        Add New Session
                    </button>
                </div>
            </div>

            {notification.message && (
                <div className={`notification ${notification.type}`}>
                    {notification.message}
                </div>
            )}

            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search sessions..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="search-input"
                />
            </div>

            {loading ? (
                <div className="loading">Loading sessions...</div>
            ) : filteredSessions.length === 0 ? (
                <div className="no-sessions">No sessions found</div>
            ) : (
                <div className="sessions-grid">
                    {filteredSessions.map(session => (
                        <div key={session._id} className="session-card">
                            <div className="session-image">
                                <img src={session.photo} alt={session.sessionName} />
                            </div>
                            <div className="session-details">
                                <h3>{session.sessionName}</h3>
                                <p className="description">{session.description}</p>
                                <div className="session-info">
                                    <p><strong>Date:</strong> {formatDate(session.date)}</p>
                                    <p><strong>Time:</strong> {session.startingTime} - {session.endingTime}</p>
                                    <p><strong>Location:</strong> {session.location}</p>
                                </div>
                                <div className="session-actions">
                                    <button 
                                        className="edit-button"
                                        onClick={() => handleEdit(session._id)}
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        className="delete-button"
                                        onClick={() => handleDelete(session._id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ViewSessions; 