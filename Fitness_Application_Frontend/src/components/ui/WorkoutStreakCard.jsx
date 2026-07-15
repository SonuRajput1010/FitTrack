import { Box, Paper, Stack, Typography } from "@mui/material";

import WhatshotIcon from "@mui/icons-material/Whatshot";
import TodayIcon from "@mui/icons-material/Today";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

function WorkoutStreakCard({ streak = 0, todayCount = 0, mostActiveDay = "No data" }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        height: "100%",
        minHeight: 210,
        borderRadius: 4,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center" mb={2}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 3,
            bgcolor: "primary.main",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <WhatshotIcon />
        </Box>

        <Box>
          <Typography variant="h6" fontWeight={800}>
            Workout Streak
          </Typography>

          <Typography fontSize={13} color="text.secondary">
            Consistency tracker
          </Typography>
        </Box>
      </Stack>

      <Typography variant="h4" fontWeight={900}>
        {streak} day{streak === 1 ? "" : "s"}
      </Typography>

      <Typography color="text.secondary" mt={0.5}>
        Current workout streak
      </Typography>

      <Stack spacing={1.2} mt={2.5}>
        <Stack direction="row" spacing={1.2} alignItems="center">
          <TodayIcon color="primary" fontSize="small" />
          <Typography fontSize={14}>Today's activities: {todayCount}</Typography>
        </Stack>

        <Stack direction="row" spacing={1.2} alignItems="center">
          <CalendarMonthIcon color="primary" fontSize="small" />
          <Typography fontSize={14}>Most active day: {mostActiveDay}</Typography>
        </Stack>
      </Stack>
    </Paper>
  );
}

export default WorkoutStreakCard;