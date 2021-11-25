import { DateTime, Info } from "luxon";

// TODO: take into account the current time. We might want to book a room for today
// AND for the next week – this really depends on when we do the booking and our
// quota/booking time framw
export const getNextOccurence = ({ today = DateTime.now(), weekDay }) => {
  return getNextOccurenceRaw({ today, weekDay }).toFormat("dd.MM.yyyy");
};

export const getNextOccurenceRaw = ({ today = DateTime.now(), weekDay }) => {
  const weekDayToday = today.weekday - 1; // make it zero-based
  const weekDayNext = Info.weekdays().indexOf(weekDay);
  const nextWeekDayIsInDays =
    weekDayToday === weekDayNext ? 7 : (7 - weekDayToday + weekDayNext) % 7;
  //   console.log(weekDayToday, weekDayNext, nextWeekDayIsInDays);
  const nextOccurence = today.plus({ days: nextWeekDayIsInDays });
  return nextOccurence;
};
