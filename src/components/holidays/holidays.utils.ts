import type { DbSpecialHourPeriod } from '@/services/google-apis';

type Period = {
  endDate: {
    year: number;
    month: number;
    day: number;
  };
  startDate: {
    year: number;
    month: number;
    day: number;
  };
};

type SingleDay = {
  date: Date;
  startDate?: never;
  endDate?: never;
};

type MultipleDays = {
  date?: never;
  startDate: Date;
  endDate: Date;
};

const getDateFromYearMonthDay = (date: Period['endDate']) =>
  new Date(date.year, date.month - 1, date.day);

export const filterPeriods = (
  period: DbSpecialHourPeriod
): period is Period => {
  // ignore special hours days
  // CAREFUL: the functionality patches, so these will be lost with updates from this call
  if (!period.closed) {
    return false;
  }

  if (!period.startDate || !period.endDate) {
    return false;
  }

  const endDate = period.endDate;

  if (!endDate.year || !endDate.month || !endDate.day) {
    return false;
  }

  const cleanDate = {
    year: endDate.year,
    month: endDate.month,
    day: endDate.day,
  };

  const parsedEndDate = getDateFromYearMonthDay(cleanDate);

  if (parsedEndDate < new Date()) {
    return false;
  }

  return true;
};

export const mapPeriod = (period: Period): SingleDay | MultipleDays => {
  const startDate = getDateFromYearMonthDay(period.startDate);
  const endDate = getDateFromYearMonthDay(period.endDate);

  if (startDate.toString() === endDate.toString()) {
    return {
      date: startDate,
    };
  }

  return {
    startDate,
    endDate,
  };
};
