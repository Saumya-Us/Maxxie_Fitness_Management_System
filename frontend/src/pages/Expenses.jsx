import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Grid, TextField, Button, CircularProgress, Select, MenuItem } from '@mui/material';
import dayjs from 'dayjs';
import Papa from 'papaparse';

function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({ category: '', amount: '', description: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // Filter state
  const [filter, setFilter] = useState({ from: '', to: '', category: '' });

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/finance/expenses');
      setExpenses(res.data);
      setError('');
    } catch (err) {
      setError('Failed to load expenses');
    }
    setLoading(false);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/finance/expenses', form);
      fetchExpenses();
      setForm({ category: '', amount: '', description: '' });
    } catch (err) {
      setError('Failed to add expense');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/finance/expenses/${id}`);
      setExpenses(expenses.filter(exp => exp._id !== id));
    } catch (err) {
      setError('Failed to delete expense');
    }
  };

  // Filtering logic
  const filteredExpenses = expenses.filter(exp => {
    const date = dayjs(exp.date);
    const from = filter.from ? dayjs(filter.from) : null;
    const to = filter.to ? dayjs(filter.to) : null;
    return (
      (!from || date.isAfter(from.subtract(1, 'day')))
      && (!to || date.isBefore(to.add(1, 'day')))
      && (!filter.category || exp.category === filter.category)
    );
  });

  // Export to CSV
  const handleExport = () => {
    const csv = Papa.unparse(filteredExpenses);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'expenses.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Get unique categories for filter
  const categories = Array.from(new Set(expenses.map(e => e.category)));

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, background: 'rgba(245,248,255,0.95)', minHeight: '100vh' }}>
      <Typography variant="h4" fontWeight={700} mb={4} color="primary.main">Expenses</Typography>
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
          value={filter.category}
          onChange={e => setFilter(f => ({ ...f, category: e.target.value }))}
          displayEmpty
          size="small"
        >
          <MenuItem value="">All Categories</MenuItem>
          {categories.map(cat => (
            <MenuItem key={cat} value={cat}>{cat}</MenuItem>
          ))}
        </Select>
        <Button variant="outlined" color="primary" onClick={handleExport}>Export CSV</Button>
      </Paper>
      <Paper sx={{ p: 3, mb: 4, borderRadius: 3, boxShadow: 2 }}>
        <form onSubmit={handleAdd}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <TextField label="Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} fullWidth required size="small" />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField label="Amount" type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} fullWidth required size="small" />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField label="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} fullWidth size="small" />
            </Grid>
            <Grid item xs={12} md={2}>
              <Button type="submit" variant="contained" color="success" fullWidth sx={{ height: '100%' }}>Add Expense</Button>
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
                <TableCell>Category</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredExpenses.map(exp => (
                <TableRow key={exp._id}>
                  <TableCell>{exp.category}</TableCell>
                  <TableCell>Rs. {exp.amount}</TableCell>
                  <TableCell>{new Date(exp.date).toLocaleString()}</TableCell>
                  <TableCell>{exp.description}</TableCell>
                  <TableCell><Button color="error" onClick={() => handleDelete(exp._id)}>Delete</Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}

export default Expenses; 