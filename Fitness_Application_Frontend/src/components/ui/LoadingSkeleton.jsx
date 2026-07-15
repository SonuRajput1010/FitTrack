import { Grid, Skeleton, Stack } from "@mui/material";
import SectionCard from "./SectionCard";

function LoadingSkeleton() {
  return (
    <Stack spacing={3}>
      <Skeleton variant="text" width={260} height={50} />
      <Skeleton variant="text" width={420} height={28} />

      <Grid container spacing={3}>
        {[1, 2, 3, 4].map((item) => (
          <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={item}>
            <SectionCard>
              <Skeleton variant="text" height={30} />
              <Skeleton variant="text" width="60%" height={48} />
              <Skeleton variant="text" width="80%" />
            </SectionCard>
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
}

export default LoadingSkeleton;