import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  Drawer,
  CircularProgress,
  Tooltip,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme } from "@mui/material/styles";
import { useParams, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import BG from "../Assests/BG2.jpg";
import Logopng from "../Assests/maxxieslogos.png";

// Sidebar buttons, matching your theme
const sidebarButtons = [
  { text: "Home", icon: <Icon icon="codicon:home" fontSize={28} />, route: "/home", color: "primary" },
  { text: "Session", icon: <Icon icon="codicon:edit-session" fontSize={28} />, route: "/session-home", color: "primary" },
  { text: "Store", icon: <Icon icon="mdi:cart" fontSize={28} />, route: "/user-store", color: "primary" },
  { text: "Workout Plans", icon: <Icon icon="mdi:cart" fontSize={28} />, route: "/workout-plans-user", color: "primary" },
  { text: "Diet Plan", icon: <Icon icon="uis:schedule" fontSize={28} />, route: "/diet-plan-user", color: "warning" },
  { text: "Membership Plan", icon: <Icon icon="codicon:edit-session" fontSize={28} />, route: "/membership-plans-user", color: "primary" },
];

const ViewAppointment = () => {
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const response = await axios.get(`/api/appointment/${id}`);
        setAppointment(response.data.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch appointment details");
        setLoading(false);
      }
    };
    fetchAppointment();
  }, [id]);

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
        <img src={Logopng} alt="Logo" style={{ width: 120, borderRadius: 12, marginTop: 80 }} />
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

  // Loading state
  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          minWidth: "100vw",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage: `url(${BG})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <Paper
          elevation={8}
          sx={{
            bgcolor: "rgba(255,255,255,0.85)",
            p: 6,
            borderRadius: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <CircularProgress />
          <Typography sx={{ mt: 2, fontWeight: "bold" }}>Loading session details...</Typography>
        </Paper>
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          minWidth: "100vw",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage: `url(${BG})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <Paper
          elevation={8}
          sx={{
            bgcolor: "rgba(255,255,255,0.90)",
            p: 6,
            borderRadius: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant="h4" fontWeight="bold" color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/my-appointments")}
            sx={{ borderRadius: 2, fontWeight: "bold", mt: 1 }}
          >
            Back to My Sessions
          </Button>
        </Paper>
      </Box>
    );
  }

  // Not found state
  if (!appointment) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          minWidth: "100vw",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage: `url(${BG})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <Paper
          elevation={8}
          sx={{
            bgcolor: "rgba(255,255,255,0.90)",
            p: 6,
            borderRadius: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant="h4" fontWeight="bold" color="error" sx={{ mb: 2 }}>
            Appointment not found
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/my-appointments")}
            sx={{ borderRadius: 2, fontWeight: "bold", mt: 1 }}
          >
            Back to My Sessions
          </Button>
        </Paper>
      </Box>
    );
  }

  // Main content
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
                color: "#fff",
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
        <Paper
          elevation={10}
          sx={{
            width: "100%",
            maxWidth: "100%",
            bgcolor: "rgba(255,255,255,0.85)",
            borderRadius: 5,
            boxShadow: 10,
            p: { xs: 2, sm: 5 },
            mt: { xs: 2, sm: 0 },
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 3,
            }}
          >
            <Button
              startIcon={<ArrowBackIcon />}
              variant="outlined"
              color="primary"
              onClick={() => navigate("/my-appointments")}
              sx={{
                borderRadius: 2,
                fontWeight: "bold",
                px: 2,
                bgcolor: "rgba(34,69,98,0.08)",
                "&:hover": { bgcolor: "rgba(34,69,98,0.18)" },
              }}
            >
              Back to My Sessions
            </Button>
          </Box>

          {/* Appointment Details */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 5,
              alignItems: "flex-start",
              justifyContent: "center",
            }}
          >
            {/* Appointment Info Section */}
            <Box sx={{ flex: "2 1 500px", width: "100%" }}>
              <Typography
                variant="h4"
                fontWeight="bold"
                sx={{
                  color: "#224562",
                  mb: 1,
                  letterSpacing: 1,
                  textShadow: "0 2px 8px rgba(0,0,0,0.10)",
                }}
              >
                Session Details
              </Typography>
              <Typography sx={{ fontSize: 18, color: "text.secondary", mb: 2 }}>
                {appointment.clientName}&apos;s Session
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Box
                  component="ul"
                  sx={{ pl: 3, color: "#333", fontSize: 16, listStyle: "none", m: 0, p: 0 }}
                >
                  <li style={{ marginBottom: 12 }}>
                    <strong>Date:</strong> {new Date(appointment.date).toLocaleDateString()}
                  </li>
                  <li style={{ marginBottom: 12 }}>
                    <strong>Time:</strong> {appointment.time}
                  </li>
                  <li style={{ marginBottom: 12 }}>
                    <strong>Duration:</strong> {appointment.duration} minutes
                  </li>
                  <li style={{ marginBottom: 12 }}>
                    <strong>Session Type:</strong> {appointment.sessionType}
                  </li>
                  {appointment.classType && (
                    <li style={{ marginBottom: 12 }}>
                      <strong>Class Type:</strong> {appointment.classType}
                    </li>
                  )}
                  <li style={{ marginBottom: 12 }}>
                    <strong>Trainer:</strong> {appointment.trainer}
                  </li>
                  <li style={{ marginBottom: 12 }}>
                    <strong>Status:</strong>{" "}
                    <span
                      style={{
                        color:
                          appointment.status === "Completed"
                            ? theme.palette.success.main
                            : appointment.status === "Cancelled"
                            ? theme.palette.error.main
                            : "#224562",
                        fontWeight: "bold",
                        textTransform: "capitalize",
                      }}
                    >
                      {appointment.status || "Unknown"}
                    </span>
                  </li>
                  <li style={{ marginBottom: 12 }}>
                    <strong>Amount:</strong> Rs. {appointment.amount}
                  </li>
                  {appointment.notes && (
                    <li style={{ marginBottom: 12 }}>
                      <strong>Notes:</strong> {appointment.notes}
                    </li>
                  )}
                </Box>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default ViewAppointment;
