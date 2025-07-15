import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Box, Typography, IconButton, Modal, Paper, Button } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const TopNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeItem, setActiveItem] = useState("");
  const [open, setOpen] = useState(false); 
  


  useEffect(() => {
    const currentPath = location.pathname.split("/")[1];
    setActiveItem(currentPath);
  }, [location.pathname]);

  const navigationItems = [
    { name: " Home", path: "/home" },
    { name: " Session", path: "/session" },
    { name: "Store", path: "/store" },

  ];

  const handleItemClick = (path) => {
    setActiveItem(path);
    navigate(path);
  };

  const handleLogout = () => {
    console.log("User Logged Out");
    localStorage.removeItem("accessToken");
    navigate("/"); // Redirect to login page
  };

  const handleProfile = () => {
    navigate("/profile"); // Redirect to profile page
  };

  return (
    <>
    <AppBar position="fixed" sx={{ backgroundColor: "#1351BF", px: 3 }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
      <Box sx={{ display: "flex", gap: 4 }}>
        {navigationItems.map((item) => (
          <Typography
            key={item.name}
            sx={{
              cursor: "pointer",
              color: activeItem === item.path ? "yellow" : "white",
              fontWeight: "bold",
              transition: "0.3s",
              "&:hover": { color: "lightgray" },
            }}
            onClick={() => handleItemClick(item.path)}
          >
            {item.name}
          </Typography>
        ))}
                </Box>

        

        <IconButton
          sx={{ color: "white" 
          }}
          onClick={() => setOpen(true)}
        >
          <AccountCircleIcon fontSize="large" />
        </IconButton>
      </Toolbar>
    </AppBar>

    <Modal open={open} onClose={() => setOpen(false)}>
        <Paper
          sx={{
            position: "absolute",
            top: 70,
            right: 5,
            
            width: 300,
            padding: 3,
            boxShadow: 24,
            textAlign: "center",
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
             Options
          </Typography>
          <Button fullWidth variant="contained" sx={{ mb: 2 }} onClick={handleProfile}>
            Profile
          </Button>
          <Button fullWidth variant="outlined" color="error" onClick={handleLogout}>
            Log Out
          </Button>
        </Paper>
      </Modal>
    </>
  );
};

export default TopNavigation;
