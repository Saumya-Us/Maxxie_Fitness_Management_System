import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  IconButton,
  Typography,
  useMediaQuery,
  Drawer,
  CircularProgress,
  InputBase,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Fade,
  Backdrop,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Icon } from "@iconify/react";
import { useTheme } from "@mui/material/styles";
import { useLocation, useNavigate, Link } from "react-router-dom";
import BG from "../Assests/BG2.jpg";
import Logopng from "../Assests/maxxieslogos.png";
import Notification from "../components/Notification";
import jsPDF from "jspdf";

// Sidebar button config (reuse from your other file)
const sidebarButtons = [
  { text: "Home", icon: <Icon icon="codicon:home" fontSize={28} />, route: "/home", color: "primary" },
  { text: "Session", icon: <Icon icon="codicon:edit-session" fontSize={28} />, route: "/session-home", color: "primary" },
  { text: "Store", icon: <Icon icon="mdi:cart" fontSize={28} />, route: "/user-store", color: "primary" },
  { text: "Workout Plans", icon: <Icon icon="mdi:cart" fontSize={28} />, route: "/workout-plans-user", color: "primary" },
  { text: "Diet Plan", icon: <Icon icon="uis:schedule" fontSize={28} />, route: "/diet-plan-user", color: "warning" },
  { text: "Membership Plan", icon: <Icon icon="codicon:edit-session" fontSize={28} />, route: "/membership-plans-user", color: "primary" },
];

function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ message: "", type: "success" });
  const [search, setSearch] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (location.state?.notification) {
      setNotification({
        message: location.state.notification,
        type: "success",
      });
    }
    fetchAppointments();
  }, [location]);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/appointment");
      if (response.data.success) {
        setAppointments(response.data.data);
        setLoading(false);
      } else {
        throw new Error(response.data.message || "Failed to fetch appointments");
      }
    } catch (error) {
      setNotification({
        message:
          error.response?.data?.message ||
          "Error: Could not fetch appointments. Please try again later.",
        type: "error",
      });
      setLoading(false);
    }
  };

  const handleViewAppointment = (id) => navigate(`/appointment/${id}`);
  const handleEditAppointment = (id) => navigate(`/edit-appointment/${id}`);
  const handleDeleteAppointment = async (id) => {
    if (window.confirm("Are you sure you want to cancel this session?")) {
      try {
        const response = await axios.delete(
          `http://localhost:5000/api/appointment/${id}`
        );
        if (response.data.success) {
          setNotification({
            message: "Session cancelled successfully.",
            type: "success",
          });
          fetchAppointments();
        } else {
          throw new Error(response.data.message || "Failed to cancel session");
        }
      } catch (error) {
        setNotification({
          message:
            error.response?.data?.message ||
            "Error: Could not cancel session.",
          type: "error",
        });
      }
    }
  };

  const handleProceedToPay = (appointment) => {
    alert(
      `Proceed to pay Rs.${appointment.amount} for ${appointment.sessionType}`
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const downloadPDF = (appointment) => {
    try {
        // Create a temporary div to hold the content
        const printDiv = document.createElement('div');
        printDiv.id = 'printSection';
        printDiv.style.padding = '40px';
        printDiv.style.fontFamily = 'Arial, sans-serif';
        printDiv.style.backgroundColor = '#ffffff';

        // Add header with logo and title
        const header = document.createElement('div');
        header.style.display = 'flex';
        header.style.alignItems = 'center';
        header.style.marginBottom = '30px';
        header.style.borderBottom = '2px solid #4CAF50';
        header.style.paddingBottom = '20px';

        const logoText = document.createElement('div');
        logoText.style.fontSize = '24px';
        logoText.style.fontWeight = 'bold';
        logoText.style.color = '#4CAF50';
        logoText.textContent = 'FitLife';
        header.appendChild(logoText);

        const titleDiv = document.createElement('div');
        titleDiv.style.marginLeft = 'auto';
        titleDiv.style.textAlign = 'right';

        const title = document.createElement('h1');
        title.textContent = 'Session Details';
        title.style.fontSize = '28px';
        title.style.color = '#333';
        title.style.margin = '0';
        title.style.fontWeight = '600';

        const date = document.createElement('p');
        date.textContent = `Generated on: ${new Date().toLocaleDateString()}`;
        date.style.color = '#666';
        date.style.margin = '5px 0 0 0';
        date.style.fontSize = '14px';

        titleDiv.appendChild(title);
        titleDiv.appendChild(date);
        header.appendChild(titleDiv);
        printDiv.appendChild(header);

        // Add summary section
        const summary = document.createElement('div');
        summary.style.marginBottom = '30px';
        summary.style.padding = '15px';
        summary.style.backgroundColor = '#f8f9fa';
        summary.style.borderRadius = '8px';

        const summaryText = document.createElement('p');
        summaryText.innerHTML = `<strong>Status:</strong> <span style="color: ${appointment.status === 'Pending' ? '#f39c12' : appointment.status === 'Approved' ? '#27ae60' : '#e74c3c'}">${appointment.status}</span>`;
        summaryText.style.margin = '0';
        summaryText.style.color = '#495057';
        summary.appendChild(summaryText);
        printDiv.appendChild(summary);

        // Create details table
        const table = document.createElement('table');
        table.style.width = '100%';
        table.style.borderCollapse = 'collapse';
        table.style.marginBottom = '20px';
        table.style.boxShadow = '0 0 20px rgba(0, 0, 0, 0.1)';
        table.style.borderRadius = '8px';
        table.style.overflow = 'hidden';

        // Add table rows
        const rows = [
            { label: 'Session Type', value: `${appointment.sessionType}${appointment.classType !== 'N/A' ? ` (${appointment.classType})` : ''}` },
            { label: 'Date & Time', value: `${formatDate(appointment.date)} at ${appointment.time}` },
            { label: 'Duration', value: `${appointment.duration} minutes` },
            { label: 'Client Name', value: appointment.clientName },
            { label: 'Trainer', value: appointment.trainer },
            { label: 'Amount', value: `Rs.${appointment.amount}` }
        ];

        rows.forEach((row, index) => {
            const tr = document.createElement('tr');
            tr.style.backgroundColor = index % 2 === 0 ? '#ffffff' : '#f8f9fa';
            tr.innerHTML = `
                <td style="padding: 15px; border: none; border-bottom: 1px solid #dee2e6; font-weight: bold; width: 30%;">${row.label}</td>
                <td style="padding: 15px; border: none; border-bottom: 1px solid #dee2e6;">${row.value}</td>
            `;
            table.appendChild(tr);
        });

        if (appointment.notes) {
            const notesTr = document.createElement('tr');
            notesTr.style.backgroundColor = '#ffffff';
            notesTr.innerHTML = `
                <td style="padding: 15px; border: none; border-bottom: 1px solid #dee2e6; font-weight: bold; width: 30%;">Notes</td>
                <td style="padding: 15px; border: none; border-bottom: 1px solid #dee2e6;">${appointment.notes}</td>
            `;
            table.appendChild(notesTr);
        }

        printDiv.appendChild(table);

        // Add footer
        const footer = document.createElement('div');
        footer.style.marginTop = '30px';
        footer.style.paddingTop = '20px';
        footer.style.borderTop = '1px solid #dee2e6';
        footer.style.textAlign = 'center';
        footer.style.color = '#6c757d';
        footer.style.fontSize = '12px';
        footer.innerHTML = `
            <p>© ${new Date().getFullYear()} FitLife. All rights reserved.</p>
            <p>This is a computer-generated document.</p>
        `;
        printDiv.appendChild(footer);

        // Add the temporary div to the document
        document.body.appendChild(printDiv);

        // Print the div
        window.print();

        // Remove the temporary div after printing
        document.body.removeChild(printDiv);

        setNotification({
            message: 'Print dialog opened successfully. Select "Save as PDF" to download.',
            type: 'success'
        });
    } catch (error) {
        console.error('Error generating print view:', error);
        setNotification({
            message: 'Error generating print view. Please try again.',
            type: 'error'
        });
    }
};

  // Filter appointments based on search query
  const filteredAppointments = appointments.filter((appointment) => {
    const query = search.toLowerCase();
    return (
      appointment.clientName.toLowerCase().includes(query) ||
      appointment.sessionType.toLowerCase().includes(query) ||
      (appointment.classType &&
        appointment.classType.toLowerCase().includes(query)) ||
      appointment.trainer.toLowerCase().includes(query) ||
      appointment.status.toLowerCase().includes(query)
    );
  });

  // Sidebar content
  const SidebarContent = (
    <Box
      component="aside"
      sx={{
        width: { xs: 250, sm: 320 },
        minHeight: "100vh",
        backgroundImage: `url(${BG})`,
        backgroundColor: "rgba(34, 69, 98, 0.92)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        py: 4,
        boxShadow: 4,
      }}
    >
      <Box sx={{ mb: 3 }}>
        <img
          src={Logopng}
          alt="Logo"
          style={{ width: 120, borderRadius: 12, marginTop: 80 }}
        />
      </Box>
      <Typography
        variant="h5"
        sx={{
          fontWeight: "bold",
          letterSpacing: 2,
          mb: 4,
          color: "#fff",
          textShadow: "0 2px 8px rgba(0,0,0,0.25)",
        }}
      >
        Maxxies
      </Typography>
      <Box sx={{ width: "90%" }}>
        {sidebarButtons.map((btn) => (
          <Button
            key={btn.text}
            variant="contained"
            color={btn.color}
            fullWidth
            startIcon={btn.icon}
            sx={{
              mb: 2,
              minHeight: 56,
              borderRadius: 3,
              fontWeight: "bold",
              fontSize: 17,
              justifyContent: "flex-start",
              boxShadow: "0 2px 12px 0 rgba(0,0,0,0.08)",
              backgroundColor: "rgba(255, 255, 255, 0.4)",
              color: "#fff",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.18)",
                color: "#fff",
                boxShadow: "0 4px 16px 0 rgba(0,0,0,0.12)",
              },
            }}
            onClick={() => {
              navigate(btn.route);
              if (isMobile) setDrawerOpen(false);
            }}
          >
            {btn.text}
          </Button>
        ))}
      </Box>
    </Box>
  );

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
      {/* Sidebar: Drawer for mobile, fixed for desktop */}
      {isMobile ? (
        <>
          <IconButton
            onClick={() => setDrawerOpen(true)}
            sx={{
              position: "absolute",
              top: 18,
              left: 18,
              zIndex: 1301,
              bgcolor: "rgba(34,69,98,0.92)",
              color: "#fff",
              boxShadow: 2,
              "&:hover": {
                bgcolor: "rgba(34,69,98,1)",
              },
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
                backgroundColor: "rgba(1, 21, 37, 0.92)",
                backgroundSize: "cover",
                backgroundPosition: "center",
                color: "#ffff",
              },
            }}
          >
            {SidebarContent}
          </Drawer>
        </>
      ) : (
        SidebarContent
      )}

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          minHeight: "100vh",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          px: { xs: 1, sm: 6 },
          py: 6,
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: "100%",
            bgcolor: "rgba(255,255,255,0.7)", // reduced opacity
            borderRadius: 5,
            boxShadow: 10,
            p: { xs: 2, sm: 4 },
            overflowX: "auto",
          }}
        >
          {/* Navbar */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 3,
              px: { xs: 0, sm: 2 },
              py: 1,
              borderRadius: 3,
              background: "linear-gradient(90deg, #224562 0%, #2e5c7a 100%)",
              color: "#fff",
              boxShadow: 3,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <img src={Logopng} alt="Logo" style={{ width: 50, borderRadius: 8 }} />
              <Typography variant="h6" sx={{ fontWeight: "bold", letterSpacing: 1 }}>
                <Link to="/session-home" style={{ color: "#fff", textDecoration: "none" }}>
                  Max Fitness Club
                </Link>
              </Typography>
            </Box>
                  <Box sx={{ display: { xs: "none", md: "flex" }, gap: 3 }}>
                    <Button color="inherit" component={Link} to="/session-home" sx={{ color: "#fff", fontWeight: "bold" }}>
                      Home
                    </Button>
                    <Button color="inherit" component={Link} to="/services/crossfit" sx={{ color: "#fff", fontWeight: "bold" }}>
                      Cross Fit
                    </Button>
                    <Button color="inherit" component={Link} to="/services/group-class" sx={{ color: "#fff", fontWeight: "bold" }}>
                      Group Classes
                    </Button>
                    
                    <Button color="inherit" component={Link} to="/services/yoga" sx={{ color: "#fff", fontWeight: "bold" }}>
                      Yoga Classes
                    </Button>
                    <Button color="inherit" component={Link} to="/services/personal-training" sx={{ color: "#fff", fontWeight: "bold" }}>
                      Personal Training
                    </Button>
                    <Button color="inherit" component={Link} to="/all-sessions" sx={{ color: "#fff", fontWeight: "bold" }}>
                      All Sessions
                    </Button>
                    <Button color="inherit" component={Link} to="/my-appointments" sx={{ color: "#fff", fontWeight: "bold" }}>
                      My Sessions
                    </Button>
                    <Button color="inherit" component={Link} to="/home" sx={{ color: "#fff", fontWeight: "bold" }}>
                      Back To Dashboard
                    </Button>
                  </Box>
          </Box>

          {/* Header and Search */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "stretch", sm: "center" },
              justifyContent: "space-between",
              mb: 3,
              gap: 2,
            }}
          >
            <Typography variant="h4" fontWeight="bold" sx={{ color: "#224562" }}>
              My Fitness Sessions
            </Typography>
            <Paper
              component="form"
              sx={{
                p: "2px 8px",
                display: "flex",
                alignItems: "center",
                width: { xs: "100%", sm: 320 },
                borderRadius: 3,
                background: "#f5f8ff",
                boxShadow: 2,
              }}
              elevation={0}
            >
              <InputBase
                sx={{ ml: 1, flex: 1, fontSize: 17 }}
                placeholder="Search sessions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                inputProps={{ "aria-label": "search sessions" }}
              />
            </Paper>
          </Box>

          {/* Notification */}
          {notification.message && (
            <Notification
              message={notification.message}
              type={notification.type}
              onClose={() => setNotification({ message: "", type: "success" })}
            />
          )}

          {/* Loading and Table */}
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Typography sx={{ mb: 2, color: "#224562", fontWeight: "bold" }}>
                Total Sessions: {filteredAppointments.length}
              </Typography>
              {filteredAppointments.length === 0 ? (
                <Box sx={{ textAlign: "center", mt: 6 }}>
                  <Typography variant="h6" color="text.secondary">
                    No sessions found.
                  </Typography>
                </Box>
              ) : (
                <TableContainer sx={{ borderRadius: 3, boxShadow: 4, background: "rgba(245,248,255,0.95)" }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: "bold", fontSize: 16 }}>Session Type</TableCell>
                        <TableCell sx={{ fontWeight: "bold", fontSize: 16 }}>Date & Time</TableCell>
                        <TableCell sx={{ fontWeight: "bold", fontSize: 16 }}>Trainer</TableCell>
                        <TableCell sx={{ fontWeight: "bold", fontSize: 16 }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: "bold", fontSize: 16 }}>Amount</TableCell>
                        <TableCell sx={{ fontWeight: "bold", fontSize: 16 }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredAppointments.map((appointment) => (
                        <TableRow key={appointment._id}>
                          <TableCell>
                            {appointment.sessionType}
                            {appointment.classType !== "N/A" && ` (${appointment.classType})`}
                          </TableCell>
                          <TableCell>
                            {formatDate(appointment.date)} at {appointment.time}
                          </TableCell>
                          <TableCell>{appointment.trainer}</TableCell>
                          <TableCell>
                            <span
                              style={{
                                color:
                                  appointment.status === "Pending"
                                    ? "#f39c12"
                                    : appointment.status === "Approved"
                                    ? "#27ae60"
                                    : "#e74c3c",
                                fontWeight: "bold",
                              }}
                            >
                              {appointment.status}
                            </span>
                          </TableCell>
                          <TableCell>Rs.{appointment.amount}</TableCell>
                          <TableCell>
                            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                              <Button
                                size="small"
                                variant="outlined"
                                color="primary"
                                onClick={() => handleViewAppointment(appointment._id)}
                              >
                                View
                              </Button>
                              {appointment.status === "Pending" && (
                                <>
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    color="warning"
                                    onClick={() => handleEditAppointment(appointment._id)}
                                  >
                                    Edit
                                  </Button>
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    color="error"
                                    onClick={() => handleDeleteAppointment(appointment._id)}
                                  >
                                    Cancel
                                  </Button>
                                </>
                              )}
                              {appointment.status === "Approved" && (
                                <Button
                                  size="small"
                                  variant="contained"
                                  color="success"
                                  onClick={() => handleProceedToPay(appointment)}
                                >
                                  Payment
                                </Button>
                              )}
                              <Button
                                size="small"
                                variant="contained"
                                color="secondary"
                                onClick={() => downloadPDF(appointment)}
                              >
                                Download PDF
                              </Button>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default MyAppointments;
