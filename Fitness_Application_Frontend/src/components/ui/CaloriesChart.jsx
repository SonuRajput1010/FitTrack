import { Box, Paper, Stack, Typography } from "@mui/material";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function CaloriesChart({ activities = [] }) {
  const data = weekDays.map((day) => ({
    day,
    calories: 0,
  }));

  activities.forEach((activity) => {
    const value = activity.startTime || activity.createdAt;
    if (!value) return;

    const date = new Date(value);
    const dayIndex = date.getDay();

    data[dayIndex].calories += Number(activity.caloriesBurned || 0);
  });

  const hasData = data.some((item) => item.calories > 0);

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
            This Week Calories
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
          <Typography>No calorie data for this week</Typography>
        </Box>
      ) : (
        <ResponsiveContainer width="100%" height="82%">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip formatter={(value) => [`${value} kcal`, "Calories"]} />
            <Area
              type="monotone"
              dataKey="calories"
              stroke="#2563eb"
              fill="#bfdbfe"
              strokeWidth={3}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </Paper>
  );
}

export default CaloriesChart;