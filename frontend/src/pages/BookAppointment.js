// client/src/BookAppointment.js
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Drawer,
  IconButton,
  Tooltip,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme } from "@mui/material/styles";
import { useNavigate, useLocation } from "react-router-dom";
import { Icon } from "@iconify/react";
import axios from "axios";
import BG from "../Assests/BG2.jpg";
import Logopng from "../Assests/maxxieslogos.png";

axios.defaults.baseURL = "http://localhost:5000";

// Sidebar buttons (matching ProductDetail)
const sidebarButtons = [
  { text: "Home", icon: <Icon icon="codicon:home" fontSize={28} />, route: "/home", color: "primary" },
  { text: "Session", icon: <Icon icon="codicon:edit-session" fontSize={28} />, route: "/session-home", color: "primary" },
  { text: "Store", icon: <Icon icon="mdi:cart" fontSize={28} />, route: "/user-store", color: "primary" },
  { text: "Workout Plans", icon: <Icon icon="mdi:cart" fontSize={28} />, route: "/workout-plans-user", color: "primary" },
  { text: "Diet Plan", icon: <Icon icon="uis:schedule" fontSize={28} />, route: "/diet-plan-user", color: "warning" },
  { text: "Membership Plan", icon: <Icon icon="codicon:edit-session" fontSize={28} />, route: "/membership-plans-user", color: "primary" },
];

function BookAppointment() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const initialSessionType = queryParams.get("session") || "";
  const initialClassType = queryParams.get("type") || "N/A";

  const [formData, setFormData] = useState({
    clientName: "",
    sessionType: initialSessionType,
    classType: initialClassType,
    date: "",
    time: "",
    duration: 60,
    notes: "",
    trainer: "Select Trainer",
  });
  const [amount, setAmount] = useState(0);
  const [errors, setErrors] = useState({});
  const [drawerOpen, setDrawerOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const trainers = [
    "John Smith",
    "Sarah Johnson",
    "Mike Williams",
    "Emily Davis",
    "David Brown",
  ];

  useEffect(() => {
    calculateAmount(formData.sessionType, formData.classType, formData.duration);
    // eslint-disable-next-line
  }, [formData.sessionType, formData.classType, formData.duration]);

  const calculateAmount = (sessionType, classType, duration) => {
    let baseAmount = 0;
    switch (sessionType) {
      case "Personal Training":
        baseAmount = 2000;
        break;
      case "Group Class":
        baseAmount = 800;
        break;
      case "Yoga":
        baseAmount = 1000;
        break;
      case "CrossFit":
        baseAmount = 1200;
        break;
      default:
        baseAmount = 0;
    }
    if (classType === "Advanced") {
      baseAmount *= 1.2;
    } else if (classType === "Intermediate") {
      baseAmount *= 1.1;
    }
    const durationMultiplier = duration / 60;
    setAmount(Math.round(baseAmount * durationMultiplier));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "sessionType" && value !== "Group Class" ? { classType: "N/A" } : {}),
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const appointmentDate = new Date(formData.date);
      appointmentDate.setHours(0, 0, 0, 0);
      const [hours, minutes] = formData.time.split(":");
      const formattedTime = `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
      const appointmentData = {
        clientName: formData.clientName.trim(),
        sessionType: formData.sessionType,
        classType: formData.classType,
        date: appointmentDate,
        time: formattedTime,
        duration: Number(formData.duration),
        amount: Number(amount),
        notes: formData.notes.trim(),
        status: "Pending",
        trainer: formData.trainer,
      };
      const response = await axios.post("/api/appointment", appointmentData);
      if (response.data.success) {
        setFormData({
          clientName: "",
          sessionType: "",
          classType: "N/A",
          date: "",
          time: "",
          duration: 60,
          notes: "",
          trainer: "Select Trainer",
        });
        alert("Session booked successfully!");
        navigate("/my-appointments");
      } else {
        throw new Error(response.data.message || "Failed to book session");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.errors?.join("\n") ||
        error.message;
      alert("Failed to book session: " + errorMessage);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!formData.clientName.trim()) {
      newErrors.clientName = "Client name is required";
    } else if (formData.clientName.length < 2) {
      newErrors.clientName = "Client name must be at least 2 characters";
    }

    if (!formData.sessionType) {
      newErrors.sessionType = "Please select a session type";
    }

    if (formData.sessionType === "Group Class" && !formData.classType) {
      newErrors.classType = "Please select a class level";
    }

    if (!formData.date) {
      newErrors.date = "Please select a date";
    } else {
      const selectedDate = new Date(formData.date);
      selectedDate.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.date = "Date cannot be in the past";
      }
    }

    if (!formData.time) {
      newErrors.time = "Please select a time";
    } else {
      const [hours, minutes] = formData.time.split(":").map(Number);
      if (hours < 6 || hours >= 21) {
        newErrors.time = "Time must be between 6:00 AM and 9:00 PM";
      }
    }

    if (!formData.duration) {
      newErrors.duration = "Please select a duration";
    } else if (![30, 45, 60, 90].includes(Number(formData.duration))) {
      newErrors.duration = "Invalid duration selected";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
            maxWidth: 600,
            bgcolor: "rgba(255,255,255,0.85)",
            borderRadius: 5,
            boxShadow: 10,
            p: { xs: 2, sm: 5 },
            mt: { xs: 2, sm: 0 },
          }}
        >
          {/* Header actions */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              variant="outlined"
              color="primary"
              onClick={() => navigate("/services/yoga")}
              sx={{
                borderRadius: 2,
                fontWeight: "bold",
                px: 2,
                bgcolor: "rgba(34,69,98,0.08)",
                "&:hover": { bgcolor: "rgba(34,69,98,0.18)" },
              }}
            >
              Back
            </Button>
          </Box>

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
            Book a Fitness Session 💪
          </Typography>
          <Typography sx={{ fontSize: 18, color: "text.secondary", mb: 3 }}>
            Schedule your workout with our expert trainers.
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextField
              label="Your Name"
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              error={!!errors.clientName}
              helperText={errors.clientName}
              fullWidth
              InputProps={{ sx: { borderRadius: 2, bgcolor: "#f5f8ff" } }}
            />

            <FormControl fullWidth error={!!errors.sessionType}>
              <InputLabel>Session Type</InputLabel>
              <Select
                label="Session Type"
                name="sessionType"
                value={formData.sessionType}
                onChange={handleChange}
                sx={{ borderRadius: 2, bgcolor: "#f5f8ff" }}
              >
                <MenuItem value="">Select a session type</MenuItem>
                <MenuItem value="Personal Training">Personal Training</MenuItem>
                <MenuItem value="Group Class">Group Class</MenuItem>
                <MenuItem value="Yoga">Yoga</MenuItem>
                <MenuItem value="CrossFit">CrossFit</MenuItem>
              </Select>
              {errors.sessionType && (
                <Typography color="error" sx={{ fontSize: 13, mt: 0.5 }}>
                  {errors.sessionType}
                </Typography>
              )}
            </FormControl>

            {formData.sessionType === "Group Class" && (
              <FormControl fullWidth error={!!errors.classType}>
                <InputLabel>Class Level</InputLabel>
                <Select
                  label="Class Level"
                  name="classType"
                  value={formData.classType}
                  onChange={handleChange}
                  sx={{ borderRadius: 2, bgcolor: "#f5f8ff" }}
                >
                  <MenuItem value="Beginner">Beginner</MenuItem>
                  <MenuItem value="Intermediate">Intermediate</MenuItem>
                  <MenuItem value="Advanced">Advanced</MenuItem>
                </Select>
                {errors.classType && (
                  <Typography color="error" sx={{ fontSize: 13, mt: 0.5 }}>
                    {errors.classType}
                  </Typography>
                )}
              </FormControl>
            )}

            <FormControl fullWidth>
              <InputLabel>Session Duration (minutes)</InputLabel>
              <Select
                label="Session Duration (minutes)"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                sx={{ borderRadius: 2, bgcolor: "#f5f8ff" }}
              >
                <MenuItem value={30}>30 minutes</MenuItem>
                <MenuItem value={45}>45 minutes</MenuItem>
                <MenuItem value={60}>60 minutes</MenuItem>
                <MenuItem value={90}>90 minutes</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Preferred Date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              error={!!errors.date}
              helperText={errors.date}
              fullWidth
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: { borderRadius: 2, bgcolor: "#f5f8ff" } }}
            />

            <TextField
              label="Preferred Time"
              name="time"
              type="time"
              value={formData.time}
              onChange={handleChange}
              error={!!errors.time}
              helperText={errors.time}
              fullWidth
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: { borderRadius: 2, bgcolor: "#f5f8ff" } }}
            />

            <FormControl fullWidth>
              <InputLabel>Select Trainer</InputLabel>
              <Select
                label="Select Trainer"
                name="trainer"
                value={formData.trainer}
                onChange={handleChange}
                sx={{ borderRadius: 2, bgcolor: "#f5f8ff" }}
                required
              >
                <MenuItem value="Select Trainer">Select Trainer</MenuItem>
                {trainers.map((trainer, idx) => (
                  <MenuItem key={idx} value={trainer}>
                    {trainer}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Additional Notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              fullWidth
              multiline
              minRows={3}
              InputProps={{ sx: { borderRadius: 2, bgcolor: "#f5f8ff" } }}
            />

            <Typography
              sx={{
                fontWeight: "bold",
                fontSize: 18,
                color: "#224562",
                mt: 1,
                mb: 1,
              }}
            >
              Total Amount: Rs.{amount}
            </Typography>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{
                fontWeight: "bold",
                borderRadius: 2,
                px: 4,
                py: 1.5,
                fontSize: 18,
                boxShadow: "0 2px 8px 0 rgba(34,69,98,0.09)",
              }}
            >
              Book Session
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}

export default BookAppointment;
