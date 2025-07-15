import React from "react";
import {
  Box,
  Button,
  IconButton,
  Typography,
  useMediaQuery,
  Drawer,
  Paper,
  Fade,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Icon } from "@iconify/react";
import { useTheme } from "@mui/material/styles";
import { useNavigate, Link } from "react-router-dom";
import BG from "../Assests/BG2.jpg";
import Logopng from "../Assests/maxxieslogos.png";

// Sidebar button config (reuse)
const sidebarButtons = [
  { text: "Home", icon: <Icon icon="codicon:home" fontSize={28} />, route: "/home", color: "primary" },
  { text: "Session", icon: <Icon icon="codicon:edit-session" fontSize={28} />, route: "/session-home", color: "primary" },
  { text: "Schedule", icon: <Icon icon="uis:schedule" fontSize={28} />, route: "/schedule", color: "warning" },
  { text: "Store", icon: <Icon icon="mdi:cart" fontSize={28} />, route: "/user-store", color: "primary" },
  { text: "Workout Plans", icon: <Icon icon="mdi:cart" fontSize={28} />, route: "/workout-plans-user", color: "primary" },
  { text: "Diet Plan", icon: <Icon icon="uis:schedule" fontSize={28} />, route: "/diet-plan-user", color: "warning" },
  { text: "Membership Plan", icon: <Icon icon="codicon:edit-session" fontSize={28} />, route: "/membership-plans-user", color: "primary" },
];

function Yoga() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const handleBookNow = () => {
    navigate("/book-appointment?session=Yoga");
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
              borderRadius: 4,
              boxShadow: 4,
              mb: 5,
              position: "relative",
              overflow: "hidden",
              minHeight: 320,
              background: "linear-gradient(120deg, #e3e8ee 60%, #f5f8ff 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Fade in timeout={800}>
              <Box
                sx={{
                  width: "100%",
                  p: { xs: 2, sm: 6 },
                  textAlign: "center",
                  color: "#224562",
                  background: "rgba(255,255,255,0.7)",
                }}
              >
                <Typography variant="h3" fontWeight="bold" sx={{ mb: 2 }}>
                  Yoga Classes
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: 20,
                    mb: 3,
                    color: "#224562",
                    fontWeight: 500,
                  }}
                >
                  Find your inner peace and improve your flexibility with our expert-led yoga classes.
                  Suitable for all levels, from beginners to advanced practitioners.
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  sx={{
                    fontWeight: "bold",
                    borderRadius: 2,
                    px: 4,
                    py: 1.5,
                    fontSize: 18,
                    boxShadow: "0 2px 8px 0 rgba(34,69,98,0.09)",
                  }}
                  onClick={handleBookNow}
                >
                  Book Now
                </Button>
              </Box>
            </Fade>
          </Box>

          {/* Benefits Section */}
          <Box sx={{ mb: 6 }}>
            <Typography
              variant="h4"
              fontWeight="bold"
              sx={{ mb: 3, color: "#224562", textAlign: "center" }}
            >
              Benefits of Yoga
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr 1fr" },
                gap: 3,
              }}
            >
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  borderRadius: 4,
                  bgcolor: "rgba(245,248,255,0.95)",
                  minHeight: 160,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  boxShadow: 5,
                }}
              >
                <Typography variant="h6" fontWeight="bold" sx={{ color: "#224562" }}>
                  Mind-Body Connection
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, fontSize: 15 }}>
                  Develop greater awareness of your body and mind through mindful movement.
                </Typography>
              </Paper>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  borderRadius: 4,
                  bgcolor: "rgba(245,248,255,0.95)",
                  minHeight: 160,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  boxShadow: 5,
                }}
              >
                <Typography variant="h6" fontWeight="bold" sx={{ color: "#224562" }}>
                  Stress Relief
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, fontSize: 15 }}>
                  Learn breathing techniques and meditation to reduce stress and anxiety.
                </Typography>
              </Paper>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  borderRadius: 4,
                  bgcolor: "rgba(245,248,255,0.95)",
                  minHeight: 160,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  boxShadow: 5,
                }}
              >
                <Typography variant="h6" fontWeight="bold" sx={{ color: "#224562" }}>
                  Improved Flexibility
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, fontSize: 15 }}>
                  Gradually increase your range of motion and prevent injuries.
                </Typography>
              </Paper>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  borderRadius: 4,
                  bgcolor: "rgba(245,248,255,0.95)",
                  minHeight: 160,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  boxShadow: 5,
                }}
              >
                <Typography variant="h6" fontWeight="bold" sx={{ color: "#224562" }}>
                  Better Posture
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, fontSize: 15 }}>
                  Strengthen your core and improve your alignment for better posture.
                </Typography>
              </Paper>
            </Box>
          </Box>

          {/* Pricing Section */}
          <Box
            sx={{
              mb: 4,
              textAlign: "center",
              borderRadius: 4,
              bgcolor: "rgba(245,248,255,0.95)",
              boxShadow: 5,
              p: { xs: 2, sm: 4 },
            }}
          >
            <Typography variant="h4" fontWeight="bold" sx={{ mb: 2, color: "#224562" }}>
              Pricing
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <table style={{ width: "auto", borderCollapse: "collapse", fontSize: 17 }}>
                <thead>
                  <tr style={{ background: "#e3e8ee", color: "#224562" }}>
                    <th style={{ padding: "10px 24px" }}>Duration</th>
                    <th style={{ padding: "10px 24px" }}>Price (Rs.)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: "10px 24px" }}>30 minutes</td>
                    <td style={{ padding: "10px 24px" }}>Rs. 500</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "10px 24px" }}>45 minutes</td>
                    <td style={{ padding: "10px 24px" }}>Rs. 750</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "10px 24px" }}>60 minutes</td>
                    <td style={{ padding: "10px 24px" }}>Rs. 1000</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "10px 24px" }}>90 minutes</td>
                    <td style={{ padding: "10px 24px" }}>Rs. 1500</td>
                  </tr>
                </tbody>
              </table>
            </Box>
            <Button
              variant="contained"
              color="primary"
              size="large"
              sx={{
                mt: 3,
                fontWeight: "bold",
                borderRadius: 2,
                px: 4,
                py: 1.5,
                fontSize: 18,
                boxShadow: "0 2px 8px 0 rgba(34,69,98,0.09)",
              }}
              onClick={handleBookNow}
            >
              Book Your Session
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Yoga;
