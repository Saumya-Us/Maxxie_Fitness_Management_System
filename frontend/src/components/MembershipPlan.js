import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  IconButton,
  Typography,
  useMediaQuery,
  Drawer,
  Modal,
  Fade,
  Backdrop,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  CircularProgress,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme } from "@mui/material/styles";
import SideBar from "../components/AdminSideBar";
import NavBar from "../components/AdminNavBar";
import BG from "../Assests/BG2.jpg";


const MembershipPlan = () => {
  const [membershipPlans, setMembershipPlans] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [formData, setFormData] = useState({
    planName: "",
    duration: "",
    price: "",
    features: "",
    description: "",
  });
  const [editId, setEditId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    fetchMembershipPlans();
    // eslint-disable-next-line
  }, []);

  const fetchMembershipPlans = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/membership-plans");
      setMembershipPlans(response.data);
    } catch (error) {
      setErrorMessage("Failed to fetch membership plans. Please ensure the backend server is running.");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.planName.trim()) errors.planName = "Plan Name is required";
    if (!formData.duration.trim()) errors.duration = "Duration is required";
    if (!formData.price || isNaN(formData.price) || parseFloat(formData.price) <= 0)
      errors.price = "Price must be a positive number";
    if (!formData.features.trim()) errors.features = "Features are required";
    if (Object.keys(errors).length > 0) {
      setErrorMessage(Object.values(errors).join(", "));
      return false;
    }
    return true;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    if (!validateForm()) return;

    // Features as array
    const featuresArray = formData.features
      .split(",")
      .map((f) => f.trim())
      .filter((f) => f);

    const formattedData = {
      planName: formData.planName,
      duration: formData.duration,
      price: parseFloat(formData.price),
      features: featuresArray,
      description: formData.description,
    };

    setLoading(true);
    try {
      if (editId) {
        await axios.put(`http://localhost:5000/api/membership-plans/${editId}`, formattedData);
        setEditId(null);
      } else {
        await axios.post("http://localhost:5000/api/membership-plans", formattedData);
      }
      fetchMembershipPlans();
      setFormData({
        planName: "",
        duration: "",
        price: "",
        features: "",
        description: "",
      });
      setShowPopup(false);
    } catch (error) {
      if (error.response && error.response.data.errors) {
        setErrorMessage(error.response.data.errors.map((err) => err.msg).join(", "));
      } else {
        setErrorMessage("Failed to save membership plan. Please check the data and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (plan) => {
    setEditId(plan._id);
    setFormData({
      planName: plan.planName,
      duration: plan.duration,
      price: plan.price,
      features: Array.isArray(plan.features) ? plan.features.join(", ") : plan.features,
      description: plan.description || "",
    });
    setShowPopup(true);
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`http://localhost:5000/api/membership-plans/${id}`);
      fetchMembershipPlans();
    } catch (error) {
      setErrorMessage("Failed to delete membership plan.");
    } finally {
      setLoading(false);
    }
  };

  // Sidebar content for Drawer (mobile)
  const SidebarContent = (
    <Box
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
      
 
      <SideBar />
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
          alignItems: "stretch",
          px: { xs: 1, sm: 6 },
          py: 4,
        }}
      >
        <NavBar />
        <Box
          sx={{
            width: "100%",
            maxWidth: "100%",
            bgcolor: "rgba(255,255,255,0.7)",
            borderRadius: 5,
            boxShadow: 10,
            p: { xs: 2, sm: 4 },
            mt: { xs: 6, sm: 8 },
            overflowX: "auto",
          }}
        >
          <Typography variant="h4" fontWeight="bold" mb={3}>
            Membership Plans
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 3 }}>
            <Button
              variant="contained"
              color="success"
              sx={{
                borderRadius: 3,
                fontWeight: "bold",
                fontSize: 16,
                px: 3,
                py: 1.5,
                boxShadow: "0 2px 12px 0 rgba(0,0,0,0.08)",
                background: "linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)",
                color: "#fff",
              }}
              onClick={() => {
                setEditId(null);
                setFormData({
                  planName: "",
                  duration: "",
                  price: "",
                  features: "",
                  description: "",
                });
                setShowPopup(true);
              }}
            >
              Add Membership Plan
            </Button>
          </Box>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          ) : errorMessage ? (
            <Typography color="error">{errorMessage}</Typography>
          ) : (
            <TableContainer
              component={Paper}
              elevation={0}
              sx={{
                borderRadius: 4,
                boxShadow: 5,
                background: "rgba(245,248,255,0.80)",
                mb: 2,
              }}
            >
              <Table
                sx={{
                  minWidth: 300,
                  "& th": {
                    background: "linear-gradient(90deg, #224562 0%, #2e5c7a 100%)",
                    color: "#fff",
                    fontWeight: "bold",
                    fontSize: 17,
                    borderBottom: "2px solid #e3e8ee",
                  },
                  "& td": {
                    fontSize: 16,
                    borderBottom: "1px solid #e3e8ee",
                  },
                  "& tr:hover td": {
                    background: "rgba(34,69,98,0.06)",
                  },
                }}
                stickyHeader
              >
                <TableHead>
                  <TableRow>
                    <TableCell>Plan Name</TableCell>
                    <TableCell>Duration</TableCell>
                    <TableCell>Price (Rs.)</TableCell>
                    <TableCell>Features</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {membershipPlans.map((plan) => (
                    <TableRow key={plan._id} hover>
                      <TableCell>{plan.planName}</TableCell>
                      <TableCell>{plan.duration}</TableCell>
                      <TableCell>{plan.price}</TableCell>
                      <TableCell>
                        <ul style={{ margin: 0, paddingLeft: 18 }}>
                          {Array.isArray(plan.features)
                            ? plan.features.map((feature, idx) => (
                                <li key={idx} style={{ fontSize: 15 }}>
                                  {feature}
                                </li>
                              ))
                            : null}
                        </ul>
                      </TableCell>
                      <TableCell sx={{ maxWidth: 220, whiteSpace: "pre-line" }}>
                        {plan.description}
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          variant="contained"
                          color="warning"
                          sx={{
                            borderRadius: 2,
                            fontWeight: "bold",
                            mr: 1,
                            fontSize: 14,
                          }}
                          onClick={() => handleEdit(plan)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          sx={{
                            borderRadius: 2,
                            fontWeight: "bold",
                            fontSize: 14,
                          }}
                          onClick={() => handleDelete(plan._id)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Box>
      {/* Modal for Add/Edit Form */}
      <Modal
        open={showPopup}
        onClose={() => {
          setShowPopup(false);
          setEditId(null);
          setFormData({
            planName: "",
            duration: "",
            price: "",
            features: "",
            description: "",
          });
          setErrorMessage("");
        }}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 300,
            sx: {
              backgroundColor: "rgba(20,20,30,0.85)",
              backdropFilter: "blur(2px)",
            },
          },
        }}
      >
        <Fade in={showPopup}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: { xs: "90vw", sm: 450 },
              bgcolor: "background.paper",
              borderRadius: 3,
              boxShadow: 24,
              p: 4,
              outline: "none",
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography variant="h6" fontWeight="bold">
                {editId ? "Edit Membership Plan" : "Add Membership Plan"}
              </Typography>
              <IconButton onClick={() => setShowPopup(false)}>
                <CloseIcon />
              </IconButton>
            </Box>
            {errorMessage && (
              <Typography color="error" mb={2}>
                {errorMessage}
              </Typography>
            )}
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                margin="normal"
                label="Plan Name"
                name="planName"
                value={formData.planName}
                onChange={handleChange}
                required
              />
              <TextField
                fullWidth
                margin="normal"
                label="Duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                required
              />
              <TextField
                fullWidth
                margin="normal"
                label="Price (Rs.)"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                required
              />
              <TextField
                fullWidth
                margin="normal"
                label="Features (comma separated)"
                name="features"
                value={formData.features}
                onChange={handleChange}
                required
                multiline
                minRows={2}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Description (optional)"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                minRows={2}
              />
              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="success"
                  sx={{ fontWeight: "bold", borderRadius: 2, mr: 2 }}
                  disabled={loading}
                >
                  {editId ? "Update" : "Add"}
                </Button>
                <Button
                  type="button"
                  variant="outlined"
                  color="error"
                  sx={{ fontWeight: "bold", borderRadius: 2 }}
                  onClick={() => {
                    setShowPopup(false);
                    setEditId(null);
                    setFormData({
                      planName: "",
                      duration: "",
                      price: "",
                      features: "",
                      description: "",
                    });
                    setErrorMessage("");
                  }}
                >
                  Cancel
                </Button>
              </Box>
            </form>
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
};

export default MembershipPlan;
