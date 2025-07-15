import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Card, CardContent, Typography, Button, CircularProgress } from '@mui/material';

export default function OrderConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.state?.userId || localStorage.getItem('userId');
  const [latestPayment, setLatestPayment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the latest payment for this user
    const fetchLatest = async () => {
      setLoading(true);
      try {
        const res = await fetch('http://localhost:5000/finance/payments');
        const data = await res.json();
        const userPayments = data.filter(p => (p.userId === userId || p.userId?._id === userId));
        userPayments.sort((a, b) => new Date(b.date) - new Date(a.date));
        setLatestPayment(userPayments[0] || null);
      } catch {
        setLatestPayment(null);
      }
      setLoading(false);
    };
    if (userId) fetchLatest();
    else setLoading(false);
  }, [userId]);

  const handleViewHistory = () => {
    if (userId) {
      navigate('/payment-history', { state: { userId } });
    } else {
      alert('User ID not found.');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(245,248,255,0.95)' }}>
      <Card sx={{ p: { xs: 2, md: 4 }, borderRadius: 4, boxShadow: 4, minWidth: 320, maxWidth: 420, textAlign: 'center' }}>
        <CardContent>
          <Typography variant="h4" fontWeight={700} color="primary.main" gutterBottom>
            Order Confirmed!
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Your payment was successful. Thank you for your order.
          </Typography>
          {loading ? (
            <CircularProgress sx={{ my: 3 }} />
          ) : latestPayment ? (
            <Box sx={{ my: 2, p: 2, background: 'rgba(34,69,98,0.06)', borderRadius: 2 }}>
              <Typography variant="subtitle1" fontWeight={600} color="primary">Payment Summary</Typography>
              <Typography variant="body2">Amount: <b>Rs. {latestPayment.amount}</b></Typography>
              <Typography variant="body2">Type: <b>{latestPayment.type}</b></Typography>
              <Typography variant="body2">Method: <b>{latestPayment.method}</b></Typography>
              <Typography variant="body2">Date: <b>{new Date(latestPayment.date).toLocaleString()}</b></Typography>
              {latestPayment.description && (
                <Typography variant="body2">Description: <b>{latestPayment.description}</b></Typography>
              )}
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ my: 2 }}>
              No recent payment details found.
            </Typography>
          )}
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 3, fontWeight: 'bold', fontSize: 18, borderRadius: 2, px: 4, py: 1.5 }}
            onClick={handleViewHistory}
          >
            View Payment History
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
} 