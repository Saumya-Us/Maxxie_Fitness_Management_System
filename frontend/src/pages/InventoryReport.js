import React, { useState, useEffect } from "react";
import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Card,
  CardContent,
  Grid,
  Tooltip,
  useMediaQuery,
} from "@mui/material";
import { Download as DownloadIcon } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import SideBar from "../components/AdminSideBar";
import NavBar from "../components/AdminNavBar";
import BG from "../Assests/BG2.jpg";

const statusColors = {
  "out-of-stock": "#e53935",
  "low-stock": "#fbc02d",
  "in-stock": "#43a047",
};

function getStockStatus(stock) {
  if (stock === 0) return "out-of-stock";
  if (stock < 10) return "low-stock";
  return "in-stock";
}

const categoryOptions = [
  { value: "all", label: "All Categories" },
  { value: "Protein", label: "Protein" },
  { value: "Pre-Workout", label: "Pre-Workout" },
  { value: "Post-Workout", label: "Post-Workout" },
  { value: "Vitamins", label: "Vitamins" },
];

const InventoryReport = () => {
  const [supplements, setSupplements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    fetchSupplements();
  }, []);

  const fetchSupplements = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/supplements");
      setSupplements(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch inventory data");
      setLoading(false);
    }
  };

  const getInventoryStats = () => {
    const totalItems = supplements.length;
    const lowStock = supplements.filter((item) => item.stock < 10 && item.stock > 0).length;
    const outOfStock = supplements.filter((item) => item.stock === 0).length;
    const totalValue = supplements.reduce((sum, item) => sum + item.price * item.stock, 0);

    return { totalItems, lowStock, outOfStock, totalValue };
  };

  const handleDownloadPDF = () => {
    const reportElement = document.getElementById("inventory-report-table");
    html2canvas(reportElement).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 30;

      pdf.setFontSize(18);
      pdf.text("Inventory Report", pdfWidth / 2, 20, { align: "center" });
      pdf.addImage(imgData, "PNG", imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save("inventory-report.pdf");
    });
  };

  const filteredSupplements = supplements
    .filter((supp) => supp.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((supp) => filterCategory === "all" || supp.category === filterCategory);

  const stats = getInventoryStats();

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

      {/* Main content */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        {/* NavBar */}
        <NavBar />

        {/* Page Content */}
        <Box
          sx={{
            flex: 1,
            px: { xs: 1, sm: 6 },
            py: 6,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            bgcolor: "rgba(255,255,255,0.7)",
            borderRadius: 5,
            boxShadow: 10,
            m: { xs: 1, sm: 4 },
            overflowX: "auto",
          }}
        >
          <Box sx={{ width: "100%", maxWidth: 1200 }}>
            {/* Header */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
                flexWrap: "wrap",
              }}
            >
              <Typography variant="h4" fontWeight="bold">
                Inventory Report
              </Typography>
              <Tooltip title="Download as PDF">
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<DownloadIcon />}
                  onClick={handleDownloadPDF}
                  sx={{
                    borderRadius: 2,
                    fontWeight: "bold",
                    boxShadow: "0 2px 8px 0 rgba(34,69,98,0.09)",
                  }}
                >
                  Download PDF
                </Button>
              </Tooltip>
            </Box>

            {/* Inventory Stats Cards */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={3}>
                <Card sx={{ borderRadius: 4, boxShadow: 4, bgcolor: "#e3eafc" }}>
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary">
                      Total Items
                    </Typography>
                    <Typography variant="h5" fontWeight="bold">
                      {stats.totalItems}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Card sx={{ borderRadius: 4, boxShadow: 4, bgcolor: "#fffbe7" }}>
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary">
                      Low Stock Items
                    </Typography>
                    <Typography variant="h5" fontWeight="bold" color="warning.main">
                      {stats.lowStock}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Card sx={{ borderRadius: 4, boxShadow: 4, bgcolor: "#ffeaea" }}>
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary">
                      Out of Stock
                    </Typography>
                    <Typography variant="h5" fontWeight="bold" color="error.main">
                      {stats.outOfStock}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Card sx={{ borderRadius: 4, boxShadow: 4, bgcolor: "#e7ffe7" }}>
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary">
                      Total Value
                    </Typography>
                    <Typography variant="h5" fontWeight="bold" color="success.main">
                      Rs. {stats.totalValue.toFixed(2)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Filters */}
            <Box
              sx={{
                display: "flex",
                gap: 2,
                mb: 3,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <TextField
                label="Search supplements"
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ bgcolor: "#f8fafc", borderRadius: 2, minWidth: 220 }}
              />
              <FormControl size="small" sx={{ minWidth: 180 }}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={filterCategory}
                  label="Category"
                  onChange={(e) => setFilterCategory(e.target.value)}
                  sx={{ bgcolor: "#f8fafc", borderRadius: 2 }}
                >
                  {categoryOptions.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Table */}
            <TableContainer
              component={Paper}
              elevation={0}
              sx={{
                borderRadius: 4,
                boxShadow: 5,
                background: "rgba(245,248,255,0.80)",
                mb: 2,
              }}
              id="inventory-report-table"
            >
              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                  <CircularProgress />
                </Box>
              ) : error ? (
                <Typography color="error" sx={{ p: 3 }}>
                  {error}
                </Typography>
              ) : (
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
                      <TableCell>Name</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Price (Rs.)</TableCell>
                      <TableCell>Stock</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredSupplements.map((supplement) => (
                      <TableRow key={supplement._id} hover>
                        <TableCell>{supplement.name}</TableCell>
                        <TableCell>{supplement.category}</TableCell>
                        <TableCell>Rs. {supplement.price.toFixed(2)}</TableCell>
                        <TableCell>{supplement.stock}</TableCell>
                        <TableCell>
                          <Box
                            component="span"
                            sx={{
                              px: 2,
                              py: 0.5,
                              borderRadius: 2,
                              fontWeight: "bold",
                              color: "#fff",
                              bgcolor: statusColors[getStockStatus(supplement.stock)],
                              fontSize: 14,
                              display: "inline-block",
                            }}
                          >
                            {supplement.stock === 0
                              ? "Out of Stock"
                              : supplement.stock < 10
                              ? "Low Stock"
                              : "In Stock"}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TableContainer>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default InventoryReport;
