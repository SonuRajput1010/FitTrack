import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { toast } from "react-toastify";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import TimerIcon from "@mui/icons-material/Timer";
import RouteIcon from "@mui/icons-material/Route";
import PsychologyIcon from "@mui/icons-material/Psychology";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import SecurityIcon from "@mui/icons-material/Security";

import LoadingSkeleton from "../components/ui/LoadingSkeleton";
import ConfirmDialog from "../components/common/ConfirmDialog";
import { activityApi } from "../api/activityApi";
import { recommendationApi } from "../api/recommendationApi";

function ActivityDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [activity, setActivity] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recommendationLoading, setRecommendationLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchRecommendation = async (showLoader = true) => {
    try {
      if (showLoader) {
        setRecommendationLoading(true);
      }

      const data = await recommendationApi.getActivityRecommendation(id);
      setRecommendation(data);
      return data;
    } catch (error) {
      console.error(error);
      setRecommendation(null);
      return null;
    } finally {
      if (showLoader) {
        setRecommendationLoading(false);
      }
    }
  };

  const fetchActivity = async () => {
    try {
      setLoading(true);

      const data = await activityApi.getActivityById(id);
      setActivity(data);

      await fetchRecommendation(true);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load activity details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivity();
  }, [id]);

  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 5;

    const interval = setInterval(async () => {
      retryCount += 1;

      await fetchRecommendation(false);

      if (retryCount >= maxRetries) {
        clearInterval(interval);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [id]);

  useEffect(() => {
    const refreshRecommendation = () => {
      fetchRecommendation(true);
    };

    window.addEventListener("activityUpdated", refreshRecommendation);
    window.addEventListener("recommendationsUpdated", refreshRecommendation);

    return () => {
      window.removeEventListener("activityUpdated", refreshRecommendation);
      window.removeEventListener("recommendationsUpdated", refreshRecommendation);
    };
  }, [id]);

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      await activityApi.deleteActivity(id);

      window.dispatchEvent(new Event("activityDeleted"));
      window.dispatchEvent(new Event("recommendationsUpdated"));

      toast.success("Activity deleted successfully");
      navigate("/activities");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete activity");
    } finally {
      setDeleteLoading(false);
      setDeleteDialogOpen(false);
    }
  };

  const formatDateTime = (value) => {
    if (!value) return "-";

    try {
      return new Date(value).toLocaleString();
    } catch {
      return value;
    }
  };

  const formatActivityType = (value) => {
    if (!value) return "Activity";

    return value
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const renderRecommendationSection = ({ title, icon, items = [], color }) => {
    return (
      <Accordion
        disableGutters
        elevation={0}
        sx={{
          mt: 2,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: "16px !important",
          bgcolor: "background.default",
          overflow: "hidden",
          "&:before": {
            display: "none",
          },
        }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 2,
                bgcolor: color,
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {icon}
            </Box>

            <Typography fontWeight={800}>
              {title} ({items.length})
            </Typography>
          </Stack>
        </AccordionSummary>

        <AccordionDetails>
          <Stack spacing={1.5}>
            {items.length > 0 ? (
              items.map((item, index) => (
                <Paper
                  key={`${title}-${index}`}
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: "divider",
                    bgcolor: "background.paper",
                  }}
                >
                  <Typography color="text.secondary" lineHeight={1.8}>
                    {index + 1}. {item}
                  </Typography>
                </Paper>
              ))
            ) : (
              <Typography color="text.secondary">
                No {title.toLowerCase()} available.
              </Typography>
            )}
          </Stack>
        </AccordionDetails>
      </Accordion>
    );
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!activity) {
    return (
      <Box textAlign="center" py={8}>
        <Typography variant="h5" color="text.primary">
          Activity not found
        </Typography>

        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          sx={{ mt: 3 }}
          onClick={() => navigate("/activities")}
        >
          Back to Activities
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", md: "center" }}
        spacing={2}
        mb={3}
      >
        <Box>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/activities")}
            sx={{ mb: 1, textTransform: "none" }}
          >
            Back to Activities
          </Button>

          <Typography variant="h4" fontWeight={800} color="text.primary">
            Activity Details
          </Typography>

          <Typography color="text.secondary">
            Full workout details, metrics and AI recommendation.
          </Typography>
        </Box>

        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<EditIcon />}
            onClick={() => navigate(`/activities/edit/${id}`)}
            sx={{
              height: 40,
              px: 2,
              borderRadius: 2,
              textTransform: "none",
            }}
          >
            Edit
          </Button>

          <Button
            variant="outlined"
            size="small"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => setDeleteDialogOpen(true)}
            sx={{
              height: 40,
              px: 2,
              borderRadius: 2,
              textTransform: "none",
            }}
          >
            Delete
          </Button>
        </Stack>
      </Stack>

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
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems={{ xs: "flex-start", sm: "center" }}
          justifyContent="space-between"
          mb={3}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: 3,
                bgcolor: "primary.main",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FitnessCenterIcon />
            </Box>

            <Box>
              <Typography variant="h5" fontWeight={700} color="text.primary">
                {formatActivityType(activity.type)}
              </Typography>
            </Box>
          </Stack>

          <Chip label="Completed" color="success" />
        </Stack>

        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 4,
                bgcolor: "background.default",
              }}
            >
              <TimerIcon color="primary" />
              <Typography color="text.secondary" mt={1}>
                Duration
              </Typography>
              <Typography variant="h5" fontWeight={700}>
                {activity.duration || 0} min
              </Typography>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 4,
                bgcolor: "background.default",
              }}
            >
              <LocalFireDepartmentIcon color="primary" />
              <Typography color="text.secondary" mt={1}>
                Calories Burned
              </Typography>
              <Typography variant="h5" fontWeight={700}>
                {activity.caloriesBurned || 0} kcal
              </Typography>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 4,
                bgcolor: "background.default",
              }}
            >
              <RouteIcon color="primary" />
              <Typography color="text.secondary" mt={1}>
                Distance
              </Typography>
              <Typography variant="h5" fontWeight={700}>
                {activity.additionalMetrics?.distance || 0} km
              </Typography>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography color="text.secondary">Start Time</Typography>
            <Typography color="text.primary" fontWeight={600}>
              {formatDateTime(activity.startTime)}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography color="text.secondary">End Time</Typography>
            <Typography color="text.primary" fontWeight={600}>
              {formatDateTime(activity.endTime)}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Typography color="text.secondary">Notes</Typography>
            <Typography color="text.primary" fontWeight={500}>
              {activity.additionalMetrics?.notes || "No notes added."}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          mt: 3,
          p: 4,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 4,
          bgcolor: "background.paper",
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center" mb={3}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: 3,
              bgcolor: "primary.main",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <PsychologyIcon />
          </Box>

          <Box>
            <Typography variant="h5" fontWeight={800} color="text.primary">
              AI Recommendation
            </Typography>

            <Typography color="text.secondary">
              Smart insights generated for this activity.
            </Typography>
          </Box>
        </Stack>

        {recommendationLoading ? (
          <Typography color="text.secondary">
            Loading recommendation...
          </Typography>
        ) : recommendation ? (
          <>
            <Box
              sx={{
                p: 3,
                borderRadius: 4,
                bgcolor: "background.default",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography variant="h6" fontWeight={800} mb={1}>
                Overall Analysis
              </Typography>

              <Typography color="text.secondary" lineHeight={1.9}>
                {recommendation.recommendation ||
                  recommendation.recommendationText ||
                  "No overall analysis available."}
              </Typography>
            </Box>

            {renderRecommendationSection({
              title: "Improvements",
              icon: <TrendingUpIcon />,
              items: recommendation.improvements || [],
              color: "success.main",
            })}

            {renderRecommendationSection({
              title: "Suggestions",
              icon: <LightbulbIcon />,
              items: recommendation.suggestions || [],
              color: "warning.main",
            })}

            {renderRecommendationSection({
              title: "Safety Tips",
              icon: <SecurityIcon />,
              items: recommendation.safety || [],
              color: "error.main",
            })}
          </>
        ) : (
          <Box
            sx={{
              p: 3,
              borderRadius: 4,
              bgcolor: "background.default",
              border: "1px solid",
              borderColor: "divider",
              textAlign: "center",
            }}
          >
            <Typography fontWeight={700}>No recommendation found yet</Typography>

            <Typography color="text.secondary" mt={1}>
              Recommendation may appear after AI service processes this activity.
            </Typography>
          </Box>
        )}
      </Paper>

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Activity?"
        message={`Are you sure you want to delete ${formatActivityType(
          activity.type
        )}? This action cannot be undone.`}
        confirmText="Delete"
        onConfirm={handleDelete}
        onClose={() => setDeleteDialogOpen(false)}
        loading={deleteLoading}
      />
    </Box>
  );
}

export default ActivityDetails;