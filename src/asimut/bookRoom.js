import fetch from "../fetch.js";
import { getNextOccurence, getNextOccurenceRaw } from "../getNextOccurence.js";
import config from "../../config.js";
import { DateTime } from "luxon";
import { getState, saveState } from "../state.js";

const eventTemplate = {
  "event-id": "0",
  date: "27.11.2021",
  starttime: "14:40",
  endtime: "15:10",
  description: "",
  participants: "",
  action: "save",
};

const BASE_URL = process.env.ASIMUT_BASE_URL;
const url = `${BASE_URL}/public/async-event.php`;

const CAN_BOOK_DAYS_INTO_FUTURE = 4;

const bookingToKey = ({ roomName, weekDay, starttime, endtime }) =>
  `${roomName}-${weekDay}-${getNextOccurence({
    weekDay,
  })}-${starttime}-${endtime}`;

export default async function bookRoom(booking) {
  const event = {
    ...eventTemplate,
    ...config.rooms[booking.roomName],
    date: getNextOccurence({ weekDay: booking.weekDay }),
    starttime: booking.starttime,
    endtime: booking.endtime,
  };

  const bookingKey = bookingToKey(booking);
  const currentState = await getState();
  const bookingAlreadyMade =
    currentState.successfulBookings.includes(bookingKey);

  if (bookingAlreadyMade) {
    return {
      skip: true,
    };
  }

  const nextOccurence = getNextOccurenceRaw({ weekDay: booking.weekDay });
  const canBookUntilDate = DateTime.now().plus({
    days: CAN_BOOK_DAYS_INTO_FUTURE,
  });
  const bookingIsTooFarInTheFuture =
    nextOccurence.diff(canBookUntilDate).valueOf() > 0;

  if (bookingIsTooFarInTheFuture) {
    return {
      skip: true,
    };
  }

  const result = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(event),
  });

  const resultJson = await result.json();

  const successful = resultJson[0]?.class === "message-success";
  if (successful) {
    await saveState({
      ...currentState,
      successfulBookings: [...currentState.successfulBookings, bookingKey],
    });
  }

  return resultJson;
}
