import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Card, CardContent, Typography, Grid, Paper, TextField, Select, MenuItem, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

function Checkout({ userId }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ amount: '', type: 'membership', method: 'cash', description: '' });
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (userId) fetchHistory();
    // Prefill amount if passed from cart
    if (location.state?.totalAmount) {
      setForm(f => ({ ...f, amount: location.state.totalAmount }));
    }
  }, [userId, location.state]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/finance/payments');
      setHistory(res.data.filter(p => p.userId === userId || p.userId?._id === userId));
      setError('');
    } catch (err) {
      setError('Failed to load payment history');
    }
    setLoading(false);
  };

  const handlePay = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/finance/payments', { ...form, userId });
      fetchHistory();
      setForm({ amount: '', type: 'membership', method: 'cash', description: '' });
      navigate('/order-confirmation');
    } catch (err) {
      setError('Failed to make payment');
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, background: 'rgba(245,248,255,0.95)', minHeight: '100vh' }}>
      <Typography variant="h4" fontWeight={700} mb={4} color="primary.main">Checkout</Typography>
      <Card sx={{ mb: 4, boxShadow: 2, borderRadius: 3 }}>
        <CardContent>
          <form onSubmit={handlePay}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <TextField label="Amount" type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} fullWidth required size="small" />
              </Grid>
              <Grid item xs={12} md={3}>
                <Select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} fullWidth size="small">
                  <MenuItem value="membership">Membership</MenuItem>
                  <MenuItem value="session">Session</MenuItem>
                  <MenuItem value="supplement">Supplement</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </Grid>
              <Grid item xs={12} md={3}>
                <Select value={form.method} onChange={e => setForm({ ...form, method: e.target.value })} fullWidth size="small">
                  <MenuItem value="cash">Cash</MenuItem>
                  <MenuItem value="card">Card</MenuItem>
                  <MenuItem value="online">Online</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField label="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} fullWidth size="small" />
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="success" fullWidth>Pay</Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
      {error && <Typography color="error" mb={2}>{error}</Typography>}
      <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2 }}>
        <Typography variant="h6" mb={2} color="primary">Payment History</Typography>
        {loading ? <CircularProgress /> : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Amount</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Method</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Description</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {history.map(p => (
                  <TableRow key={p._id}>
                    <TableCell>Rs. {p.amount}</TableCell>
                    <TableCell>{p.type}</TableCell>
                    <TableCell>{p.method}</TableCell>
                    <TableCell>{p.status}</TableCell>
                    <TableCell>{new Date(p.date).toLocaleString()}</TableCell>
                    <TableCell>{p.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
}

export default Checkout; 