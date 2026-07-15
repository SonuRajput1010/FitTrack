import { Box, Typography } from "@mui/material";

function PageHeader({ title, subtitle, action }) {
  return (
    <Box
      sx={{
        mb: 4,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 2,
      }}
    >
      <Box>
        <Typography variant="h3" fontWeight={800} color="text.primary">
          {title}
        </Typography>

        {subtitle && (
          <Typography color="text.secondary" mt={0.5}>
            {subtitle}
          </Typography>
        )}
      </Box>

      {action}
    </Box>
  );
}

export default PageHeader;