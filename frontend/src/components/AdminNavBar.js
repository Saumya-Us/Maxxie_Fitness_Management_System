import React, { useEffect, useState } from "react";
import {
  Box,
  IconButton,
  Typography,
  Modal,
  Paper,
  Button
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Logopng from "../Assests/maxxieslogos.png";
import { useNavigate, useLocation } from "react-router-dom";
import FeedbackNotificationDropdown from "./FeedbackNotificationDropdown";

const navigationItems = [
  { name: "Suppliments Store", path: "/suppliment-home" },
  { name: "Users", path: "/userinfo" },
  { name: "Workout Plans", path: "/workout-plans" },
  { name: "Diet Plans", path: "/diet-plans" },
  { name: "Membership Plans", path: "/membership-plans" },
  { name: "Appointments", path: "/admin/appointments" }
];

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeItem, setActiveItem] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const currentPath = "/" + location.pathname.split("/")[1];
    setActiveItem(currentPath);
  }, [location.pathname]);

  const handleItemClick = (path) => {
    setActiveItem(path);
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/");
  };

  const handleProfile = () => {
    // Update with your profile route if needed
    navigate("/profile");
    setOpen(false);
  };

  return (
    <>
      <Box
        sx={{
          width: "100%",
          maxWidth: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 4,
          px: { xs: 0, sm: 2 },
          py: 1,
          borderRadius: 3,
          background: "linear-gradient(90deg, #224562 0%, #2e5c7a 100%)",
          color: "#fff",
          boxShadow: 3,
        }}
      >
        {/* Logo and Title */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <img src={Logopng} alt="Logo" style={{ width: 50, borderRadius: 8 }} />
          <Typography variant="h6" sx={{ fontWeight: "bold", letterSpacing: 1 }}>
            Max Fitness Club
          </Typography>
        </Box>

        {/* Navigation Items */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
          {navigationItems.map((item) => (
            <Typography
              key={item.name}
              sx={{
                cursor: "pointer",
                color: activeItem === item.path ? "yellow" : "white",
                fontWeight: "bold",
                transition: "0.3s",
                "&:hover": { color: "lightgray" },
                fontSize: { xs: "0.9rem", sm: "1rem" },
              }}
              onClick={() => handleItemClick(item.path)}
            >
              {item.name}
            </Typography>
          ))}
        </Box>

        {/* Feedback & Profile Icon */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <FeedbackNotificationDropdown />
          <IconButton sx={{ color: "#fff" }} onClick={() => setOpen(true)}>
            <AccountCircleIcon fontSize="large" />
          </IconButton>
        </Box>
      </Box>

      {/* Profile/Logout Modal */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Paper
          sx={{
            position: "absolute",
            top: 70,
            right: 5,
            width: 300,
            padding: 3,
            boxShadow: 24,
            textAlign: "center",
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Options
          </Typography>
          <Button
            fullWidth
            variant="contained"
            sx={{ mb: 2 }}
            onClick={handleProfile}
          >
            Profile
          </Button>
          <Button
            fullWidth
            variant="outlined"
            color="error"
            onClick={handleLogout}
          >
            Log Out
          </Button>
        </Paper>
      </Modal>
    </>
  );
}
