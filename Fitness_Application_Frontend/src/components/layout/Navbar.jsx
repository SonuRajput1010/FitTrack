import { useEffect, useState } from "react";
import {
  AppBar,
  Avatar,
  Box,
  Divider,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";

import { useColorMode } from "../../context/ColorModeContext";
import NotificationMenu from "../common/NotificationMenu";
import keycloak from "../../api/keycloak";
import { userApi } from "../../api/userApi";

const capitalizeWords = (value = "") => {
  return value
    .toString()
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const getInitials = (name = "") => {
  const parts = name.trim().split(" ").filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }

  if (parts.length === 1) {
    return parts[0][0].toUpperCase();
  }

  return "FM";
};

function Navbar({ onMenuClick }) {
  const navigate = useNavigate();
  const { mode, toggleColorMode } = useColorMode();

  const [anchorEl, setAnchorEl] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [user, setUser] = useState({
    name: localStorage.getItem("userName") || "Fitness Member",
    email: localStorage.getItem("userEmail") || "Fitness Member",
  });

  const open = Boolean(anchorEl);

  const loadUser = async () => {
    try {
      const userId = localStorage.getItem("userId");

      if (!userId) return;

      const data = await userApi.getUserById(userId);

      const fullName =
        capitalizeWords(`${data.firstName || ""} ${data.lastName || ""}`) ||
        data.email ||
        "Fitness Member";

      const email = data.email || "Fitness Member";

      setUser({
        name: fullName,
        email,
      });

      localStorage.setItem("userName", fullName);
      localStorage.setItem("userEmail", email);
    } catch (error) {
      console.error("Failed to load navbar user", error);
    }
  };

  useEffect(() => {
    loadUser();

    const handleProfileUpdated = () => {
      setUser({
        name: localStorage.getItem("userName") || "Fitness Member",
        email: localStorage.getItem("userEmail") || "Fitness Member",
      });
    };

    window.addEventListener("profileUpdated", handleProfileUpdated);

    return () => {
      window.removeEventListener("profileUpdated", handleProfileUpdated);
    };
  }, []);

  const handleSearch = () => {
    const query = searchText.trim();

    if (!query) return;

    const lowerQuery = query.toLowerCase();

    const dashboardKeywords = [
      "dashboard",
      "weekly",
      "weekly chart",
      "weekly progress",
      "progress",
      "bmi",
      "calories chart",
      "pie chart",
      "activity distribution",
      "recent activities",
      "stats",
      "total activities",
      "calories burned",
      "goal",
      "chart",
    ];

    const recommendationKeywords = [
      "recommendation",
      "recommendations",
      "ai",
      "insight",
      "suggestion",
      "suggestions",
      "safety",
      "improvement",
      "improvements",
    ];

    const profileKeywords = [
      "profile",
      "age",
      "height",
      "weight",
      "bio",
      "experience",
      "experience level",
      "fitness goal",
      "email",
      "name",
      "password",
    ];

    const settingsKeywords = [
      "settings",
      "setting",
      "dark",
      "theme",
      "language",
      "notification",
      "notifications",
      "privacy",
      "units",
      "logout",
    ];

    const matches = (keywords) =>
      keywords.some((keyword) => lowerQuery.includes(keyword));

    if (matches(recommendationKeywords)) {
      navigate(`/recommendations?search=${encodeURIComponent(query)}`);
    } else if (matches(profileKeywords)) {
      navigate("/profile");
    } else if (matches(settingsKeywords)) {
      navigate("/settings");
    } else if (matches(dashboardKeywords)) {
      navigate(`/dashboard?search=${encodeURIComponent(query)}`);
    } else {
      navigate(`/activities?search=${encodeURIComponent(query)}`);
    }

    setSearchText("");
  };

  const handleSearchKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");

    handleClose();

    if (keycloak.authenticated) {
      keycloak.logout({
        redirectUri: `${window.location.origin}/login`,
      });
    } else {
      navigate("/login", { replace: true });
    }
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: "background.paper",
        color: "text.primary",
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Toolbar sx={{ gap: 2, minHeight: 72 }}>
        <IconButton
          onClick={onMenuClick}
          sx={{ display: { xs: "inline-flex", md: "none" } }}
        >
          <MenuIcon />
        </IconButton>

        <Box>
          <Typography variant="h6" fontWeight={800}>
            Fitness Application
          </Typography>

          <Typography
            fontSize={13}
            color="text.secondary"
            sx={{ display: { xs: "none", sm: "block" } }}
          >
            Track. Improve. Repeat.
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            px: 1.2,
            py: 0.8,
            borderRadius: 4,
            bgcolor: mode === "light" ? "#f1f5f9" : "#1e293b",
            minWidth: 360,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <IconButton
            size="small"
            onClick={handleSearch}
            sx={{ color: "text.secondary", mr: 1 }}
          >
            <SearchIcon />
          </IconButton>

          <InputBase
            placeholder="Search activities, BMI, weekly chart, recommendations..."
            fullWidth
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            onKeyDown={handleSearchKeyDown}
          />
        </Box>

        <IconButton onClick={toggleColorMode}>
          {mode === "light" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>

        <NotificationMenu />

        <Stack
          direction="row"
          spacing={1.5}
          alignItems="center"
          onClick={handleProfileClick}
          sx={{
            cursor: "pointer",
            px: 1,
            py: 0.8,
            borderRadius: 3,
            "&:hover": {
              bgcolor: "action.hover",
            },
          }}
        >
          <Avatar sx={{ bgcolor: "primary.main", fontWeight: 800 }}>
            {getInitials(user.name)}
          </Avatar>

          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            <Typography fontWeight={700} fontSize={14}>
              {user.name}
            </Typography>

            <Typography fontSize={12} color="text.secondary">
              {user.email}
            </Typography>
          </Box>
        </Stack>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          PaperProps={{
            sx: {
              mt: 1,
              width: 220,
              borderRadius: 3,
            },
          }}
        >
          <MenuItem
            onClick={() => {
              navigate("/profile");
              handleClose();
            }}
          >
            <PersonIcon fontSize="small" sx={{ mr: 1.5 }} />
            Profile
          </MenuItem>

          <MenuItem
            onClick={() => {
              navigate("/settings");
              handleClose();
            }}
          >
            <SettingsIcon fontSize="small" sx={{ mr: 1.5 }} />
            Settings
          </MenuItem>

          <Divider />

          <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
            <LogoutIcon fontSize="small" sx={{ mr: 1.5 }} />
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;