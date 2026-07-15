import {
  Box,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

function RecentActivitiesTable({ activities = [] }) {
  const recentActivities = [...activities]
    .sort((a, b) => {
      const dateA = new Date(a.startTime || a.createdAt || 0);
      const dateB = new Date(b.startTime || b.createdAt || 0);
      return dateB - dateA;
    })
    .slice(0, 5);

  const formatDate = (value) => {
    if (!value) return "-";

    try {
      return new Date(value).toLocaleDateString();
    } catch {
      return value;
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 4,
        bgcolor: "background.paper",
        height: "100%",
      }}
    >
      <Typography variant="h6" mb={2} color="text.primary">
        Recent Activities
      </Typography>

      {recentActivities.length === 0 ? (
        <Box
          sx={{
            minHeight: 240,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "text.secondary",
            textAlign: "center",
          }}
        >
          <Typography>No recent activities found</Typography>
        </Box>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Activity</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Calories</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {recentActivities.map((activity) => (
                <TableRow key={activity.id} hover>
                  <TableCell>
                    <Chip
                      label={activity.type?.replaceAll("_", " ") || "UNKNOWN"}
                      color="primary"
                      variant="outlined"
                    />
                  </TableCell>

                  <TableCell>{activity.duration || 0} min</TableCell>
                  <TableCell>{activity.caloriesBurned || 0} kcal</TableCell>
                  <TableCell>
                    {formatDate(activity.startTime || activity.createdAt)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
}

export default RecentActivitiesTable;