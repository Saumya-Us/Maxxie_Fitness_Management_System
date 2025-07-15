import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/session.css';

function AddSession() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        sessionName: '',
        description: '',
        date: '',
        startingTime: '',
        endingTime: '',
        location: '',
        photo: null
    });
    const [errors, setErrors] = useState({});
    const [notification, setNotification] = useState({ message: '', type: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleGoBack = () => {
        navigate('/admin/appointments');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check file size (limit to 1MB)
            if (file.size > 1024 * 1024) {
                setErrors(prev => ({
                    ...prev,
                    photo: 'Photo size should be less than 1MB'
                }));
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({
                    ...prev,
                    photo: reader.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.sessionName.trim()) {
            newErrors.sessionName = 'Session name is required';
        }
        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
        }
        if (!formData.date) {
            newErrors.date = 'Date is required';
        } else {
            // Check if date is in the future
            const selectedDate = new Date(formData.date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (selectedDate < today) {
                newErrors.date = 'Date must be in the future';
            }
        }
        if (!formData.startingTime) {
            newErrors.startingTime = 'Starting time is required';
        }
        if (!formData.endingTime) {
            newErrors.endingTime = 'Ending time is required';
        }
        if (!formData.location.trim()) {
            newErrors.location = 'Location is required';
        }
        if (!formData.photo) {
            newErrors.photo = 'Photo is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        setNotification({ message: '', type: '' });

        try {
            // Format the date properly
            const sessionDate = new Date(formData.date);
            sessionDate.setHours(0, 0, 0, 0);

            // Create a new form data object with properly formatted date
            const sessionData = {
                ...formData,
                date: sessionDate
            };

            console.log('Sending session data:', sessionData);

            const response = await axios.post('http://localhost:5000/api/sessions', sessionData);
            
            if (response.data.success) {
                setNotification({
                    message: 'Session added successfully!',
                    type: 'success'
                });
                setTimeout(() => {
                    navigate('/admin/view-sessions');
                }, 2000);
            } else {
                throw new Error(response.data.message || 'Failed to add session');
            }
        } catch (error) {
            console.error('Error adding session:', error);
            console.error('Error details:', error.response?.data || error);
            
            // Handle validation errors from the server
            if (error.response?.data?.errors) {
                const serverErrors = {};
                error.response.data.errors.forEach(err => {
                    // Map server validation errors to form fields
                    if (err.includes('name')) serverErrors.sessionName = err;
                    else if (err.includes('description')) serverErrors.description = err;
                    else if (err.includes('date')) serverErrors.date = err;
                    else if (err.includes('starting')) serverErrors.startingTime = err;
                    else if (err.includes('ending')) serverErrors.endingTime = err;
                    else if (err.includes('location')) serverErrors.location = err;
                    else if (err.includes('photo')) serverErrors.photo = err;
                });
                setErrors(serverErrors);
            }
            
            setNotification({
                message: error.response?.data?.message || error.response?.data?.error || 'Error adding session. Please check your input and try again.',
                type: 'error'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="session-container">
            <div className="session-header">
                <button className="back-button" onClick={handleGoBack}>
                    Go Back
                </button>
                <h1>Add New Session</h1>
            </div>
            
            {notification.message && (
                <div className={`notification ${notification.type}`}>
                    {notification.message}
                </div>
            )}

            <form className="session-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="sessionName">Session Name</label>
                    <input
                        type="text"
                        id="sessionName"
                        name="sessionName"
                        value={formData.sessionName}
                        onChange={handleChange}
                        className="form-control"
                    />
                    {errors.sessionName && <span className="error">{errors.sessionName}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="form-control"
                        rows="4"
                    />
                    {errors.description && <span className="error">{errors.description}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="date">Date</label>
                    <input
                        type="date"
                        id="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        className="form-control"
                        min={new Date().toISOString().split('T')[0]}
                    />
                    {errors.date && <span className="error">{errors.date}</span>}
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="startingTime">Starting Time</label>
                        <input
                            type="time"
                            id="startingTime"
                            name="startingTime"
                            value={formData.startingTime}
                            onChange={handleChange}
                            className="form-control"
                        />
                        {errors.startingTime && <span className="error">{errors.startingTime}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="endingTime">Ending Time</label>
                        <input
                            type="time"
                            id="endingTime"
                            name="endingTime"
                            value={formData.endingTime}
                            onChange={handleChange}
                            className="form-control"
                        />
                        {errors.endingTime && <span className="error">{errors.endingTime}</span>}
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="location">Location</label>
                    <input
                        type="text"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="form-control"
                    />
                    {errors.location && <span className="error">{errors.location}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="photo">Session Photo</label>
                    <input
                        type="file"
                        id="photo"
                        name="photo"
                        onChange={handlePhotoChange}
                        className="form-control"
                        accept="image/*"
                    />
                    {errors.photo && <span className="error">{errors.photo}</span>}
                </div>

                <div className="form-actions">
                    <button 
                        type="submit" 
                        className="submit-button"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Adding Session...' : 'Add Session'}
                    </button>
                    <button 
                        type="button" 
                        className="cancel-button"
                        onClick={() => navigate('/admin/view-sessions')}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AddSession; 