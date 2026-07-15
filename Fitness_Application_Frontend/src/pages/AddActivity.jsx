import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  Stack,
  Divider,
  InputAdornment,
} from "@mui/material";
import { toast } from "react-toastify";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import TimerIcon from "@mui/icons-material/Timer";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import RouteIcon from "@mui/icons-material/Route";
import NotesIcon from "@mui/icons-material/Notes";
import SaveIcon from "@mui/icons-material/Save";

import { activityApi } from "../api/activityApi";
import { notificationService } from "../services/notificationService";

const activityTypes = [
  "RUNNING",
  "WALKING",
  "SWIMMING",
  "CYCLING",
  "WEIGHT_TRAINING",
  "YOGA",
  "CARDIO",
  "HIIT",
  "STRETCHING",
  "OTHER",
];

function AddActivity() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    type: "",
    duration: "",
    caloriesBurned: "",
    startTime: "",
    endTime: "",
    distance: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);

  const formatActivityType = (value) => {
    if (!value) return "Activity";

    return value
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.type) {
      toast.error("Please select activity type");
      return false;
    }

    if (!formData.duration || Number(formData.duration) <= 0) {
      toast.error("Please enter valid duration");
      return false;
    }

    if (!formData.caloriesBurned || Number(formData.caloriesBurned) < 0) {
      toast.error("Please enter valid calories");
      return false;
    }

    if (formData.distance && Number(formData.distance) < 0) {
      toast.error("Distance cannot be negative");
      return false;
    }

    if (
      formData.startTime &&
      formData.endTime &&
      new Date(formData.endTime) < new Date(formData.startTime)
    ) {
      toast.error("End time must be after start time");
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    const payload = {
      userId: localStorage.getItem("userId"),
      type: formData.type,
      duration: Number(formData.duration),
      caloriesBurned: Number(formData.caloriesBurned),
      startTime: formData.startTime ? `${formData.startTime}:00` : null,
      endTime: formData.endTime ? `${formData.endTime}:00` : null,
      additionalMetrics: {
        distance: formData.distance ? Number(formData.distance) : 0,
        notes: formData.notes || "",
      },
    };

    try {
      setLoading(true);

      await activityApi.createActivity(payload);

      notificationService.addNotification({
        title: "Activity Added",
        message: `${formatActivityType(formData.type)} activity added successfully.`,
        type: "activity",
      });

      window.dispatchEvent(new Event("activityCreated"));
      window.dispatchEvent(new Event("activityUpdated"));
      window.dispatchEvent(new Event("recommendationsUpdated"));

      toast.success("Activity added successfully");
      navigate("/activities");
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Failed to add activity"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box sx={{ textAlign: "center", mb: 5 }}>
        <Typography variant="h3" fontWeight={900} color="text.primary">
          Add Activity
        </Typography>

        <Typography color="text.secondary" mt={1} fontSize={17}>
          Track your workout and generate AI-powered recommendations.
        </Typography>
      </Box>

      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, md: 4 },
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 6,
          maxWidth: 1050,
          mx: "auto",
          bgcolor: "background.paper",
          boxShadow: "0 18px 45px rgba(15, 23, 42, 0.06)",
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center" mb={3}>
          <Box
            sx={{
              width: 58,
              height: 58,
              borderRadius: 4,
              bgcolor: "primary.main",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 12px 28px rgba(37, 99, 235, 0.28)",
            }}
          >
            <FitnessCenterIcon />
          </Box>

          <Box>
            <Typography variant="h5" fontWeight={900}>
              Workout Details
            </Typography>

            <Typography color="text.secondary">
              Fill in your activity metrics carefully.
            </Typography>
          </Box>
        </Stack>

        <Divider sx={{ mb: 4 }} />

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                select
                fullWidth
                required
                label="Activity Type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                  },
                }}
              >
                {activityTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {formatActivityType(type)}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                required
                type="number"
                label="Duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                helperText="Duration in minutes"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <TimerIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                  },
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                required
                type="number"
                label="Calories Burned"
                name="caloriesBurned"
                value={formData.caloriesBurned}
                onChange={handleChange}
                helperText="Example: 250"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocalFireDepartmentIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                  },
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                type="number"
                label="Distance"
                name="distance"
                value={formData.distance}
                onChange={handleChange}
                helperText="Distance in kilometers"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <RouteIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                  },
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Typography
                variant="body2"
                sx={{
                  mb: 1,
                  color: "text.secondary",
                  fontWeight: 700,
                }}
              >
                Start Time
              </Typography>

              <TextField
                fullWidth
                type="datetime-local"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                  },
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Typography
                variant="body2"
                sx={{
                  mb: 1,
                  color: "text.secondary",
                  fontWeight: 700,
                }}
              >
                End Time
              </Typography>

              <TextField
                fullWidth
                type="datetime-local"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                  },
                }}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                multiline
                minRows={5}
                label="Notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Example: Felt strong today, completed workout easily..."
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ alignSelf: "flex-start", mt: 1.5 }}>
                      <NotesIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                    alignItems: "flex-start",
                  },
                }}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Divider sx={{ my: 1 }} />

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                justifyContent="flex-end"
              >
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<ArrowBackIcon />}
                  onClick={() => navigate("/activities")}
                  sx={{
                    height: 52,
                    px: 3,
                    borderRadius: 3,
                    textTransform: "none",
                    fontWeight: 800,
                  }}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading}
                  startIcon={<SaveIcon />}
                  sx={{
                    height: 52,
                    px: 3.5,
                    borderRadius: 3,
                    textTransform: "none",
                    fontWeight: 800,
                    boxShadow: "0 12px 28px rgba(37, 99, 235, 0.28)",
                  }}
                >
                  {loading ? "Saving..." : "Add Activity"}
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
}

export default AddActivity;