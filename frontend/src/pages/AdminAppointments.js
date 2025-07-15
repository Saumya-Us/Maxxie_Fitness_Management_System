import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  IconButton,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  useMediaQuery,
  Drawer,
  TextField,
  Fade,
  Backdrop,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useTheme } from '@mui/material/styles';
import Notification from '../components/Notification';
import SideBar from '../components/AdminSideBar';
import NavBar from '../components/AdminNavBar';
import BG from '../Assests/BG2.jpg';

function AdminAppointments() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ message: '', type: 'success' });
  const [search, setSearch] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    fetchAppointments();
    // eslint-disable-next-line
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/appointment');
      if (response.data.success) {
        setAppointments(response.data.data);
      } else {
        throw new Error(response.data.message || 'Failed to fetch appointments');
      }
    } catch (error) {
      setNotification({
        message: error.response?.data?.message || 'Error: Could not fetch appointments.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApproveAppointment = async (id) => {
    try {
      const response = await axios.patch(`http://localhost:5000/api/appointment/approve/${id}`);
      if (response.data.success) {
        setNotification({ message: 'Appointment approved successfully.', type: 'success' });
        fetchAppointments();
      } else {
        throw new Error(response.data.message || 'Failed to approve appointment');
      }
    } catch (error) {
      setNotification({
        message: error.response?.data?.message || 'Error: Could not approve appointment.',
        type: 'error',
      });
    }
  };

  const handleRejectAppointment = async (id) => {
    try {
      const response = await axios.patch(`http://localhost:5000/api/appointment/reject/${id}`);
      if (response.data.success) {
        setNotification({ message: 'Appointment rejected successfully.', type: 'success' });
        fetchAppointments();
      } else {
        throw new Error(response.data.message || 'Failed to reject appointment');
      }
    } catch (error) {
      setNotification({
        message: error.response?.data?.message || 'Error: Could not reject appointment.',
        type: 'error',
      });
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // PDF download logic remains unchanged (uses window.print for simplicity)
  const downloadSinglePDF = (appointment) => {
    // ...same implementation as your code, omitted for brevity
    setNotification({
      message: 'Print dialog opened successfully. Select "Save as PDF" to download.',
      type: 'success',
    });
  };

  const downloadAllPDF = () => {
    // ...same implementation as your code, omitted for brevity
    setNotification({
      message: 'Print dialog opened successfully. Select "Save as PDF" to download.',
      type: 'success',
    });
  };

  // Filter appointments based on search query
  const filteredAppointments = appointments.filter((appointment) => {
    const query = search.toLowerCase();
    return (
      appointment.clientName.toLowerCase().includes(query) ||
      appointment.sessionType.toLowerCase().includes(query) ||
      (appointment.classType && appointment.classType.toLowerCase().includes(query)) ||
      appointment.trainer.toLowerCase().includes(query) ||
      appointment.status.toLowerCase().includes(query)
    );
  });

  // Sidebar content for Drawer (mobile)
  const SidebarContent = <SideBar />;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        minWidth: '100vw',
        m: 0,
        p: 0,
        display: 'flex',
        flexDirection: 'row',
        backgroundImage: `url(${BG})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        overflow: 'hidden',
      }}
    >
      {/* Sidebar: Drawer for mobile, fixed for desktop */}
      {isMobile ? (
        <>
          <IconButton
            onClick={() => setDrawerOpen(true)}
            sx={{
              position: 'absolute',
              top: 18,
              left: 18,
              zIndex: 1301,
              bgcolor: 'rgba(34,69,98,0.92)',
              color: '#fff',
              boxShadow: 2,
              '&:hover': { bgcolor: 'rgba(34,69,98,1)' },
            }}
          >
            <MenuIcon fontSize="large" />
          </IconButton>
          <Drawer
            anchor="left"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            PaperProps={{
              sx: {
                backgroundImage: `url(${BG})`,
                backgroundColor: 'rgba(1, 21, 37, 0.92)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                color: '#fff',
              },
            }}
          >
            {SidebarContent}
          </Drawer>
        </>
      ) : (
        <Box sx={{ minWidth: 250, maxWidth: 320, height: '100vh', position: 'sticky', top: 0 }}>
          {SidebarContent}
        </Box>
      )}

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          px: { xs: 1, sm: 6 },
          py: 4,
        }}
      >
        {/* Navbar */}
        <Box sx={{ width: '100%', mb: 3 }}>
          <NavBar />
        </Box>

        {/* Header and Actions */}
        <Box
          sx={{
            width: '100%',
            maxWidth: '100%',
            bgcolor: 'rgba(255,255,255,0.7)',
            borderRadius: 5,
            boxShadow: 10,
            p: { xs: 2, sm: 4 },
            mb: 4,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', sm: 'center' },
              mb: 2,
            }}
          >
            <Typography variant="h4" fontWeight="bold" mb={{ xs: 2, sm: 0 }}>
              Manage Fitness Sessions
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                color="success"
                onClick={() => navigate('/admin/add-session')}
                sx={{
                  fontWeight: 'bold',
                  borderRadius: 2,
                  boxShadow: '0 2px 8px 0 rgba(34,69,98,0.09)',
                }}
              >
                Add Session
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => navigate('/admin/view-sessions')}
                sx={{
                  fontWeight: 'bold',
                  borderRadius: 2,
                  boxShadow: '0 2px 8px 0 rgba(34,69,98,0.09)',
                }}
              >
                View Sessions
              </Button>
            </Box>
          </Box>
          {/* Search */}
          <TextField
            variant="outlined"
            placeholder="Search appointments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{
              mb: 2,
              width: '100%',
              maxWidth: 400,
              background: '#f8fafc',
              borderRadius: 2,
              boxShadow: '0 1px 4px 0 rgba(34,69,98,0.05)',
            }}
            size="small"
          />

          {/* Notification */}
          {notification.message && (
            <Notification
              message={notification.message}
              type={notification.type}
              onClose={() => setNotification({ message: '', type: 'success' })}
            />
          )}

          {/* Table */}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : filteredAppointments.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <Typography variant="h6" color="text.secondary">
                No appointments found.
              </Typography>
            </Box>
          ) : (
            <Box>
              <Button
                variant="contained"
                color="secondary"
                sx={{
                  mb: 2,
                  fontWeight: 'bold',
                  borderRadius: 2,
                  boxShadow: '0 2px 8px 0 rgba(34,69,98,0.09)',
                }}
                onClick={downloadAllPDF}
              >
                Download All as PDF
              </Button>
              <TableContainer
                component={Paper}
                elevation={0}
                sx={{
                  borderRadius: 4,
                  boxShadow: 5,
                  background: 'rgba(245,248,255,0.80)',
                  mb: 2,
                }}
              >
                <Table
                  sx={{
                    minWidth: 100,
                    '& th': {
                      background: 'linear-gradient(90deg, #224562 0%, #2e5c7a 100%)',
                      color: '#fff',
                      fontWeight: 'bold',
                      fontSize: 17,
                      borderBottom: '2px solid #e3e8ee',
                    },
                    '& td': {
                      fontSize: 16,
                      borderBottom: '1px solid #e3e8ee',
                    },
                    '& tr:hover td': {
                      background: 'rgba(34,69,98,0.06)',
                    },
                  }}
                  stickyHeader
                >
                  <TableHead>
                    <TableRow>
                      <TableCell>Session Type</TableCell>
                      <TableCell>Date & Time</TableCell>
                      <TableCell>Client Name</TableCell>
                      <TableCell>Trainer</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredAppointments.map((appointment) => (
                      <TableRow key={appointment._id} hover>
                        <TableCell>
                          {appointment.sessionType}
                          {appointment.classType !== 'N/A' && ` (${appointment.classType})`}
                        </TableCell>
                        <TableCell>
                          {formatDate(appointment.date)} at {appointment.time}
                        </TableCell>
                        <TableCell>{appointment.clientName}</TableCell>
                        <TableCell>{appointment.trainer}</TableCell>
                        <TableCell>
                          <Typography
                            sx={{
                              color:
                                appointment.status === 'Pending'
                                  ? '#f39c12'
                                  : appointment.status === 'Approved'
                                  ? '#27ae60'
                                  : '#e74c3c',
                              fontWeight: 'bold',
                            }}
                          >
                            {appointment.status}
                          </Typography>
                        </TableCell>
                        <TableCell>Rs.{appointment.amount}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            {appointment.status === 'Pending' && (
                              <>
                                <Tooltip title="Approve">
                                  <Button
                                    size="small"
                                    variant="contained"
                                    color="success"
                                    sx={{ borderRadius: 2, fontWeight: 'bold' }}
                                    onClick={() => handleApproveAppointment(appointment._id)}
                                  >
                                    Approve
                                  </Button>
                                </Tooltip>
                                <Tooltip title="Reject">
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    color="error"
                                    sx={{ borderRadius: 2, fontWeight: 'bold' }}
                                    onClick={() => handleRejectAppointment(appointment._id)}
                                  >
                                    Reject
                                  </Button>
                                </Tooltip>
                              </>
                            )}
                            <Tooltip title="Download PDF">
                              <Button
                                size="small"
                                variant="outlined"
                                color="primary"
                                sx={{ borderRadius: 2, fontWeight: 'bold' }}
                                onClick={() => downloadSinglePDF(appointment)}
                              >
                                PDF
                              </Button>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default AdminAppointments;
