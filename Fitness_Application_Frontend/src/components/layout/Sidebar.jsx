import { NavLink } from "react-router-dom";
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import PsychologyIcon from "@mui/icons-material/Psychology";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";

const menuItems = [
  { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
  { text: "Activities", icon: <FitnessCenterIcon />, path: "/activities" },
  { text: "Add Activity", icon: <AddCircleIcon />, path: "/activities/add" },
  {
    text: "AI Recommendations",
    icon: <PsychologyIcon />,
    path: "/recommendations",
  },
  { text: "Profile", icon: <PersonIcon />, path: "/profile" },
  { text: "Settings", icon: <SettingsIcon />, path: "/settings" },
];

function Sidebar() {
  return (
    <Box sx={{ height: "100%", bgcolor: "background.paper" }}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" fontWeight={800} color="primary">
          FitTrack
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Fitness Dashboard
        </Typography>
      </Box>

      <List sx={{ px: 2 }}>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.text}
            component={NavLink}
            to={item.path}
            end
            sx={{
              mb: 1,
              borderRadius: 3,
              px: 2,
              py: 1.4,
              color: "text.secondary",
              "&.active": {
                bgcolor: "primary.main",
                color: "white",
                boxShadow: "0 8px 20px rgba(37, 99, 235, 0.25)",
                "& .MuiListItemIcon-root": {
                  color: "white",
                },
              },
              "&:hover": {
                bgcolor: "action.hover",
                color: "primary.main",
              },
              "&.active:hover": {
                bgcolor: "primary.main",
                color: "white",
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 42, color: "inherit" }}>
              {item.icon}
            </ListItemIcon>

            <ListItemText
              primary={item.text}
              primaryTypographyProps={{ fontWeight: 600 }}
            />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
}

export default Sidebar;