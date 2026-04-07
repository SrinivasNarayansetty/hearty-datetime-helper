# hearty-datetime-helper

A lightweight TypeScript utility library providing comprehensive date and time helper functions. Zero dependencies.

## Tech Stack

| Tool       | Purpose            |
| ---------- | ------------------ |
| TypeScript | Language           |
| tsup       | Build (CJS + ESM)  |
| Vitest     | Testing            |
| Node 18+   | Runtime            |

## Installation

```bash
npm install hearty-datetime-helper
```

## Usage

```ts
// ESM
import { formatDate, isToday, addDays, toRelativeTime } from "hearty-datetime-helper";

// CommonJS
const { formatDate, isToday, addDays, toRelativeTime } = require("hearty-datetime-helper");
```

## API Reference

### Original Functions

#### `getMonthNameWithOrdinal(ordinal: number | string): string`
Returns the full month name for a given month ordinal (1-12).
```ts
getMonthNameWithOrdinal(6)  // "June"
```

#### `strToDate(dt: DateInput, format?: string | false): Date | string`
Converts a date string to a Date object, optionally formatting the output.
Supports: `dd/mm/yyyy`, `dd-mm-yyyy`, `yyyy/mm/dd`, `yyyy-mm-dd`, epoch timestamps, and Date objects.
```ts
strToDate("21/10/2018", "yyyy-mm-dd")  // "2018-10-21"
strToDate("21-10-2018")                 // Date object
```

#### `isToday(dt: DateInput): boolean`
Checks if the given date is today.
```ts
isToday(new Date())     // true
isToday("21-10-2018")   // false
```

#### `daysdiffFromToday(dt: DateInput): number`
Returns the number of days between the given date and today.
```ts
daysdiffFromToday("28/10/2025")  // days until that date
```

#### `daysdiff(dt1: DateInput, dt2: DateInput): number`
Returns the number of days between two dates.
```ts
daysdiff("21/10/2018", "28/10/2018")  // 7
```

#### `formatMinutes(time: number | string): string`
Formats a number of minutes into `HH:MM hrs` format.
```ts
formatMinutes(150)  // "02:30 hrs"
```

#### `handleDisplayDigit(value: number): string`
Pads a number with a leading zero if less than 10.
```ts
handleDisplayDigit(4)   // "04"
handleDisplayDigit(12)  // "12"
```

#### `getDuration(startTime: DateInput, endTime: DateInput): DurationResult`
Calculates the duration between two date/time values.
```ts
getDuration("22/10/2018", "28/11/2018")
// { year: "00", month: "01", day: "06", ... displayDiff: "01mo 06d" }
```

#### `displayDate(dt: DateInput, year?: boolean): string`
Displays a date as a human-readable string.
```ts
displayDate("22/10/2018")        // "Mon, 22 Oct"
displayDate("22/10/2018", true)  // "Mon, 22 Oct 2018"
```

#### `getDayFromDate(dt: DateInput): string`
Returns the short day name from a given date.
```ts
getDayFromDate("22/10/2018")  // "Mon"
```

#### `getMonthFromDate(dt: DateInput): string`
Returns the short month name from a given date.
```ts
getMonthFromDate("22/10/2018")  // "Oct"
```

#### `isPastDate(dt: DateInput): boolean`
Checks if a given date is in the past.
```ts
isPastDate("22/10/2016")  // true
```

#### `formatDate(date: DateInput, pattern: string): string`
Formats a date according to a pattern string.
Tokens: `d`, `dd`, `ddd`, `dddd`, `m`, `mm`, `mmm`, `mmmm`, `yy`, `yyyy`, `h`, `hh`, `H`, `HH`, `M`, `MM`, `s`, `ss`, `t`, `tt`, `T`, `TT`
```ts
formatDate("22/10/2016", "yyyy/mm/dd")  // "2016/10/22"
```

#### `getDaysAhead(dt: DateInput, days: number, as?: string): Date | string`
Returns a date that is N days ahead of the given date.
```ts
getDaysAhead("22/10/2016", 20, "yyyy/mm/dd")  // "2016/11/11"
```

#### `numberOfDays(m: number, y: number): number`
Returns the number of days in a given month/year.
```ts
numberOfDays(2, 2024)  // 29
```

#### `getDaysBehind(dt: DateInput, days: number, as?: string): Date | string`
Returns a date that is N days behind the given date.
```ts
getDaysBehind("22/10/2016", 20, "yyyy/mm/dd")  // "2016/10/02"
```

#### `isDateInBetween(startDate: DateInput, endDate: DateInput, dateToCheck: DateInput): boolean`
Checks if a date falls between two other dates (inclusive).
```ts
isDateInBetween("01/01/2020", "31/12/2020", "15/06/2020")  // true
```

#### `getDateWithOrdinal(date: number): string`
Returns a number with its ordinal suffix.
```ts
getDateWithOrdinal(23)  // "23rd"
```

#### `getDateFromTimeStamp(dateInput: number, onlyText?: boolean): string | undefined`
Converts a Unix epoch timestamp to a human-readable date string.
```ts
getDateFromTimeStamp(1541658537)  // "8th Nov, 2018"
```

#### `getConvertedEpochdate(inputtext: number): number | false`
Converts various epoch timestamp formats to milliseconds.
```ts
getConvertedEpochdate(1541658537)  // 1541658537000
```

#### `getTodaydate(): string`
Returns today's date formatted as `dd/mm/yyyy`.
```ts
getTodaydate()  // "07/04/2026"
```

### New Functions (v2.0)

#### `toRelativeTime(date: DateInput): string`
Returns a human-readable relative time string.
```ts
toRelativeTime(new Date(Date.now() - 3600000))  // "1 hour ago"
toRelativeTime(new Date(Date.now() + 86400000 * 3))  // "in 3 days"
```

#### `startOfDay(date: DateInput): Date` / `endOfDay(date: DateInput): Date`
Set time to start (00:00:00.000) or end (23:59:59.999) of the day.

#### `startOfMonth(date: DateInput): Date` / `endOfMonth(date: DateInput): Date`
Set date to first or last day of the month.

#### `startOfYear(date: DateInput): Date` / `endOfYear(date: DateInput): Date`
Set date to Jan 1 or Dec 31 of the year.

#### `isSameDay(date1: DateInput, date2: DateInput): boolean`
Checks if two dates fall on the same calendar day.

#### `isWeekend(date: DateInput): boolean` / `isWeekday(date: DateInput): boolean`
Checks if a date is a weekend or weekday.

#### `isLeapYear(year: number): boolean`
Checks if a year is a leap year.

#### `getQuarter(date: DateInput): number`
Returns the quarter (1-4) for a given date.

#### `addDays(date, days)` / `addMonths(date, months)` / `addYears(date, years)`
Returns a new Date with the specified amount added.

#### `subtractDays(date, days)` / `subtractMonths(date, months)` / `subtractYears(date, years)`
Returns a new Date with the specified amount subtracted.

#### `getAge(birthDate: DateInput): number`
Calculates age in years from a birth date.

#### `getWeekNumber(date: DateInput): number`
Returns the ISO 8601 week number.

#### `toUTC(date: DateInput): Date` / `fromUTC(date: DateInput): Date`
Converts between local and UTC dates.

#### `formatDuration(ms: number): string`
Formats milliseconds to a human-readable duration string.
```ts
formatDuration(9015000)  // "2h 30m 15s"
```

#### `getCalendarDays(month: number, year: number): Date[]`
Returns an array of dates for a calendar month view (padded to complete weeks).

#### `isValidDate(value: unknown): boolean`
Checks if a value is a valid Date object.

#### `parseISO(isoString: string): Date`
Parses an ISO 8601 string to a Date object.

#### `diffInHours(date1, date2)` / `diffInMinutes(date1, date2)` / `diffInSeconds(date1, date2)`
Returns the difference between two dates in the specified unit.

## Types

```ts
type DateInput = Date | string | number;

interface DurationResult {
  year: string;
  month: string;
  day: string;
  hour: string;
  minute: string;
  second: string;
  displayDiff: string;
  duration: number;
}
```

## Migration from v1

- **Breaking**: Package is now ESM-first with CJS fallback.
- **Breaking**: Version bumped to 2.0.0.
- All original function names and signatures are preserved.
- TypeScript types are now included (`*.d.ts`).
- Import style changed from `require()` to `import` (CJS still supported).

```diff
- var helper = require('hearty-datetime-helper');
- helper.isToday('21-10-2018');
+ import { isToday } from 'hearty-datetime-helper';
+ isToday('21-10-2018');
```

## License

ISC
