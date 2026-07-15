import { Box, Paper, Stack, Typography } from "@mui/material";

import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import TimerIcon from "@mui/icons-material/Timer";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

function MonthlySummaryCard({
  activities = 0,
  calories = 0,
  duration = 0,
  bestWorkout,
}) {
  const formatActivityType = (value) => {
    if (!value) return "No data";

    return value
      .toString()
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

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
          <CalendarMonthIcon />
        </Box>

        <Box>
          <Typography variant="h6" fontWeight={800}>
            Monthly Summary
          </Typography>

          <Typography fontSize={13} color="text.secondary">
            This month's performance
          </Typography>
        </Box>
      </Stack>

      <Typography variant="h4" fontWeight={900}>
        {activities}
      </Typography>

      <Typography color="text.secondary" mt={0.5}>
        Activities this month
      </Typography>

      <Stack spacing={1.2} mt={2.5}>
        <Stack direction="row" spacing={1.2} alignItems="center">
          <LocalFireDepartmentIcon color="primary" fontSize="small" />
          <Typography fontSize={14}>{calories} kcal burned</Typography>
        </Stack>

        <Stack direction="row" spacing={1.2} alignItems="center">
          <TimerIcon color="primary" fontSize="small" />
          <Typography fontSize={14}>{duration} min workout time</Typography>
        </Stack>

        <Stack direction="row" spacing={1.2} alignItems="center">
          <EmojiEventsIcon color="primary" fontSize="small" />
          <Typography fontSize={14}>
            Best: {formatActivityType(bestWorkout?.type)}
          </Typography>
        </Stack>
      </Stack>
    </Paper>
  );
}

export default MonthlySummaryCard;