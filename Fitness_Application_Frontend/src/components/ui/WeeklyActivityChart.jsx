import { Box, Paper, Stack, Typography } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function WeeklyActivityChart({ activities = [] }) {
  const data = weekDays.map((day) => ({
    day,
    duration: 0,
    activities: 0,
  }));

  activities.forEach((activity) => {
    const value = activity.startTime || activity.createdAt;
    if (!value) return;

    const date = new Date(value);
    const dayIndex = date.getDay();

    data[dayIndex].duration += Number(activity.duration || 0);
    data[dayIndex].activities += 1;
  });

  const hasData = data.some((item) => item.duration > 0);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        height: 360,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 4,
        bgcolor: "background.paper",
      }}
    >
      <Stack direction="row" justifyContent="space-between" mb={2}>
        <Box>
          <Typography variant="h6" fontWeight={800} color="text.primary">
            This Week Activity
          </Typography>

          <Typography fontSize={13} color="text.secondary">
            Auto resets when a new week starts
          </Typography>
        </Box>
      </Stack>

      {!hasData ? (
        <Box
          sx={{
            height: "82%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "text.secondary",
            textAlign: "center",
          }}
        >
          <Typography>No activity data for this week</Typography>
        </Box>
      ) : (
        <ResponsiveContainer width="100%" height="82%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip
              formatter={(value, name) =>
                name === "duration" ? [`${value} min`, "Duration"] : value
              }
            />
            <Bar dataKey="duration" fill="#2563eb" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Paper>
  );
}

export default WeeklyActivityChart;