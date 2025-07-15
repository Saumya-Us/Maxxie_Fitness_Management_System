import React, { useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Typography,
  useMediaQuery,
  Drawer,
  Modal,
  Paper,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Icon } from "@iconify/react";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import BG from "../../Assests/BG2.jpg";
import Logopng from "../../Assests/maxxieslogos.png";
import { Link } from "react-router-dom";

// Example images for the slider
const images = [
  "https://images.ctfassets.net/0k812o62ndtw/WE3fGLHIvifgzs7iBw9Le/e66c3a58d6558193a49c1eaac72b713d/Gym_-_Kayla_-_7108-1024x683-27c3a53.jpg?w=1024&q=85",
  "https://cdn.centr.com/content/26000/25417/images/landscapewidemobile2x-lz-cable-upper-header-169-113350.jpg",
  "https://cdn.centr.com/content/26000/25417/images/landscapewidedesktop2x-453e6e8de6c08a086a8a48b2a6585430-cen23-255---cable-builder-program-hero-image-blog-619.jpg",
];

const sidebarButtons = [
  { text: "Home", icon: <Icon icon="codicon:home" fontSize={28} />, route: "/home", color: "primary" },
  { text: "Session", icon: <Icon icon="codicon:edit-session" fontSize={28} />, route: "/session-home", color: "primary" },
  { text: "Store", icon: <Icon icon="mdi:cart" fontSize={28} />, route: "/user-store", color: "primary" },
  { text: "Workout Plans", icon: <Icon icon="mdi:cart" fontSize={28} />, route: "/workout-plans-user", color: "primary" },
  { text: "Diet Plan", icon: <Icon icon="uis:schedule" fontSize={28} />, route: "/diet-plan-user", color: "warning" },
  { text: "Membership Plan", icon: <Icon icon="codicon:edit-session" fontSize={28} />, route: "/membership-plans-user", color: "primary" },
];

function Home() {
  const [index, setIndex] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const prevImage = () => {
    setIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleProfile = () => {
    setProfileOpen(false);
    navigate("/profile");
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    setProfileOpen(false);
    navigate("/");
  };

  // Sidebar content, shared for Drawer and Desktop
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
          flexDirection: "column",
          alignItems: "center",
          px: { xs: 1, sm: 6 },
          py: 6,
        }}
      >
        {/* Modern Navbar with Profile Icon */}
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
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <img src={Logopng} alt="Logo" style={{ width: 50, borderRadius: 8 }} />
            <Typography variant="h6" sx={{ fontWeight: "bold", letterSpacing: 1 }}>
              Max Fitness Club
            </Typography>
          </Box>
          <IconButton sx={{ color: "#fff" }} onClick={() => setProfileOpen(true)}>
            <AccountCircleIcon fontSize="large" />
          </IconButton>
        </Box>

        {/* Profile Modal */}
        <Modal open={profileOpen} onClose={() => setProfileOpen(false)}>
          <Paper
            sx={{
              position: "absolute",
              top: 80,
              right: 30,
              width: 300,
              padding: 3,
              boxShadow: 24,
              textAlign: "center",
              outline: "none",
            }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              Options
            </Typography>
            <Button
              fullWidth
              variant="contained"
              sx={{ mb: 2, fontWeight: "bold" }}
              onClick={handleProfile}
            >
              Profile
            </Button>
            <Button
              fullWidth
              variant="outlined"
              color="error"
              sx={{ fontWeight: "bold" }}
              onClick={handleLogout}
            >
              Log Out
            </Button>
          </Paper>
        </Modal>
        <Box
                  sx={{
                    width: "100%",
                    height: "100%",
                    maxWidth: "100%",
                    bgcolor: "rgba(255,255,255,0.7)",
                    borderRadius: 5,
                    boxShadow: 10,
                    p: { xs: 2, sm: 6 },
                    overflowX: "auto",
                    textAlign: "center",
                  }}
                >
        <Box sx={{ mb: 4, mt: 2 }}>
            <Typography variant="h3" fontWeight="bold" sx={{ color: "#224562", mb: 2 }}>
              Welcome to Max Fitness Club
            </Typography>
            <Typography variant="h6" sx={{ color: "#2e5c7a", mb: 4 }}>
              Your journey to a healthier lifestyle starts here!
            </Typography>
            
            {/* Image Slider */}
        <Box
          sx={{
            width: "100%",
            maxWidth: "100%",
            height: { xs: 220, sm: 400, md: 500 },
            bgcolor: "rgba(255,255,255,0.95)",
            borderRadius: 4,
            boxShadow: 8,
            position: "relative",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 2
            
          }}
        >
          <img
            src={images[index]}
            alt={`slide-${index}`}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "inherit",
              transition: "all 0.5s",
            }}
          />
          {/* Left Button */}
          <IconButton
            onClick={prevImage}
            sx={{
              position: "absolute",
              left: 18,
              top: "50%",
              transform: "translateY(-50%)",
              bgcolor: "rgba(34,69,98,0.75)",
              color: "#fff",
              "&:hover": { bgcolor: "rgba(34,69,98,1)" },
              zIndex: 2,
            }}
          >
            <ArrowBackIosNewIcon />
          </IconButton>
          {/* Right Button */}
          <IconButton
            onClick={nextImage}
            sx={{
              position: "absolute",
              right: 18,
              top: "50%",
              transform: "translateY(-50%)",
              bgcolor: "rgba(34,69,98,0.75)",
              color: "#fff",
              "&:hover": { bgcolor: "rgba(34,69,98,1)" },
              zIndex: 2,
            }}
          >
            <ArrowForwardIosIcon />
          </IconButton>
        </Box>
          </Box>
          </Box>
      </Box>
    </Box>
  );
}

export default Home;
