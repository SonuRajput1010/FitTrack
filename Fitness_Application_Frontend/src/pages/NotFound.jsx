import { Box, Button, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import HomeIcon from "@mui/icons-material/Home";
import RefreshIcon from "@mui/icons-material/Refresh";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

function NotFound() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
      }}
    >
      <Stack spacing={3} alignItems="center">
        <WarningAmberIcon
          sx={{
            fontSize: 100,
            color: "warning.main",
          }}
        />

        <Typography variant="h1" fontWeight={900}>
          404
        </Typography>

        <Typography variant="h4" fontWeight={700}>
          Page Not Found
        </Typography>

        <Typography
          color="text.secondary"
          textAlign="center"
          maxWidth={500}
        >
          The page you are looking for doesn't exist or has been moved.
        </Typography>

        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            startIcon={<HomeIcon />}
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </Button>

          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => window.location.reload()}
          >
            Refresh
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}

export default NotFound;