import { Paper } from "@mui/material";

function SectionCard({ children, sx = {} }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 4,
        bgcolor: "background.paper",
        ...sx,
      }}
    >
      {children}
    </Paper>
  );
}

export default SectionCard;