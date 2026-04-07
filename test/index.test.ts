import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  getMonthNameWithOrdinal,
  strToDate,
  isToday,
  daysdiffFromToday,
  daysdiff,
  formatMinutes,
  handleDisplayDigit,
  getDuration,
  displayDate,
  getDayFromDate,
  getMonthFromDate,
  isPastDate,
  formatDate,
  getDaysAhead,
  numberOfDays,
  getDaysBehind,
  isDateInBetween,
  getDateWithOrdinal,
  getDateFromTimeStamp,
  getConvertedEpochdate,
  getTodaydate,
  toRelativeTime,
  startOfDay,
  endOfDay,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  isSameDay,
  isWeekend,
  isWeekday,
  isLeapYear,
  getQuarter,
  addDays,
  addMonths,
  addYears,
  subtractDays,
  subtractMonths,
  subtractYears,
  getAge,
  getWeekNumber,
  toUTC,
  fromUTC,
  formatDuration,
  getCalendarDays,
  isValidDate,
  parseISO,
  diffInHours,
  diffInMinutes,
  diffInSeconds,
} from "../src/index";

// ─── Original Functions ─────────────────────────────────────────────────────

describe("getMonthNameWithOrdinal", () => {
  it("returns full month name for valid ordinal", () => {
    expect(getMonthNameWithOrdinal(1)).toBe("January");
    expect(getMonthNameWithOrdinal(6)).toBe("June");
    expect(getMonthNameWithOrdinal(12)).toBe("December");
  });

  it("returns empty string for out-of-range ordinal", () => {
    expect(getMonthNameWithOrdinal(13)).toBe("");
  });

  it("returns Dec (short) for ordinal 0 due to index mapping", () => {
    // ordinal 0 => monthNames[0+11] = monthNames[11] = "Dec"
    expect(getMonthNameWithOrdinal(0)).toBe("Dec");
  });

  it("handles string input", () => {
    expect(getMonthNameWithOrdinal("3")).toBe("March");
  });
});

describe("strToDate", () => {
  it("parses dd/mm/yyyy format", () => {
    const result = strToDate("21/10/2018") as Date;
    expect(result).toBeInstanceOf(Date);
    expect(result.getDate()).toBe(21);
    expect(result.getMonth()).toBe(9); // October = 9
    expect(result.getFullYear()).toBe(2018);
  });

  it("parses dd-mm-yyyy format", () => {
    const result = strToDate("21-10-2018") as Date;
    expect(result).toBeInstanceOf(Date);
    expect(result.getFullYear()).toBe(2018);
  });

  it("parses yyyy-mm-dd format", () => {
    const result = strToDate("2018-10-21") as Date;
    expect(result).toBeInstanceOf(Date);
    expect(result.getDate()).toBe(21);
  });

  it("returns formatted string when format is provided", () => {
    const result = strToDate("21/10/2018", "yyyy-mm-dd");
    expect(result).toBe("2018-10-21");
  });

  it("handles Date object input", () => {
    const input = new Date(2020, 0, 15);
    const result = strToDate(input) as Date;
    expect(result.getFullYear()).toBe(2020);
  });
});

describe("isToday", () => {
  it("returns true for today", () => {
    expect(isToday(new Date())).toBe(true);
  });

  it("returns false for a past date", () => {
    expect(isToday(new Date(2020, 0, 1))).toBe(false);
  });
});

describe("daysdiffFromToday", () => {
  it("returns 0 for today", () => {
    expect(daysdiffFromToday(new Date())).toBe(0);
  });

  it("returns negative for past dates", () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    expect(daysdiffFromToday(yesterday)).toBe(-1);
  });

  it("returns positive for future dates", () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    expect(daysdiffFromToday(tomorrow)).toBe(1);
  });
});

describe("daysdiff", () => {
  it("calculates difference between two dates", () => {
    const d1 = new Date(2024, 0, 1);
    const d2 = new Date(2024, 0, 8);
    expect(daysdiff(d1, d2)).toBe(7);
  });

  it("returns negative when second date is before first", () => {
    const d1 = new Date(2024, 0, 8);
    const d2 = new Date(2024, 0, 1);
    expect(daysdiff(d1, d2)).toBe(-7);
  });
});

describe("formatMinutes", () => {
  it("formats minutes to HH:MM hrs", () => {
    expect(formatMinutes(150)).toBe("02:30 hrs");
    expect(formatMinutes(1760)).toBe("29:20 hrs");
    expect(formatMinutes(0)).toBe("00:00 hrs");
  });

  it("handles string input", () => {
    expect(formatMinutes("90")).toBe("01:30 hrs");
  });
});

describe("handleDisplayDigit", () => {
  it("pads single digits with leading zero", () => {
    expect(handleDisplayDigit(4)).toBe("04");
    expect(handleDisplayDigit(0)).toBe("00");
  });

  it("does not pad double digits", () => {
    expect(handleDisplayDigit(12)).toBe("12");
    expect(handleDisplayDigit(10)).toBe("10");
  });
});

describe("getDuration", () => {
  it("returns duration object", () => {
    const result = getDuration(new Date(2024, 0, 1), new Date(2024, 0, 2));
    expect(result).toHaveProperty("year");
    expect(result).toHaveProperty("month");
    expect(result).toHaveProperty("day");
    expect(result).toHaveProperty("hour");
    expect(result).toHaveProperty("minute");
    expect(result).toHaveProperty("second");
    expect(result).toHaveProperty("displayDiff");
    expect(result).toHaveProperty("duration");
  });

  it("calculates 1 day duration", () => {
    const result = getDuration(new Date(2024, 0, 1, 0, 0, 0), new Date(2024, 0, 2, 0, 0, 0));
    expect(result.duration).toBe(86400);
    expect(result.day).toBe("01");
  });
});

describe("displayDate", () => {
  it("formats date without year", () => {
    // Jan 15, 2024 is a Monday
    const result = displayDate(new Date(2024, 0, 15));
    expect(result).toBe("Mon, 15 Jan");
  });

  it("formats date with year", () => {
    const result = displayDate(new Date(2024, 0, 15), true);
    expect(result).toBe("Mon, 15 Jan 2024");
  });
});

describe("getDayFromDate", () => {
  it("returns day name", () => {
    // Jan 15, 2024 is a Monday
    expect(getDayFromDate(new Date(2024, 0, 15))).toBe("Mon");
  });
});

describe("getMonthFromDate", () => {
  it("returns month name", () => {
    expect(getMonthFromDate(new Date(2024, 9, 15))).toBe("Oct");
  });
});

describe("isPastDate", () => {
  it("returns true for past dates", () => {
    expect(isPastDate(new Date(2020, 0, 1))).toBe(true);
  });

  it("returns false for today", () => {
    expect(isPastDate(new Date())).toBe(false);
  });

  it("returns false for future dates", () => {
    const future = new Date();
    future.setFullYear(future.getFullYear() + 1);
    expect(isPastDate(future)).toBe(false);
  });
});

describe("formatDate", () => {
  it("formats date with dd/mm/yyyy pattern", () => {
    const d = new Date(2024, 9, 22); // Oct 22
    expect(formatDate(d, "dd/mm/yyyy")).toBe("22/10/2024");
  });

  it("formats date with yyyy-mm-dd pattern", () => {
    const d = new Date(2024, 0, 5);
    expect(formatDate(d, "yyyy-mm-dd")).toBe("2024-01-05");
  });

  it("throws on invalid date", () => {
    expect(() => formatDate("not-a-date", "yyyy-mm-dd")).toThrow("invalid date");
  });
});

describe("getDaysAhead", () => {
  it("returns date N days ahead", () => {
    const result = getDaysAhead(new Date(2024, 0, 1), 10) as Date;
    expect(result.getDate()).toBe(11);
  });

  it("returns formatted string when format provided", () => {
    const result = getDaysAhead(new Date(2024, 0, 1), 10, "dd/mm/yyyy");
    expect(result).toBe("11/01/2024");
  });
});

describe("numberOfDays", () => {
  it("returns 31 for January", () => {
    expect(numberOfDays(1, 2024)).toBe(31);
  });

  it("returns 29 for February in leap year", () => {
    expect(numberOfDays(2, 2024)).toBe(29);
  });

  it("returns 28 for February in non-leap year", () => {
    expect(numberOfDays(2, 2023)).toBe(28);
  });

  it("returns 30 for April", () => {
    expect(numberOfDays(4, 2024)).toBe(30);
  });
});

describe("getDaysBehind", () => {
  it("returns date N days behind", () => {
    const result = getDaysBehind(new Date(2024, 0, 15), 10) as Date;
    expect(result.getDate()).toBe(5);
  });

  it("returns formatted string when format provided", () => {
    const result = getDaysBehind(new Date(2024, 0, 15), 10, "dd/mm/yyyy");
    expect(result).toBe("05/01/2024");
  });
});

describe("isDateInBetween", () => {
  it("returns true when date is in range", () => {
    expect(isDateInBetween(
      new Date(2024, 0, 1),
      new Date(2024, 11, 31),
      new Date(2024, 6, 15)
    )).toBe(true);
  });

  it("returns false when date is outside range", () => {
    expect(isDateInBetween(
      new Date(2024, 0, 1),
      new Date(2024, 11, 31),
      new Date(2025, 0, 1)
    )).toBe(false);
  });

  it("returns true for boundary dates", () => {
    const start = new Date(2024, 0, 1);
    const end = new Date(2024, 11, 31);
    expect(isDateInBetween(start, end, new Date(2024, 0, 1))).toBe(true);
  });
});

describe("getDateWithOrdinal", () => {
  it("adds st to 1st", () => {
    expect(getDateWithOrdinal(1)).toBe("1st");
    expect(getDateWithOrdinal(21)).toBe("21st");
    expect(getDateWithOrdinal(31)).toBe("31st");
  });

  it("adds nd to 2nd", () => {
    expect(getDateWithOrdinal(2)).toBe("2nd");
    expect(getDateWithOrdinal(22)).toBe("22nd");
  });

  it("adds rd to 3rd", () => {
    expect(getDateWithOrdinal(3)).toBe("3rd");
    expect(getDateWithOrdinal(23)).toBe("23rd");
  });

  it("adds th to others", () => {
    expect(getDateWithOrdinal(4)).toBe("4th");
    expect(getDateWithOrdinal(11)).toBe("11th");
    expect(getDateWithOrdinal(12)).toBe("12th");
    expect(getDateWithOrdinal(13)).toBe("13th");
  });
});

describe("getDateFromTimeStamp", () => {
  it("converts timestamp to readable date", () => {
    // 1541658537 = Nov 8, 2018
    const result = getDateFromTimeStamp(1541658537);
    expect(result).toContain("Nov");
    expect(result).toContain("2018");
  });

  it("returns date with ordinal by default", () => {
    const result = getDateFromTimeStamp(1541658537);
    expect(result).toMatch(/\d+(st|nd|rd|th)/);
  });

  it("returns date without ordinal when onlyText is true", () => {
    const result = getDateFromTimeStamp(1541658537, true);
    expect(result).not.toMatch(/(st|nd|rd|th)/);
  });
});

describe("getConvertedEpochdate", () => {
  it("converts seconds to milliseconds", () => {
    expect(getConvertedEpochdate(1541658537)).toBe(1541658537000);
  });

  it("keeps millisecond timestamps as-is", () => {
    expect(getConvertedEpochdate(1541658537000)).toBe(1541658537000);
  });

  it("returns false for pre-Gregorian dates", () => {
    expect(getConvertedEpochdate(-7000000000)).toBe(false);
  });
});

describe("getTodaydate", () => {
  it("returns today in dd/mm/yyyy format", () => {
    const result = getTodaydate();
    expect(result).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
    const today = new Date();
    const expected = `${String(today.getDate()).padStart(2, "0")}/${String(today.getMonth() + 1).padStart(2, "0")}/${today.getFullYear()}`;
    expect(result).toBe(expected);
  });
});

// ─── New Utility Functions ──────────────────────────────────────────────────

describe("toRelativeTime", () => {
  it("returns 'just now' for very recent times", () => {
    expect(toRelativeTime(new Date())).toBe("just now");
  });

  it("returns minutes ago", () => {
    const d = new Date(Date.now() - 5 * 60 * 1000);
    expect(toRelativeTime(d)).toBe("5 minutes ago");
  });

  it("returns hours ago", () => {
    const d = new Date(Date.now() - 2 * 3600 * 1000);
    expect(toRelativeTime(d)).toBe("2 hours ago");
  });

  it("returns days in the future", () => {
    const d = new Date(Date.now() + 3 * 86400 * 1000);
    expect(toRelativeTime(d)).toBe("in 3 days");
  });
});

describe("startOfDay / endOfDay", () => {
  it("sets time to 00:00:00.000", () => {
    const d = startOfDay(new Date(2024, 5, 15, 14, 30));
    expect(d.getHours()).toBe(0);
    expect(d.getMinutes()).toBe(0);
    expect(d.getSeconds()).toBe(0);
    expect(d.getMilliseconds()).toBe(0);
  });

  it("sets time to 23:59:59.999", () => {
    const d = endOfDay(new Date(2024, 5, 15, 14, 30));
    expect(d.getHours()).toBe(23);
    expect(d.getMinutes()).toBe(59);
    expect(d.getSeconds()).toBe(59);
    expect(d.getMilliseconds()).toBe(999);
  });
});

describe("startOfMonth / endOfMonth", () => {
  it("returns first day of month", () => {
    const d = startOfMonth(new Date(2024, 5, 15));
    expect(d.getDate()).toBe(1);
    expect(d.getMonth()).toBe(5);
    expect(d.getHours()).toBe(0);
  });

  it("returns last day of month", () => {
    const d = endOfMonth(new Date(2024, 1, 15)); // Feb 2024
    expect(d.getDate()).toBe(29); // leap year
    expect(d.getMonth()).toBe(1);
    expect(d.getHours()).toBe(23);
  });

  it("handles December correctly", () => {
    const d = endOfMonth(new Date(2024, 11, 5)); // Dec
    expect(d.getDate()).toBe(31);
    expect(d.getMonth()).toBe(11);
  });
});

describe("startOfYear / endOfYear", () => {
  it("returns Jan 1", () => {
    const d = startOfYear(new Date(2024, 5, 15));
    expect(d.getMonth()).toBe(0);
    expect(d.getDate()).toBe(1);
  });

  it("returns Dec 31", () => {
    const d = endOfYear(new Date(2024, 5, 15));
    expect(d.getMonth()).toBe(11);
    expect(d.getDate()).toBe(31);
    expect(d.getHours()).toBe(23);
  });
});

describe("isSameDay", () => {
  it("returns true for same day", () => {
    expect(isSameDay(
      new Date(2024, 0, 15, 10, 0),
      new Date(2024, 0, 15, 22, 30)
    )).toBe(true);
  });

  it("returns false for different days", () => {
    expect(isSameDay(
      new Date(2024, 0, 15),
      new Date(2024, 0, 16)
    )).toBe(false);
  });
});

describe("isWeekend / isWeekday", () => {
  it("identifies Saturday as weekend", () => {
    // Jan 13, 2024 is a Saturday
    expect(isWeekend(new Date(2024, 0, 13))).toBe(true);
    expect(isWeekday(new Date(2024, 0, 13))).toBe(false);
  });

  it("identifies Sunday as weekend", () => {
    // Jan 14, 2024 is a Sunday
    expect(isWeekend(new Date(2024, 0, 14))).toBe(true);
  });

  it("identifies Monday as weekday", () => {
    // Jan 15, 2024 is a Monday
    expect(isWeekend(new Date(2024, 0, 15))).toBe(false);
    expect(isWeekday(new Date(2024, 0, 15))).toBe(true);
  });
});

describe("isLeapYear", () => {
  it("identifies leap years", () => {
    expect(isLeapYear(2024)).toBe(true);
    expect(isLeapYear(2000)).toBe(true);
  });

  it("identifies non-leap years", () => {
    expect(isLeapYear(2023)).toBe(false);
    expect(isLeapYear(1900)).toBe(false);
  });
});

describe("getQuarter", () => {
  it("returns correct quarter", () => {
    expect(getQuarter(new Date(2024, 0, 15))).toBe(1);
    expect(getQuarter(new Date(2024, 3, 15))).toBe(2);
    expect(getQuarter(new Date(2024, 6, 15))).toBe(3);
    expect(getQuarter(new Date(2024, 9, 15))).toBe(4);
  });
});

describe("addDays / addMonths / addYears", () => {
  it("adds days", () => {
    const d = addDays(new Date(2024, 0, 1), 10);
    expect(d.getDate()).toBe(11);
  });

  it("adds months", () => {
    const d = addMonths(new Date(2024, 0, 15), 3);
    expect(d.getMonth()).toBe(3); // April
  });

  it("adds years", () => {
    const d = addYears(new Date(2024, 0, 15), 2);
    expect(d.getFullYear()).toBe(2026);
  });

  it("does not mutate original date", () => {
    const original = new Date(2024, 0, 1);
    const originalTime = original.getTime();
    addDays(original, 10);
    expect(original.getTime()).toBe(originalTime);
  });
});

describe("subtractDays / subtractMonths / subtractYears", () => {
  it("subtracts days", () => {
    const d = subtractDays(new Date(2024, 0, 15), 10);
    expect(d.getDate()).toBe(5);
  });

  it("subtracts months", () => {
    const d = subtractMonths(new Date(2024, 6, 15), 3);
    expect(d.getMonth()).toBe(3);
  });

  it("subtracts years", () => {
    const d = subtractYears(new Date(2024, 0, 15), 4);
    expect(d.getFullYear()).toBe(2020);
  });
});

describe("getAge", () => {
  it("calculates age correctly", () => {
    const today = new Date();
    const birthYear = today.getFullYear() - 30;
    const birthDate = new Date(birthYear, 0, 1);
    expect(getAge(birthDate)).toBeGreaterThanOrEqual(29);
    expect(getAge(birthDate)).toBeLessThanOrEqual(30);
  });

  it("accounts for birthday not yet passed this year", () => {
    const today = new Date();
    // Birthday in December of 30 years ago - if current month is before Dec, age should be 29
    const birth = new Date(today.getFullYear() - 30, 11, 31);
    if (today.getMonth() < 11 || (today.getMonth() === 11 && today.getDate() < 31)) {
      expect(getAge(birth)).toBe(29);
    } else {
      expect(getAge(birth)).toBe(30);
    }
  });
});

describe("getWeekNumber", () => {
  it("returns correct ISO week number", () => {
    // Dec 29, 2003 is ISO week 1 of 2004
    expect(getWeekNumber(new Date(2024, 0, 1))).toBe(1);
  });

  it("handles end of year", () => {
    expect(getWeekNumber(new Date(2024, 11, 30))).toBeGreaterThan(0);
  });
});

describe("toUTC / fromUTC", () => {
  it("converts to UTC", () => {
    const d = new Date(2024, 0, 15, 10, 30, 0);
    const utc = toUTC(d);
    expect(utc.getUTCFullYear()).toBe(2024);
    expect(utc.getUTCMonth()).toBe(0);
    expect(utc.getUTCDate()).toBe(15);
    expect(utc.getUTCHours()).toBe(10);
    expect(utc.getUTCMinutes()).toBe(30);
  });

  it("converts from UTC", () => {
    const utcDate = new Date(Date.UTC(2024, 0, 15, 10, 30, 0));
    const local = fromUTC(utcDate);
    expect(local.getFullYear()).toBe(2024);
    expect(local.getMonth()).toBe(0);
    expect(local.getDate()).toBe(15);
    expect(local.getHours()).toBe(10);
    expect(local.getMinutes()).toBe(30);
  });
});

describe("formatDuration", () => {
  it("formats milliseconds to readable string", () => {
    expect(formatDuration(9015000)).toBe("2h 30m 15s");
  });

  it("handles days", () => {
    expect(formatDuration(90061000)).toBe("1d 1h 1m 1s");
  });

  it("handles zero", () => {
    expect(formatDuration(0)).toBe("0s");
  });

  it("handles sub-second", () => {
    expect(formatDuration(500)).toBe("0s");
  });

  it("handles negative values", () => {
    expect(formatDuration(-3600000)).toBe("1h");
  });
});

describe("getCalendarDays", () => {
  it("returns array of dates", () => {
    const days = getCalendarDays(1, 2024);
    expect(days.length).toBeGreaterThanOrEqual(28);
    // Should be a multiple of 7 (complete weeks)
    expect(days.length % 7).toBe(0);
  });

  it("starts on Sunday", () => {
    const days = getCalendarDays(1, 2024);
    expect(days[0].getDay()).toBe(0); // Sunday
  });

  it("ends on Saturday", () => {
    const days = getCalendarDays(1, 2024);
    expect(days[days.length - 1].getDay()).toBe(6); // Saturday
  });

  it("contains all days of the month", () => {
    const days = getCalendarDays(2, 2024); // Feb 2024, 29 days
    const febDays = days.filter(d => d.getMonth() === 1);
    expect(febDays.length).toBe(29);
  });
});

describe("isValidDate", () => {
  it("returns true for valid dates", () => {
    expect(isValidDate(new Date())).toBe(true);
    expect(isValidDate(new Date(2024, 0, 1))).toBe(true);
  });

  it("returns false for invalid dates", () => {
    expect(isValidDate(new Date("invalid"))).toBe(false);
  });

  it("returns false for non-date values", () => {
    expect(isValidDate("2024-01-01")).toBe(false);
    expect(isValidDate(123)).toBe(false);
    expect(isValidDate(null)).toBe(false);
    expect(isValidDate(undefined)).toBe(false);
  });
});

describe("parseISO", () => {
  it("parses valid ISO strings", () => {
    const d = parseISO("2024-01-15T10:30:00Z");
    expect(d).toBeInstanceOf(Date);
    expect(d.getUTCFullYear()).toBe(2024);
    expect(d.getUTCMonth()).toBe(0);
    expect(d.getUTCDate()).toBe(15);
  });

  it("throws on invalid strings", () => {
    expect(() => parseISO("not-a-date")).toThrow(SyntaxError);
  });
});

describe("diffInHours / diffInMinutes / diffInSeconds", () => {
  it("calculates hour difference", () => {
    const d1 = new Date(2024, 0, 1, 10, 0, 0);
    const d2 = new Date(2024, 0, 1, 13, 0, 0);
    expect(diffInHours(d1, d2)).toBe(3);
  });

  it("calculates minute difference", () => {
    const d1 = new Date(2024, 0, 1, 10, 0, 0);
    const d2 = new Date(2024, 0, 1, 10, 45, 0);
    expect(diffInMinutes(d1, d2)).toBe(45);
  });

  it("calculates second difference", () => {
    const d1 = new Date(2024, 0, 1, 10, 0, 0);
    const d2 = new Date(2024, 0, 1, 10, 0, 30);
    expect(diffInSeconds(d1, d2)).toBe(30);
  });

  it("returns negative for reversed dates", () => {
    const d1 = new Date(2024, 0, 1, 13, 0, 0);
    const d2 = new Date(2024, 0, 1, 10, 0, 0);
    expect(diffInHours(d1, d2)).toBe(-3);
  });
});
