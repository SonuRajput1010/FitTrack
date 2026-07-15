import { Box, Button, Divider, Paper, Stack, Typography } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";

import keycloak from "../api/keycloak";

function Login() {
  const handleLogin = () => {
    keycloak.login({
      redirectUri: `${window.location.origin}/dashboard`,
    });
  };

  const handleSignup = () => {
    keycloak.register({
      redirectUri: `${window.location.origin}/dashboard`,
    });
  };

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
          maxWidth: 480,
          p: 4,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 5,
          bgcolor: "background.paper",
        }}
      >
        <Stack spacing={3}>
          <Box textAlign="center">
            <Box
              sx={{
                width: 70,
                height: 70,
                borderRadius: "50%",
                bgcolor: "primary.main",
                color: "white",
                mx: "auto",
                mb: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FitnessCenterIcon sx={{ fontSize: 38 }} />
            </Box>

            <Typography variant="h4" fontWeight={800} color="primary">
              FitTrack
            </Typography>

            <Typography variant="h5" fontWeight={700} mt={1}>
              Welcome Back
            </Typography>

            <Typography color="text.secondary" mt={1}>
              Login or create an account to continue your fitness journey.
            </Typography>
          </Box>

          <Button
            fullWidth
            variant="contained"
            size="large"
            startIcon={<LoginIcon />}
            onClick={handleLogin}
            sx={{
              py: 1.4,
              borderRadius: 3,
              textTransform: "none",
              fontWeight: 700,
            }}
          >
            Login with Keycloak
          </Button>

          <Divider>or</Divider>

          <Button
            fullWidth
            variant="outlined"
            size="large"
            startIcon={<PersonAddIcon />}
            onClick={handleSignup}
            sx={{
              py: 1.4,
              borderRadius: 3,
              textTransform: "none",
              fontWeight: 700,
            }}
          >
            Create New Account
          </Button>

          <Typography textAlign="center" color="text.secondary" fontSize={14}>
            Secure authentication powered by Keycloak
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
}

export default Login;