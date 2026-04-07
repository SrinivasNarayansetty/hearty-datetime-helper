/**
 * Hearty Datetime Helper - A lightweight TypeScript utility library
 * providing comprehensive date and time helper functions.
 *
 * @module hearty-datetime-helper
 */

// ─── Constants ──────────────────────────────────────────────────────────────

const pattern: Record<string, string> = {
  default: "ddd mmm dd yyyy HH:MM:ss",
  shortDate: "m/d/yy",
  mediumDate: "mmm d, yyyy",
  longDate: "mmmm d, yyyy",
  fullDate: "dddd, mmmm d, yyyy",
  shortTime: "h:MM TT",
  mediumTime: "h:MM:ss TT",
  longTime: "h:MM:ss TT Z",
  isoDate: "yyyy-mm-dd",
  isoTime: "HH:MM:ss",
  isoDateTime: "yyyy-mm-dd'T'HH:MM:ss",
  isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'",
  simpleDateTime: "dd/mm/yyyy",
};

const dayNames: string[] = [
  "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
];

const monthNames: string[] = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// ─── Types ──────────────────────────────────────────────────────────────────

export type DateInput = Date | string | number;

export interface DurationResult {
  year: string;
  month: string;
  day: string;
  hour: string;
  minute: string;
  second: string;
  displayDiff: string;
  duration: number;
}

// ─── Internal Helpers ───────────────────────────────────────────────────────

function formulateDateStr(dts: string): string | null {
  let dtArr: string[] = [];
  if (dts.indexOf("-") > 0) {
    dtArr = dts.split("-");
  } else if (dts.indexOf("/") > 0) {
    dtArr = dts.split("/");
  } else if (dts.indexOf("_") > 0) {
    dtArr = dts.split("_");
  } else {
    return null;
  }

  if (dtArr[2] && dtArr[2].length === 4) {
    // date/month/year
    return dtArr[2] + "/" + dtArr[1] + "/" + dtArr[0];
  } else if (dtArr[0] && dtArr[0].length === 4) {
    // year/month/date
    return dtArr[0] + "/" + dtArr[1] + "/" + dtArr[2];
  }
  return null;
}

function toDate(dt: DateInput): Date {
  if (dt instanceof Date) return dt;
  return strToDate(dt) as Date;
}

// ─── Original Functions (ported to TypeScript) ──────────────────────────────

/**
 * Returns the full month name for a given month ordinal (1-12).
 *
 * @param ordinal - Month number (1-12)
 * @returns The full month name, or empty string if invalid
 *
 * @example
 * ```ts
 * getMonthNameWithOrdinal(6)  // "June"
 * getMonthNameWithOrdinal(1)  // "January"
 * ```
 */
export function getMonthNameWithOrdinal(ordinal: number | string): string {
  const num = parseInt(String(ordinal), 10);
  return num <= 12 ? monthNames[num + 11] : "";
}

/**
 * Converts a date string to a Date object, optionally formatting the output.
 * Supports multiple input formats: dd/mm/yyyy, dd-mm-yyyy, yyyy/mm/dd, yyyy-mm-dd,
 * epoch timestamps, and Date objects.
 *
 * @param dt - The date input (string, number, or Date)
 * @param format - Optional output format pattern
 * @returns A Date object, or a formatted date string if format is provided
 *
 * @example
 * ```ts
 * strToDate('21/10/2018', 'yyyy-mm-dd')  // "2018-10-21"
 * strToDate('21-10-2018')                 // Date object
 * ```
 */
export function strToDate(dt: DateInput, format?: string | false): Date | string {
  const isDateObj = Object.prototype.toString.call(dt) === "[object Date]";
  const fmt = format === undefined ? false : format;
  let date: Date;

  if (isDateObj) {
    date = dt as Date;
  } else {
    let dtStr = String(dt);
    const time = " 00:00:00";
    let dateStr: string | null;

    if (dtStr.indexOf(":") === -1) {
      dateStr = formulateDateStr(dtStr);
    } else {
      if (dtStr.indexOf("-") === -1 && dtStr.indexOf("/") === -1 && dtStr.indexOf("_") > -1) {
        const nd = new Date();
        dtStr = nd.getDate() + "/" + (nd.getMonth() + 1) + "/" + nd.getFullYear() + " " + dtStr;
      }
      const dtsArr = dtStr.split(" ");
      dateStr = formulateDateStr(dtsArr[0]);
      // time part handled by appending dtsArr[1]
      if (dateStr !== null) {
        date = new Date(dateStr + " " + dtsArr[1]);
      } else if (!isNaN(parseInt(dtStr)) && formulateDateStr(dtsArr[0]) === null) {
        date = new Date(parseInt(dtStr) * 1000);
      } else {
        date = new Date(dtStr);
      }
      if (fmt !== false) {
        return formatDate(date!, fmt as string);
      }
      return date!;
    }

    if (!isNaN(parseInt(dtStr)) && dateStr === null) {
      date = new Date(parseInt(dtStr) * 1000);
    } else if (dateStr === null) {
      date = new Date(dtStr);
    } else {
      date = new Date(dateStr + time);
    }
  }

  if (fmt !== false) {
    return formatDate(date, fmt as string);
  }
  return date;
}

/**
 * Checks if the given date is today.
 *
 * @param dt - The date to check
 * @returns `true` if the date is today
 *
 * @example
 * ```ts
 * isToday(new Date())         // true
 * isToday('21-10-2018')       // false
 * ```
 */
export function isToday(dt: DateInput): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = toDate(dt);
  target.setHours(0, 0, 0, 0);
  return today.getTime() === target.getTime();
}

/**
 * Returns the number of days between the given date and today.
 * Positive values mean the date is in the future, negative in the past.
 *
 * @param dt - The target date
 * @returns Number of days difference
 *
 * @example
 * ```ts
 * daysdiffFromToday('28/10/2025')  // days until that date
 * ```
 */
export function daysdiffFromToday(dt: DateInput): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = toDate(dt);
  target.setHours(0, 0, 0, 0);
  return (target.getTime() - today.getTime()) / 86400000;
}

/**
 * Returns the number of days between two dates.
 *
 * @param dt1 - The first date
 * @param dt2 - The second date
 * @returns Number of days (positive if dt2 is after dt1)
 *
 * @example
 * ```ts
 * daysdiff('21/10/2018', '28/10/2018')  // 7
 * ```
 */
export function daysdiff(dt1: DateInput, dt2: DateInput): number {
  const firstDate = toDate(dt1);
  const secondDate = toDate(dt2);
  firstDate.setHours(0, 0, 0, 0);
  secondDate.setHours(0, 0, 0, 0);
  return (secondDate.getTime() - firstDate.getTime()) / 86400000;
}

/**
 * Formats a number of minutes into "HH:MM hrs" format.
 *
 * @param time - Total minutes
 * @returns Formatted string like "02:30 hrs"
 *
 * @example
 * ```ts
 * formatMinutes(150)   // "02:30 hrs"
 * formatMinutes(1760)  // "29:20 hrs"
 * ```
 */
export function formatMinutes(time: number | string): string {
  const total = parseInt(String(time), 10);
  let hr: string | number = Math.floor(total / 60);
  let min: string | number = total % 60;
  hr = hr < 10 ? "0" + hr : String(hr);
  min = min < 10 ? "0" + min : String(min);
  return hr + ":" + min + " hrs";
}

/**
 * Pads a number with a leading zero if less than 10.
 *
 * @param value - The number to pad
 * @returns Padded string representation
 *
 * @example
 * ```ts
 * handleDisplayDigit(4)   // "04"
 * handleDisplayDigit(12)  // "12"
 * ```
 */
export function handleDisplayDigit(value: number): string {
  return value < 10 ? "0" + value : value.toString();
}

/**
 * Calculates the duration between two date/time values.
 * Returns an object with years, months, days, hours, minutes, seconds,
 * a human-readable displayDiff string, and duration in seconds.
 *
 * @param startTime - Start date/time
 * @param endTime - End date/time
 * @returns Duration result object
 *
 * @example
 * ```ts
 * getDuration('22/10/2018', '28/11/2018')
 * // { year: "00", month: "01", day: "06", ... displayDiff: "01mo 06d" }
 * ```
 */
export function getDuration(startTime: DateInput, endTime: DateInput): DurationResult {
  const startTimeObj = new Date(String(strToDate(startTime)));
  const endTimeObj = new Date(String(strToDate(endTime)));

  let timeDiff = endTimeObj.getTime() - startTimeObj.getTime();
  if (timeDiff < 0) {
    timeDiff = (endTimeObj.getTime() + 86400000) - startTimeObj.getTime();
  }

  const diffDate = new Date(timeDiff);

  const inDays = handleDisplayDigit(diffDate.getDate() - 1);
  const inMonths = handleDisplayDigit(diffDate.getMonth());
  const inYears = handleDisplayDigit(diffDate.getFullYear() - 1970);
  const inHours = handleDisplayDigit(diffDate.getUTCHours());
  const inMinutes = handleDisplayDigit(diffDate.getUTCMinutes());
  const inSecs = handleDisplayDigit(diffDate.getUTCSeconds());

  const formatStr: DurationResult = {
    year: inYears,
    month: inMonths,
    day: inDays,
    hour: inHours,
    minute: inMinutes,
    second: inSecs,
    displayDiff: "Now",
    duration: 0,
  };

  if (parseInt(inYears) > 0) {
    formatStr.displayDiff = inYears + "yr " + inMonths + "mo ";
  } else if (parseInt(inMonths) > 0) {
    formatStr.displayDiff = inMonths + "mo " + inDays + "d";
  } else if (parseInt(inDays) > 0) {
    formatStr.displayDiff = inDays + "d " + inHours + "h";
  } else if (parseInt(inHours) > 0) {
    formatStr.displayDiff = inHours + "h " + inMinutes + "m";
  } else if (parseInt(inMinutes) > 0) {
    formatStr.displayDiff = inMinutes + "m ";
  }

  formatStr.duration = timeDiff / 1000;
  return formatStr;
}

/**
 * Displays a date as a human-readable string like "Mon, 22 Oct".
 * Optionally includes the year.
 *
 * @param dt - The date input
 * @param year - Whether to include the year
 * @returns Formatted display string
 *
 * @example
 * ```ts
 * displayDate('22/10/2018')        // "Mon, 22 Oct"
 * displayDate('22/10/2018', true)  // "Mon, 22 Oct 2018"
 * ```
 */
export function displayDate(dt: DateInput, year?: boolean): string {
  const date = toDate(dt);
  let dDate = dayNames[date.getDay()] + ", " + date.getDate() + " " + monthNames[date.getMonth()];
  if (year) {
    dDate = dDate + " " + date.getFullYear();
  }
  return dDate;
}

/**
 * Returns the short day name (e.g., "Mon") from a given date.
 *
 * @param dt - The date input
 * @returns Short day name
 *
 * @example
 * ```ts
 * getDayFromDate('22/10/2018')  // "Mon"
 * ```
 */
export function getDayFromDate(dt: DateInput): string {
  const date = toDate(dt);
  return dayNames[date.getDay()];
}

/**
 * Returns the short month name (e.g., "Oct") from a given date.
 *
 * @param dt - The date input
 * @returns Short month name
 *
 * @example
 * ```ts
 * getMonthFromDate('22/10/2018')  // "Oct"
 * ```
 */
export function getMonthFromDate(dt: DateInput): string {
  const date = toDate(dt);
  return monthNames[date.getMonth()];
}

/**
 * Checks if a given date is in the past (before today).
 * Returns false if the date is today.
 *
 * @param dt - The date to check
 * @returns `true` if the date is in the past
 *
 * @example
 * ```ts
 * isPastDate('22/10/2016')  // true
 * isPastDate('22/10/2030')  // false
 * ```
 */
export function isPastDate(dt: DateInput): boolean {
  const srcDate = toDate(dt);
  const src = new Date(srcDate.getFullYear(), srcDate.getMonth(), srcDate.getDate(), 0, 0, 0);
  const target = new Date();
  target.setHours(0, 0, 0, 0);

  if (
    src.getFullYear() === target.getFullYear() &&
    src.getMonth() === target.getMonth() &&
    src.getDate() === target.getDate()
  ) {
    return false;
  }
  return src.getTime() < target.getTime();
}

/**
 * Formats a date according to a pattern string.
 * Supports tokens: d, dd, ddd, dddd, m, mm, mmm, mmmm, yy, yyyy,
 * h, hh, H, HH, M, MM, s, ss, l, L, t, tt, T, TT
 *
 * @param date - The date to format
 * @param pat - The format pattern
 * @returns Formatted date string
 *
 * @example
 * ```ts
 * formatDate('22/10/2016', 'yyyy/mm/dd')  // "2016/10/22"
 * formatDate(new Date(), 'dd-mm-yyyy')     // "07-04-2026"
 * ```
 */
export function formatDate(date: DateInput, pat: string): string {
  if (!date) {
    return String(date);
  }

  const dateStr = String(strToDate(date, false));
  const utc = false;
  const token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g;

  const pad = (val: string | number, len: number = 2): string => {
    const zero = "0000000000";
    let s = String(val);
    if (s.length < len) {
      s = zero.substring(0, len - s.length) + s;
    }
    return s;
  };

  const d = new Date(dateStr);
  if (isNaN(d.getTime())) {
    throw new SyntaxError("invalid date");
  }

  const resolvedPattern = String(
    pattern[pat] || pat || pattern["default"]
  );

  const _ = utc ? "getUTC" : "get";
  const day = (d as any)[_ + "Date"]() as number;
  const D = (d as any)[_ + "Day"]() as number;
  const m = (d as any)[_ + "Month"]() as number;
  const y = (d as any)[_ + "FullYear"]() as number;
  const H = (d as any)[_ + "Hours"]() as number;
  const M = (d as any)[_ + "Minutes"]() as number;
  const s = (d as any)[_ + "Seconds"]() as number;
  const L = (d as any)[_ + "Milliseconds"]() as number;

  const flags: Record<string, string | number> = {
    d: day,
    dd: pad(day),
    ddd: dayNames[D],
    dddd: dayNames[D + 7],
    m: m + 1,
    mm: pad(m + 1),
    mmm: monthNames[m],
    mmmm: monthNames[m + 12],
    yy: String(y).slice(2),
    yyyy: y,
    h: H % 12 || 12,
    hh: pad(H % 12 || 12),
    H: H,
    HH: pad(H),
    M: M,
    MM: pad(M),
    s: s,
    ss: pad(s),
    l: pad(L, 3),
    L: pad(L > 99 ? Math.round(L / 10) : L),
    t: H < 12 ? "a" : "p",
    tt: H < 12 ? "am" : "pm",
    T: H < 12 ? "A" : "P",
    TT: H < 12 ? "AM" : "PM",
  };

  return resolvedPattern.replace(token, ($0: string) => {
    return $0 in flags ? String(flags[$0]) : $0.slice(1, $0.length - 1);
  });
}

/**
 * Returns a date that is N days ahead of the given date.
 *
 * @param dt - The starting date
 * @param days - Number of days to add
 * @param as - Optional format string for the output
 * @returns A Date object or formatted string
 *
 * @example
 * ```ts
 * getDaysAhead('22/10/2016', 20, 'yyyy/mm/dd')  // "2016/11/11"
 * ```
 */
export function getDaysAhead(dt: DateInput, days: number, as?: string): Date | string {
  const date = toDate(dt);
  date.setDate(date.getDate() + days);
  return typeof as === "string" ? formatDate(date, as) : date;
}

/**
 * Returns the number of days in a given month/year.
 *
 * @param m - Month number (1-12)
 * @param y - Year
 * @returns Number of days in the month
 *
 * @example
 * ```ts
 * numberOfDays(2, 2024)  // 29 (leap year)
 * numberOfDays(2, 2023)  // 28
 * ```
 */
export function numberOfDays(m: number, y: number): number {
  const month = m - 1;
  return /8|3|5|10/.test(String(month)) ? 30 : month === 1 ? (!(y % 4) && y % 100) || !(y % 400) ? 29 : 28 : 31;
}

/**
 * Returns a date that is N days behind the given date.
 *
 * @param dt - The starting date
 * @param days - Number of days to subtract
 * @param as - Optional format string for the output
 * @returns A Date object or formatted string
 *
 * @example
 * ```ts
 * getDaysBehind('22/10/2016', 20, 'yyyy/mm/dd')  // "2016/10/02"
 * ```
 */
export function getDaysBehind(dt: DateInput, days: number, as?: string): Date | string {
  const date = toDate(dt);
  date.setDate(date.getDate() - days);
  return typeof as === "string" ? formatDate(date, as) : date;
}

/**
 * Checks if a date falls between two other dates (inclusive).
 *
 * @param startDate - Range start
 * @param endDate - Range end
 * @param dateToCheck - The date to check
 * @returns `true` if dateToCheck is between startDate and endDate
 *
 * @example
 * ```ts
 * isDateInBetween('01/01/2020', '31/12/2020', '15/06/2020')  // true
 * ```
 */
export function isDateInBetween(startDate: DateInput, endDate: DateInput, dateToCheck: DateInput): boolean {
  const startDateObj = toDate(startDate);
  const endDateObj = toDate(endDate);
  const dateToCheckObj = toDate(dateToCheck);
  return dateToCheckObj >= startDateObj && dateToCheckObj <= endDateObj;
}

/**
 * Returns a number with its ordinal suffix (st, nd, rd, th).
 *
 * @param date - The number to add an ordinal to
 * @returns String with ordinal suffix
 *
 * @example
 * ```ts
 * getDateWithOrdinal(1)   // "1st"
 * getDateWithOrdinal(23)  // "23rd"
 * ```
 */
export function getDateWithOrdinal(date: number): string {
  if (date % 10 === 1 && date !== 11) {
    return date + "st";
  } else if (date % 10 === 2 && date !== 12) {
    return date + "nd";
  } else if (date % 10 === 3 && date !== 13) {
    return date + "rd";
  } else {
    return date + "th";
  }
}

/**
 * Converts a Unix epoch timestamp to a human-readable date string.
 *
 * @param dateInput - Unix timestamp
 * @param onlyText - If true, omits ordinal suffix from the date number
 * @returns Formatted string like "8th Nov, 2018"
 *
 * @example
 * ```ts
 * getDateFromTimeStamp(1541658537)  // "8th Nov, 2018"
 * ```
 */
export function getDateFromTimeStamp(dateInput: number, onlyText?: boolean): string | undefined {
  const dateValue = getConvertedEpochdate(dateInput);
  if (dateValue !== false && dateValue !== 0) {
    const data = new Date(dateValue as number);
    let dateNumber = data.getDate();
    if (dateNumber < 10) {
      dateNumber = parseInt(String(dateNumber), 10);
    }
    const dateInNumber = onlyText ? String(dateNumber) : getDateWithOrdinal(dateNumber);
    const dateYear = data.getFullYear().toString();
    const datemonth = monthNames[data.getMonth()];
    return dateInNumber + " " + datemonth + ", " + dateYear;
  }
  return undefined;
}

/**
 * Converts various epoch timestamp formats to milliseconds.
 * Handles timestamps in seconds, milliseconds, microseconds, and nanoseconds.
 *
 * @param inputtext - The epoch timestamp
 * @returns The timestamp in milliseconds, or false for invalid dates
 *
 * @example
 * ```ts
 * getConvertedEpochdate(1541658537)  // 1541658537000
 * ```
 */
export function getConvertedEpochdate(inputtext: number): number | false {
  if (inputtext >= 100000000000000 || inputtext <= -100000000000000) {
    inputtext = Math.round(inputtext / 1000);
  }

  if (inputtext >= 100000000000 || inputtext <= -100000000000) {
    // Already in milliseconds
    return inputtext;
  }

  if (inputtext < -6857222400) {
    return false;
  }

  return inputtext * 1000;
}

/**
 * Returns today's date formatted as dd/mm/yyyy.
 *
 * @returns Today's date string
 *
 * @example
 * ```ts
 * getTodaydate()  // "07/04/2026"
 * ```
 */
export function getTodaydate(): string {
  const today = new Date();
  const dd = today.getDate() < 10 ? "0" + today.getDate() : String(today.getDate());
  const mmNum = today.getMonth() + 1;
  const mm = mmNum < 10 ? "0" + mmNum : String(mmNum);
  const yyyy = today.getFullYear();
  return dd + "/" + mm + "/" + yyyy;
}

// ─── New Utility Functions ──────────────────────────────────────────────────

/**
 * Returns a human-readable relative time string.
 *
 * @param date - The date to compare against now
 * @returns Relative time string like "2 hours ago" or "in 3 days"
 *
 * @example
 * ```ts
 * toRelativeTime(new Date(Date.now() - 3600000))  // "1 hour ago"
 * toRelativeTime(new Date(Date.now() + 86400000 * 3))  // "in 3 days"
 * ```
 */
export function toRelativeTime(date: DateInput): string {
  const d = toDate(date);
  const now = Date.now();
  const diffMs = d.getTime() - now;
  const absDiff = Math.abs(diffMs);
  const isFuture = diffMs > 0;

  const seconds = Math.floor(absDiff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  let text: string;
  if (seconds < 60) {
    text = seconds <= 1 ? "just now" : `${seconds} seconds`;
  } else if (minutes < 60) {
    text = minutes === 1 ? "1 minute" : `${minutes} minutes`;
  } else if (hours < 24) {
    text = hours === 1 ? "1 hour" : `${hours} hours`;
  } else if (days < 30) {
    text = days === 1 ? "1 day" : `${days} days`;
  } else if (months < 12) {
    text = months === 1 ? "1 month" : `${months} months`;
  } else {
    text = years === 1 ? "1 year" : `${years} years`;
  }

  if (text === "just now") return text;
  return isFuture ? `in ${text}` : `${text} ago`;
}

/**
 * Returns a new Date set to the start of the day (00:00:00.000).
 *
 * @param date - The input date
 * @returns New Date at start of day
 */
export function startOfDay(date: DateInput): Date {
  const d = new Date(toDate(date));
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Returns a new Date set to the end of the day (23:59:59.999).
 *
 * @param date - The input date
 * @returns New Date at end of day
 */
export function endOfDay(date: DateInput): Date {
  const d = new Date(toDate(date));
  d.setHours(23, 59, 59, 999);
  return d;
}

/**
 * Returns a new Date set to the first day of the month at 00:00:00.000.
 *
 * @param date - The input date
 * @returns New Date at start of month
 */
export function startOfMonth(date: DateInput): Date {
  const d = new Date(toDate(date));
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Returns a new Date set to the last day of the month at 23:59:59.999.
 *
 * @param date - The input date
 * @returns New Date at end of month
 */
export function endOfMonth(date: DateInput): Date {
  const d = new Date(toDate(date));
  d.setMonth(d.getMonth() + 1, 0);
  d.setHours(23, 59, 59, 999);
  return d;
}

/**
 * Returns a new Date set to January 1st of the year at 00:00:00.000.
 *
 * @param date - The input date
 * @returns New Date at start of year
 */
export function startOfYear(date: DateInput): Date {
  const d = new Date(toDate(date));
  d.setMonth(0, 1);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Returns a new Date set to December 31st of the year at 23:59:59.999.
 *
 * @param date - The input date
 * @returns New Date at end of year
 */
export function endOfYear(date: DateInput): Date {
  const d = new Date(toDate(date));
  d.setMonth(11, 31);
  d.setHours(23, 59, 59, 999);
  return d;
}

/**
 * Checks if two dates fall on the same calendar day.
 *
 * @param date1 - First date
 * @param date2 - Second date
 * @returns `true` if both dates are on the same day
 *
 * @example
 * ```ts
 * isSameDay(new Date('2024-01-15'), new Date('2024-01-15'))  // true
 * ```
 */
export function isSameDay(date1: DateInput, date2: DateInput): boolean {
  const d1 = toDate(date1);
  const d2 = toDate(date2);
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

/**
 * Checks if a date falls on a weekend (Saturday or Sunday).
 *
 * @param date - The date to check
 * @returns `true` if the date is a weekend
 */
export function isWeekend(date: DateInput): boolean {
  const day = toDate(date).getDay();
  return day === 0 || day === 6;
}

/**
 * Checks if a date falls on a weekday (Monday-Friday).
 *
 * @param date - The date to check
 * @returns `true` if the date is a weekday
 */
export function isWeekday(date: DateInput): boolean {
  return !isWeekend(date);
}

/**
 * Checks if a year is a leap year.
 *
 * @param year - The year to check
 * @returns `true` if the year is a leap year
 *
 * @example
 * ```ts
 * isLeapYear(2024)  // true
 * isLeapYear(2023)  // false
 * ```
 */
export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/**
 * Returns the quarter (1-4) for a given date.
 *
 * @param date - The date
 * @returns Quarter number (1-4)
 *
 * @example
 * ```ts
 * getQuarter(new Date('2024-07-15'))  // 3
 * ```
 */
export function getQuarter(date: DateInput): number {
  return Math.floor(toDate(date).getMonth() / 3) + 1;
}

/**
 * Returns a new Date with the specified number of days added.
 *
 * @param date - The starting date
 * @param days - Number of days to add
 * @returns New Date
 */
export function addDays(date: DateInput, days: number): Date {
  const d = new Date(toDate(date));
  d.setDate(d.getDate() + days);
  return d;
}

/**
 * Returns a new Date with the specified number of months added.
 *
 * @param date - The starting date
 * @param months - Number of months to add
 * @returns New Date
 */
export function addMonths(date: DateInput, months: number): Date {
  const d = new Date(toDate(date));
  d.setMonth(d.getMonth() + months);
  return d;
}

/**
 * Returns a new Date with the specified number of years added.
 *
 * @param date - The starting date
 * @param years - Number of years to add
 * @returns New Date
 */
export function addYears(date: DateInput, years: number): Date {
  const d = new Date(toDate(date));
  d.setFullYear(d.getFullYear() + years);
  return d;
}

/**
 * Returns a new Date with the specified number of days subtracted.
 *
 * @param date - The starting date
 * @param days - Number of days to subtract
 * @returns New Date
 */
export function subtractDays(date: DateInput, days: number): Date {
  return addDays(date, -days);
}

/**
 * Returns a new Date with the specified number of months subtracted.
 *
 * @param date - The starting date
 * @param months - Number of months to subtract
 * @returns New Date
 */
export function subtractMonths(date: DateInput, months: number): Date {
  return addMonths(date, -months);
}

/**
 * Returns a new Date with the specified number of years subtracted.
 *
 * @param date - The starting date
 * @param years - Number of years to subtract
 * @returns New Date
 */
export function subtractYears(date: DateInput, years: number): Date {
  return addYears(date, -years);
}

/**
 * Calculates age in years from a birth date.
 *
 * @param birthDate - The date of birth
 * @returns Age in years
 *
 * @example
 * ```ts
 * getAge(new Date('1990-06-15'))  // 35 (as of 2026)
 * ```
 */
export function getAge(birthDate: DateInput): number {
  const birth = toDate(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

/**
 * Returns the ISO 8601 week number for a given date.
 *
 * @param date - The date
 * @returns ISO week number (1-53)
 *
 * @example
 * ```ts
 * getWeekNumber(new Date('2024-01-01'))  // 1
 * ```
 */
export function getWeekNumber(date: DateInput): number {
  const d = new Date(toDate(date));
  d.setHours(0, 0, 0, 0);
  // Set to nearest Thursday: current date + 4 - current day number (make Sunday=7)
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  const yearStart = new Date(d.getFullYear(), 0, 1);
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

/**
 * Converts a local date to a UTC date (shifts by timezone offset).
 *
 * @param date - The local date
 * @returns New Date representing the UTC equivalent
 */
export function toUTC(date: DateInput): Date {
  const d = toDate(date);
  return new Date(
    Date.UTC(
      d.getFullYear(), d.getMonth(), d.getDate(),
      d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds()
    )
  );
}

/**
 * Converts a UTC date to a local date (shifts by timezone offset).
 *
 * @param date - The UTC date
 * @returns New Date representing the local equivalent
 */
export function fromUTC(date: DateInput): Date {
  const d = toDate(date);
  return new Date(
    d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(),
    d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds(), d.getUTCMilliseconds()
  );
}

/**
 * Formats a duration in milliseconds to a human-readable string.
 *
 * @param ms - Duration in milliseconds
 * @returns Formatted string like "2h 30m 15s"
 *
 * @example
 * ```ts
 * formatDuration(9015000)  // "2h 30m 15s"
 * formatDuration(61000)    // "1m 1s"
 * ```
 */
export function formatDuration(ms: number): string {
  if (ms < 0) ms = -ms;

  const days = Math.floor(ms / 86400000);
  const hours = Math.floor((ms % 86400000) / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);

  const parts: string[] = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`);

  return parts.join(" ");
}

/**
 * Returns an array of Date objects for all days in a calendar month view.
 * Includes padding days from the previous and next months to fill complete weeks.
 *
 * @param month - Month number (1-12)
 * @param year - Year
 * @returns Array of Date objects (always starts on Sunday, ends on Saturday)
 *
 * @example
 * ```ts
 * getCalendarDays(1, 2024)  // Array of 35 dates (Dec 31 - Feb 3)
 * ```
 */
export function getCalendarDays(month: number, year: number): Date[] {
  const dates: Date[] = [];
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);

  // Pad start with days from previous month (start week on Sunday)
  const startPad = firstDay.getDay();
  for (let i = startPad - 1; i >= 0; i--) {
    const d = new Date(year, month - 1, -i);
    dates.push(d);
  }

  // Add all days of the month
  for (let i = 1; i <= lastDay.getDate(); i++) {
    dates.push(new Date(year, month - 1, i));
  }

  // Pad end to complete the last week
  const endPad = 6 - lastDay.getDay();
  for (let i = 1; i <= endPad; i++) {
    dates.push(new Date(year, month, i));
  }

  return dates;
}

/**
 * Checks if a value is a valid Date object.
 *
 * @param value - The value to check
 * @returns `true` if the value is a valid Date
 *
 * @example
 * ```ts
 * isValidDate(new Date())          // true
 * isValidDate(new Date('invalid')) // false
 * isValidDate('string')            // false
 * ```
 */
export function isValidDate(value: unknown): value is Date {
  return value instanceof Date && !isNaN(value.getTime());
}

/**
 * Parses an ISO 8601 date string into a Date object.
 *
 * @param isoString - The ISO 8601 string
 * @returns A Date object
 * @throws {SyntaxError} If the string is not a valid ISO date
 *
 * @example
 * ```ts
 * parseISO('2024-01-15T10:30:00Z')  // Date object
 * ```
 */
export function parseISO(isoString: string): Date {
  const date = new Date(isoString);
  if (isNaN(date.getTime())) {
    throw new SyntaxError(`Invalid ISO 8601 date string: "${isoString}"`);
  }
  return date;
}

/**
 * Returns the difference between two dates in hours.
 *
 * @param date1 - First date
 * @param date2 - Second date
 * @returns Difference in hours (can be negative)
 */
export function diffInHours(date1: DateInput, date2: DateInput): number {
  const d1 = toDate(date1);
  const d2 = toDate(date2);
  return (d2.getTime() - d1.getTime()) / 3600000;
}

/**
 * Returns the difference between two dates in minutes.
 *
 * @param date1 - First date
 * @param date2 - Second date
 * @returns Difference in minutes (can be negative)
 */
export function diffInMinutes(date1: DateInput, date2: DateInput): number {
  const d1 = toDate(date1);
  const d2 = toDate(date2);
  return (d2.getTime() - d1.getTime()) / 60000;
}

/**
 * Returns the difference between two dates in seconds.
 *
 * @param date1 - First date
 * @param date2 - Second date
 * @returns Difference in seconds (can be negative)
 */
export function diffInSeconds(date1: DateInput, date2: DateInput): number {
  const d1 = toDate(date1);
  const d2 = toDate(date2);
  return (d2.getTime() - d1.getTime()) / 1000;
}
