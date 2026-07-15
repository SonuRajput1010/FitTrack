import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Divider,
  FormControlLabel,
  Grid,
  MenuItem,
  Paper,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import SaveIcon from "@mui/icons-material/Save";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import PaletteIcon from "@mui/icons-material/Palette";
import PublicIcon from "@mui/icons-material/Public";
import SecurityIcon from "@mui/icons-material/Security";
import LogoutIcon from "@mui/icons-material/Logout";
import FlagIcon from "@mui/icons-material/Flag";

import { useColorMode } from "../context/ColorModeContext";
import LoadingSkeleton from "../components/ui/LoadingSkeleton";
import keycloak from "../api/keycloak";
import { userApi } from "../api/userApi";

const defaultSettings = {
  language: "English",
  emailNotifications: true,
  workoutReminders: true,
  weeklyReports: false,
  units: "Metric",
  profileVisibility: true,
  shareActivityData: false,

  weeklyWorkoutGoalMinutes: 300,
  monthlyCaloriesGoal: 8000,
  targetWeight: "",
  dailyWaterGoalMl: 3000,
  dailySleepGoalHours: 8,
};

function Settings() {
  const navigate = useNavigate();
  const { mode, setColorMode } = useColorMode();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState(defaultSettings);

  const userId = localStorage.getItem("userId");

  const accountName = localStorage.getItem("userName") || "Fitness Member";
  const accountEmail = localStorage.getItem("userEmail") || "No email found";

  const toNumberOrNull = (value) => {
    if (value === "" || value === null || value === undefined) return null;
    return Number(value);
  };

  const loadSettings = async () => {
    try {
      setLoading(true);

      const savedSettings = JSON.parse(
        localStorage.getItem("appSettings") || "{}"
      );

      let profileSettings = {};

      if (userId) {
        const profile = await userApi.getUserById(userId);

        profileSettings = {
          weeklyWorkoutGoalMinutes: profile.weeklyWorkoutGoalMinutes ?? 300,
          monthlyCaloriesGoal: profile.monthlyCaloriesGoal ?? 8000,
          targetWeight: profile.targetWeight ?? "",
          dailyWaterGoalMl: profile.dailyWaterGoalMl ?? 3000,
          dailySleepGoalHours: profile.dailySleepGoalHours ?? 8,
        };
      }

      setSettings({
        ...defaultSettings,
        ...savedSettings,
        ...profileSettings,
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSettingChange = (name, value) => {
    setSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDarkModeChange = (event) => {
    const newMode = event.target.checked ? "dark" : "light";
    setColorMode(newMode);
    localStorage.setItem("themeMode", newMode);
  };

  const validateGoals = () => {
    if (Number(settings.weeklyWorkoutGoalMinutes) <= 0) {
      toast.error("Weekly workout goal must be greater than 0");
      return false;
    }

    if (Number(settings.monthlyCaloriesGoal) <= 0) {
      toast.error("Monthly calories goal must be greater than 0");
      return false;
    }

    if (settings.targetWeight && Number(settings.targetWeight) <= 0) {
      toast.error("Target weight must be greater than 0");
      return false;
    }

    if (Number(settings.dailyWaterGoalMl) <= 0) {
      toast.error("Daily water goal must be greater than 0");
      return false;
    }

    if (Number(settings.dailySleepGoalHours) <= 0) {
      toast.error("Daily sleep goal must be greater than 0");
      return false;
    }

    return true;
  };

  const handleSaveSettings = async () => {
    if (!validateGoals()) return;

    try {
      setSaving(true);

      localStorage.setItem(
        "appSettings",
        JSON.stringify({
          language: settings.language,
          emailNotifications: settings.emailNotifications,
          workoutReminders: settings.workoutReminders,
          weeklyReports: settings.weeklyReports,
          units: settings.units,
          profileVisibility: settings.profileVisibility,
          shareActivityData: settings.shareActivityData,
        })
      );

      if (userId) {
        await userApi.patchUser(userId, {
          weeklyWorkoutGoalMinutes: toNumberOrNull(
            settings.weeklyWorkoutGoalMinutes
          ),
          monthlyCaloriesGoal: toNumberOrNull(settings.monthlyCaloriesGoal),
          targetWeight: toNumberOrNull(settings.targetWeight),
          dailyWaterGoalMl: toNumberOrNull(settings.dailyWaterGoalMl),
          dailySleepGoalHours: toNumberOrNull(settings.dailySleepGoalHours),
        });
      }

      window.dispatchEvent(new Event("profileUpdated"));

      toast.success("Settings saved successfully");
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Failed to save settings"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");

    if (keycloak.authenticated) {
      keycloak.logout({
        redirectUri: `${window.location.origin}/login`,
      });
    } else {
      navigate("/login", { replace: true });
    }
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <Box>
      <Box textAlign="center" mb={5}>
        <Typography variant="h3" fontWeight={800} color="text.primary">
          Settings
        </Typography>

        <Typography color="text.secondary" mt={1}>
          Manage your goals, preferences and application settings.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 4,
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper",
            }}
          >
            <Stack direction="row" spacing={2} mb={3} alignItems="center">
              <FlagIcon color="primary" />

              <Typography variant="h5" fontWeight={700}>
                Fitness Goals
              </Typography>
            </Stack>

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  type="number"
                  label="Weekly Workout Goal"
                  value={settings.weeklyWorkoutGoalMinutes}
                  onChange={(event) =>
                    handleSettingChange(
                      "weeklyWorkoutGoalMinutes",
                      event.target.value
                    )
                  }
                  helperText="Minutes per week"
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  type="number"
                  label="Monthly Calories Goal"
                  value={settings.monthlyCaloriesGoal}
                  onChange={(event) =>
                    handleSettingChange("monthlyCaloriesGoal", event.target.value)
                  }
                  helperText="Calories per month"
                />
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  type="number"
                  label="Target Weight"
                  value={settings.targetWeight}
                  onChange={(event) =>
                    handleSettingChange("targetWeight", event.target.value)
                  }
                  helperText="Target weight in kg"
                />
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  type="number"
                  label="Daily Water Goal"
                  value={settings.dailyWaterGoalMl}
                  onChange={(event) =>
                    handleSettingChange("dailyWaterGoalMl", event.target.value)
                  }
                  helperText="Water in ml"
                />
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  type="number"
                  label="Daily Sleep Goal"
                  value={settings.dailySleepGoalHours}
                  onChange={(event) =>
                    handleSettingChange("dailySleepGoalHours", event.target.value)
                  }
                  helperText="Sleep in hours"
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 4,
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper",
            }}
          >
            <Stack direction="row" spacing={2} mb={3} alignItems="center">
              <PaletteIcon color="primary" />

              <Typography variant="h5" fontWeight={700}>
                Appearance
              </Typography>
            </Stack>

            <FormControlLabel
              control={
                <Switch
                  checked={mode === "dark"}
                  onChange={handleDarkModeChange}
                />
              }
              label="Dark Mode"
            />

            <Divider sx={{ my: 2 }} />

            <TextField
              select
              fullWidth
              label="Language"
              value={settings.language}
              onChange={(event) =>
                handleSettingChange("language", event.target.value)
              }
            >
              <MenuItem value="English">English</MenuItem>
              <MenuItem value="Hindi">Hindi</MenuItem>
            </TextField>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 4,
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper",
            }}
          >
            <Stack direction="row" spacing={2} mb={3} alignItems="center">
              <NotificationsActiveIcon color="primary" />

              <Typography variant="h5" fontWeight={700}>
                Notifications
              </Typography>
            </Stack>

            <Stack spacing={2}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.emailNotifications}
                    onChange={(event) =>
                      handleSettingChange(
                        "emailNotifications",
                        event.target.checked
                      )
                    }
                  />
                }
                label="Email Notifications"
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.workoutReminders}
                    onChange={(event) =>
                      handleSettingChange(
                        "workoutReminders",
                        event.target.checked
                      )
                    }
                  />
                }
                label="Workout Reminders"
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.weeklyReports}
                    onChange={(event) =>
                      handleSettingChange("weeklyReports", event.target.checked)
                    }
                  />
                }
                label="Weekly Reports"
              />
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 4,
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper",
            }}
          >
            <Stack direction="row" spacing={2} mb={3} alignItems="center">
              <PublicIcon color="primary" />

              <Typography variant="h5" fontWeight={700}>
                Preferences
              </Typography>
            </Stack>

            <TextField
              select
              fullWidth
              label="Units"
              value={settings.units}
              onChange={(event) =>
                handleSettingChange("units", event.target.value)
              }
            >
              <MenuItem value="Metric">Metric kg, cm</MenuItem>
              <MenuItem value="Imperial">Imperial lbs, ft</MenuItem>
            </TextField>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 4,
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper",
            }}
          >
            <Stack direction="row" spacing={2} mb={3} alignItems="center">
              <SecurityIcon color="primary" />

              <Typography variant="h5" fontWeight={700}>
                Privacy
              </Typography>
            </Stack>

            <Stack spacing={2}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.profileVisibility}
                    onChange={(event) =>
                      handleSettingChange(
                        "profileVisibility",
                        event.target.checked
                      )
                    }
                  />
                }
                label="Profile Visibility"
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.shareActivityData}
                    onChange={(event) =>
                      handleSettingChange(
                        "shareActivityData",
                        event.target.checked
                      )
                    }
                  />
                }
                label="Share Activity Data"
              />
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 4,
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper",
            }}
          >
            <Typography variant="h5" fontWeight={700} mb={3}>
              Account
            </Typography>

            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={2}
              justifyContent="space-between"
              alignItems={{ xs: "stretch", md: "center" }}
            >
              <Box>
                <Typography fontWeight={600}>{accountName}</Typography>

                <Typography color="text.secondary">{accountEmail}</Typography>
              </Box>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={handleSaveSettings}
                  disabled={saving}
                  sx={{
                    px: 4,
                    py: 1.2,
                    borderRadius: 3,
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                >
                  {saving ? "Saving..." : "Save Settings"}
                </Button>

                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<LogoutIcon />}
                  onClick={handleLogout}
                  sx={{
                    px: 4,
                    py: 1.2,
                    borderRadius: 3,
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                >
                  Logout
                </Button>
              </Stack>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Settings;