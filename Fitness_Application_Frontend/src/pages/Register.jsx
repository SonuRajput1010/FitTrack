import { Box, Button, Divider, Paper, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";

import PersonAddIcon from "@mui/icons-material/PersonAdd";
import LoginIcon from "@mui/icons-material/Login";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";

import keycloak from "../api/keycloak";

function Register() {
  const handleRegister = () => {
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
              Create Account
            </Typography>

            <Typography color="text.secondary" mt={1}>
              Sign up securely with Keycloak. Your profile will be synced with
              FitTrack after login.
            </Typography>
          </Box>

          <Button
            fullWidth
            variant="contained"
            size="large"
            startIcon={<PersonAddIcon />}
            onClick={handleRegister}
            sx={{
              py: 1.4,
              borderRadius: 3,
              textTransform: "none",
              fontWeight: 700,
            }}
          >
            Register with Keycloak
          </Button>

          <Divider>or</Divider>

          <Button
            fullWidth
            variant="outlined"
            size="large"
            startIcon={<LoginIcon />}
            component={Link}
            to="/login"
            sx={{
              py: 1.4,
              borderRadius: 3,
              textTransform: "none",
              fontWeight: 700,
            }}
          >
            Back to Login
          </Button>

          <Typography textAlign="center" color="text.secondary" fontSize={14}>
            After registration, login once to automatically sync your profile.
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
}

export default Register;