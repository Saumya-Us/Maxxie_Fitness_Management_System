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
import { Link } from "react-router-dom";
import NavBar from '../components/AdminNavBar';
import SideBar from "../components/AdminSideBar";
import BG from "../Assests/BG2.jpg";
import SupplementModal from './AddSupplement'; // adjust path as needed

const statCards = [
  {
    key: "totalSupplements",
    label: "Total Supplements",
    icon: <Icon icon="mdi:package-variant-closed" fontSize={38} />,
    trend: "↑ 5% from last month",
    color: "primary.main",
  },
  {
    key: "lowStockItems",
    label: "Low Stock Items",
    icon: <Icon icon="mdi:alert" fontSize={38} />,
    trend: "↑ 3% from last month",
    color: "warning.main",
  },
  {
    key: "supplementsSold",
    label: "Supplements Sold",
    icon: <Icon icon="mdi:pill" fontSize={38} />,
    trend: "↑ 15% from last month",
    color: "success.main",
  },
  {
    key: "revenue",
    label: "Monthly Revenue",
    icon: <Icon icon="mdi:currency-inr" fontSize={38} />,
    trend: "↑ 10% from last month",
    color: "secondary.main",
    isCurrency: true,
  },
];

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

const Home = () => {
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

        {/* Hero Section */}
        <Paper
          elevation={8}
          sx={{
            borderRadius: 5,
            mb: 4,
            p: { xs: 2, sm: 4 },
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "stretch",
            background: `linear-gradient(100deg, ${theme.palette.primary.main} 60%, ${theme.palette.background.paper} 100%)`,
            minHeight: { xs: 320, md: 320 },
            overflow: "hidden",
            boxShadow: 8,
          }}
        >
          {/* Text and Stats */}
          <Box
            sx={{
              flex: 1.2,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              color: theme.palette.primary.contrastText,
              zIndex: 2,
            }}
          >
            <Typography
              variant="h3"
              fontWeight="bold"
              sx={{
                color: theme.palette.primary.contrastText,
                textShadow: "0 2px 16px rgba(34,69,98,0.18)",
                mb: 1,
                letterSpacing: 1,
              }}
            >
              Supplement Store
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                color: theme.palette.secondary.light,
                fontWeight: 500,
                mb: 3,
                textShadow: "0 1px 8px rgba(0,0,0,0.09)",
              }}
            >
              Your premium source for fitness supplements
            </Typography>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={4}>
                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="h4" fontWeight="bold" color="inherit">
                    {stats.totalSupplements}
                  </Typography>
                  <Typography variant="body2" color={theme.palette.primary.contrastText}>
                    Total Supplements
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="h4" fontWeight="bold" color={theme.palette.warning.main}>
                    {stats.lowStockItems}
                  </Typography>
                  <Typography variant="body2" color={theme.palette.primary.contrastText}>
                    Low Stock Items
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="h4" fontWeight="bold" color={theme.palette.success.main}>
                    {stats.supplementsSold}
                  </Typography>
                  <Typography variant="body2" color={theme.palette.primary.contrastText}>
                    Supplements Sold
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
          {/* Hero Image with Overlay */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              minHeight: 240,
              mt: { xs: 3, md: 0 },
            }}
          >
            <Box
              sx={{
                width: "100%",
                maxWidth: 340,
                aspectRatio: "1.2",
                borderRadius: 4,
                overflow: "hidden",
                boxShadow: 6,
                position: "relative",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  inset: 0,
                  background: `linear-gradient(120deg, rgba(0,0,0,0.18) 30%, transparent 100%)`,
                  zIndex: 1,
                },
              }}
            >
              <img
                src="https://images.pexels.com/photos/4397840/pexels-photo-4397840.jpeg"
                alt="Supplement Store"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                  borderRadius: "inherit",
                  filter: "brightness(0.97) contrast(1.08)",
                }}
              />
            </Box>
          </Box>
        </Paper>

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

        {/* Stats Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" fontWeight="bold" mb={2} color={theme.palette.primary.main}>
            Inventory Overview
          </Typography>
          <Grid container spacing={2}>
            {statCards.map((card) => (
              <Grid item xs={12} sm={6} md={3} key={card.key}>
                <Card sx={{
                  background: theme.palette.background.paper,
                  borderRadius: 4,
                  boxShadow: 4,
                  p: 1.5,
                  minHeight: 150,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between"
                }}>
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      {card.icon}
                      <Typography variant="subtitle1" fontWeight="bold" sx={{ ml: 1 }}>{card.label}</Typography>
                    </Box>
                    <Typography variant="h5" fontWeight="bold" color={theme.palette[card.color.split('.')[0]]?.main || theme.palette.primary.main}>
                      {card.isCurrency ? `Rs. ${stats[card.key]?.toLocaleString()}` : stats[card.key]?.toLocaleString()}
                    </Typography>
                    <Typography variant="caption" color="success.main">{card.trend}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Recent Activity & Low Stock Alerts */}
        <Grid container spacing={3}>
          {/* Recent Activity */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ borderRadius: 4, p: 2, minHeight: 250 }}>
              <Typography variant="h6" fontWeight="bold" color={theme.palette.primary.main} mb={2}>
                Recent Activity
              </Typography>
              <Box>
                {recentActivity.map(activity => (
                  <Box key={activity.id} sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Avatar sx={{ bgcolor: theme.palette.primary.light, color: theme.palette.primary.main, mr: 2 }}>
                      {activity.icon}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {activity.user} <span style={{ fontWeight: 400 }}>{activity.action}</span>
                      </Typography>
                      <Typography variant="caption" color="text.secondary">{activity.time}</Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
              <Button
                variant="outlined"
                size="small"
                sx={{ mt: 2, borderRadius: 2, fontWeight: "bold" }}
                component={Link}
                to="/admin-dashboard"
              >
                View All Activity
              </Button>
            </Paper>
          </Grid>

          {/* Low Stock Alerts */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ borderRadius: 4, p: 2, minHeight: 250 }}>
              <Typography variant="h6" fontWeight="bold" color={theme.palette.error.main} mb={2}>
                Low Stock Alerts
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Stock</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Threshold</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {lowStockItems.map(item => (
                      <TableRow key={item.id}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>
                          <Chip label={`Only ${item.stock} left`} color="warning" size="small" />
                        </TableCell>
                        <TableCell>
                          <Chip label={`Threshold: ${item.threshold}`} color="info" size="small" />
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            size="small"
                            color="primary"
                            component={Link}
                            to={`/edit-supplement/${item._id || item.id}`}
                            sx={{ borderRadius: 2, fontWeight: "bold" }}
                          >
                            Restock
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Button
                variant="outlined"
                size="small"
                sx={{ mt: 2, borderRadius: 2, fontWeight: "bold" }}
                component={Link}
                to="/inventory"
              >
                View All Inventory
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Box>
      <SupplementModal
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        onAdded={handleSupplementAdded}
      />
    </Box>
  );
};

export default Home;
