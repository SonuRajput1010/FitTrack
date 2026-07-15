import { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { toast } from "react-toastify";

import PersonIcon from "@mui/icons-material/Person";
import SaveIcon from "@mui/icons-material/Save";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import MonitorWeightIcon from "@mui/icons-material/MonitorWeight";
import HeightIcon from "@mui/icons-material/Height";
import FlagIcon from "@mui/icons-material/Flag";

import LoadingSkeleton from "../components/ui/LoadingSkeleton";
import { userApi } from "../api/userApi";

const defaultProfile = {
  firstName: "",
  lastName: "",
  email: "",
  age: "",
  height: "",
  weight: "",
  goal: "",
  experienceLevel: "",
  bio: "",
  weeklyWorkoutGoalMinutes: 300,
  monthlyCaloriesGoal: 8000,
  targetWeight: "",
  dailyWaterGoalMl: 3000,
  dailySleepGoalHours: 8,
};

const experienceLevels = ["Beginner", "Intermediate", "Advanced"];

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

function Profile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState(defaultProfile);

  const userId = localStorage.getItem("userId");

  const fullName =
    capitalizeWords(`${profile.firstName || ""} ${profile.lastName || ""}`) ||
    "Fitness Member";

  const updateNavbarUser = (data) => {
    const name =
      capitalizeWords(`${data.firstName || ""} ${data.lastName || ""}`) ||
      data.email ||
      "Fitness Member";

    localStorage.setItem("userName", name);
    localStorage.setItem("userEmail", data.email || "");
    window.dispatchEvent(new Event("profileUpdated"));
  };

  const normalizeProfile = (data) => ({
    firstName: data.firstName || "",
    lastName: data.lastName || "",
    email: data.email || "",
    age: data.age ?? "",
    height: data.height ?? "",
    weight: data.weight ?? "",
    goal: data.goal || "",
    experienceLevel: data.experienceLevel || "",
    bio: data.bio || "",
    weeklyWorkoutGoalMinutes: data.weeklyWorkoutGoalMinutes ?? 300,
    monthlyCaloriesGoal: data.monthlyCaloriesGoal ?? 8000,
    targetWeight: data.targetWeight ?? "",
    dailyWaterGoalMl: data.dailyWaterGoalMl ?? 3000,
    dailySleepGoalHours: data.dailySleepGoalHours ?? 8,
  });

  const fetchProfile = async () => {
    try {
      setLoading(true);

      if (!userId) {
        toast.error("User not found. Please login again.");
        return;
      }

      const data = await userApi.getUserById(userId);
      const profileData = normalizeProfile(data);

      setProfile(profileData);
      updateNavbarUser(profileData);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toNumberOrNull = (value) => {
    if (value === "" || value === null || value === undefined) {
      return null;
    }

    return Number(value);
  };

  const validateGoals = () => {
    if (
      profile.weeklyWorkoutGoalMinutes &&
      Number(profile.weeklyWorkoutGoalMinutes) <= 0
    ) {
      toast.error("Weekly workout goal must be greater than 0");
      return false;
    }

    if (profile.monthlyCaloriesGoal && Number(profile.monthlyCaloriesGoal) <= 0) {
      toast.error("Monthly calories goal must be greater than 0");
      return false;
    }

    if (profile.targetWeight && Number(profile.targetWeight) <= 0) {
      toast.error("Target weight must be greater than 0");
      return false;
    }

    if (profile.dailyWaterGoalMl && Number(profile.dailyWaterGoalMl) <= 0) {
      toast.error("Daily water goal must be greater than 0");
      return false;
    }

    if (profile.dailySleepGoalHours && Number(profile.dailySleepGoalHours) <= 0) {
      toast.error("Daily sleep goal must be greater than 0");
      return false;
    }

    return true;
  };

  const handleSaveProfile = async () => {
    if (!profile.firstName.trim()) {
      toast.error("First name is required");
      return;
    }

    if (!profile.lastName.trim()) {
      toast.error("Last name is required");
      return;
    }

    if (!profile.email.trim()) {
      toast.error("Email is required");
      return;
    }

    if (!validateGoals()) return;

    try {
      setSaving(true);

      const payload = {
        firstName: profile.firstName.trim(),
        lastName: profile.lastName.trim(),
        email: profile.email.trim(),
        age: toNumberOrNull(profile.age),
        height: toNumberOrNull(profile.height),
        weight: toNumberOrNull(profile.weight),
        goal: profile.goal,
        experienceLevel: profile.experienceLevel,
        bio: profile.bio,
        weeklyWorkoutGoalMinutes: toNumberOrNull(
          profile.weeklyWorkoutGoalMinutes
        ),
        monthlyCaloriesGoal: toNumberOrNull(profile.monthlyCaloriesGoal),
        targetWeight: toNumberOrNull(profile.targetWeight),
        dailyWaterGoalMl: toNumberOrNull(profile.dailyWaterGoalMl),
        dailySleepGoalHours: toNumberOrNull(profile.dailySleepGoalHours),
      };

      const updatedProfile = await userApi.patchUser(userId, payload);
      const newProfile = normalizeProfile(updatedProfile);

      setProfile(newProfile);
      updateNavbarUser(newProfile);

      toast.success("Profile updated successfully");
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <Box>
      <Box sx={{ mb: 5, textAlign: "center" }}>
        <Typography variant="h3" fontWeight={800} color="text.primary">
          Profile
        </Typography>

        <Typography color="text.secondary" mt={1}>
          Manage your personal information, fitness preferences and goals.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 4,
              bgcolor: "background.paper",
              height: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Avatar
                sx={{
                  width: 140,
                  height: 140,
                  bgcolor: "primary.main",
                  mb: 3,
                  fontSize: 52,
                  fontWeight: 800,
                }}
              >
                {fullName !== "Fitness Member" ? (
                  getInitials(fullName)
                ) : (
                  <PersonIcon sx={{ fontSize: 80 }} />
                )}
              </Avatar>

              <Typography variant="h4" fontWeight={700} textAlign="center">
                {fullName}
              </Typography>

              <Typography color="text.secondary" mt={1} textAlign="center">
                {profile.email || "Fitness Member"}
              </Typography>

              <Chip
                label="Active User"
                color="success"
                sx={{
                  mt: 2,
                  mb: 3,
                  fontSize: "1rem",
                  px: 1,
                }}
              />
            </Box>

            <Divider sx={{ my: 4 }} />

            <Stack spacing={3}>
              <Stack direction="row" alignItems="center">
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  sx={{ minWidth: 135 }}
                >
                  <FitnessCenterIcon color="primary" />
                  <Typography fontWeight={600}>Goal</Typography>
                </Stack>

                <Typography fontWeight={600}>:</Typography>

                <Typography color="text.secondary" ml={1}>
                  {profile.goal || "Not set"}
                </Typography>
              </Stack>

              <Stack direction="row" alignItems="center">
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  sx={{ minWidth: 135 }}
                >
                  <MonitorWeightIcon color="primary" />
                  <Typography fontWeight={600}>Weight</Typography>
                </Stack>

                <Typography fontWeight={600}>:</Typography>

                <Typography color="text.secondary" ml={1}>
                  {profile.weight ? `${profile.weight} kg` : "Not set"}
                </Typography>
              </Stack>

              <Stack direction="row" alignItems="center">
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  sx={{ minWidth: 135 }}
                >
                  <HeightIcon color="primary" />
                  <Typography fontWeight={600}>Height</Typography>
                </Stack>

                <Typography fontWeight={600}>:</Typography>

                <Typography color="text.secondary" ml={1}>
                  {profile.height ? `${profile.height} cm` : "Not set"}
                </Typography>
              </Stack>

              <Stack direction="row" alignItems="center">
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  sx={{ minWidth: 135 }}
                >
                  <FlagIcon color="primary" />
                  <Typography fontWeight={600}>Weekly</Typography>
                </Stack>

                <Typography fontWeight={600}>:</Typography>

                <Typography color="text.secondary" ml={1}>
                  {profile.weeklyWorkoutGoalMinutes || 300} min
                </Typography>
              </Stack>
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 4,
              bgcolor: "background.paper",
            }}
          >
            <Typography variant="h4" fontWeight={700} mb={4}>
              Personal Details
            </Typography>

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="firstName"
                  value={profile.firstName}
                  onChange={handleChange}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  value={profile.lastName}
                  onChange={handleChange}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Age"
                  name="age"
                  type="number"
                  value={profile.age}
                  onChange={handleChange}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Height"
                  name="height"
                  type="number"
                  value={profile.height}
                  onChange={handleChange}
                  helperText="Height in cm"
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Weight"
                  name="weight"
                  type="number"
                  value={profile.weight}
                  onChange={handleChange}
                  helperText="Weight in kg"
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  select
                  fullWidth
                  label="Experience Level"
                  name="experienceLevel"
                  value={profile.experienceLevel}
                  onChange={handleChange}
                >
                  {experienceLevels.map((level) => (
                    <MenuItem key={level} value={level}>
                      {level}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Fitness Goal"
                  name="goal"
                  value={profile.goal}
                  onChange={handleChange}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Divider sx={{ my: 1 }} />
                <Typography variant="h5" fontWeight={800} mt={2} mb={1}>
                  Fitness Goals
                </Typography>

                <Typography color="text.secondary" mb={2}>
                  These values are used dynamically on your dashboard.
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Weekly Workout Goal"
                  name="weeklyWorkoutGoalMinutes"
                  type="number"
                  value={profile.weeklyWorkoutGoalMinutes}
                  onChange={handleChange}
                  helperText="Minutes per week"
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Monthly Calories Goal"
                  name="monthlyCaloriesGoal"
                  type="number"
                  value={profile.monthlyCaloriesGoal}
                  onChange={handleChange}
                  helperText="Calories per month"
                />
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  label="Target Weight"
                  name="targetWeight"
                  type="number"
                  value={profile.targetWeight}
                  onChange={handleChange}
                  helperText="Target weight in kg"
                />
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  label="Daily Water Goal"
                  name="dailyWaterGoalMl"
                  type="number"
                  value={profile.dailyWaterGoalMl}
                  onChange={handleChange}
                  helperText="Water in ml"
                />
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  label="Daily Sleep Goal"
                  name="dailySleepGoalHours"
                  type="number"
                  value={profile.dailySleepGoalHours}
                  onChange={handleChange}
                  helperText="Sleep in hours"
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  multiline
                  minRows={4}
                  label="Bio"
                  name="bio"
                  value={profile.bio}
                  onChange={handleChange}
                  placeholder="Tell us about your fitness journey..."
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={handleSaveProfile}
                  disabled={saving}
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 3,
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                >
                  {saving ? "Saving..." : "Save Profile"}
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Profile;