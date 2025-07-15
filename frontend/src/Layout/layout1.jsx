import { Outlet, useLocation } from "react-router-dom";
import { Box } from "@mui/material";
import TopNavigation from  "../components/Navbar/navbar";
import { Suspense, useEffect, useState } from "react";
import Loading from "../components/Loading/Loading";

function Layout1() {
  const location = useLocation();
  const [urlLocation, setUrlLocation] = useState("");
  useEffect(() => {
    // Use location.pathname to get the current URL path
    const currentUrl = location.pathname;

    const firstPath = currentUrl.split("/")[1];
    console.log("path", firstPath);
    setUrlLocation(firstPath);

    // const setUrl = removePart(location)
    // Your existing removePart function can be used here if needed

    const showNavigation = urlLocation !== "login"||"register";
  }, [location.pathname]);
  return (
    <Box
      sx={{
        // backgroundColor: "#E2E3EA",
        pl: {
          xs: 0,
          lg: 0,
        },
        display: "flex",
        flexDirection: "row", 
        maxHeight: "100vh",
        overflow: "hidden",
      }}
    >
      <Box
        // sx={{
        //   height: "100vh",
        //   overflow: "auto",
        //   pt: 2,
        //   flexGrow: 1, 
        //   px: {
        //     xs: 2,
        //     lg: 4,
        //   },
        // }}
      >
                <Suspense fallback={<Loading />}>
        <Outlet />
        </Suspense>
      </Box>
      <TopNavigation />

    </Box>
  );
}

export default Layout1;