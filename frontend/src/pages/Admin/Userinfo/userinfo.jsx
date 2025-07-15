import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  useMediaQuery,
  CircularProgress,
  Tooltip,
  Modal,
  Fade,
  Backdrop,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import BG from "../../../Assests/BG2.jpg";
import SideBar from "../../../components/AdminSideBar";
import NavBar from "../../../components/AdminNavBar";

function Userinfo() {
  const [listofUsers, setlistofUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState({});
  const [error, setError] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:5000/user");
        setlistofUsers(response.data);
      } catch (err) {
        setError("Failed to load users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async (userId, userEmail) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete user: ${userEmail}?`
    );
    if (!confirmDelete) return;
    setDeleteLoading((prev) => ({ ...prev, [userId]: true }));
    try {
      await axios.delete(`http://localhost:5000/user/${userId}`);
      setlistofUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        alert("Error deleting user: " + err.response.data.message);
      } else {
        alert("Error deleting user");
      }
    } finally {
      setDeleteLoading((prev) => ({ ...prev, [userId]: false }));
    }
  };

  // Filtered user list
  const filteredUsers = listofUsers.filter((user) => {
    const searchStr = search.toLowerCase();
    return (
      searchStr === "" ||
      user.firstName.toLowerCase().includes(searchStr) ||
      user.lastName.toLowerCase().includes(searchStr)
    );
  });

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
      <SideBar />

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
        {/* Navbar */}
        <NavBar />

        {/* Content */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            px: { xs: 1, sm: 6 },
            py: 6,
          }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: "100%",
              bgcolor: "rgba(255,255,255,0.8)",
              borderRadius: 5,
              boxShadow: 10,
              p: { xs: 2, sm: 4 },
              overflowX: "auto",
            }}
          >
            <Typography variant="h4" fontWeight="bold" mb={3} textAlign="center">
              Users
            </Typography>
            <Box
              sx={{
                mb: 2,
                width: "100%",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <TextField
                placeholder="Search User"
                size="small"
                sx={{
                  width: { xs: "100%", sm: "240px" },
                  borderRadius: "12px",
                  background: "#f5f8ff",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                  },
                }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Typography color="error">{error}</Typography>
            ) : (
              <TableContainer
                component={Paper}
                elevation={0}
                sx={{
                  borderRadius: 4,
                  boxShadow: 5,
                  background: "rgba(245,248,255,0.90)",
                  mb: 2,
                  maxHeight: { xs: 400, md: 500 },
                  overflowY: "auto",
                }}
              >
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={headerCellStyle}>No</TableCell>
                      <TableCell sx={headerCellStyle}>Name</TableCell>
                      <TableCell sx={headerCellStyle}>Email</TableCell>
                      <TableCell sx={headerCellStyle}>Phone</TableCell>
                      <TableCell sx={headerCellStyle}>Height</TableCell>
                      <TableCell sx={headerCellStyle}>Weight</TableCell>
                      <TableCell sx={headerCellStyle}>Request</TableCell>
                      <TableCell sx={headerCellStyle}>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} align="center">
                          No users found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((user, index) => (
                        <TableRow key={user._id} hover>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>
                            {user.firstName} {user.lastName}
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.phone}</TableCell>
                          <TableCell>{user.height}</TableCell>
                          <TableCell>{user.weight}</TableCell>
                          <TableCell>
                            {user.deleteRequest ? (
                              <Typography color="error" fontWeight="bold">
                                Requested to Delete
                              </Typography>
                            ) : (
                              "-"
                            )}
                          </TableCell>
                          <TableCell>
                            <Button
                              size="small"
                              variant="outlined"
                              color="success"
                              onClick={() => window.open(`/payment-history?userId=${user._id}`, '_blank')}
                              sx={{ mr: 1 }}
                            >
                              View Payment History
                            </Button>
                            <Tooltip title="Delete User">
                              <span>
                                <IconButton
                                  color="error"
                                  onClick={() => handleDelete(user._id, user.email)}
                                  disabled={!!deleteLoading[user._id]}
                                  sx={{
                                    backgroundColor: "rgba(255,0,0,0.08)",
                                    borderRadius: 2,
                                    "&:hover": {
                                      backgroundColor: "rgba(255,0,0,0.18)",
                                    },
                                  }}
                                >
                                  {deleteLoading[user._id] ? (
                                    <CircularProgress size={22} color="error" />
                                  ) : (
                                    <DeleteIcon />
                                  )}
                                </IconButton>
                              </span>
                            </Tooltip>
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
      </Box>
    </Box>
  );
}

// Custom header cell style for table
const headerCellStyle = {
  background: "linear-gradient(90deg, #224562 0%, #2e5c7a 100%)",
  color: "#fff",
  fontWeight: "bold",
  fontSize: 17,
  borderBottom: "2px solid #e3e8ee",
};

export default Userinfo;
