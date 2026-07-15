import { useEffect, useMemo, useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { toast } from "react-toastify";

import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import MonitorWeightIcon from "@mui/icons-material/MonitorWeight";
import TimerIcon from "@mui/icons-material/Timer";
import RouteIcon from "@mui/icons-material/Route";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import FavoriteIcon from "@mui/icons-material/Favorite";

import WeeklyActivityChart from "../components/ui/WeeklyActivityChart";
import CaloriesChart from "../components/ui/CaloriesChart";
import ActivityPieChart from "../components/ui/ActivityPieChart";
import RecentActivitiesTable from "../components/ui/RecentActivitiesTable";
import StatCard from "../components/ui/StatCard";
import LoadingSkeleton from "../components/ui/LoadingSkeleton";
import GoalProgressCard from "../components/ui/GoalProgressCard";
import WorkoutStreakCard from "../components/ui/WorkoutStreakCard";
import MonthlySummaryCard from "../components/ui/MonthlySummaryCard";

import { activityApi } from "../api/activityApi";
import { userApi } from "../api/userApi";

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState([]);
  const [profile, setProfile] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const userId = localStorage.getItem("userId");

      const activityData = await activityApi.getUserActivities();
      setActivities(Array.isArray(activityData) ? activityData : []);

      if (userId) {
        const profileData = await userApi.getUserById(userId);
        setProfile(profileData);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    const refreshDashboard = () => {
      fetchDashboardData();
    };

    window.addEventListener("activityCreated", refreshDashboard);
    window.addEventListener("activityUpdated", refreshDashboard);
    window.addEventListener("activityDeleted", refreshDashboard);
    window.addEventListener("profileUpdated", refreshDashboard);

    return () => {
      window.removeEventListener("activityCreated", refreshDashboard);
      window.removeEventListener("activityUpdated", refreshDashboard);
      window.removeEventListener("activityDeleted", refreshDashboard);
      window.removeEventListener("profileUpdated", refreshDashboard);
    };
  }, []);

  const formatActivityType = (value) => {
    if (!value || value === "No data") return value;

    return value
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const getActivityDate = (activity) => {
    const value = activity.startTime || activity.createdAt;
    return value ? new Date(value) : null;
  };

  const isSameDay = (dateA, dateB) => {
    return (
      dateA.getFullYear() === dateB.getFullYear() &&
      dateA.getMonth() === dateB.getMonth() &&
      dateA.getDate() === dateB.getDate()
    );
  };

  const isCurrentWeek = (value) => {
    if (!value) return false;

    const date = new Date(value);
    const today = new Date();

    const startOfWeek = new Date(today);
    startOfWeek.setHours(0, 0, 0, 0);
    startOfWeek.setDate(today.getDate() - today.getDay());

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    return date >= startOfWeek && date <= endOfWeek;
  };

  const isCurrentMonth = (value) => {
    if (!value) return false;

    const date = new Date(value);
    const today = new Date();

    return (
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isCurrentYear = (value) => {
    if (!value) return false;

    const date = new Date(value);
    const today = new Date();

    return date.getFullYear() === today.getFullYear();
  };

  const sumActivities = (list) => {
    return list.reduce(
      (acc, activity) => {
        acc.activities += 1;
        acc.duration += Number(activity.duration || 0);
        acc.calories += Number(activity.caloriesBurned || 0);
        acc.distance += Number(activity.additionalMetrics?.distance || 0);
        return acc;
      },
      {
        activities: 0,
        duration: 0,
        calories: 0,
        distance: 0,
      }
    );
  };

  const analytics = useMemo(() => {
    const today = new Date();

    const todayActivities = activities.filter((activity) => {
      const date = getActivityDate(activity);
      return date && isSameDay(date, today);
    });

    const weeklyActivities = activities.filter((activity) =>
      isCurrentWeek(activity.startTime || activity.createdAt)
    );

    const monthlyActivities = activities.filter((activity) =>
      isCurrentMonth(activity.startTime || activity.createdAt)
    );

    const yearlyActivities = activities.filter((activity) =>
      isCurrentYear(activity.startTime || activity.createdAt)
    );

    const lifetime = sumActivities(activities);
    const todayStats = sumActivities(todayActivities);
    const weekStats = sumActivities(weeklyActivities);
    const monthStats = sumActivities(monthlyActivities);
    const yearStats = sumActivities(yearlyActivities);

    const averageCalories = lifetime.activities
      ? Math.round(lifetime.calories / lifetime.activities)
      : 0;

    const averageDuration = lifetime.activities
      ? Math.round(lifetime.duration / lifetime.activities)
      : 0;

    const longestWorkout = activities.reduce((max, activity) => {
      const duration = Number(activity.duration || 0);
      return duration > max ? duration : max;
    }, 0);

    const monthlyBestWorkout = [...monthlyActivities].sort(
      (a, b) => Number(b.caloriesBurned || 0) - Number(a.caloriesBurned || 0)
    )[0];

    const activityCountMap = activities.reduce((acc, activity) => {
      const type = activity.type || "OTHER";
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    const favoriteActivity =
      Object.entries(activityCountMap).sort((a, b) => b[1] - a[1])[0]?.[0] ||
      "No data";

    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const dayCountMap = weeklyActivities.reduce((acc, activity) => {
      const date = getActivityDate(activity);
      if (!date) return acc;

      const day = weekDays[date.getDay()];
      acc[day] = (acc[day] || 0) + 1;

      return acc;
    }, {});

    const mostActiveDay =
      Object.entries(dayCountMap).sort((a, b) => b[1] - a[1])[0]?.[0] ||
      "No data";

    const uniqueActivityDates = [
      ...new Set(
        activities
          .map(getActivityDate)
          .filter(Boolean)
          .map((date) => date.toISOString().slice(0, 10))
      ),
    ];

    let streak = 0;
    const cursor = new Date();

    while (true) {
      const dateKey = cursor.toISOString().slice(0, 10);

      if (uniqueActivityDates.includes(dateKey)) {
        streak += 1;
        cursor.setDate(cursor.getDate() - 1);
      } else {
        break;
      }
    }

    const weeklyGoalMinutes = Number(
      profile?.weeklyWorkoutGoalMinutes || 300
    );

    const monthlyCaloriesGoal = Number(profile?.monthlyCaloriesGoal || 8000);

    const weeklyProgress = Math.min(
      Math.round((weekStats.duration / weeklyGoalMinutes) * 100),
      100
    );

    const monthlyCaloriesProgress = Math.min(
      Math.round((monthStats.calories / monthlyCaloriesGoal) * 100),
      100
    );

    return {
      todayActivities,
      weeklyActivities,
      monthlyActivities,
      yearlyActivities,

      todayStats,
      weekStats,
      monthStats,
      yearStats,
      lifetime,

      averageCalories,
      averageDuration,
      longestWorkout,
      favoriteActivity,
      weeklyGoalMinutes,
      weeklyProgress,
      monthlyCaloriesGoal,
      monthlyCaloriesProgress,
      mostActiveDay,
      monthlyBestWorkout,
      streak,
    };
  }, [activities, profile]);

  const bmi = useMemo(() => {
    const weight = Number(profile?.weight || 0);
    const heightCm = Number(profile?.height || 0);

    if (!weight || !heightCm) return null;

    const heightMeter = heightCm / 100;
    return (weight / (heightMeter * heightMeter)).toFixed(1);
  }, [profile]);

  const bmiStatus = useMemo(() => {
    if (!bmi) return "Add height & weight";

    const value = Number(bmi);

    if (value < 18.5) return "Underweight";
    if (value < 25) return "Healthy Weight";
    if (value < 30) return "Overweight";

    return "Obese Range";
  }, [bmi]);

  const primaryStats = [
    {
      title: "Today",
      value: analytics.todayStats.activities,
      icon: <FitnessCenterIcon />,
      subtitle: `${analytics.todayStats.duration} min today`,
    },
    {
      title: "This Week",
      value: analytics.weekStats.activities,
      icon: <TrendingUpIcon />,
      subtitle: `${analytics.weekStats.duration}/${analytics.weeklyGoalMinutes} min goal`,
    },
    {
      title: "This Month",
      value: `${analytics.monthlyCaloriesProgress}%`,
      icon: <LocalFireDepartmentIcon />,
      subtitle: `${analytics.monthStats.calories}/${analytics.monthlyCaloriesGoal} kcal goal`,
    },
    {
      title: "BMI",
      value: bmi || "--",
      icon: <MonitorWeightIcon />,
      subtitle: bmiStatus,
    },
  ];

  const topInsightStats = [
    {
      title: "This Year",
      value: analytics.yearStats.activities,
      icon: <FitnessCenterIcon />,
      subtitle: `${analytics.yearStats.duration} min this year`,
    },
    {
      title: "Lifetime Activities",
      value: analytics.lifetime.activities,
      icon: <EmojiEventsIcon />,
      subtitle: "All-time activities logged",
    },
    {
      title: "Lifetime Calories",
      value: `${analytics.lifetime.calories} kcal`,
      icon: <LocalFireDepartmentIcon />,
      subtitle: "All-time calories burned",
    },
  ];

  const bottomInsightStats = [
    {
      title: "Average Duration",
      value: `${analytics.averageDuration} min`,
      icon: <TimerIcon />,
      subtitle: "Average workout session",
    },
    {
      title: "Total Distance",
      value: `${analytics.lifetime.distance.toFixed(1)} km`,
      icon: <RouteIcon />,
      subtitle: "All-time distance covered",
    },
    {
      title: "Favorite Activity",
      value: formatActivityType(analytics.favoriteActivity),
      icon: <FavoriteIcon />,
      subtitle: "Most frequent activity type",
    },
  ];

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <Box>
      <Box sx={{ textAlign: "center", mb: 5 }}>
        <Typography variant="h4" fontWeight={800} color="text.primary">
          Dashboard
        </Typography>

        <Typography color="text.secondary" mt={1} fontSize={16}>
          Track today, weekly, monthly, yearly and lifetime fitness progress.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <WeeklyActivityChart activities={analytics.weeklyActivities} />
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <ActivityPieChart activities={analytics.weeklyActivities} />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 3 }}>
        {primaryStats.map((item) => (
          <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={item.title}>
            <StatCard {...item} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mt: 3 }}>
        {topInsightStats.map((item) => (
          <Grid size={{ xs: 12, md: 4 }} key={item.title}>
            <StatCard {...item} compact />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mt: 3 }}>
        {bottomInsightStats.map((item) => (
          <Grid size={{ xs: 12, md: 4 }} key={item.title}>
            <StatCard {...item} compact />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <GoalProgressCard
            progress={analytics.weeklyProgress}
            completed={analytics.weekStats.duration}
            goal={analytics.weeklyGoalMinutes}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <WorkoutStreakCard
            streak={analytics.streak}
            todayCount={analytics.todayActivities.length}
            mostActiveDay={analytics.mostActiveDay}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <MonthlySummaryCard
            activities={analytics.monthStats.activities}
            calories={analytics.monthStats.calories}
            duration={analytics.monthStats.duration}
            bestWorkout={analytics.monthlyBestWorkout}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid size={{ xs: 12, lg: 6 }}>
          <CaloriesChart activities={analytics.weeklyActivities} />
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <RecentActivitiesTable activities={activities} />
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;