import { createTheme } from "@mui/material/styles";

export const getAppTheme = (mode = "light") =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: "#2563eb",
      },
      secondary: {
        main: "#16a34a",
      },
      background: {
        default: mode === "light" ? "#f5f7fb" : "#0f172a",
        paper: mode === "light" ? "#ffffff" : "#111827",
      },
      text: {
        primary: mode === "light" ? "#1f2937" : "#f8fafc",
        secondary: mode === "light" ? "#64748b" : "#cbd5e1",
      },
    },
    typography: {
      fontFamily: "Inter, Arial, sans-serif",
      h4: {
        fontWeight: 700,
      },
      h5: {
        fontWeight: 700,
      },
      h6: {
        fontWeight: 600,
      },
    },
    shape: {
      borderRadius: 12,
    },
  });