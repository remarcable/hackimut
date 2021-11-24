import { DateTime } from "luxon";
import { getNextOccurence } from "./getNextOccurence.js";

it.each([
  ["24.11.2021", "Monday", "29.11.2021"],
  ["24.11.2021", "Tuesday", "30.11.2021"],
  ["24.11.2021", "Wednesday", "01.12.2021"],
  ["24.11.2021", "Thursday", "25.11.2021"],
  ["24.11.2021", "Friday", "26.11.2021"],
  ["24.11.2021", "Saturday", "27.11.2021"],
  ["24.11.2021", "Sunday", "28.11.2021"],

  ["05.12.2021", "Monday", "06.12.2021"],
  ["05.12.2021", "Tuesday", "07.12.2021"],
  ["05.12.2021", "Wednesday", "08.12.2021"],
  ["05.12.2021", "Thursday", "09.12.2021"],
  ["05.12.2021", "Friday", "10.12.2021"],
  ["05.12.2021", "Saturday", "11.12.2021"],
  ["05.12.2021", "Sunday", "12.12.2021"],
])(
  "returns the correct next date for %s-%s",
  (startDate, weekDay, expected) => {
    const today = DateTime.fromFormat(startDate, "dd.MM.yyyy");

    const next = getNextOccurence({ today, weekDay });
    expect(next).toBe(expected);
  }
);
