import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Typography,
  useMediaQuery,
  Drawer,
  Modal,
  Fade,
  Backdrop,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  TextField,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import SideBar from "../components/AdminSideBar";
import NavBar from "../components/AdminNavBar";
import BG from "../Assests/BG2.jpg";

// Import jsPDF and autotable
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Popup form for Add/Edit
function WorkoutPlanForm({ open, onClose, onSubmit, formData, setFormData, errorMessage, editId }) {
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
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
      <Fade in={open}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "95vw", sm: 420 },
            bgcolor: "background.paper",
            borderRadius: 3,
            boxShadow: 24,
            p: 4,
            outline: "none",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h6" fontWeight="bold">
              {editId ? "Edit Workout Plan" : "Add Workout Plan"}
            </Typography>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>
          {errorMessage && (
            <Typography color="error" mb={2}>
              {errorMessage}
            </Typography>
          )}
          <form onSubmit={onSubmit}>
            <TextField
              select
              label="Workout Type"
              name="workoutType"
              value={formData.workoutType}
              onChange={handleChange}
              SelectProps={{ native: true }}
              fullWidth
              margin="dense"
              required
            >
              <option value="">Select Workout Type</option>
              <option value="Cardio">Cardio</option>
              <option value="Strength">Strength</option>
              <option value="Flexibility">Flexibility</option>
              <option value="Balance">Balance</option>
            </TextField>
            <TextField
              label="Duration (min)"
              name="duration"
              type="number"
              value={formData.duration}
              onChange={handleChange}
              fullWidth
              margin="dense"
              required
            />
            <TextField
              label="Sets"
              name="sets"
              type="number"
              value={formData.sets}
              onChange={handleChange}
              fullWidth
              margin="dense"
              required
            />
            <TextField
              label="Reps"
              name="reps"
              type="number"
              value={formData.reps}
              onChange={handleChange}
              fullWidth
              margin="dense"
              required
            />
            <TextField
              label="Height (cm)"
              name="height"
              type="number"
              value={formData.height}
              onChange={handleChange}
              fullWidth
              margin="dense"
              required
            />
            <TextField
              label="Weight (kg)"
              name="weight"
              type="number"
              value={formData.weight}
              onChange={handleChange}
              fullWidth
              margin="dense"
              required
            />
            <TextField
              label="Created By (optional)"
              name="createdBy"
              value={formData.createdBy}
              onChange={handleChange}
              fullWidth
              margin="dense"
            />
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                sx={{ mr: 1, borderRadius: 2, fontWeight: "bold" }}
              >
                {editId ? "Update" : "Add"}
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={onClose}
                sx={{ borderRadius: 2 }}
              >
                Cancel
              </Button>
            </Box>
          </form>
        </Box>
      </Fade>
    </Modal>
  );
}

function WorkoutPlan() {
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [filteredWorkoutPlans, setFilteredWorkoutPlans] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    workoutType: "",
    duration: "",
    sets: "",
    reps: "",
    height: "",
    weight: "",
    createdBy: "",
  });
  const [editId, setEditId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(true);

  // Responsive sidebar
  const isMobile = useMediaQuery("(max-width:600px)");
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    fetchWorkoutPlans();
    // eslint-disable-next-line
  }, []);

  const fetchWorkoutPlans = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/workout-plans");
      setWorkoutPlans(response.data);
      setFilteredWorkoutPlans(response.data);
    } catch (error) {
      setErrorMessage("Failed to fetch workout plans. Please ensure the backend server is running.");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!searchQuery) {
      setFilteredWorkoutPlans(workoutPlans);
      return;
    }
    const lowerCaseQuery = searchQuery.toLowerCase();
    const filtered = workoutPlans.filter((plan) =>
      plan.workoutType.toLowerCase().includes(lowerCaseQuery) ||
      plan.duration.toLowerCase().includes(lowerCaseQuery) ||
      (plan.sets && plan.sets.toString().includes(lowerCaseQuery)) ||
      (plan.reps && plan.reps.toString().includes(lowerCaseQuery)) ||
      (plan.height && plan.height.toString().includes(lowerCaseQuery)) ||
      (plan.weight && plan.weight.toString().includes(lowerCaseQuery)) ||
      (plan.createdBy && plan.createdBy.toLowerCase().includes(lowerCaseQuery)) ||
      new Date(plan.createdAt).toLocaleDateString().toLowerCase().includes(lowerCaseQuery) ||
      new Date(plan.updatedAt).toLocaleDateString().toLowerCase().includes(lowerCaseQuery)
    );
    setFilteredWorkoutPlans(filtered);
  }, [searchQuery, workoutPlans]);

  const validateForm = () => {
    const errors = {};
    if (!formData.workoutType) errors.workoutType = "Workout Type is required";
    if (!formData.duration || isNaN(formData.duration) || parseInt(formData.duration) <= 0)
      errors.duration = "Duration must be a positive number";
    if (!formData.sets || isNaN(formData.sets) || parseInt(formData.sets) < 1)
      errors.sets = "Sets must be a positive integer";
    if (!formData.reps || isNaN(formData.reps) || parseInt(formData.reps) < 1)
      errors.reps = "Reps must be a positive integer";
    if (
      !formData.height ||
      isNaN(formData.height) ||
      parseFloat(formData.height) < 100 ||
      parseFloat(formData.height) > 250
    )
      errors.height = "Height must be between 100 and 250 cm";
    if (
      !formData.weight ||
      isNaN(formData.weight) ||
      parseFloat(formData.weight) < 30 ||
      parseFloat(formData.weight) > 200
    )
      errors.weight = "Weight must be between 30 and 200 kg";
    if (Object.keys(errors).length > 0) {
      setErrorMessage(Object.values(errors).join(", "));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    if (!validateForm()) return;

    const formattedData = {
      workoutType: formData.workoutType,
      duration: `${formData.duration}min`,
      sets: parseInt(formData.sets),
      reps: parseInt(formData.reps),
      height: parseFloat(formData.height),
      weight: parseFloat(formData.weight),
      createdBy: formData.createdBy || "admin",
    };

    try {
      if (editId) {
        await axios.put(`http://localhost:5000/api/workout-plans/${editId}`, formattedData);
        setEditId(null);
      } else {
        await axios.post("http://localhost:5000/api/workout-plans", formattedData);
      }
      fetchWorkoutPlans();
      setFormData({
        workoutType: "",
        duration: "",
        sets: "",
        reps: "",
        height: "",
        weight: "",
        createdBy: "",
      });
      setShowPopup(false);
    } catch (error) {
      if (error.response && error.response.data.errors) {
        setErrorMessage(error.response.data.errors.map((err) => err.msg).join(", "));
      } else {
        setErrorMessage("Failed to save workout plan. Please check the data and try again.");
      }
    }
  };

  const handleEdit = (plan) => {
    setEditId(plan._id);
    setFormData({
      ...plan,
      duration: plan.duration.replace("min", ""),
    });
    setShowPopup(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/workout-plans/${id}`);
      fetchWorkoutPlans();
    } catch (error) {
      setErrorMessage("Failed to delete workout plan.");
    }
  };

  // PDF Download Handler
  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    const tableColumn = [
      "Workout Type",
      "Duration",
      "Sets",
      "Reps",
      "Height (cm)",
      "Weight (kg)",
      "Created By",
      "Created At",
      "Updated At"
    ];

    const tableRows = filteredWorkoutPlans.map(plan => [
      plan.workoutType,
      plan.duration,
      plan.sets,
      plan.reps,
      plan.height,
      plan.weight,
      plan.createdBy || "N/A",
      plan.createdAt ? new Date(plan.createdAt).toLocaleDateString() : "",
      plan.updatedAt ? new Date(plan.updatedAt).toLocaleDateString() : ""
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [34, 69, 98] }
    });

    doc.save("workout-plans.pdf");
  };

  // Sidebar content: use Drawer for mobile
  const sidebarContent = <SideBar />;

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
      {/* Sidebar */}
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
              "&:hover": { bgcolor: "rgba(34,69,98,1)" },
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
            {sidebarContent}
          </Drawer>
        </>
      ) : (
        sidebarContent
      )}

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          px: { xs: 1, sm: 6 },
          py: 6,
        }}
      >
        {/* NavBar at the top */}
        <NavBar />

        <Box
          sx={{
            width: "100%",
            maxWidth: "100%",
            bgcolor: "rgba(255,255,255,0.7)",
            borderRadius: 5,
            boxShadow: 10,
            p: { xs: 2, sm: 4 },
            mt: 3,
            overflowX: "auto",
          }}
        >
          {/* Add Button, Download PDF, and Search */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Box>
              <Button
                variant="contained"
                color="primary"
                sx={{ fontWeight: "bold", borderRadius: 2, boxShadow: 3 }}
                onClick={() => {
                  setShowPopup(true);
                  setEditId(null);
                  setFormData({
                    workoutType: "",
                    duration: "",
                    sets: "",
                    reps: "",
                    height: "",
                    weight: "",
                    createdBy: "",
                  });
                  setErrorMessage("");
                }}
              >
                Add Workout
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                sx={{ fontWeight: "bold", borderRadius: 2, boxShadow: 3, ml: 2 }}
                onClick={handleDownloadPDF}
              >
                Download PDF
              </Button>
            </Box>
            <TextField
              placeholder="Search Workout Plans..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              variant="outlined"
              size="small"
              sx={{ bgcolor: "rgba(245,248,255,0.8)", borderRadius: 2, width: { xs: 180, sm: 320 } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="primary" />
                  </InputAdornment>
                ),
                endAdornment: searchQuery && (
                  <IconButton
                    size="small"
                    onClick={() => setSearchQuery("")}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                ),
              }}
            />
          </Box>

          <Typography variant="h4" fontWeight="bold" mb={3}>
            Workout Plans
          </Typography>

          {errorMessage && !showPopup && (
            <Typography color="error" mb={2}>
              {errorMessage}
            </Typography>
          )}

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
            </Box>
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
                  minWidth: 100,
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
                    <TableCell>Workout Type</TableCell>
                    <TableCell>Duration</TableCell>
                    <TableCell>Sets</TableCell>
                    <TableCell>Reps</TableCell>
                    <TableCell>Height (cm)</TableCell>
                    <TableCell>Weight (kg)</TableCell>
                    <TableCell>Created By</TableCell>
                    <TableCell>Created At</TableCell>
                    <TableCell>Updated At</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredWorkoutPlans.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} align="center">
                        No workout plans available.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredWorkoutPlans.map((plan) => (
                      <TableRow key={plan._id} hover>
                        <TableCell>{plan.workoutType}</TableCell>
                        <TableCell>{plan.duration}</TableCell>
                        <TableCell>{plan.sets}</TableCell>
                        <TableCell>{plan.reps}</TableCell>
                        <TableCell>{plan.height}</TableCell>
                        <TableCell>{plan.weight}</TableCell>
                        <TableCell>{plan.createdBy || "N/A"}</TableCell>
                        <TableCell>
                          {plan.createdAt ? new Date(plan.createdAt).toLocaleDateString() : ""}
                        </TableCell>
                        <TableCell>
                          {plan.updatedAt ? new Date(plan.updatedAt).toLocaleDateString() : ""}
                        </TableCell>
                        <TableCell>
                          <Button
                            size="small"
                            variant="outlined"
                            color="warning"
                            sx={{ mr: 1, borderRadius: 2, fontWeight: "bold" }}
                            onClick={() => handleEdit(plan)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="small"
                            variant="contained"
                            color="error"
                            sx={{ borderRadius: 2, fontWeight: "bold" }}
                            onClick={() => handleDelete(plan._id)}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Box>
      {/* Popup Modal for Add/Edit */}
      <WorkoutPlanForm
        open={showPopup}
        onClose={() => {
          setShowPopup(false);
          setEditId(null);
          setFormData({
            workoutType: "",
            duration: "",
            sets: "",
            reps: "",
            height: "",
            weight: "",
            createdBy: "",
          });
          setErrorMessage("");
        }}
        onSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        errorMessage={errorMessage}
        editId={editId}
      />
    </Box>
  );
}

export default WorkoutPlan;
