import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  InputAdornment,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { toast } from "react-toastify";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PsychologyIcon from "@mui/icons-material/Psychology";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import SecurityIcon from "@mui/icons-material/Security";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";

import LoadingSkeleton from "../components/ui/LoadingSkeleton";
import { recommendationApi } from "../api/recommendationApi";
import { activityApi } from "../api/activityApi";
import { notificationService } from "../services/notificationService";

function Recommendations() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState([]);
  const [searchText, setSearchText] = useState(searchParams.get("search") || "");
  const [selectedType, setSelectedType] = useState(
    searchParams.get("type") || "ALL"
  );
  const [regeneratingId, setRegeneratingId] = useState(null);

  const fetchRecommendations = async () => {
    try {
      const data = await recommendationApi.getUserRecommendations();
      setRecommendations(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load recommendations");
    }
  };

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      await fetchRecommendations();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecommendations();

    const handleRefresh = () => {
      fetchRecommendations();
    };

    window.addEventListener("recommendationsUpdated", handleRefresh);
    window.addEventListener("activityUpdated", handleRefresh);
    window.addEventListener("activityCreated", handleRefresh);
    window.addEventListener("activityDeleted", handleRefresh);

    return () => {
      window.removeEventListener("recommendationsUpdated", handleRefresh);
      window.removeEventListener("activityUpdated", handleRefresh);
      window.removeEventListener("activityCreated", handleRefresh);
      window.removeEventListener("activityDeleted", handleRefresh);
    };
  }, []);

  useEffect(() => {
    setSearchText(searchParams.get("search") || "");
    setSelectedType(searchParams.get("type") || "ALL");
  }, [searchParams]);

  const normalizeText = (value = "") => {
    return value
      .toString()
      .replaceAll("_", " ")
      .replaceAll("-", " ")
      .toLowerCase()
      .trim();
  };

  const compactText = (value = "") => {
    return normalizeText(value).replace(/\s+/g, "");
  };

  const formatActivityType = (value) => {
    if (!value) return "Activity";

    return value
      .toString()
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const formatDate = (value) => {
    if (!value) return "Recently generated";

    try {
      return new Date(value).toLocaleString();
    } catch {
      return "Recently generated";
    }
  };

  const getActivityType = (item) => {
    return (
      item.activityType ||
      item.type ||
      item.activity?.type ||
      item.activity?.activityType ||
      "Activity"
    );
  };

  const getActivityId = (item) => {
    return item.activityId || item.activity?.id || item.activity?._id;
  };

  const getRecommendationText = (item) => {
    return (
      item.recommendation ||
      item.recommendationText ||
      item.description ||
      item.summary ||
      "No overall analysis available."
    );
  };

  const flattenObjectValues = (value) => {
    if (value === null || value === undefined) return "";

    if (typeof value === "string" || typeof value === "number") {
      return String(value);
    }

    if (Array.isArray(value)) {
      return value.map(flattenObjectValues).join(" ");
    }

    if (typeof value === "object") {
      return Object.values(value).map(flattenObjectValues).join(" ");
    }

    return "";
  };

  const getSearchableText = (item) => {
    const activityType = getActivityType(item);
    const formattedActivityType = formatActivityType(activityType);

    const text = `
      ai
      ai generated
      recommendation
      recommendations
      fitness recommendation
      fitness insight
      activity recommendation
      overall analysis
      improvements
      suggestions
      safety
      safety tips
      ${activityType}
      ${formattedActivityType}
      ${compactText(activityType)}
      ${compactText(formattedActivityType)}
      ${getRecommendationText(item)}
      ${flattenObjectValues(item)}
    `;

    return normalizeText(text);
  };

  const activityTypes = useMemo(() => {
    const types = recommendations.map(getActivityType).filter(Boolean);
    return ["ALL", ...new Set(types)];
  }, [recommendations]);

  const filteredRecommendations = useMemo(() => {
    const query = normalizeText(searchText);
    const compactQuery = compactText(searchText);
    const queryWords = query.split(" ").filter(Boolean);

    return recommendations.filter((item) => {
      const activityType = getActivityType(item);
      const formattedActivityType = formatActivityType(activityType);

      const searchableText = getSearchableText(item);
      const searchableCompact = compactText(searchableText);

      const matchesSearch =
        queryWords.length === 0 ||
        searchableText.includes(query) ||
        searchableCompact.includes(compactQuery) ||
        queryWords.every((word) => searchableText.includes(word));

      const matchesType =
        selectedType === "ALL" ||
        compactText(activityType) === compactText(selectedType) ||
        compactText(formattedActivityType) === compactText(selectedType);

      return matchesSearch && matchesType;
    });
  }, [recommendations, searchText, selectedType]);

  const updateSearchParams = (nextSearch, nextType) => {
    const params = {};

    if (nextSearch?.trim()) {
      params.search = nextSearch.trim();
    }

    if (nextType && nextType !== "ALL") {
      params.type = nextType;
    }

    setSearchParams(params);
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchText(value);
    updateSearchParams(value, selectedType);
  };

  const handleTypeChange = (event) => {
    const value = event.target.value;
    setSelectedType(value);
    updateSearchParams(searchText, value);
  };

  const handleRegenerate = async (item) => {
    const activityId = getActivityId(item);

    if (!activityId) {
      toast.error("Activity id not found for this recommendation");
      return;
    }

    try {
      setRegeneratingId(activityId);

      await activityApi.regenerateRecommendation(activityId);

      notificationService.addNotification({
        title: "AI Regeneration Started",
        message: `${formatActivityType(
          getActivityType(item)
        )} recommendation is being regenerated.`,
        type: "recommendation",
      });

      toast.success("AI recommendation regeneration started");

      window.dispatchEvent(new Event("recommendationsUpdated"));

      setTimeout(fetchRecommendations, 3000);
      setTimeout(fetchRecommendations, 7000);
      setTimeout(fetchRecommendations, 12000);
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Failed to regenerate recommendation"
      );
    } finally {
      setTimeout(() => {
        setRegeneratingId(null);
      }, 12000);
    }
  };

  const renderAccordionSection = ({
    title,
    icon,
    items = [],
    color = "primary.main",
  }) => {
    return (
      <Accordion
        disableGutters
        elevation={0}
        sx={{
          mt: 2,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: "16px !important",
          overflow: "hidden",
          bgcolor: "background.default",
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

  return (
    <Box>
      <Box textAlign="center" mb={5}>
        <Typography variant="h4" fontWeight={800} color="text.primary">
          AI Recommendations
        </Typography>

        <Typography color="text.secondary" mt={1}>
          Personalized AI fitness insights generated from your activity data.
        </Typography>
      </Box>

      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 4,
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
        }}
      >
        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
          <TextField
            fullWidth
            label="Search by activity type or recommendation text"
            placeholder="Example: running, weight training, safety, calories"
            value={searchText}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            select
            fullWidth
            label="Filter by activity"
            value={selectedType}
            onChange={handleTypeChange}
          >
            {activityTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type === "ALL" ? "All Activities" : formatActivityType(type)}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
      </Paper>

      {recommendations.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 6,
            borderRadius: 4,
            border: "1px solid",
            borderColor: "divider",
            textAlign: "center",
            bgcolor: "background.paper",
          }}
        >
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              bgcolor: "primary.main",
              color: "white",
              mx: "auto",
              mb: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <PsychologyIcon sx={{ fontSize: 42 }} />
          </Box>

          <Typography variant="h5" fontWeight={800} color="text.primary">
            No recommendations available yet
          </Typography>

          <Typography color="text.secondary" mt={1}>
            Add some activities first. AI recommendations will appear here after
            analysis.
          </Typography>
        </Paper>
      ) : filteredRecommendations.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 6,
            borderRadius: 4,
            border: "1px solid",
            borderColor: "divider",
            textAlign: "center",
            bgcolor: "background.paper",
          }}
        >
          <Typography variant="h5" fontWeight={800} color="text.primary">
            No matching recommendations
          </Typography>

          <Typography color="text.secondary" mt={1}>
            Try searching activity type like running, walking, weight training,
            yoga, cycling, safety, calories, suggestions, or improvements.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filteredRecommendations.map((item) => {
            const activityType = getActivityType(item);
            const activityId = getActivityId(item);
            const isRegenerating = regeneratingId === activityId;

            return (
              <Grid
                key={item.id || item._id || item.activityId}
                size={{ xs: 12 }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 2.5, md: 3.5 },
                    borderRadius: 5,
                    border: "1px solid",
                    borderColor: "divider",
                    bgcolor: "background.paper",
                    boxShadow: "0 18px 45px rgba(15, 23, 42, 0.06)",
                  }}
                >
                  <Stack
                    direction={{ xs: "column", md: "row" }}
                    justifyContent="space-between"
                    alignItems={{ xs: "flex-start", md: "center" }}
                    spacing={2}
                    mb={3}
                  >
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Box
                        sx={{
                          width: 58,
                          height: 58,
                          borderRadius: 3,
                          bgcolor: "primary.main",
                          color: "white",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <PsychologyIcon sx={{ fontSize: 34 }} />
                      </Box>

                      <Box>
                        <Typography
                          variant="h5"
                          fontWeight={800}
                          color="text.primary"
                        >
                          {formatActivityType(activityType)} Recommendation
                        </Typography>

                        <Typography color="text.secondary" mt={0.5}>
                          {formatDate(item.createdAt)}
                        </Typography>
                      </Box>
                    </Stack>

                    <Stack
                      direction="row"
                      spacing={1}
                      flexWrap="wrap"
                      alignItems="center"
                    >
                      <Chip
                        icon={<AutoAwesomeIcon />}
                        label="AI Generated"
                        color="primary"
                        sx={{ fontWeight: 700 }}
                      />

                      <Chip
                        label={formatActivityType(activityType)}
                        variant="outlined"
                        sx={{ fontWeight: 700 }}
                      />

                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={
                          isRegenerating ? (
                            <CircularProgress size={16} />
                          ) : (
                            <RefreshIcon />
                          )
                        }
                        disabled={isRegenerating || !activityId}
                        onClick={() => handleRegenerate(item)}
                        sx={{
                          borderRadius: 3,
                          textTransform: "none",
                          fontWeight: 800,
                          px: 2,
                          height: 36,
                        }}
                      >
                        {isRegenerating ? "Generating..." : "Regenerate AI"}
                      </Button>
                    </Stack>
                  </Stack>

                  <Divider sx={{ mb: 3 }} />

                  <Box
                    sx={{
                      p: 3,
                      borderRadius: 4,
                      bgcolor: "background.default",
                      border: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <Stack
                      direction="row"
                      spacing={1.5}
                      alignItems="center"
                      mb={1}
                    >
                      <AutoAwesomeIcon color="primary" />

                      <Typography variant="h6" fontWeight={800}>
                        Overall Analysis
                      </Typography>
                    </Stack>

                    <Typography color="text.secondary" lineHeight={1.9}>
                      {getRecommendationText(item)}
                    </Typography>
                  </Box>

                  {renderAccordionSection({
                    title: "Improvements",
                    icon: <TrendingUpIcon />,
                    items: item.improvements || [],
                    color: "success.main",
                  })}

                  {renderAccordionSection({
                    title: "Suggestions",
                    icon: <LightbulbIcon />,
                    items: item.suggestions || [],
                    color: "warning.main",
                  })}

                  {renderAccordionSection({
                    title: "Safety Tips",
                    icon: <SecurityIcon />,
                    items: item.safety || [],
                    color: "error.main",
                  })}
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
}

export default Recommendations;