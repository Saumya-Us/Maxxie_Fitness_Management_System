import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  Paper,
  Drawer,
  IconButton,
  Container,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import { Icon } from "@iconify/react";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import BG from "../../Assests/BG2.jpg";
import Logopng from "../../Assests/maxxieslogos.png";

// Sidebar buttons, matching your main theme
const sidebarButtons = [
  { text: "Home", icon: <Icon icon="codicon:home" fontSize={28} />, route: "/home", color: "primary" },
  { text: "Session", icon: <Icon icon="codicon:edit-session" fontSize={28} />, route: "/session-home", color: "primary" },
  { text: "Store", icon: <Icon icon="mdi:cart" fontSize={28} />, route: "/user-store", color: "primary" },
  { text: "Workout Plans", icon: <Icon icon="mdi:cart" fontSize={28} />, route: "/workout-plans-user", color: "primary" },
  { text: "Diet Plan", icon: <Icon icon="uis:schedule" fontSize={28} />, route: "/diet-plan-user", color: "warning" },
  { text: "Membership Plan", icon: <Icon icon="codicon:edit-session" fontSize={28} />, route: "/membership-plans-user", color: "primary" },
];

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    weight: "",
  });
  const [userId, setUserId] = useState(null);
  const [deleteRequested, setDeleteRequested] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Fetch user details from token
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.error("No token found");
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      const id = decodedToken.id;
      setUserId(id);

      axios
        .get(`http://localhost:5000/user/${id}`)
        .then((response) => {
          setUser(response.data);
          setDeleteRequested(response.data.deleteRequest);
          setUpdatedUser({
            firstName: response.data.firstName || "",
            lastName: response.data.lastName || "",
            email: response.data.email || "",
            phone: response.data.phone || "",
            weight: response.data.weight || "",
          });
        })
        .catch((error) => {
          console.error("Error fetching user:", error);
        });
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }, []);

  // Update user details
  const handleUpdate = async () => {
    if (!userId) return;

    try {
      const response = await axios.put(
        `http://localhost:5000/user/${userId}`,
        updatedUser
      );
      setUser(response.data);
      setEditMode(false);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  // Delete user account
  const handleDeleteRequest = async () => {
    if (!userId) return;

    try {
      await axios.put(`http://localhost:5000/user/request-delete/${userId}`);
      setDeleteRequested(true);
      alert("Delete request sent to admin.");
    } catch (error) {
      console.error("Error requesting account deletion:", error);
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
            <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
              <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: "#fff" }}>
                <CloseIcon />
              </IconButton>
            </Box>
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
              onClick={() => navigate(-1)}
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
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                color: "#224562",
                letterSpacing: 1,
                textShadow: "0 2px 8px rgba(0,0,0,0.10)",
              }}
            >
              Profile
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Button variant="contained" color="primary" onClick={() => userId ? navigate('/payment-history', { state: { userId } }) : alert('User ID not found.')}>
              View Payment History
            </Button>
            <Button variant="contained" color="primary" onClick={() => navigate('/paymentpage')}>
              Make a Payment
            </Button>
          </Box>

          {editMode ? (
            <>
              <TextField
                label="First Name"
                fullWidth
                margin="normal"
                value={updatedUser.firstName}
                onChange={(e) =>
                  setUpdatedUser({
                    ...updatedUser,
                    firstName: e.target.value,
                  })
                }
                sx={{
                  bgcolor: "#f5f8ff",
                  borderRadius: 2,
                  mb: 2,
                }}
              />
              <TextField
                label="Last Name"
                fullWidth
                margin="normal"
                value={updatedUser.lastName}
                onChange={(e) =>
                  setUpdatedUser({ ...updatedUser, lastName: e.target.value })
                }
                sx={{
                  bgcolor: "#f5f8ff",
                  borderRadius: 2,
                  mb: 2,
                }}
              />
              <TextField
                label="Email"
                fullWidth
                margin="normal"
                value={updatedUser.email}
                onChange={(e) =>
                  setUpdatedUser({ ...updatedUser, email: e.target.value })
                }
                sx={{
                  bgcolor: "#f5f8ff",
                  borderRadius: 2,
                  mb: 2,
                }}
              />
              <TextField
                label="Phone Number"
                fullWidth
                margin="normal"
                value={updatedUser.phone}
                onChange={(e) =>
                  setUpdatedUser({ ...updatedUser, phone: e.target.value })
                }
                sx={{
                  bgcolor: "#f5f8ff",
                  borderRadius: 2,
                  mb: 2,
                }}
              />
              <TextField
                label="Weight"
                fullWidth
                margin="normal"
                value={updatedUser.weight}
                onChange={(e) =>
                  setUpdatedUser({ ...updatedUser, weight: e.target.value })
                }
                sx={{
                  bgcolor: "#f5f8ff",
                  borderRadius: 2,
                  mb: 2,
                }}
              />
              <Box mt={2} display="flex" gap={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleUpdate}
                  sx={{
                    fontWeight: "bold",
                    borderRadius: 2,
                    px: 4,
                    boxShadow: "0 2px 8px 0 rgba(34,69,98,0.09)",
                  }}
                >
                  Save
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => setEditMode(false)}
                  sx={{
                    fontWeight: "bold",
                    borderRadius: 2,
                    px: 4,
                  }}
                >
                  Cancel
                </Button>
              </Box>
            </>
          ) : (
            user && (
              <>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Name:</strong> {user.firstName} {user.lastName}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Email:</strong> {user.email}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Phone number:</strong> {user.phone}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Height:</strong> {user.height}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Weight:</strong> {user.weight}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
  <strong>Membership Plan:</strong>{" "}
  {user.selectedPlanName ? user.selectedPlanName : "No Plan Selected"}
</Typography>




                <Box mt={2} display="flex" gap={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setEditMode(true)}
                    sx={{
                      fontWeight: "bold",
                      borderRadius: 2,
                      px: 4,
                      boxShadow: "0 2px 8px 0 rgba(34,69,98,0.09)",
                    }}
                  >
                    Edit Profile
                  </Button>
                  {deleteRequested ? (
                    <Button variant="contained" disabled sx={{
                      fontWeight: "bold",
                      borderRadius: 2,
                      px: 4,
                    }}>
                      Requested
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="error"
                      onClick={handleDeleteRequest}
                      sx={{
                        fontWeight: "bold",
                        borderRadius: 2,
                        px: 4,
                      }}
                    >
                      Delete Account
                    </Button>
                  )}
                </Box>
              </>
            )
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default Profile;
