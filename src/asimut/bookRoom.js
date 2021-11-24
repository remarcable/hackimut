import fetch from "../fetch.js";
import { getNextOccurence } from "../getNextOccurence.js";
import config from "../../config.js";

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

export default async function bookRoom(booking) {
  const event = {
    ...eventTemplate,
    ...config.rooms[booking.roomName],
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

  return result.json();
}
