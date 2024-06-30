const getToday = function (options: any = {}) {
  const today = new Date();

  // This is necessary to compare with created_at from Supabase, because it it not at 0.0.0.0, so we need to set the date to be END of the day when we compare it with earlier dates
  if (options?.end)
    // Set to the last second of the day
    today.setHours(23, 59, 59, 999);
  else today.setHours(0, 0, 0, 0);
  return today;
};

export default getToday;
