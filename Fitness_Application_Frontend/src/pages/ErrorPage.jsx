import { Box, Button, Paper, Typography } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import HomeIcon from "@mui/icons-material/Home";
import { useNavigate } from "react-router-dom";

function ErrorPage() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "70vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          maxWidth: 560,
          width: "100%",
          p: 5,
          textAlign: "center",
          borderRadius: 5,
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
        }}
      >
        <Typography variant="h3" fontWeight={900} color="error.main">
          Something went wrong
        </Typography>

        <Typography color="text.secondary" mt={2} mb={4}>
          Please refresh the page or return to the dashboard.
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={() => window.location.reload()}
            sx={{
              borderRadius: 3,
              textTransform: "none",
              fontWeight: 700,
              px: 3,
            }}
          >
            Refresh
          </Button>

          <Button
            variant="outlined"
            startIcon={<HomeIcon />}
            onClick={() => navigate("/dashboard")}
            sx={{
              borderRadius: 3,
              textTransform: "none",
              fontWeight: 700,
              px: 3,
            }}
          >
            Dashboard
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default ErrorPage;