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

export default async function bookRoom(booking) {
  const event = {
    ...eventTemplate,
    ...config.rooms[booking.roomName],
    date: getNextOccurence({ weekDay: booking.weekDay }),
    starttime: booking.starttime,
    endtime: booking.endtime,
  };

  const url = "https://udk-berlin.asimut.net/public/async-event.php";
  const result = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(event),
  });

  return result.json();
}
