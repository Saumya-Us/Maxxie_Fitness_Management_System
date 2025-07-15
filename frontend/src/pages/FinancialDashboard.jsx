import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Card, CardContent, Typography, Grid, Paper, Skeleton } from '@mui/material';

function FinancialDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/finance/dashboard').then(res => {
      setStats(res.data);
      setLoading(false);
    });
  }, []);

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, background: '#f7f9fc', minHeight: '100vh', borderRadius: 4, maxWidth: 900, mx: 'auto', boxShadow: 3 }}>
      <Typography variant="h4" fontWeight={700} mb={5} color="primary.main" sx={{ letterSpacing: 1 }}>
        Financial Dashboard
      </Typography>
      <Grid container spacing={4} mb={5} justifyContent="center">
        {[{ label: 'Total Revenue', value: stats?.totalRevenue, color: 'success.main' },
          { label: 'Total Expenses', value: stats?.totalExpenses, color: 'error.main' },
          { label: 'Profit', value: stats?.profit, color: 'primary.main' }].map((item, idx) => (
          <Grid item xs={12} sm={6} md={4} key={item.label} display="flex" justifyContent="center">
            <Card sx={{ boxShadow: 4, borderRadius: 4, minWidth: 210, px: 3, py: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', transition: '0.2s', '&:hover': { boxShadow: 8 } }}>
              <CardContent sx={{ p: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="subtitle1" color="text.secondary" fontWeight={600} mb={1} sx={{ fontSize: '1.15rem' }}>{item.label}</Typography>
                {loading ? <Skeleton width={90} height={44} /> : (
                  <Typography variant="h4" fontWeight={700} color={item.color} sx={{ fontSize: '2.2rem', letterSpacing: 1 }}>
                    Rs. {item.value}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Paper sx={{ p: 4, borderRadius: 4, boxShadow: 2, background: '#fff' }}>
        <Typography variant="h6" mb={2} color="primary" fontWeight={700}>
          Trends <span style={{ color: '#6b7280', fontWeight: 400, fontSize: '1rem' }}>(Coming Soon)</span>
        </Typography>
        <Box sx={{ height: 200, background: '#f1f5f9', borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'grey.500', fontSize: '1.25rem', fontWeight: 500, letterSpacing: 1 }}>
          <span style={{ opacity: 0.7 }}>[Charts will be here]</span>
        </Box>
      </Paper>
    </Box>
  );
}

export default FinancialDashboard; 