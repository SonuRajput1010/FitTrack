import { useState } from "react";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import MobileDrawer from "../components/layout/MobileDrawer";
import Footer from "../components/layout/Footer";
import useAutoLogout from "../hooks/useAutoLogout";

const drawerWidth = 280;

function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  useAutoLogout();

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar drawerWidth={drawerWidth} />

      <MobileDrawer
        open={mobileOpen}
        onClose={handleDrawerToggle}
        drawerWidth={drawerWidth}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          minHeight: "100vh",
          bgcolor: "background.default",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Navbar onMenuClick={handleDrawerToggle} />

        <Box
          sx={{
            flexGrow: 1,
            p: { xs: 2, md: 4 },
          }}
        >
          <Outlet />
        </Box>

        <Footer />
      </Box>
    </Box>
  );
}

export default DashboardLayout;