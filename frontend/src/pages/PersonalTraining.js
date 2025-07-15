import React, { useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Typography,
  Drawer,
  useMediaQuery,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Icon } from "@iconify/react";
import { useTheme } from "@mui/material/styles";
import { useNavigate, Link } from "react-router-dom";
import BG from "../Assests/BG2.jpg";
import Logopng from "../Assests/maxxieslogos.png";

// Sidebar button config
const sidebarButtons = [
  { text: "Home", icon: <Icon icon="codicon:home" fontSize={28} />, route: "/home", color: "primary" },
  { text: "Session", icon: <Icon icon="codicon:edit-session" fontSize={28} />, route: "/session-home", color: "primary" },
  { text: "Store", icon: <Icon icon="mdi:cart" fontSize={28} />, route: "/user-store", color: "primary" },
  { text: "Workout Plans", icon: <Icon icon="mdi:cart" fontSize={28} />, route: "/workout-plans-user", color: "primary" },
  { text: "Diet Plan", icon: <Icon icon="uis:schedule" fontSize={28} />, route: "/diet-plan-user", color: "warning" },
  { text: "Membership Plan", icon: <Icon icon="codicon:edit-session" fontSize={28} />, route: "/membership-plans-user", color: "primary" },
];

function PersonalTraining() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [drawerOpen, setDrawerOpen] = useState(false);

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
            bgcolor: "rgba(255,255,255,0.7)",
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

          {/* Hero Section */}
          <Box
            sx={{
              backgroundImage: `url(/images/personal-training-hero.jpg)`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              borderRadius: 4,
              overflow: "hidden",
              mb: 4,
              position: "relative",
              minHeight: { xs: 220, sm: 320 },
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(90deg, rgba(34,69,98,0.85) 0%, rgba(46,92,122,0.7) 100%)",
                zIndex: 1,
              }}
            />
            <Box
              sx={{
                position: "relative",
                zIndex: 2,
                color: "#fff",
                textAlign: "center",
                width: "100%",
                px: { xs: 2, sm: 6 },
                py: { xs: 4, sm: 8 },
              }}
            >
              <Typography variant="h3" fontWeight="bold" sx={{ mb: 2, letterSpacing: 1 }}>
                Personal Training
              </Typography>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 400 }}>
                Transform your fitness journey with personalized training sessions tailored to your goals.
                Our expert trainers will guide you every step of the way.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                size="large"
                sx={{
                  borderRadius: 3,
                  fontWeight: "bold",
                  fontSize: 18,
                  px: 4,
                  boxShadow: "0 2px 8px 0 rgba(34,69,98,0.09)",
                }}
                component={Link}
                to="/book-appointment"
              >
                Start Your Journey
              </Button>
            </Box>
          </Box>

          {/* Features Section */}
          <Box sx={{ mb: 6 }}>
            <Typography
              variant="h4"
              fontWeight="bold"
              sx={{ color: "#224562", mb: 3, textAlign: "center" }}
            >
              Why Choose Personal Training?
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr 1fr" },
                gap: 3,
              }}
            >
              <Box
                sx={{
                  bgcolor: "rgba(245,248,255,0.95)",
                  borderRadius: 3,
                  boxShadow: 4,
                  p: 3,
                  textAlign: "center",
                  minHeight: 160,
                }}
              >
                <Typography variant="h6" fontWeight="bold" sx={{ color: "#224562", mb: 1 }}>
                  Personalized Approach
                </Typography>
                <Typography variant="body1" sx={{ fontSize: 16 }}>
                  Custom workout plans designed specifically for your fitness goals, body type, and preferences.
                </Typography>
              </Box>
              <Box
                sx={{
                  bgcolor: "rgba(245,248,255,0.95)",
                  borderRadius: 3,
                  boxShadow: 4,
                  p: 3,
                  textAlign: "center",
                  minHeight: 160,
                }}
              >
                <Typography variant="h6" fontWeight="bold" sx={{ color: "#224562", mb: 1 }}>
                  Expert Guidance
                </Typography>
                <Typography variant="body1" sx={{ fontSize: 16 }}>
                  Learn proper form and technique from certified trainers with years of experience.
                </Typography>
              </Box>
              <Box
                sx={{
                  bgcolor: "rgba(245,248,255,0.95)",
                  borderRadius: 3,
                  boxShadow: 4,
                  p: 3,
                  textAlign: "center",
                  minHeight: 160,
                }}
              >
                <Typography variant="h6" fontWeight="bold" sx={{ color: "#224562", mb: 1 }}>
                  Flexible Scheduling
                </Typography>
                <Typography variant="body1" sx={{ fontSize: 16 }}>
                  Choose from various time slots that fit your busy schedule perfectly.
                </Typography>
              </Box>
              <Box
                sx={{
                  bgcolor: "rgba(245,248,255,0.95)",
                  borderRadius: 3,
                  boxShadow: 4,
                  p: 3,
                  textAlign: "center",
                  minHeight: 160,
                }}
              >
                <Typography variant="h6" fontWeight="bold" sx={{ color: "#224562", mb: 1 }}>
                  Progress Tracking
                </Typography>
                <Typography variant="body1" sx={{ fontSize: 16 }}>
                  Regular assessments and progress monitoring to ensure you're on track to reach your goals.
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Pricing Section */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h4"
              fontWeight="bold"
              sx={{ color: "#224562", mb: 3, textAlign: "center" }}
            >
              Training Packages
            </Typography>
            <TableContainer
              component={Paper}
              sx={{
                background: "rgba(245,248,255,0.98)",
                borderRadius: 3,
                boxShadow: 4,
                mb: 3,
                maxWidth: 700,
                mx: "auto",
              }}
              elevation={0}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold", fontSize: 16 }}>Package</TableCell>
                    <TableCell sx={{ fontWeight: "bold", fontSize: 16 }}>Sessions</TableCell>
                    <TableCell sx={{ fontWeight: "bold", fontSize: 16 }}>Duration</TableCell>
                    <TableCell sx={{ fontWeight: "bold", fontSize: 16 }}>Price</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Starter</TableCell>
                    <TableCell>5 Sessions</TableCell>
                    <TableCell>60 minutes</TableCell>
                    <TableCell>$299</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Progressive</TableCell>
                    <TableCell>10 Sessions</TableCell>
                    <TableCell>60 minutes</TableCell>
                    <TableCell>$549</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Elite</TableCell>
                    <TableCell>20 Sessions</TableCell>
                    <TableCell>60 minutes</TableCell>
                    <TableCell>$999</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
            <Box sx={{ textAlign: "center" }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                sx={{
                  borderRadius: 3,
                  fontWeight: "bold",
                  fontSize: 18,
                  px: 4,
                  boxShadow: "0 2px 8px 0 rgba(34,69,98,0.09)",
                }}
                component={Link}
                to="/book-appointment"
              >
                Book Your Session
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default PersonalTraining;
