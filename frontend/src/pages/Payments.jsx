import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Grid, TextField, Select, MenuItem, Button, CircularProgress } from '@mui/material';
import dayjs from 'dayjs';
import Papa from 'papaparse';

function Payments() {
  const [payments, setPayments] = useState([]);
  const [form, setForm] = useState({ userId: '', amount: '', type: 'membership', method: 'cash', status: 'completed', description: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // Filter state
  const [filter, setFilter] = useState({ from: '', to: '', type: '', method: '', status: '' });

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/finance/payments');
      setPayments(res.data);
      setError('');
    } catch (err) {
      setError('Failed to load payments');
    }
    setLoading(false);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/finance/payments', form);
      fetchPayments();
      setForm({ userId: '', amount: '', type: 'membership', method: 'cash', status: 'completed', description: '' });
    } catch (err) {
      setError('Failed to add payment');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/finance/payments/${id}`);
      setPayments(payments.filter(p => p._id !== id));
    } catch (err) {
      setError('Failed to delete payment');
    }
  };

  // Filtering logic
  const filteredPayments = payments.filter(p => {
    const date = dayjs(p.date);
    const from = filter.from ? dayjs(filter.from) : null;
    const to = filter.to ? dayjs(filter.to) : null;
    return (
      (!from || date.isAfter(from.subtract(1, 'day')))
      && (!to || date.isBefore(to.add(1, 'day')))
      && (!filter.type || p.type === filter.type)
      && (!filter.method || p.method === filter.method)
      && (!filter.status || p.status === filter.status)
    );
  });

  // Export to CSV
  const handleExport = () => {
    const csv = Papa.unparse(filteredPayments);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'payments.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, background: 'rgba(245,248,255,0.95)', minHeight: '100vh' }}>
      <Typography variant="h4" fontWeight={700} mb={4} color="primary.main">Payments</Typography>
      {/* Filters and Export */}
      <Paper sx={{ p: 2, mb: 2, borderRadius: 3, boxShadow: 2, display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
        <TextField
          label="From"
          type="date"
          size="small"
          InputLabelProps={{ shrink: true }}
          value={filter.from}
          onChange={e => setFilter(f => ({ ...f, from: e.target.value }))}
        />
        <TextField
          label="To"
          type="date"
          size="small"
          InputLabelProps={{ shrink: true }}
          value={filter.to}
          onChange={e => setFilter(f => ({ ...f, to: e.target.value }))}
        />
        <Select
          value={filter.type}
          onChange={e => setFilter(f => ({ ...f, type: e.target.value }))}
          displayEmpty
          size="small"
        >
          <MenuItem value="">All Types</MenuItem>
          <MenuItem value="membership">Membership</MenuItem>
          <MenuItem value="session">Session</MenuItem>
          <MenuItem value="supplement">Supplement</MenuItem>
          <MenuItem value="other">Other</MenuItem>
        </Select>
        <Select
          value={filter.method}
          onChange={e => setFilter(f => ({ ...f, method: e.target.value }))}
          displayEmpty
          size="small"
        >
          <MenuItem value="">All Methods</MenuItem>
          <MenuItem value="cash">Cash</MenuItem>
          <MenuItem value="card">Card</MenuItem>
          <MenuItem value="online">Online</MenuItem>
          <MenuItem value="other">Other</MenuItem>
        </Select>
        <Select
          value={filter.status}
          onChange={e => setFilter(f => ({ ...f, status: e.target.value }))}
          displayEmpty
          size="small"
        >
          <MenuItem value="">All Statuses</MenuItem>
          <MenuItem value="completed">Completed</MenuItem>
          <MenuItem value="pending">Pending</MenuItem>
          <MenuItem value="failed">Failed</MenuItem>
        </Select>
        <Button variant="outlined" color="primary" onClick={handleExport}>Export CSV</Button>
      </Paper>
      <Paper sx={{ p: 3, mb: 4, borderRadius: 3, boxShadow: 2 }}>
        <form onSubmit={handleAdd}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={2}>
              <TextField label="User ID" value={form.userId} onChange={e => setForm({ ...form, userId: e.target.value })} fullWidth required size="small" />
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField label="Amount" type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} fullWidth required size="small" />
            </Grid>
            <Grid item xs={12} md={2}>
              <Select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} fullWidth size="small">
                <MenuItem value="membership">Membership</MenuItem>
                <MenuItem value="session">Session</MenuItem>
                <MenuItem value="supplement">Supplement</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={12} md={2}>
              <Select value={form.method} onChange={e => setForm({ ...form, method: e.target.value })} fullWidth size="small">
                <MenuItem value="cash">Cash</MenuItem>
                <MenuItem value="card">Card</MenuItem>
                <MenuItem value="online">Online</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField label="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} fullWidth size="small" />
            </Grid>
            <Grid item xs={12} md={2}>
              <Button type="submit" variant="contained" color="success" fullWidth sx={{ height: '100%' }}>Add Payment</Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
      {error && <Typography color="error" mb={2}>{error}</Typography>}
      {loading ? <CircularProgress /> : (
        <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Method</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPayments.map(p => (
                <TableRow key={p._id}>
                  <TableCell>{p.userId?.email || p.userId}</TableCell>
                  <TableCell>Rs. {p.amount}</TableCell>
                  <TableCell>{p.type}</TableCell>
                  <TableCell>{p.method}</TableCell>
                  <TableCell>{p.status}</TableCell>
                  <TableCell>{new Date(p.date).toLocaleString()}</TableCell>
                  <TableCell>{p.description}</TableCell>
                  <TableCell><Button color="error" onClick={() => handleDelete(p._id)}>Delete</Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}

export default Payments; 