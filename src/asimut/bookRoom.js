import fetch from "../fetch.js";
import { getNextOccurence, getNextOccurenceRaw } from "../getNextOccurence.js";
import config from "../../config.js";
import { DateTime } from "luxon";
import { getState, saveState } from "../state.js";

const eventTemplate = {
  "event-id": "0",
  description: "",
  participants: "",
  action: "save",
  // will be filled with values below:
  // date: "27.11.2021",
  // starttime: "14:40",
  // endtime: "15:10",
};

const BASE_URL = process.env.ASIMUT_BASE_URL;
const url = `${BASE_URL}/public/async-event.php`;

const bookingToKey = ({ weekDay, starttime, endtime }) =>
  `${getNextOccurence({ weekDay })}-${starttime}-${endtime}`;

export default async function bookRoom(booking) {
  if (!(await canMakeBooking(booking))) {
    return { skip: true };
  }

  // Attempt to book rooms based on the priority list
  for (let i = 0; i < config.rooms.length; i++) {
    const currentRoom = config.rooms[i];
    const result = await bookSingleRoom(currentRoom, booking);

    if (result.success) {
      await saveSuccessfulBooking(booking);
      return { ...result, room: config.roomNames[i] };
    }
  }

  return { success: false, room: {} };
}

async function bookSingleRoom(room, booking) {
  const event = {
    ...eventTemplate,
    ...room,
    date: getNextOccurence({ weekDay: booking.weekDay }),
    starttime: booking.starttime,
    endtime: booking.endtime,
  };

  const result = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(event),
  });

  const resultJson = await result.json();
  const success = resultJson[0]?.class === "message-success";

  return { success, messages: resultJson };
}

const CAN_BOOK_DAYS_INTO_FUTURE = 4;
async function canMakeBooking(booking) {
  const bookingKey = bookingToKey(booking);
  const currentState = await getState();
  const bookingAlreadySuccessful =
    currentState.successfulBookings.includes(bookingKey);

  if (bookingAlreadySuccessful) {
    return false;
  }

  const nextOccurence = getNextOccurenceRaw({ weekDay: booking.weekDay });
  const canBookUntilDate = DateTime.now().plus({
    days: CAN_BOOK_DAYS_INTO_FUTURE,
  });
  const bookingIsTooFarInTheFuture =
    nextOccurence.diff(canBookUntilDate).valueOf() > 0;

  if (bookingIsTooFarInTheFuture) {
    return false;
  }

  return true;
}

async function saveSuccessfulBooking(booking) {
  const bookingKey = bookingToKey(booking);
  const currentState = await getState();
  await saveState({
    ...currentState,
    successfulBookings: [...currentState.successfulBookings, bookingKey],
  });
}
