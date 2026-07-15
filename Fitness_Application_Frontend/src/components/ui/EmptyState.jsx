import { Box, Button, Typography } from "@mui/material";

function EmptyState({ title, message, actionText, onAction, icon }) {
  return (
    <Box
      sx={{
        py: 7,
        px: 3,
        textAlign: "center",
        border: "1px dashed",
        borderColor: "divider",
        borderRadius: 4,
        bgcolor: "background.default",
      }}
    >
      {icon && <Box sx={{ mb: 2 }}>{icon}</Box>}

      <Typography variant="h6" color="text.primary">
        {title}
      </Typography>

      <Typography color="text.secondary" mt={1}>
        {message}
      </Typography>

      {actionText && (
        <Button variant="contained" sx={{ mt: 3 }} onClick={onAction}>
          {actionText}
        </Button>
      )}
    </Box>
  );
}

export default EmptyState;