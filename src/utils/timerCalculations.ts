/**
 * Formats hours and minutes into "HH:MM"
 */
export function formatTimeHM(hours: number, minutes: number): string {
  const h = ((hours % 24) + 24) % 24;
  const m = Math.max(0, Math.min(59, Math.floor(minutes)));
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/**
 * Parses "HH:MM" into total minutes from midnight (0 to 1439)
 */
export function parseTimeToMinutes(timeStr: string): number {
  const [hStr, mStr] = timeStr.split(':');
  const h = parseInt(hStr, 10) || 0;
  const m = parseInt(mStr, 10) || 0;
  return h * 60 + m;
}

/**
 * Calculates forward minute difference from startTime to targetTime.
 * If targetTime is smaller or equal, it is assumed to be next day (e.g. 23:00 to 07:00 = 8h = 480m).
 * If targetTime is same minute, returns 1440m (24 hours).
 */
export function calculateForwardMinutes(startMinutes: number, targetMinutes: number): number {
  let diff = targetMinutes - startMinutes;
  if (diff <= 0) {
    diff += 24 * 60;
  }
  return diff;
}

/**
 * Given a base time (minutes from 00:00) and an offset in whole hours,
 * returns the resulting "HH:MM" string and whether it's next day.
 */
export function addHoursToTime(baseMinutes: number, hoursToAdd: number): { timeStr: string; isNextDay: boolean; daysAdded: number } {
  const total = baseMinutes + hoursToAdd * 60;
  const daysAdded = Math.floor(total / 1440);
  const normalizedMins = ((total % 1440) + 1440) % 1440;
  const h = Math.floor(normalizedMins / 60);
  const m = normalizedMins % 60;
  return {
    timeStr: formatTimeHM(h, m),
    isNextDay: daysAdded >= 1,
    daysAdded
  };
}

/**
 * Generates options for hourly timer (Floor, Rounded, Ceil)
 */
export function calculateHourlyRecommendations(nowMinutes: number, targetMinutes: number) {
  const diffMinutes = calculateForwardMinutes(nowMinutes, targetMinutes);
  const exactHoursDecimal = diffMinutes / 60;

  const floorHours = Math.max(1, Math.floor(diffMinutes / 60));
  const ceilHours = Math.max(1, Math.ceil(diffMinutes / 60));
  const roundedHours = Math.max(1, Math.round(diffMinutes / 60));

  const floorResult = addHoursToTime(nowMinutes, floorHours);
  const ceilResult = addHoursToTime(nowMinutes, ceilHours);
  const roundedResult = addHoursToTime(nowMinutes, roundedHours);

  // Delta: difference between planned result time and user requested target time (in minutes)
  // positive means runs X minutes longer, negative means turns off/on X minutes earlier
  const floorDeltaMinutes = (floorHours * 60) - diffMinutes;
  const ceilDeltaMinutes = (ceilHours * 60) - diffMinutes;
  const roundedDeltaMinutes = (roundedHours * 60) - diffMinutes;

  return {
    diffMinutes,
    exactHoursDecimal,
    floorHours,
    ceilHours,
    roundedHours,
    floorResult,
    ceilResult,
    roundedResult,
    floorDeltaMinutes,
    ceilDeltaMinutes,
    roundedDeltaMinutes
  };
}
