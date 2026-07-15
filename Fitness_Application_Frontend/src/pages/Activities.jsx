import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  Stack,
  Button,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Tooltip,
  Grid,
  InputAdornment,
  Divider,
} from "@mui/material";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import AddIcon from "@mui/icons-material/Add";
import DownloadIcon from "@mui/icons-material/Download";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import TimerIcon from "@mui/icons-material/Timer";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import RouteIcon from "@mui/icons-material/Route";

import ConfirmDialog from "../components/common/ConfirmDialog";
import LoadingSkeleton from "../components/ui/LoadingSkeleton";
import { activityApi } from "../api/activityApi";
import { notificationService } from "../services/notificationService";

const activityTypes = [
  "ALL",
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

function Activities() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState([]);
  const [searchText, setSearchText] = useState(searchParams.get("search") || "");
  const [selectedType, setSelectedType] = useState("ALL");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const data = await activityApi.getUserActivities();
      setActivities(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load activities");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();

    const refreshActivities = () => {
      fetchActivities();
    };

    window.addEventListener("activityCreated", refreshActivities);
    window.addEventListener("activityUpdated", refreshActivities);
    window.addEventListener("activityDeleted", refreshActivities);

    return () => {
      window.removeEventListener("activityCreated", refreshActivities);
      window.removeEventListener("activityUpdated", refreshActivities);
      window.removeEventListener("activityDeleted", refreshActivities);
    };
  }, []);

  useEffect(() => {
    setSearchText(searchParams.get("search") || "");
    setPage(0);
  }, [searchParams]);

  const formatActivityType = (value) => {
    if (!value) return "Unknown";

    return value
      .toString()
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const formatDateTime = (value) => {
    if (!value) return "-";

    try {
      return new Date(value).toLocaleString();
    } catch {
      return value;
    }
  };

  const filteredActivities = useMemo(() => {
    return activities.filter((activity) => {
      const typeText = formatActivityType(activity.type).toLowerCase();
      const notesText =
        activity.additionalMetrics?.notes?.toLowerCase() || "";

      const query = searchText.toLowerCase();

      const matchesSearch =
        typeText.includes(query) ||
        notesText.includes(query) ||
        String(activity.duration || "").includes(query) ||
        String(activity.caloriesBurned || "").includes(query) ||
        String(activity.additionalMetrics?.distance || "").includes(query);

      const matchesType =
        selectedType === "ALL" || activity.type === selectedType;

      return matchesSearch && matchesType;
    });
  }, [activities, searchText, selectedType]);

  const paginatedActivities = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return filteredActivities.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredActivities, page, rowsPerPage]);

  const exportSummary = useMemo(() => {
    const totalActivities = filteredActivities.length;

    const totalDuration = filteredActivities.reduce(
      (sum, activity) => sum + Number(activity.duration || 0),
      0
    );

    const totalCalories = filteredActivities.reduce(
      (sum, activity) => sum + Number(activity.caloriesBurned || 0),
      0
    );

    const totalDistance = filteredActivities.reduce(
      (sum, activity) =>
        sum + Number(activity.additionalMetrics?.distance || 0),
      0
    );

    return {
      totalActivities,
      totalDuration,
      totalCalories,
      totalDistance,
    };
  }, [filteredActivities]);

  useEffect(() => {
    const maxPage = Math.max(
      0,
      Math.ceil(filteredActivities.length / rowsPerPage) - 1
    );

    if (page > maxPage) {
      setPage(maxPage);
    }
  }, [filteredActivities.length, rowsPerPage, page]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number(event.target.value));
    setPage(0);
  };

  const handleOpenDeleteDialog = (activity) => {
    setSelectedActivity(activity);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    if (deleteLoading) return;

    setDeleteDialogOpen(false);
    setSelectedActivity(null);
  };

  const handleDeleteActivity = async () => {
    if (!selectedActivity) return;

    try {
      setDeleteLoading(true);

      await activityApi.deleteActivity(selectedActivity.id);

      notificationService.addNotification({
        title: "Activity Deleted",
        message: `${formatActivityType(
          selectedActivity.type
        )} activity deleted successfully.`,
        type: "delete",
      });

      window.dispatchEvent(new Event("activityDeleted"));
      window.dispatchEvent(new Event("activityUpdated"));
      window.dispatchEvent(new Event("recommendationsUpdated"));

      setActivities((prev) =>
        prev.filter((activity) => activity.id !== selectedActivity.id)
      );

      toast.success("Activity deleted successfully");
      setDeleteDialogOpen(false);
      setSelectedActivity(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete activity");
    } finally {
      setDeleteLoading(false);
    }
  };

  const getExportRows = () => {
    return filteredActivities.map((activity) => [
      formatActivityType(activity.type),
      activity.duration || 0,
      activity.caloriesBurned || 0,
      activity.additionalMetrics?.distance || 0,
      formatDateTime(activity.startTime),
      formatDateTime(activity.endTime),
      activity.additionalMetrics?.notes || "-",
    ]);
  };

  const handleExportCSV = () => {
    if (!filteredActivities.length) {
      toast.warning("No activities available to export");
      return;
    }

    const headers = [
      "Type",
      "Duration (min)",
      "Calories",
      "Distance (km)",
      "Start Time",
      "End Time",
      "Notes",
    ];

    const csvContent = [
      headers.join(","),
      ...getExportRows().map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "fittrack_activities.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    notificationService.addNotification({
      title: "Activities Exported",
      message: "Your filtered activities CSV file was downloaded successfully.",
      type: "activity",
    });

    toast.success("Activities exported successfully");
  };

  const handleExportPDF = () => {
    if (!filteredActivities.length) {
      toast.warning("No activities available to export");
      return;
    }

    const userName = localStorage.getItem("userName") || "Fitness Member";
    const userEmail = localStorage.getItem("userEmail") || "";
    const generatedAt = new Date().toLocaleString();

    const doc = new jsPDF({
      orientation: "landscape",
      unit: "pt",
      format: "a4",
    });

    doc.setFontSize(22);
    doc.setTextColor(37, 99, 235);
    doc.text("FitTrack Activity Report", 40, 45);

    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.text(`Generated for: ${userName}`, 40, 68);

    if (userEmail) {
      doc.text(`Email: ${userEmail}`, 40, 84);
    }

    doc.text(`Generated at: ${generatedAt}`, 40, userEmail ? 100 : 84);

    doc.setFontSize(12);
    doc.setTextColor(20, 20, 20);
    doc.text("Summary", 40, 130);

    autoTable(doc, {
      startY: 145,
      head: [
        ["Total Activities", "Total Duration", "Total Calories", "Total Distance"],
      ],
      body: [
        [
          exportSummary.totalActivities,
          `${exportSummary.totalDuration} min`,
          `${exportSummary.totalCalories} kcal`,
          `${exportSummary.totalDistance.toFixed(1)} km`,
        ],
      ],
      theme: "grid",
      styles: {
        fontSize: 10,
        cellPadding: 8,
      },
      headStyles: {
        fillColor: [37, 99, 235],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
    });

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 25,
      head: [
        [
          "Type",
          "Duration",
          "Calories",
          "Distance",
          "Start Time",
          "End Time",
          "Notes",
        ],
      ],
      body: getExportRows().map((row) => [
        row[0],
        `${row[1]} min`,
        `${row[2]} kcal`,
        `${row[3]} km`,
        row[4],
        row[5],
        row[6],
      ]),
      theme: "striped",
      styles: {
        fontSize: 9,
        cellPadding: 6,
        overflow: "linebreak",
      },
      headStyles: {
        fillColor: [37, 99, 235],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      columnStyles: {
        0: { cellWidth: 90 },
        1: { cellWidth: 70 },
        2: { cellWidth: 70 },
        3: { cellWidth: 70 },
        4: { cellWidth: 120 },
        5: { cellWidth: 120 },
        6: { cellWidth: 220 },
      },
      didDrawPage: () => {
        const pageSize = doc.internal.pageSize;
        const pageHeight = pageSize.height || pageSize.getHeight();
        const pageWidth = pageSize.width || pageSize.getWidth();

        doc.setFontSize(9);
        doc.setTextColor(120, 120, 120);
        doc.text(
          `Page ${doc.internal.getNumberOfPages()}`,
          pageWidth - 70,
          pageHeight - 20
        );
      },
    });

    doc.save("FitTrack_Activities_Report.pdf");

    notificationService.addNotification({
      title: "PDF Report Exported",
      message: "Your activities PDF report was downloaded successfully.",
      type: "activity",
    });

    toast.success("PDF report exported successfully");
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <Box>
      <Box
        sx={{
          mb: 5,
          textAlign: "center",
        }}
      >
        <Typography variant="h3" fontWeight={900} color="text.primary">
          Activities
        </Typography>

        <Typography color="text.secondary" mt={1} fontSize={17}>
          Manage, export and track all your fitness activities.
        </Typography>
      </Box>

      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, md: 4 },
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 6,
          bgcolor: "background.paper",
          boxShadow: "0 18px 45px rgba(15, 23, 42, 0.06)",
        }}
      >
        <Stack
          direction={{ xs: "column", lg: "row" }}
          spacing={3}
          alignItems={{ xs: "stretch", lg: "center" }}
          justifyContent="space-between"
          mb={4}
        >
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            sx={{
              flex: 1,
              alignItems: "center",
            }}
          >
            <TextField
              fullWidth
              label="Search activities"
              placeholder="Search by type, notes, calories..."
              value={searchText}
              onChange={(event) => {
                setSearchText(event.target.value);
                setPage(0);
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                maxWidth: { md: 360 },
                "& .MuiOutlinedInput-root": {
                  borderRadius: 4,
                  height: 58,
                  bgcolor: "background.default",
                },
              }}
            />

            <TextField
              select
              fullWidth
              label="Filter by type"
              value={selectedType}
              onChange={(event) => {
                setSelectedType(event.target.value);
                setPage(0);
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FilterListIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                maxWidth: { md: 320 },
                "& .MuiOutlinedInput-root": {
                  borderRadius: 4,
                  height: 58,
                  bgcolor: "background.default",
                },
              }}
            >
              {activityTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type === "ALL" ? "All Activities" : formatActivityType(type)}
                </MenuItem>
              ))}
            </TextField>
          </Stack>

          <Divider
            flexItem
            orientation="vertical"
            sx={{
              display: { xs: "none", lg: "block" },
            }}
          />

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent={{ xs: "stretch", lg: "flex-end" }}
          >
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={handleExportCSV}
              sx={{
                height: 56,
                px: 3,
                borderRadius: 3,
                textTransform: "none",
                fontWeight: 800,
                minWidth: 150,
              }}
            >
              Export CSV
            </Button>

            <Button
              variant="outlined"
              color="error"
              startIcon={<PictureAsPdfIcon />}
              onClick={handleExportPDF}
              sx={{
                height: 56,
                px: 3,
                borderRadius: 3,
                textTransform: "none",
                fontWeight: 800,
                minWidth: 150,
              }}
            >
              Export PDF
            </Button>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate("/activities/add")}
              sx={{
                height: 56,
                px: 3.5,
                borderRadius: 3,
                textTransform: "none",
                fontWeight: 800,
                minWidth: 160,
                boxShadow: "0 12px 28px rgba(37, 99, 235, 0.28)",
              }}
            >
              Add Activity
            </Button>
          </Stack>
        </Stack>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, md: 3 },
            mb: 4,
            mt:2,
            borderRadius: 5,
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "background.default",
          }}
        >
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{
                  p: 2,
                  borderRadius: 4,
                  bgcolor: "background.paper",
                  height: "100%",
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Box
                  sx={{
                    width: 54,
                    height: 54,
                    borderRadius: "50%",
                    bgcolor: "primary.light",
                    color: "primary.main",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FitnessCenterIcon />
                </Box>

                <Box>
                  <Typography variant="h4" fontWeight={900} color="primary.main">
                    {exportSummary.totalActivities}
                  </Typography>

                  <Typography color="text.secondary" fontSize={14}>
                    Filtered Activities
                  </Typography>
                </Box>
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{
                  p: 2,
                  borderRadius: 4,
                  bgcolor: "background.paper",
                  height: "100%",
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Box
                  sx={{
                    width: 54,
                    height: 54,
                    borderRadius: "50%",
                    bgcolor: "success.light",
                    color: "success.main",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <TimerIcon />
                </Box>

                <Box>
                  <Typography variant="h4" fontWeight={900} color="success.main">
                    {exportSummary.totalDuration}
                    <Typography component="span" fontSize={14} ml={0.5}>
                      min
                    </Typography>
                  </Typography>

                  <Typography color="text.secondary" fontSize={14}>
                    Total Duration
                  </Typography>
                </Box>
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{
                  p: 2,
                  borderRadius: 4,
                  bgcolor: "background.paper",
                  height: "100%",
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Box
                  sx={{
                    width: 54,
                    height: 54,
                    borderRadius: "50%",
                    bgcolor: "warning.light",
                    color: "warning.main",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <LocalFireDepartmentIcon />
                </Box>

                <Box>
                  <Typography variant="h4" fontWeight={900} color="warning.main">
                    {exportSummary.totalCalories}
                    <Typography component="span" fontSize={14} ml={0.5}>
                      kcal
                    </Typography>
                  </Typography>

                  <Typography color="text.secondary" fontSize={14}>
                    Total Calories
                  </Typography>
                </Box>
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{
                  p: 2,
                  borderRadius: 4,
                  bgcolor: "background.paper",
                  height: "100%",
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Box
                  sx={{
                    width: 54,
                    height: 54,
                    borderRadius: "50%",
                    bgcolor: "secondary.light",
                    color: "secondary.main",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <RouteIcon />
                </Box>

                <Box>
                  <Typography variant="h4" fontWeight={900} color="secondary.main">
                    {exportSummary.totalDistance.toFixed(1)}
                    <Typography component="span" fontSize={14} ml={0.5}>
                      km
                    </Typography>
                  </Typography>

                  <Typography color="text.secondary" fontSize={14}>
                    Total Distance
                  </Typography>
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </Paper>

        {filteredActivities.length === 0 ? (
          <Box
            sx={{
              py: 8,
              minHeight: 320,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                bgcolor: "primary.main",
                color: "white",
                mb: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FitnessCenterIcon sx={{ fontSize: 42 }} />
            </Box>

            <Typography variant="h5" fontWeight={800} color="text.primary">
              No activities found
            </Typography>

            <Typography color="text.secondary" mt={1}>
              Add your first activity or change your filters.
            </Typography>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              sx={{
                mt: 3,
                borderRadius: 3,
                textTransform: "none",
                fontWeight: 700,
              }}
              onClick={() => navigate("/activities/add")}
            >
              Add Activity
            </Button>
          </Box>
        ) : (
          <>
            <TableContainer
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 4,
                overflow: "hidden",
              }}
            >
              <Table>
                <TableHead
                  sx={{
                    bgcolor: "background.default",
                  }}
                >
                  <TableRow>
                    <TableCell sx={{ fontWeight: 900 }}>Type</TableCell>
                    <TableCell sx={{ fontWeight: 900 }}>Duration</TableCell>
                    <TableCell sx={{ fontWeight: 900 }}>Calories</TableCell>
                    <TableCell sx={{ fontWeight: 900 }}>Distance</TableCell>
                    <TableCell sx={{ fontWeight: 900 }}>Start Time</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 900 }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {paginatedActivities.map((activity) => (
                    <TableRow
                      key={activity.id}
                      hover
                      sx={{
                        "&:last-child td": {
                          borderBottom: 0,
                        },
                      }}
                    >
                      <TableCell>
                        <Chip
                          label={formatActivityType(activity.type)}
                          color="primary"
                          variant="outlined"
                          sx={{ fontWeight: 800 }}
                        />
                      </TableCell>

                      <TableCell>{activity.duration || 0} min</TableCell>

                      <TableCell>
                        {activity.caloriesBurned || 0} kcal
                      </TableCell>

                      <TableCell>
                        {activity.additionalMetrics?.distance || 0} km
                      </TableCell>

                      <TableCell>
                        {formatDateTime(activity.startTime)}
                      </TableCell>

                      <TableCell align="right">
                        <Tooltip title="View">
                          <IconButton
                            color="primary"
                            onClick={() =>
                              navigate(`/activities/${activity.id}`)
                            }
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Edit">
                          <IconButton
                            color="secondary"
                            onClick={() =>
                              navigate(`/activities/edit/${activity.id}`)
                            }
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Delete">
                          <IconButton
                            color="error"
                            onClick={() => handleOpenDeleteDialog(activity)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              component="div"
              count={filteredActivities.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25]}
            />
          </>
        )}
      </Paper>

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Activity?"
        message={`Are you sure you want to delete ${
          formatActivityType(selectedActivity?.type) || "this activity"
        }? This action cannot be undone.`}
        confirmText="Delete"
        onConfirm={handleDeleteActivity}
        onClose={handleCloseDeleteDialog}
        loading={deleteLoading}
      />
    </Box>
  );
}

export default Activities;