import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Avatar,
  Chip,
  useTheme,
} from "@mui/material";
import { Icon } from "@iconify/react";
import { Link, useNavigate } from "react-router-dom";
import NavBar from '../components/AdminNavBar';
import SideBar from "../components/AdminSideBar";
import BG from "../Assests/BG2.jpg";
import SupplementModal from './AddSupplement'; // adjust path as needed



const quickActions = [
  {
    label: "Add Supplement",
    desc: "Add a new supplement to inventory",
    icon: <Icon icon="mdi:plus" fontSize={32} />,
    to: "/add-supplement",
  },
  {
    label: "View Inventory",
    desc: "Check current stock levels",
    icon: <Icon icon="mdi:package-variant-closed" fontSize={32} />,
    to: "/admin-dashboard",
  },
  {
    label: "Generate Report",
    desc: "Create inventory reports",
    icon: <Icon icon="mdi:chart-bar" fontSize={32} />,
    to: "/inventory-report",
  },
  {
    label: "User Store",
    desc: "View customer-facing store",
    icon: <Icon icon="mdi:cart" fontSize={32} />,
    to: "/user-store",
  },
];

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalSupplements: 0,
    lowStockItems: 0,
    supplementsSold: 0,
    revenue: 0,
  });

  const [recentActivity, setRecentActivity] = useState([
    { id: 1, type: 'purchase', user: 'Sarah Smith', action: 'bought supplements', time: '3 hours ago', icon: <Icon icon="mdi:pill" fontSize={22} /> },
    { id: 2, type: 'supplement', user: 'Admin', action: 'updated inventory', time: '1 day ago', icon: <Icon icon="mdi:package-variant-closed" fontSize={22} /> }
  ]);

  const [lowStockItems, setLowStockItems] = useState([
    { id: 1, name: 'Protein Powder', stock: 5, threshold: 10 },
    { id: 2, name: 'BCAA', stock: 3, threshold: 10 },
    { id: 3, name: 'Pre-Workout', stock: 7, threshold: 10 }
  ]);

  const [openAddModal, setOpenAddModal] = useState(false);
  const theme = useTheme();
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const supplementsResponse = await axios.get('http://localhost:5000/api/supplements');
        if (supplementsResponse.data) {
          const supplements = supplementsResponse.data;
          setStats((prev) => ({
            ...prev,
            totalSupplements: supplements.length,
            lowStockItems: supplements.filter(s => s.stock <= 10).length,
          }));
        }
        try {
          const lowStockResponse = await axios.get('http://localhost:5000/api/admin/low-stock');
          if (lowStockResponse.data) setLowStockItems(lowStockResponse.data);
        } catch {}
        setRecentActivity([
          { id: 1, type: 'purchase', user: 'Sarah Smith', action: 'bought supplements', time: '3 hours ago', icon: <Icon icon="mdi:pill" fontSize={22} /> },
          { id: 2, type: 'supplement', user: 'Admin', action: 'updated inventory', time: '1 day ago', icon: <Icon icon="mdi:package-variant-closed" fontSize={22} /> }
        ]);
      } catch {}
    };
    fetchData();
  }, []);

  const handleSupplementAdded = () => {
    window.location.reload(); // or call fetchData() if you want to avoid full reload
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        minWidth: "100vw",
        m: 0,
        p: 0,
        display: "flex",
        flexDirection: "row",
        backgroundImage: `url(${BG})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        overflow: "hidden",
      }}
    >
      {/* Sidebar */}
      <Box sx={{ minWidth: { xs: 0, sm: 250 }, maxWidth: 320, zIndex: 1200 }}>
        <SideBar />
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          bgcolor: "rgba(255,255,255,0.80)",
          borderRadius: { xs: 0, sm: 5 },
          boxShadow: 10,
          m: { xs: 0, sm: 3 },
          p: { xs: 1, sm: 4 },
          overflowX: "auto"
        }}
      >
        {/* Navbar */}
        <Box sx={{ mb: 2 }}>
          <NavBar />
        </Box>

        {/* Welcome Header */}
        <Box sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
          px: { xs: 1, sm: 2 }
        }}>
          <Box>
            <Typography variant="h4" fontWeight="bold" sx={{ color: theme.palette.primary.main }}>
              Welcome, <span style={{ color: theme.palette.secondary.main }}>Admin</span>
            </Typography>
            <Typography variant="subtitle2" color="text.secondary">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Avatar sx={{ bgcolor: theme.palette.primary.main }}>A</Avatar>
            <Typography variant="subtitle1" fontWeight="bold">Admin</Typography>
          </Box>
        </Box>

        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2, mb: 2 }}
          onClick={() => userId ? navigate('/paymentpage', { state: { userId } }) : alert('User ID not found.')}
        >
          View Payment History
        </Button>

        {/* Quick Actions */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" fontWeight="bold" mb={2} color={theme.palette.primary.main}>
            Quick Actions
          </Typography>
          <Grid container spacing={2}>
            {quickActions.map((action) => (
              <Grid item xs={12} sm={6} md={3} key={action.label}>
                {action.label === "Add Supplement" ? (
                  <Paper
                    elevation={3}
                    sx={{
                      p: 2,
                      borderRadius: 4,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      transition: "box-shadow 0.2s",
                      cursor: "pointer",
                      "&:hover": { boxShadow: 8, background: theme.palette.action.hover },
                      textDecoration: "none",
                    }}
                    onClick={() => setOpenAddModal(true)}
                  >
                    <Box sx={{ mb: 1 }}>{action.icon}</Box>
                    <Typography fontWeight="bold" sx={{ color: theme.palette.primary.main }}>{action.label}</Typography>
                    <Typography variant="body2" color="text.secondary" align="center">
                      {action.desc}
                    </Typography>
                  </Paper>
                ) : (
                  <Paper
                    elevation={3}
                    sx={{
                      p: 2,
                      borderRadius: 4,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      transition: "box-shadow 0.2s",
                      cursor: "pointer",
                      "&:hover": { boxShadow: 8, background: theme.palette.action.hover },
                      textDecoration: "none",
                    }}
                    component={Link}
                    to={action.to}
                  >
                    <Box sx={{ mb: 1 }}>{action.icon}</Box>
                    <Typography fontWeight="bold" sx={{ color: theme.palette.primary.main }}>{action.label}</Typography>
                    <Typography variant="body2" color="text.secondary" align="center">
                      {action.desc}
                    </Typography>
                  </Paper>
                )}
              </Grid>
            ))}
          </Grid>
          
        </Box>

        
      </Box>
      <SupplementModal
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        onAdded={handleSupplementAdded}
      />
    </Box>
  );
};

export default Dashboard;
