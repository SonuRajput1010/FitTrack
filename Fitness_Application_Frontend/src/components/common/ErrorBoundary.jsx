import { Component } from "react";
import { Box, Button, Paper, Typography } from "@mui/material";

import HomeIcon from "@mui/icons-material/Home";
import RefreshIcon from "@mui/icons-material/Refresh";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Application Error:", error);
    console.error("Error Info:", errorInfo);
  }

  handleRefresh = () => {
    window.location.reload();
  };

  handleDashboard = () => {
    window.location.href = "/dashboard";
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "background.default",
            p: 2,
          }}
        >
          <Paper
            elevation={0}
            sx={{
              width: "100%",
              maxWidth: 560,
              p: 5,
              borderRadius: 5,
              border: "1px solid",
              borderColor: "divider",
              textAlign: "center",
              bgcolor: "background.paper",
            }}
          >
            <Typography variant="h3" fontWeight={900} color="error.main">
              Something went wrong
            </Typography>

            <Typography color="text.secondary" mt={2} mb={4}>
              The app ran into an unexpected error. Please refresh the page or
              go back to dashboard.
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
                onClick={this.handleRefresh}
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
                onClick={this.handleDashboard}
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

    return this.props.children;
  }
}

export default ErrorBoundary;