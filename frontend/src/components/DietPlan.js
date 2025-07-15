import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Typography,
  Modal,
  Fade,
  Backdrop,
  TextField,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SideBar from "../components/AdminSideBar";
import NavBar from "../components/AdminNavBar";
import BG from "../Assests/BG2.jpg";

// PDF export imports
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const DIET_TYPES = ["Vegetarian", "Vegan", "Non-Vegetarian", "Keto", "Paleo"];
const ALLERGIES = ["Nuts", "Dairy", "Gluten", "None"];
const CONDITIONS = ["Diabetes", "Hypertension", "None"];
const GOALS = ["Weight Loss", "Maintenance", "Muscle Gain"];

const defaultForm = {
  dietType: "Vegetarian",
  foodAllergies: "None",
  medicalConditions: "None",
  caloricIntakeGoal: "Maintenance",
};

function DietPlan() {
  const [dietPlans, setDietPlans] = useState([]);
  const [formData, setFormData] = useState(defaultForm);
  const [editId, setEditId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState({ table: true, form: false });
  const [modalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchDietPlans();
  }, []);

  const fetchDietPlans = async () => {
    setLoading((prev) => ({ ...prev, table: true }));
    try {
      const response = await axios.get("http://localhost:5000/api/diet-plans");
      setDietPlans(response.data);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage("Failed to fetch diet plans. Please ensure the backend server is running.");
    } finally {
      setLoading((prev) => ({ ...prev, table: false }));
    }
  };

  const validateForm = () => {
    if (!DIET_TYPES.includes(formData.dietType)) return false;
    if (!ALLERGIES.includes(formData.foodAllergies)) return false;
    if (!CONDITIONS.includes(formData.medicalConditions)) return false;
    if (!GOALS.includes(formData.caloricIntakeGoal)) return false;
    return true;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setErrorMessage("Invalid form data. Please check your inputs.");
      return;
    }
    setLoading((prev) => ({ ...prev, form: true }));
    try {
      if (editId) {
        await axios.put(`http://localhost:5000/api/diet-plans/${editId}`, formData);
      } else {
        await axios.post("http://localhost:5000/api/diet-plans", formData);
      }
      fetchDietPlans();
      setFormData(defaultForm);
      setEditId(null);
      setModalOpen(false);
    } catch (error) {
      setErrorMessage("Failed to save diet plan. Please check the data and try again.");
    } finally {
      setLoading((prev) => ({ ...prev, form: false }));
    }
  };

  const handleEdit = (plan) => {
    setEditId(plan._id);
    setFormData({
      dietType: plan.dietType,
      foodAllergies: plan.foodAllergies,
      medicalConditions: plan.medicalConditions,
      caloricIntakeGoal: plan.caloricIntakeGoal,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/diet-plans/${id}`);
      fetchDietPlans();
    } catch (error) {
      setErrorMessage("Failed to delete diet plan.");
    }
  };

  const handleAddNew = () => {
    setEditId(null);
    setFormData(defaultForm);
    setModalOpen(true);
    setErrorMessage("");
  };

  // Filter diet plans based on search term (case-insensitive)
  const filteredDietPlans = dietPlans.filter((plan) =>
    Object.values(plan)
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // PDF Download Handler - exports filtered data
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const tableColumn = [
      "Diet Type",
      "Food Allergies",
      "Medical Conditions",
      "Caloric Intake Goal",
      "Created At",
      "Updated At",
    ];
    const tableRows = filteredDietPlans.map((plan) => [
      plan.dietType,
      plan.foodAllergies,
      plan.medicalConditions,
      plan.caloricIntakeGoal,
      plan.createdAt ? new Date(plan.createdAt).toLocaleDateString() : "-",
      plan.updatedAt ? new Date(plan.updatedAt).toLocaleDateString() : "-",
    ]);
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [34, 69, 98] },
    });
    doc.save("diet-plans.pdf");
  };

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
      {/* Sidebar */}
      <SideBar />

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          px: { xs: 1, sm: 6 },
          py: 6,
        }}
      >
        {/* Navbar */}
        <NavBar />

        {/* Content Card */}
        <Box
          sx={{
            width: "100%",
            maxWidth: "100%",
            bgcolor: "rgba(255,255,255,0.7)",
            borderRadius: 5,
            boxShadow: 10,
            p: { xs: 2, sm: 4 },
            mt: 4,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Typography variant="h4" fontWeight="bold" sx={{ flexGrow: 1 }}>
              Diet Plans
            </Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddNew}
                sx={{ fontWeight: "bold", borderRadius: 2, boxShadow: 2 }}
              >
                Add Diet Plan
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleDownloadPDF}
                sx={{ fontWeight: "bold", borderRadius: 2, boxShadow: 2 }}
              >
                Download PDF
              </Button>
            </Box>
          </Box>

          {/* Search Bar */}
          <TextField
            label="Search Diet Plans"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mb: 2, width: 300 }}
          />

          {errorMessage && (
            <Typography color="error" sx={{ mb: 2 }}>
              {errorMessage}
            </Typography>
          )}

          {loading.table ? (
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
                    <TableCell>Diet Type</TableCell>
                    <TableCell>Food Allergies</TableCell>
                    <TableCell>Medical Conditions</TableCell>
                    <TableCell>Caloric Intake Goal</TableCell>
                    <TableCell>Created At</TableCell>
                    <TableCell>Updated At</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredDietPlans.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        No diet plans available.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredDietPlans.map((plan) => (
                      <TableRow key={plan._id} hover>
                        <TableCell>{plan.dietType}</TableCell>
                        <TableCell>{plan.foodAllergies}</TableCell>
                        <TableCell>{plan.medicalConditions}</TableCell>
                        <TableCell>{plan.caloricIntakeGoal}</TableCell>
                        <TableCell>
                          {plan.createdAt ? new Date(plan.createdAt).toLocaleDateString() : "-"}
                        </TableCell>
                        <TableCell>
                          {plan.updatedAt ? new Date(plan.updatedAt).toLocaleDateString() : "-"}
                        </TableCell>
                        <TableCell>
                          <IconButton color="warning" onClick={() => handleEdit(plan)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton color="error" onClick={() => handleDelete(plan._id)}>
                            <DeleteIcon />
                          </IconButton>
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

      {/* Modal for Add/Edit */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
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
        <Fade in={modalOpen}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: { xs: "90vw", sm: 400 },
              bgcolor: "background.paper",
              borderRadius: 3,
              boxShadow: 24,
              p: 4,
              outline: "none",
            }}
          >
            <Typography variant="h6" fontWeight="bold" mb={2}>
              {editId ? "Edit Diet Plan" : "Add Diet Plan"}
            </Typography>
            {errorMessage && (
              <Typography color="error" sx={{ mb: 2 }}>
                {errorMessage}
              </Typography>
            )}
            <form onSubmit={handleSubmit}>
              <TextField
                select
                label="Preferred Diet Type"
                name="dietType"
                value={formData.dietType}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
              >
                {DIET_TYPES.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="Food Allergies"
                name="foodAllergies"
                value={formData.foodAllergies}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
              >
                {ALLERGIES.map((allergy) => (
                  <MenuItem key={allergy} value={allergy}>
                    {allergy}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="Medical Conditions"
                name="medicalConditions"
                value={formData.medicalConditions}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
              >
                {CONDITIONS.map((cond) => (
                  <MenuItem key={cond} value={cond}>
                    {cond}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="Caloric Intake Goal"
                name="caloricIntakeGoal"
                value={formData.caloricIntakeGoal}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
              >
                {GOALS.map((goal) => (
                  <MenuItem key={goal} value={goal}>
                    {goal}
                  </MenuItem>
                ))}
              </TextField>
              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2, gap: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={loading.form}
                  sx={{ fontWeight: "bold", borderRadius: 2 }}
                >
                  {loading.form ? "Saving..." : editId ? "Update" : "Add"}
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => {
                    setModalOpen(false);
                    setEditId(null);
                    setFormData(defaultForm);
                    setErrorMessage("");
                  }}
                  sx={{ borderRadius: 2 }}
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
}

export default DietPlan;
