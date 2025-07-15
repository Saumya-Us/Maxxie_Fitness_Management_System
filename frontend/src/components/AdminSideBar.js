// Sidebar.js
import React from "react";
import {
  Box,
  Button,
  Drawer,
  IconButton,
  useMediaQuery
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Icon } from "@iconify/react";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import BG from "../Assests/BG2.jpg";
import Logopng from "../Assests/maxxieslogos.png";

const sidebarButtons = [
  {
    text: "Dashboard",
    icon: <Icon icon="codicon:home" fontSize={28} />,
    route: "/dashboard",
    color: "primary"
  },
  {
    text: "Workout Plans",
    icon: <Icon icon="codicon:edit-session" fontSize={28} />,
    route: "/workout-plans",
    color: "primary"
  },
  {
    text: "Diet Plans",
    icon: <Icon icon="mdi:cart" fontSize={28} />,
    route: "/diet-plans",
    color: "primary"
  },
  {
    text: "Session & Appointments",
    icon: <Icon icon="mdi:cart" fontSize={28} />,
    route: "/admin/appointments",
    color: "primary"
  },
  {
    text: "Membership Plans",
    icon: <Icon icon="uis:schedule" fontSize={28} />,
    route: "/membership-plans",
    color: "warning"
  },
  {
    text: "Suppliment Store",
    icon: <Icon icon="codicon:edit-session" fontSize={28} />,
    route: "/suppliment-home",
    color: "primary"
  },
  {
    text: "Users",
    icon: <Icon icon="codicon:edit-session" fontSize={28} />,
    route: "/userinfo",
    color: "primary"
  },
  {
    text: "Financial Dashboard",
    icon: <Icon icon="mdi:finance" fontSize={28} />,
    route: "/financial-dashboard",
    color: "success"
  },
  {
    text: "Payments",
    icon: <Icon icon="mdi:cash-multiple" fontSize={28} />,
    route: "/payments",
    color: "success"
  },
  {
    text: "Expenses",
    icon: <Icon icon="mdi:cash-minus" fontSize={28} />,
    route: "/expenses",
    color: "success"
  }
];

export default function Sidebar({ drawerOpen, setDrawerOpen }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

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
        boxShadow: 4
      }}
    >
      <Box sx={{ mb: 3 }}>
        <img
          src={Logopng}
          alt="Logo"
          style={{ width: 120, borderRadius: 12, marginTop: 80 }}
        />
      </Box>
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
                boxShadow: "0 4px 16px 0 rgba(0,0,0,0.12)"
              }
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
    <>
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
                bgcolor: "rgba(34,69,98,1)"
              }
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
                color: "#fff"
              }
            }}
          >
            {SidebarContent}
          </Drawer>
        </>
      ) : (
        SidebarContent
      )}
    </>
  );
}
