import React from "react";
import {
  Box,
  Button,
  Typography,
  Drawer,
  IconButton,
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

// Sidebar button config (reuse from your theme)
const sidebarButtons = [
  { text: "Home", icon: <Icon icon="codicon:home" fontSize={28} />, route: "/home", color: "primary" },
  { text: "Session", icon: <Icon icon="codicon:edit-session" fontSize={28} />, route: "/session-home", color: "primary" },
  { text: "Store", icon: <Icon icon="mdi:cart" fontSize={28} />, route: "/user-store", color: "primary" },
  { text: "Workout Plans", icon: <Icon icon="mdi:cart" fontSize={28} />, route: "/workout-plans-user", color: "primary" },
  { text: "Diet Plan", icon: <Icon icon="uis:schedule" fontSize={28} />, route: "/diet-plan-user", color: "warning" },
  { text: "Membership Plan", icon: <Icon icon="codicon:edit-session" fontSize={28} />, route: "/membership-plans-user", color: "primary" },
];

function GroupClass() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const handleBookNow = () => {
    navigate("/book-appointment?session=Group Class");
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
              position: "relative",
              width: "100%",
              minHeight: 280,
              borderRadius: 4,
              overflow: "hidden",
              mb: 5,
              background: "linear-gradient(120deg, #224562 60%, #2e5c7a 100%)",
              boxShadow: 6,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                background: "rgba(34,69,98,0.45)",
                zIndex: 1,
              }}
            />
            <Box
              sx={{
                position: "relative",
                zIndex: 2,
                color: "#fff",
                textAlign: "center",
                p: { xs: 3, sm: 6 },
                width: "100%",
              }}
            >
              <Typography variant="h3" fontWeight="bold" sx={{ mb: 2, letterSpacing: 2 }}>
                Group Classes
              </Typography>
              <Typography variant="h6" sx={{ mb: 3, maxWidth: 600, mx: "auto", fontWeight: 400 }}>
                Join our energetic group classes and experience the power of working out together.
                Perfect for those who thrive in a social, motivating environment.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                size="large"
                sx={{
                  borderRadius: 3,
                  fontWeight: "bold",
                  px: 5,
                  py: 1.5,
                  fontSize: 20,
                  boxShadow: "0 2px 8px 0 rgba(34,69,98,0.09)",
                }}
                onClick={handleBookNow}
              >
                Book Now
              </Button>
            </Box>
          </Box>

          {/* Features Section */}
          <Box sx={{ mb: 6 }}>
            <Typography variant="h4" fontWeight="bold" sx={{ color: "#224562", mb: 3, textAlign: "center" }}>
              Why Join Group Classes?
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
                  textAlign: "center",
                  minHeight: 140,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Typography variant="h6" fontWeight="bold" sx={{ color: "#224562" }}>
                  Motivating Environment
                </Typography>
                <Typography sx={{ fontSize: 16, mt: 1 }}>
                  Work out with others and feed off the group's energy to push yourself further.
                </Typography>
              </Paper>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  borderRadius: 4,
                  bgcolor: "rgba(245,248,255,0.95)",
                  textAlign: "center",
                  minHeight: 140,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Typography variant="h6" fontWeight="bold" sx={{ color: "#224562" }}>
                  Variety of Classes
                </Typography>
                <Typography sx={{ fontSize: 16, mt: 1 }}>
                  Choose from different class types and difficulty levels to suit your preferences.
                </Typography>
              </Paper>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  borderRadius: 4,
                  bgcolor: "rgba(245,248,255,0.95)",
                  textAlign: "center",
                  minHeight: 140,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Typography variant="h6" fontWeight="bold" sx={{ color: "#224562" }}>
                  Social Connection
                </Typography>
                <Typography sx={{ fontSize: 16, mt: 1 }}>
                  Meet like-minded people and build a supportive fitness community.
                </Typography>
              </Paper>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  borderRadius: 4,
                  bgcolor: "rgba(245,248,255,0.95)",
                  textAlign: "center",
                  minHeight: 140,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Typography variant="h6" fontWeight="bold" sx={{ color: "#224562" }}>
                  Cost-Effective
                </Typography>
                <Typography sx={{ fontSize: 16, mt: 1 }}>
                  Get professional guidance at a more affordable price than personal training.
                </Typography>
              </Paper>
            </Box>
          </Box>

          {/* Pricing Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" fontWeight="bold" sx={{ color: "#224562", mb: 3, textAlign: "center" }}>
              Pricing
            </Typography>
            <TableContainer component={Paper} sx={{ borderRadius: 4, boxShadow: 3, maxWidth: 540, mx: "auto", mb: 3 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold", fontSize: 18 }}>Class Level</TableCell>
                    <TableCell sx={{ fontWeight: "bold", fontSize: 18 }}>Duration</TableCell>
                    <TableCell sx={{ fontWeight: "bold", fontSize: 18 }}>Price</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Beginner</TableCell>
                    <TableCell>60 minutes</TableCell>
                    <TableCell>Rs. 800</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Intermediate</TableCell>
                    <TableCell>60 minutes</TableCell>
                    <TableCell>Rs. 880</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Advanced</TableCell>
                    <TableCell>60 minutes</TableCell>
                    <TableCell>Rs. 960</TableCell>
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
                  px: 5,
                  py: 1.5,
                  fontSize: 20,
                  boxShadow: "0 2px 8px 0 rgba(34,69,98,0.09)",
                }}
                onClick={handleBookNow}
              >
                Book Your Class
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default GroupClass;
