export const calculateCurrentStreak = (activities = []) => {
  if (!activities.length) return 0;

  const uniqueDates = [
    ...new Set(
      activities.map((activity) =>
        new Date(activity.startTime).toISOString().split("T")[0]
      )
    ),
  ].sort((a, b) => new Date(b) - new Date(a));

  let streak = 0;
  let currentDate = new Date();

  while (true) {
    const dateString = currentDate.toISOString().split("T")[0];

    if (uniqueDates.includes(dateString)) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
};

export const calculateBestStreak = (activities = []) => {
  if (!activities.length) return 0;

  const uniqueDates = [
    ...new Set(
      activities.map((activity) =>
        new Date(activity.startTime).toISOString().split("T")[0]
      )
    ),
  ].sort((a, b) => new Date(a) - new Date(b));

  let best = 1;
  let current = 1;

  for (let i = 1; i < uniqueDates.length; i++) {
    const prev = new Date(uniqueDates[i - 1]);
    const curr = new Date(uniqueDates[i]);

    const diff =
      (curr.getTime() - prev.getTime()) /
      (1000 * 60 * 60 * 24);

    if (diff === 1) {
      current++;
      best = Math.max(best, current);
    } else {
      current = 1;
    }
  }

  return best;
};