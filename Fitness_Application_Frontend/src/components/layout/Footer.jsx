import { Box, IconButton, Stack, Typography } from "@mui/material";

import EmailIcon from "@mui/icons-material/Email";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import GitHubIcon from "@mui/icons-material/GitHub";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";

function Footer() {
  return (
    <Box
      sx={{
        py: 2.5,
        px: 4,
        borderTop: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
      }}
    >
      <Box
        sx={{
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Center */}
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          justifyContent="center"
        >
          <FitnessCenterIcon color="primary" />

          <Typography
            variant="h5"
            fontWeight={700}
            color="primary"
          >
            FitTrack
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            © 2026 FitTrack. All rights reserved.
          </Typography>
        </Stack>

        {/* Right Icons */}
        <Stack
          direction="row"
          spacing={1}
          sx={{
            position: "absolute",
            right: 0,
            top: "50%",
            transform: "translateY(-50%)",
          }}
        >
          <IconButton
            href="mailto:sonusinghrajput9189@gmail.com"
            sx={{
              color: "#EA4335",
              "&:hover": {
                transform: "translateY(-3px)",
              },
            }}
          >
            <EmailIcon />
          </IconButton>

          <IconButton
            href="https://linkedin.com"
            target="_blank"
            sx={{
              color: "#0A66C2",
              "&:hover": {
                transform: "translateY(-3px)",
              },
            }}
          >
            <LinkedInIcon />
          </IconButton>

          <IconButton
            href="https://instagram.com"
            target="_blank"
            sx={{
              color: "#E4405F",
              "&:hover": {
                transform: "translateY(-3px)",
              },
            }}
          >
            <InstagramIcon />
          </IconButton>

          <IconButton
            href="https://github.com"
            target="_blank"
            sx={{
              color: "#8B5CF6",
              "&:hover": {
                transform: "translateY(-3px)",
              },
            }}
          >
            <GitHubIcon />
          </IconButton>
        </Stack>
      </Box>
    </Box>
  );
}

export default Footer;