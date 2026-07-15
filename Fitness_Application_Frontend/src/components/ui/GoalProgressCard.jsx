import { Box, LinearProgress, Paper, Stack, Typography } from "@mui/material";

import FlagIcon from "@mui/icons-material/Flag";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

function GoalProgressCard({ progress = 0, completed = 0, goal = 300 }) {
  const safeProgress = Math.min(Math.max(progress, 0), 100);

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
          <FlagIcon />
        </Box>

        <Box>
          <Typography variant="h6" fontWeight={800}>
            Weekly Goal
          </Typography>

          <Typography fontSize={13} color="text.secondary">
            Workout minutes progress
          </Typography>
        </Box>
      </Stack>

      <Typography variant="h4" fontWeight={900} color="text.primary">
        {safeProgress}%
      </Typography>

      <Typography color="text.secondary" mt={0.5}>
        {completed}/{goal} minutes completed
      </Typography>

      <LinearProgress
        variant="determinate"
        value={safeProgress}
        sx={{
          mt: 2.5,
          height: 10,
          borderRadius: 10,
        }}
      />

      <Stack direction="row" spacing={1} alignItems="center" mt={2}>
        <CheckCircleIcon color={safeProgress >= 100 ? "success" : "primary"} />

        <Typography fontSize={14} color="text.secondary">
          {safeProgress >= 100
            ? "Goal completed. Excellent work!"
            : "Keep going, you are getting closer."}
        </Typography>
      </Stack>
    </Paper>
  );
}

export default GoalProgressCard;