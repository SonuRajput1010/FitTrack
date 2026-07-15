import { Box, Paper, Stack, Typography } from "@mui/material";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = [
  "#2563eb",
  "#16a34a",
  "#f97316",
  "#9333ea",
  "#ec4899",
  "#14b8a6",
  "#eab308",
  "#ef4444",
  "#6366f1",
  "#8b5cf6",
];

function ActivityPieChart({ activities = [] }) {
  const activityMap = activities.reduce((acc, activity) => {
    const type = activity.type || "OTHER";
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  const data = Object.entries(activityMap)
    .map(([name, value]) => ({
      name: name
        .replaceAll("_", " ")
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase()),
      value,
    }))
    .sort((a, b) => b.value - a.value);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        height: 420,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 4,
        bgcolor: "background.paper",
        overflow: "hidden",
      }}
    >
      <Typography variant="h6" fontWeight={800} color="text.primary">
        Activity Distribution
      </Typography>

      <Typography fontSize={13} color="text.secondary" mb={2}>
        Breakdown by activity type
      </Typography>

      {data.length === 0 ? (
        <Box
          sx={{
            height: 300,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "text.secondary",
          }}
        >
          No activity data available
        </Box>
      ) : (
        <Box
          sx={{
            height: 300,
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.2fr) minmax(120px, 0.8fr)",
            alignItems: "center",
            columnGap: 2,
          }}
        >
          <Box sx={{ width: "100%", height: 290, minWidth: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 6, right: 6, bottom: 6, left: 6 }}>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius="78%"
                  innerRadius="48%"
                  paddingAngle={3}
                  isAnimationActive
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Box>

          <Box
            sx={{
              height: 290,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <Stack
              spacing={1.8}
              sx={{
                width: "100%",
                maxHeight: 250,
                overflowY: "auto",
                pr: 0.5,
              }}
            >
              {data.map((item, index) => (
                <Stack
                  key={item.name}
                  direction="row"
                  spacing={1.4}
                  alignItems="center"
                  sx={{ minWidth: 0 }}
                >
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      bgcolor: COLORS[index % COLORS.length],
                      flexShrink: 0,
                    }}
                  />

                  <Typography
                    fontWeight={700}
                    fontSize={14}
                    color="text.primary"
                    noWrap
                    title={item.name}
                  >
                    {item.name}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Box>
        </Box>
      )}
    </Paper>
  );
}

export default ActivityPieChart;