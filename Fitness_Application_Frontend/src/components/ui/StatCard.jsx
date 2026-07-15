import { Box, Paper, Stack, Typography } from "@mui/material";

function StatCard({ title, value, subtitle, icon, compact = false }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: compact ? 2.8 : 3,
        height: "100%",
        minHeight: compact ? 155 : 160,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 4,
        bgcolor: "background.paper",
        transition: "all 0.25s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 16px 40px rgba(15,23,42,0.08)",
        },
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        spacing={2}
        alignItems="flex-start"
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            fontSize={14}
            color="text.secondary"
            fontWeight={600}
            sx={{
              lineHeight: 1.35,
              whiteSpace: "normal",
              wordBreak: "break-word",
            }}
          >
            {title}
          </Typography>

          <Typography
            variant={compact ? "h5" : "h4"}
            fontWeight={800}
            color="text.primary"
            mt={1}
            sx={{
              lineHeight: 1.2,
              whiteSpace: "normal",
              wordBreak: "break-word",
            }}
          >
            {value}
          </Typography>

          <Typography
            fontSize={13}
            color="text.secondary"
            mt={1}
            sx={{
              lineHeight: 1.35,
              whiteSpace: "normal",
              wordBreak: "break-word",
            }}
          >
            {subtitle}
          </Typography>
        </Box>

        <Box
          sx={{
            width: compact ? 48 : 52,
            height: compact ? 48 : 52,
            borderRadius: 3,
            bgcolor: "primary.main",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            boxShadow: "0 8px 18px rgba(37,99,235,.25)",
          }}
        >
          {icon}
        </Box>
      </Stack>
    </Paper>
  );
}

export default StatCard;