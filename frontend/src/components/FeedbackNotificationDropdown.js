import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const FeedbackNotificationDropdown = () => {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const bellRef = useRef(null);

  // Helper to tag notification type
  const tagType = (arr, type) =>
    arr.map(n => ({ ...n, __type: type }));

  // Fetch unread feedback notifications from both endpoints
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      // Fetch both endpoints in parallel
      const [workoutRes, dietRes] = await Promise.all([
        axios.get('http://localhost:5000/api/workout-feedback/unread'),
        axios.get('http://localhost:5000/api/diet-feedback/unread')
      ]);
      // Tag notifications so we know which endpoint to mark as read
      const workoutNotifs = tagType(workoutRes.data, 'workout');
      const dietNotifs = tagType(dietRes.data, 'diet');
      // Merge and sort by createdAt desc
      const all = [...workoutNotifs, ...dietNotifs].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setNotifications(all);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll every 30 seconds for new notifications
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (bellRef.current && !bellRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Mark single notification as read, using correct endpoint
  const handleMarkAsRead = async (id, type) => {
    try {
      const endpoint =
        type === 'diet'
          ? `http://localhost:5000/api/diet-feedback/${id}/read`
          : `http://localhost:5000/api/workout-feedback/${id}/read`;
      await axios.patch(endpoint);
      setNotifications(notifications.filter(n => n._id !== id));
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };

  // Mark all as read, using correct endpoint for each
  const handleMarkAllAsRead = async () => {
    try {
      await Promise.all(
        notifications.map(n =>
          axios.patch(
            n.__type === 'diet'
              ? `http://localhost:5000/api/diet-feedback/${n._id}/read`
              : `http://localhost:5000/api/workout-feedback/${n._id}/read`
          )
        )
      );
      setNotifications([]);
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  };

  return (
    <div className="relative" ref={bellRef}>
      <button 
        onClick={() => {
          setOpen(!open);
          if (!open && notifications.length > 0) {
            fetchNotifications();
          }
        }} 
        className="relative p-2 rounded-full hover:bg-gray-100"
      >
        <span role="img" aria-label="Notifications" className="text-2xl">🔔</span>
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
            {notifications.length}
          </span>
        )}
      </button>
      
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white border rounded-lg shadow-lg z-50 overflow-hidden">
          <div className="p-3 border-b font-bold flex justify-between items-center bg-gray-50">
            <span className="text-black">Feedback Notifications</span>
            {notifications.length > 0 && (
              <button 
                onClick={handleMarkAllAsRead}
                className="text-xs text-blue-500 hover:text-blue-700"
              >
                Mark all as read
              </button>
            )}
          </div>
          
          {loading ? (
            <div className="p-4 text-center text-gray-500">Loading...</div>
          ) : notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No new notifications</div>
          ) : (
            <ul className="max-h-96 overflow-y-auto">
              {notifications.map(notification => (
                <li key={notification._id} className="p-3 border-b hover:bg-gray-50">
                  <div className="flex items-start">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <div className="text-yellow-500 mr-1">
                          {'★'.repeat(notification.rating)}
                          {'☆'.repeat(5 - notification.rating)}
                        </div>
                        <span className="text-sm text-gray-500 ml-1">
                          ({notification.rating}/5)
                        </span>
                        <span className={`ml-2 px-2 py-0.5 rounded text-xs ${notification.__type === 'diet' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                          {notification.__type === 'diet' ? 'Diet Plan' : 'Workout Plan'}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-black">{notification.comment}</p>
                      <div className="mt-1 flex justify-between items-center">
                        <span className="text-xs text-gray-400">
                          {new Date(notification.createdAt).toLocaleString()}
                        </span>
                        <span className="text-xs font-medium">
                          {notification.user || 'Anonymous'}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleMarkAsRead(notification._id, notification.__type)}
                      className="ml-2 text-xs text-blue-500 hover:text-blue-700"
                    >
                      ✓
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default FeedbackNotificationDropdown;
