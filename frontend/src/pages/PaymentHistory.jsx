import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Button, MenuItem, Select, FormControl, InputLabel, Grid } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

function PaymentHistory(props) {
  const location = useLocation();
  const navigate = useNavigate();
  // Robust userId fetching
  const userId = props.userId || location.state?.userId || localStorage.getItem('userId');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [sortBy, setSortBy] = useState('dateDesc');

  useEffect(() => {
    if (userId) fetchHistory();
  }, [userId]);

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

  // Filtering and sorting
  let filtered = history;
  if (typeFilter !== 'all') filtered = filtered.filter(p => p.type === typeFilter);
  if (methodFilter !== 'all') filtered = filtered.filter(p => p.method === methodFilter);
  if (sortBy === 'dateDesc') filtered = filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  if (sortBy === 'dateAsc') filtered = filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
  if (sortBy === 'amountDesc') filtered = filtered.sort((a, b) => b.amount - a.amount);
  if (sortBy === 'amountAsc') filtered = filtered.sort((a, b) => a.amount - b.amount);

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, background: 'rgba(245,248,255,0.95)', minHeight: '100vh' }}>
      <Grid container spacing={2} alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Grid item>
          <Typography variant="h4" fontWeight={700} color="primary.main">Payment History</Typography>
        </Grid>
        <Grid item>
          <Button variant="outlined" color="primary" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </Grid>
      </Grid>
      <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2, mb: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Type</InputLabel>
              <Select value={typeFilter} label="Type" onChange={e => setTypeFilter(e.target.value)}>
                <MenuItem value="all">All Types</MenuItem>
                <MenuItem value="membership">Membership</MenuItem>
                <MenuItem value="session">Session</MenuItem>
                <MenuItem value="supplement">Supplement</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Method</InputLabel>
              <Select value={methodFilter} label="Method" onChange={e => setMethodFilter(e.target.value)}>
                <MenuItem value="all">All Methods</MenuItem>
                <MenuItem value="cash">Cash</MenuItem>
                <MenuItem value="card">Card</MenuItem>
                <MenuItem value="online">Online</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Sort By</InputLabel>
              <Select value={sortBy} label="Sort By" onChange={e => setSortBy(e.target.value)}>
                <MenuItem value="dateDesc">Date (Newest)</MenuItem>
                <MenuItem value="dateAsc">Date (Oldest)</MenuItem>
                <MenuItem value="amountDesc">Amount (High to Low)</MenuItem>
                <MenuItem value="amountAsc">Amount (Low to High)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>
      {error && <Typography color="error" mb={2}>{error}</Typography>}
      <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2 }}>
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
                {filtered.map(p => (
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

export default PaymentHistory; 