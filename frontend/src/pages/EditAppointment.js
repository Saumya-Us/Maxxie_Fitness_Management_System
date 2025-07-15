import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Drawer,
  Typography,
  Paper,
  IconButton,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Tooltip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Icon } from "@iconify/react";
import BG from "../Assests/BG2.jpg";
import Logopng from "../Assests/maxxieslogos.png";

// Sidebar buttons (same as ProductDetail)
const sidebarButtons = [
  { text: "Home", icon: <Icon icon="codicon:home" fontSize={28} />, route: "/home", color: "primary" },
  { text: "Session", icon: <Icon icon="codicon:edit-session" fontSize={28} />, route: "/session-home", color: "primary" },
  { text: "Store", icon: <Icon icon="mdi:cart" fontSize={28} />, route: "/user-store", color: "primary" },
  { text: "Workout Plans", icon: <Icon icon="mdi:cart" fontSize={28} />, route: "/workout-plans-user", color: "primary" },
  { text: "Diet Plan", icon: <Icon icon="uis:schedule" fontSize={28} />, route: "/diet-plan-user", color: "warning" },
  { text: "Membership Plan", icon: <Icon icon="codicon:edit-session" fontSize={28} />, route: "/membership-plans-user", color: "primary" },
];

const EditAppointment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [appointment, setAppointment] = useState({
    clientName: "",
    sessionType: "",
    classType: "",
    date: "",
    time: "",
    duration: 60,
    amount: 0,
    notes: "",
    status: "Pending",
    trainer: "Select Trainer",
  });

  const trainers = [
    "John Smith",
    "Sarah Johnson",
    "Mike Williams",
    "Emily Davis",
    "David Brown",
  ];

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/appointment/${id}`);
        const res = await response.json();
        if (!res || !res.success) throw new Error("No appointment data returned");
        const data = res.data;
        setAppointment({
          ...data,
          date: new Date(data.date).toISOString().split("T")[0],
        });
      } catch (error) {
        toast.error("Failed to fetch appointment details");
        navigate("/my-appointments");
      } finally {
        setLoading(false);
      }
    };
    fetchAppointment();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAppointment((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/appointment/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(appointment),
      });
      const res = await response.json();
      if (res.success) {
        toast.success("Session updated successfully");
        navigate("/my-appointments");
      } else {
        throw new Error(res.message || "Failed to update session");
      }
    } catch (error) {
      toast.error(error.message || "Failed to update session");
    }
  };

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
          <Typography sx={{ mt: 2, fontWeight: "bold" }}>Loading session details...</Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        minWidth: "100vw",
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
            maxWidth: 800,
            bgcolor: "rgba(255,255,255,0.85)",
            borderRadius: 5,
            boxShadow: 10,
            p: { xs: 2, sm: 5 },
            mt: { xs: 2, sm: 0 },
          }}
        >
          <ToastContainer position="top-right" autoClose={3000} />
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
              Back to Appointments
            </Button>
            <Tooltip title="Close">
              <IconButton
                onClick={() => navigate("/my-appointments")}
                sx={{
                  ml: 2,
                  bgcolor: "rgba(34,69,98,0.92)",
                  color: "#fff",
                  boxShadow: 2,
                  "&:hover": { bgcolor: "rgba(34,69,98,1)" },
                }}
              >
                <CloseIcon fontSize="large" />
              </IconButton>
            </Tooltip>
          </Box>
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{
              color: "#224562",
              mb: 3,
              letterSpacing: 1,
              textShadow: "0 2px 8px rgba(0,0,0,0.10)",
            }}
          >
            Edit Session
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 4,
            }}
          >
            {/* Client Name */}
            <TextField
              label="Client Name"
              name="clientName"
              value={appointment.clientName}
              onChange={handleChange}
              required
              fullWidth
              sx={{ mb: 2, bgcolor: "#f5f8ff", borderRadius: 2 }}
              InputProps={{
                sx: { borderRadius: 2, fontWeight: "bold" },
              }}
            />

            {/* Session Type */}
            <FormControl fullWidth required sx={{ mb: 2, bgcolor: "#f5f8ff", borderRadius: 2 }}>
              <InputLabel>Session Type</InputLabel>
              <Select
                label="Session Type"
                name="sessionType"
                value={appointment.sessionType}
                onChange={handleChange}
                sx={{ borderRadius: 2, fontWeight: "bold" }}
              >
                <MenuItem value="">Select Session Type</MenuItem>
                <MenuItem value="Personal Training">Personal Training</MenuItem>
                <MenuItem value="Group Class">Group Class</MenuItem>
                <MenuItem value="Yoga">Yoga</MenuItem>
                <MenuItem value="CrossFit">CrossFit</MenuItem>
              </Select>
            </FormControl>

            {/* Class Type (conditionally shown) */}
            {appointment.sessionType === "Group Class" && (
              <FormControl fullWidth required sx={{ mb: 2, bgcolor: "#f5f8ff", borderRadius: 2 }}>
                <InputLabel>Class Type</InputLabel>
                <Select
                  label="Class Type"
                  name="classType"
                  value={appointment.classType}
                  onChange={handleChange}
                  sx={{ borderRadius: 2, fontWeight: "bold" }}
                >
                  <MenuItem value="">Select Class Type</MenuItem>
                  <MenuItem value="Beginner">Beginner</MenuItem>
                  <MenuItem value="Intermediate">Intermediate</MenuItem>
                  <MenuItem value="Advanced">Advanced</MenuItem>
                </Select>
              </FormControl>
            )}

            {/* Date */}
            <TextField
              label="Date"
              type="date"
              name="date"
              value={appointment.date}
              onChange={handleChange}
              required
              fullWidth
              sx={{ mb: 2, bgcolor: "#f5f8ff", borderRadius: 2 }}
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: { borderRadius: 2, fontWeight: "bold" } }}
            />

            {/* Time */}
            <TextField
              label="Time"
              type="time"
              name="time"
              value={appointment.time}
              onChange={handleChange}
              required
              fullWidth
              sx={{ mb: 2, bgcolor: "#f5f8ff", borderRadius: 2 }}
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: { borderRadius: 2, fontWeight: "bold" } }}
            />

            {/* Duration */}
            <FormControl fullWidth required sx={{ mb: 2, bgcolor: "#f5f8ff", borderRadius: 2 }}>
              <InputLabel>Duration (minutes)</InputLabel>
              <Select
                label="Duration (minutes)"
                name="duration"
                value={appointment.duration}
                onChange={handleChange}
                sx={{ borderRadius: 2, fontWeight: "bold" }}
              >
                <MenuItem value={30}>30 minutes</MenuItem>
                <MenuItem value={45}>45 minutes</MenuItem>
                <MenuItem value={60}>60 minutes</MenuItem>
                <MenuItem value={90}>90 minutes</MenuItem>
              </Select>
            </FormControl>

            {/* Amount */}
            <TextField
              label="Amount"
              type="number"
              name="amount"
              value={appointment.amount}
              onChange={handleChange}
              required
              fullWidth
              sx={{ mb: 2, bgcolor: "#f5f8ff", borderRadius: 2 }}
              InputProps={{ sx: { borderRadius: 2, fontWeight: "bold" } }}
            />

            {/* Status */}
            <FormControl fullWidth required sx={{ mb: 2, bgcolor: "#f5f8ff", borderRadius: 2 }}>
              <InputLabel>Status</InputLabel>
              <Select
                label="Status"
                name="status"
                value={appointment.status}
                onChange={handleChange}
                sx={{ borderRadius: 2, fontWeight: "bold" }}
              >
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Confirmed">Confirmed</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
                <MenuItem value="Cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>

            {/* Trainer */}
            <FormControl fullWidth required sx={{ mb: 2, bgcolor: "#f5f8ff", borderRadius: 2 }}>
              <InputLabel>Trainer</InputLabel>
              <Select
                label="Trainer"
                name="trainer"
                value={appointment.trainer}
                onChange={handleChange}
                sx={{ borderRadius: 2, fontWeight: "bold" }}
              >
                <MenuItem value="Select Trainer">Select Trainer</MenuItem>
                {trainers.map((trainer, idx) => (
                  <MenuItem key={idx} value={trainer}>
                    {trainer}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Notes */}
            <TextField
              label="Notes"
              name="notes"
              value={appointment.notes}
              onChange={handleChange}
              multiline
              rows={3}
              fullWidth
              sx={{
                mb: 2,
                gridColumn: { md: "span 2" },
                bgcolor: "#f5f8ff",
                borderRadius: 2,
              }}
              InputProps={{ sx: { borderRadius: 2, fontWeight: "bold" } }}
            />

            {/* Actions */}
            <Box
              sx={{
                gridColumn: { md: "span 2" },
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
                mt: 2,
              }}
            >
              <Button
                type="button"
                variant="outlined"
                color="error"
                onClick={() => navigate("/my-appointments")}
                sx={{
                  borderRadius: 2,
                  fontWeight: "bold",
                  px: 4,
                  bgcolor: "rgba(34,69,98,0.08)",
                  "&:hover": { bgcolor: "rgba(34,69,98,0.18)" },
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{
                  fontWeight: "bold",
                  borderRadius: 2,
                  px: 4,
                  boxShadow: "0 2px 8px 0 rgba(34,69,98,0.09)",
                }}
              >
                Update Session
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default EditAppointment;
