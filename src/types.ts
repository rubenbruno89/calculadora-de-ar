export interface TimerCalculationResult {
  mode: 'turn_off_now' | 'turn_on_later' | 'turn_on_then_off';
  currentHour: number;
  currentMinute: number;
  targetTimeStr: string;
  exactDiffMinutes: number;
  exactHoursDecimal: number;
  // Option recommendations for integer hours
  hoursRounded: number; // closest whole hour
  hoursFloor: number; // exact integer lower bound
  hoursCeil: number; // exact integer upper bound
  actualResultTimeRounded: string;
  actualResultTimeFloor: string;
  actualResultTimeCeil: string;
  deltaMinutesFloor: number; // difference in minutes compared to desired
  deltaMinutesCeil: number;
  deltaMinutesRounded: number;
}

export interface PresetScenario {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: 'turn_off_now' | 'turn_on_later' | 'turn_on_then_off';
  defaultOffTime?: string;
  defaultOnTime?: string;
  defaultOnThenOffHours?: number;
}
