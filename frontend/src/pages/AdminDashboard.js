import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import {
  Box,
  Typography,
  Button,
  Select,
  MenuItem,
  InputBase,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  CircularProgress,
  Badge,
  IconButton,
  Alert,
  Snackbar,
  Stack,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import NotificationsIcon from "@mui/icons-material/Notifications";
import BG from "../Assests/BG2.jpg";
import SideBar from "../components/AdminSideBar";
import NavBar from "../components/AdminNavBar";
import SupplementModal from './AddSupplement'; // <-- Import the modal
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import SearchIcon from '@mui/icons-material/Search';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const AdminDashboard = () => {
  const [filteredSupplements, setFilteredSupplements] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState([]);
  const [lowStockSupplements, setLowStockSupplements] = useState([]);
  const [notification, setNotification] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [supplements, setSupplements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState("");
  const [warning, setWarning] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // --- NEW STATE FOR MODAL ---
  const [openAddModal, setOpenAddModal] = useState(false);

  const [paymentTrends, setPaymentTrends] = useState([]);
  const [expenseTrends, setExpenseTrends] = useState([]);
  const [loadingTrends, setLoadingTrends] = useState(true);
  const [trends, setTrends] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loadingPayments, setLoadingPayments] = useState(true);
  const [paymentSearch, setPaymentSearch] = useState("");
  const [paymentType, setPaymentType] = useState("all");
  const [paymentMethod, setPaymentMethod] = useState("all");
  const [paymentStatus, setPaymentStatus] = useState("all");
  const [paymentSort, setPaymentSort] = useState("dateDesc");

  // --- Add payment method aggregation for chart ---
  const [paymentMethodData, setPaymentMethodData] = useState([]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  // Fetch supplements
  const fetchSupplements = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/supplements`);
      if (!response.ok) throw new Error("Failed to fetch supplements");
      const data = await response.json();
      setSupplements(data);
      setFilteredSupplements(data);

      // Extract unique categories
      const uniqueCategories = [...new Set(data.map(supp => supp.category))];
      setCategories(uniqueCategories);
      setError(null);
    } catch (error) {
      setError("Failed to fetch supplements. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch low stock
  const fetchLowStockSupplements = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/low-stock`);
      if (!response.ok) throw new Error("Failed to fetch low stock supplements");
      const data = await response.json();
      setLowStockSupplements(data);
    } catch (error) {
      // ignore for now
    }
  };

  // Fetch payment/expense trends for analytics
  const fetchTrends = async () => {
    setLoadingTrends(true);
    try {
      const paymentsRes = await axios.get('http://localhost:5000/finance/payments');
      const expensesRes = await axios.get('http://localhost:5000/finance/expenses');
      // Aggregate by month
      const payments = paymentsRes.data;
      const expenses = expensesRes.data;
      const months = Array.from({length: 12}, (_, i) => i);
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const paymentAgg = months.map(m => ({
        month: monthNames[m],
        revenue: payments.filter(p => new Date(p.date).getMonth() === m && p.status === 'completed').reduce((sum, p) => sum + (p.amount || 0), 0)
      }));
      const expenseAgg = months.map(m => ({
        month: monthNames[m],
        expense: expenses.filter(e => new Date(e.date).getMonth() === m).reduce((sum, e) => sum + (e.amount || 0), 0)
      }));
      // Merge for profit
      const trends = months.map(m => ({
        month: monthNames[m],
        revenue: paymentAgg[m].revenue,
        expense: expenseAgg[m].expense,
        profit: paymentAgg[m].revenue - expenseAgg[m].expense
      }));
      setPaymentTrends(paymentAgg);
      setExpenseTrends(expenseAgg);
      setTrends(trends);
      setLoadingTrends(false);
    } catch (err) {
      setLoadingTrends(false);
    }
  };

  // Fetch all payments for admin
  const fetchPayments = async () => {
    setLoadingPayments(true);
    try {
      const res = await axios.get('http://localhost:5000/finance/payments');
      setPayments(res.data);
    } catch {
      setPayments([]);
    }
    setLoadingPayments(false);
  };

  useEffect(() => {
    fetchSupplements();
    fetchLowStockSupplements();
    fetchTrends();
    fetchPayments();
  }, []);

  useEffect(() => {
    // Aggregate payment methods per month for chart
    if (!payments.length) return;
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const methods = ['cash', 'card', 'online', 'other'];
    const data = Array.from({ length: 12 }, (_, m) => {
      const monthPayments = payments.filter(p => new Date(p.date).getMonth() === m);
      const entry = { month: monthNames[m] };
      methods.forEach(method => {
        entry[method] = monthPayments.filter(p => p.method === method).length;
      });
      return entry;
    });
    setPaymentMethodData(data);
  }, [payments]);

  // Filter logic
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    filterSupplements(term, selectedCategory);
  };

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    filterSupplements(searchTerm, category);
  };

  const filterSupplements = (term, category) => {
    let filtered = supplements;
    if (term !== "") {
      filtered = filtered.filter(supp =>
        supp.name.toLowerCase().includes(term) ||
        supp.brand?.toLowerCase().includes(term)
      );
    }
    if (category !== "all") {
      filtered = filtered.filter(supp => supp.category === category);
    }
    setFilteredSupplements(filtered);
  };

  // Edit/Delete/Stock logic
  const handleEditSupplement = (supp) => {
    navigate(`/edit-supplement/${supp._id}`);
  };

  const handleDeleteSupplement = async (id) => {
    try {
      const response = await fetch(`${API_URL}/supplements/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete supplement");
      fetchSupplements();
      setSnackbar({ open: true, message: "Supplement deleted.", severity: "success" });
    } catch (error) {
      setSnackbar({ open: true, message: "Delete failed.", severity: "error" });
    }
  };

  const handleStockAdjustment = async (id, adjustment) => {
    try {
      setLoading(true);
      setError(null);
      const currentSupplement = supplements.find(supp => supp._id === id);
      if (!currentSupplement) throw new Error("Supplement not found");
      const newStock = currentSupplement.stock + adjustment;
      if (newStock < 0) {
        setSnackbar({ open: true, message: "Stock cannot be negative", severity: "error" });
        setLoading(false);
        return;
      }
      const response = await axios.patch(
        `${API_URL}/admin/update-stock/${id}`,
        { quantity: adjustment },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          validateStatus: status => status >= 200 && status < 500
        }
      );
      if (response.status >= 400) throw new Error(response.data.message || 'Failed to update stock');
      if (response.data) {
        setSupplements(prevSupplements =>
          prevSupplements.map(supplement =>
            supplement._id === id
              ? { ...supplement, stock: response.data.supplement.stock }
              : supplement
          )
        );
        setFilteredSupplements(prevSupplements =>
          prevSupplements.map(supplement =>
            supplement._id === id
              ? { ...supplement, stock: response.data.supplement.stock }
              : supplement
          )
        );
        setSuccess(`Stock updated for ${response.data.supplement.name}`);
        if (response.data.isLowStock) {
          setSnackbar({
            open: true,
            message: `Low stock alert: ${response.data.supplement.name} has only ${response.data.supplement.stock} items remaining`,
            severity: "warning"
          });
        }
      }
      fetchLowStockSupplements();
    } catch (error) {
      setSnackbar({ open: true, message: error.message || "An unexpected error occurred", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  // Snackbar auto-close
  useEffect(() => {
    if (snackbar.open) {
      const timer = setTimeout(() => setSnackbar({ ...snackbar, open: false }), 4000);
      return () => clearTimeout(timer);
    }
  }, [snackbar]);

  // Handle after supplement added
  const handleSupplementAdded = () => {
    setOpenAddModal(false);
    fetchSupplements();
    fetchLowStockSupplements();
    setSnackbar({ open: true, message: "Supplement added successfully!", severity: "success" });
  };

  // Layout
  return (
    <Box
      sx={{
        minHeight: "100vh",
        minWidth: "100vw",
        backgroundImage: `url(${BG})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        flexDirection: "row",
        overflow: "hidden",
      }}
    >
      {/* Sidebar */}
      <SideBar />

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
          m: { xs: 0, sm: 4 },
          p: { xs: 1, sm: 4 },
          overflowX: "auto",
        }}
      >
        {/* NavBar */}
        <NavBar />

        {/* Header and Notifications */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: { xs: "flex-start", md: "center" },
            justifyContent: "space-between",
            mb: 3,
            mt: 2,
          }}
        >
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Admin Dashboard
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </Typography>
          </Box>
          <Stack direction="row" spacing={2} alignItems="center">
            <IconButton color="primary" onClick={() => setShowNotifications(!showNotifications)}>
              <Badge badgeContent={lowStockSupplements.length} color="error">
                <NotificationsIcon fontSize="large" />
              </Badge>
            </IconButton>
            {showNotifications && (
              <Paper
                elevation={6}
                sx={{
                  position: "absolute",
                  top: 80,
                  right: 40,
                  minWidth: 320,
                  zIndex: 2000,
                  p: 2,
                  bgcolor: "#fff",
                  borderRadius: 3,
                  boxShadow: 8,
                }}
              >
                <Typography variant="h6" fontWeight="bold" mb={1}>
                  Notifications
                </Typography>
                {lowStockSupplements.length === 0 ? (
                  <Typography color="text.secondary">All items are well stocked.</Typography>
                ) : (
                  lowStockSupplements.map(supp => (
                    <Alert key={supp._id} severity="warning" sx={{ mb: 1 }}>
                      <strong>{supp.name}</strong> has only <b>{supp.stock}</b> items remaining.
                    </Alert>
                  ))
                )}
              </Paper>
            )}
          </Stack>
        </Box>

        {/* Snackbar for alerts */}
        <Snackbar
          open={snackbar.open}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>

        {/* Stats Cards */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 3,
            mb: 3,
          }}
        >
          <Card sx={{ flex: 1, bgcolor: "#e3f2fd", borderRadius: 3, boxShadow: 4 }}>
            <CardContent>
              <Typography variant="subtitle1" color="text.secondary">Total Supplements</Typography>
              <Typography variant="h5" fontWeight="bold">{supplements.length}</Typography>
            </CardContent>
          </Card>
          <Card sx={{ flex: 1, bgcolor: "#fffde7", borderRadius: 3, boxShadow: 4 }}>
            <CardContent>
              <Typography variant="subtitle1" color="text.secondary">Showing</Typography>
              <Typography variant="h5" fontWeight="bold">{filteredSupplements.length} items</Typography>
            </CardContent>
          </Card>
          <Card sx={{
            flex: 1,
            bgcolor: lowStockSupplements.length > 0 ? "#ffebee" : "#e8f5e9",
            borderRadius: 3,
            boxShadow: 4
          }}>
            <CardContent>
              <Typography variant="subtitle1" color="text.secondary">Low Stock Items</Typography>
              <Typography variant="h5" fontWeight="bold" color={lowStockSupplements.length > 0 ? "error" : "success.main"}>
                {lowStockSupplements.length}
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Analytics Charts Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" fontWeight="bold" mb={2}>Finance Analytics</Typography>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
            <Box flex={1} minWidth={0}>
              <Typography variant="subtitle1" fontWeight={600} mb={1}>Monthly Revenue/Expense/Profit</Typography>
              {loadingTrends ? <CircularProgress /> : (
                <ResponsiveContainer width="100%" height={320}>
                  <LineChart data={trends} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#22c55e" name="Revenue" strokeWidth={3} />
                    <Line type="monotone" dataKey="expense" stroke="#ef4444" name="Expenses" strokeWidth={3} />
                    <Line type="monotone" dataKey="profit" stroke="#2563eb" name="Profit" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </Box>
            <Box flex={1} minWidth={0}>
              <Typography variant="subtitle1" fontWeight={600} mb={1}>Monthly Payment Methods</Typography>
              {loadingPayments ? <CircularProgress /> : (
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={paymentMethodData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="cash" stackId="a" fill="#fbbf24" name="Cash" />
                    <Bar dataKey="card" stackId="a" fill="#2563eb" name="Card" />
                    <Bar dataKey="online" stackId="a" fill="#22c55e" name="Online" />
                    <Bar dataKey="other" stackId="a" fill="#a3a3a3" name="Other" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </Box>
          </Stack>
        </Box>

        {/* --- PAYMENTS TABLE --- */}
        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" fontWeight="bold" mb={2}>
            All User Payments
          </Typography>
          <Paper sx={{ p: 2, mb: 2, borderRadius: 3, boxShadow: 2 }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" justifyContent="space-between">
              <Paper component="form" sx={{ p: '2px 8px', display: 'flex', alignItems: 'center', width: { xs: '100%', sm: 320 }, borderRadius: 2, boxShadow: 1, bgcolor: '#f8fafc' }} onSubmit={e => e.preventDefault()}>
                <SearchIcon sx={{ color: 'action.active', mr: 1 }} />
                <InputBase
                  sx={{ flex: 1, fontSize: 16 }}
                  placeholder="Search by user, type, method, status, description..."
                  value={paymentSearch}
                  onChange={e => setPaymentSearch(e.target.value)}
                />
              </Paper>
              <Select value={paymentType} onChange={e => setPaymentType(e.target.value)} size="small" sx={{ minWidth: 120, bgcolor: '#f8fafc', borderRadius: 2 }}>
                <MenuItem value="all">All Types</MenuItem>
                <MenuItem value="membership">Membership</MenuItem>
                <MenuItem value="session">Session</MenuItem>
                <MenuItem value="supplement">Supplement</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
              <Select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} size="small" sx={{ minWidth: 120, bgcolor: '#f8fafc', borderRadius: 2 }}>
                <MenuItem value="all">All Methods</MenuItem>
                <MenuItem value="cash">Cash</MenuItem>
                <MenuItem value="card">Card</MenuItem>
                <MenuItem value="online">Online</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
              <Select value={paymentStatus} onChange={e => setPaymentStatus(e.target.value)} size="small" sx={{ minWidth: 120, bgcolor: '#f8fafc', borderRadius: 2 }}>
                <MenuItem value="all">All Statuses</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="failed">Failed</MenuItem>
              </Select>
              <Select value={paymentSort} onChange={e => setPaymentSort(e.target.value)} size="small" sx={{ minWidth: 140, bgcolor: '#f8fafc', borderRadius: 2 }}>
                <MenuItem value="dateDesc">Date (Newest)</MenuItem>
                <MenuItem value="dateAsc">Date (Oldest)</MenuItem>
                <MenuItem value="amountDesc">Amount (High to Low)</MenuItem>
                <MenuItem value="amountAsc">Amount (Low to High)</MenuItem>
              </Select>
            </Stack>
          </Paper>
          <Paper sx={{ p: 2, borderRadius: 3, boxShadow: 2 }}>
            {loadingPayments ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <TableContainer>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold', bgcolor: '#224562', color: '#fff' }}>User</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', bgcolor: '#224562', color: '#fff' }}>Amount</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', bgcolor: '#224562', color: '#fff' }}>Type</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', bgcolor: '#224562', color: '#fff' }}>Method</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', bgcolor: '#224562', color: '#fff' }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', bgcolor: '#224562', color: '#fff' }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', bgcolor: '#224562', color: '#fff' }}>Description</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {payments
                      .filter(p =>
                        (paymentType === 'all' || p.type === paymentType) &&
                        (paymentMethod === 'all' || p.method === paymentMethod) &&
                        (paymentStatus === 'all' || p.status === paymentStatus) &&
                        (
                          !paymentSearch ||
                          (p.userId?.email?.toLowerCase().includes(paymentSearch.toLowerCase()) ||
                           p.userId?.firstName?.toLowerCase().includes(paymentSearch.toLowerCase()) ||
                           p.userId?.lastName?.toLowerCase().includes(paymentSearch.toLowerCase()) ||
                           p.type?.toLowerCase().includes(paymentSearch.toLowerCase()) ||
                           p.method?.toLowerCase().includes(paymentSearch.toLowerCase()) ||
                           p.status?.toLowerCase().includes(paymentSearch.toLowerCase()) ||
                           (p.description || '').toLowerCase().includes(paymentSearch.toLowerCase())
                          )
                        )
                      )
                      .sort((a, b) => {
                        if (paymentSort === 'dateDesc') return new Date(b.date) - new Date(a.date);
                        if (paymentSort === 'dateAsc') return new Date(a.date) - new Date(b.date);
                        if (paymentSort === 'amountDesc') return b.amount - a.amount;
                        if (paymentSort === 'amountAsc') return a.amount - b.amount;
                        return 0;
                      })
                      .map(p => (
                        <TableRow key={p._id} hover>
                          <TableCell>
                            {p.userId?._id ? (
                              <Button
                                variant="text"
                                color="primary"
                                sx={{ textTransform: 'none', textDecoration: 'underline', minWidth: 0, p: 0 }}
                                onClick={() => window.open('/payment-history?userId=' + p.userId._id, '_blank')}
                              >
                                {p.userId.email || p.userId.firstName || p.userId._id}
                              </Button>
                            ) : (
                              p.userId?.email || p.userId?.firstName || p.userId || 'N/A'
                            )}
                          </TableCell>
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

        {/* Controls */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            mb: 3,
            alignItems: { xs: "stretch", sm: "center" },
          }}
        >
          <Paper
            component="form"
            sx={{
              p: "2px 8px",
              display: "flex",
              alignItems: "center",
              width: { xs: "100%", sm: 350 },
              borderRadius: 2,
              boxShadow: 2,
              bgcolor: "#f8fafc",
            }}
            onSubmit={e => e.preventDefault()}
          >
            <InputBase
              sx={{ ml: 1, flex: 1, fontSize: 16 }}
              placeholder="Search supplements..."
              value={searchTerm}
              onChange={handleSearch}
              inputProps={{ 'aria-label': 'search supplements' }}
            />
          </Paper>
          <Select
            value={selectedCategory}
            onChange={handleCategoryChange}
            displayEmpty
            sx={{
              minWidth: 160,
              bgcolor: "#f8fafc",
              borderRadius: 2,
              boxShadow: 2,
              fontSize: 16,
              height: 42,
            }}
          >
            <MenuItem value="all">All Categories</MenuItem>
            {categories.map(category => (
              <MenuItem key={category} value={category}>{category}</MenuItem>
            ))}
          </Select>
          <Button
            variant="contained"
            color="primary"
            sx={{
              fontWeight: "bold",
              borderRadius: 2,
              boxShadow: "0 2px 8px 0 rgba(34,69,98,0.09)",
              height: 42,
              ml: { sm: "auto" }
            }}
            // onClick={() => navigate("/add-supplement")}
            onClick={() => setOpenAddModal(true)} // <-- OPEN MODAL INSTEAD
          >
            + Add New Supplement
          </Button>
        </Box>

        {/* Inventory Table */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="h5" fontWeight="bold" mb={2}>
            Inventory
          </Typography>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          ) : filteredSupplements.length === 0 ? (
            <Typography color="text.secondary" sx={{ mt: 3 }}>
              {searchTerm || selectedCategory !== "all"
                ? "No matching supplements found"
                : "No supplements available"}
            </Typography>
          ) : (
            <TableContainer
              component={Paper}
              elevation={0}
              sx={{
                borderRadius: 4,
                boxShadow: 5,
                background: "rgba(245,248,255,0.90)",
                mb: 2,
                maxHeight: 520,
              }}
            >
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold", fontSize: 17, bgcolor: "#224562", color: "#fff" }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: "bold", fontSize: 17, bgcolor: "#224562", color: "#fff" }}>Brand</TableCell>
                    <TableCell sx={{ fontWeight: "bold", fontSize: 17, bgcolor: "#224562", color: "#fff" }}>Price</TableCell>
                    <TableCell sx={{ fontWeight: "bold", fontSize: 17, bgcolor: "#224562", color: "#fff" }}>Stock</TableCell>
                    <TableCell sx={{ fontWeight: "bold", fontSize: 17, bgcolor: "#224562", color: "#fff" }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredSupplements.map(supp => (
                    <TableRow key={supp._id} hover sx={{
                      bgcolor: supp.stock <= 10 ? "#fff3e0" : "inherit"
                    }}>
                      <TableCell>{supp.name}</TableCell>
                      <TableCell>{supp.brand || 'Generic'}</TableCell>
                      <TableCell>Rs. {supp.price}</TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleStockAdjustment(supp._id, -1)}
                          >
                            <RemoveIcon />
                          </IconButton>
                          <Typography variant="body1" sx={{ mx: 1 }}>{supp.stock}</Typography>
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleStockAdjustment(supp._id, 1)}
                          >
                            <AddIcon />
                          </IconButton>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <IconButton
                            color="primary"
                            onClick={() => handleEditSupplement(supp)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => handleDeleteSupplement(supp._id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Box>
      {/* --- SUPPLEMENT MODAL --- */}
      <SupplementModal
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        onAdded={handleSupplementAdded}
      />
    </Box>
  );
};

export default AdminDashboard;
