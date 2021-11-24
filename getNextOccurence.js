import { DateTime, Info } from "luxon";

export const getNextOccurence = ({ today = DateTime.now(), weekDay }) => {
  const weekDayToday = today.weekday - 1; // make it zero-based
  const weekDayNext = Info.weekdays().indexOf(weekDay);
  const nextWeekDayIsInDays =
    weekDayToday === weekDayNext ? 7 : (7 - weekDayToday + weekDayNext) % 7;
  //   console.log(weekDayToday, weekDayNext, nextWeekDayIsInDays);
  const nextOccurence = today.plus({ days: nextWeekDayIsInDays });
  return nextOccurence.toFormat("dd.MM.yyyy");
};
