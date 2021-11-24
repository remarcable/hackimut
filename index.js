import { config as dotenvConfig } from "dotenv";
import fetch from "./fetch.js";

import authenticate from "./authenticate.js";
import { getNextOccurence } from "./getNextOccurence.js";

dotenvConfig();

await authenticate({
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
});

// const currentBookings = getCurrentBookings();
// const quota = getQuota();

const ROOMS = {
  K02: {
    "location-id": 50,
    location: "Lie-R02 (Überaum)",
    category: 51,
  },
  R207: {
    "location-id": 58,
    location: "Lie-R207 (Klavier - LA/KPA)",
    category: 51,
  },
};
const wantedBookings = [
  {
    roomName: "K02",
    weekDay: "Sunday",
    starttime: "14:10",
    endtime: "16:00",
  },
  {
    roomName: "K02",
    weekDay: "Thursday",
    starttime: "10:00",
    endtime: "10:50",
  },
  {
    roomName: "207",
    weekDay: "Thursday",
    starttime: "13:10",
    endtime: "14:10",
  },
  {
    roomName: "K02",
    weekDay: "Thursday",
    starttime: "16:15",
    endtime: "17:00",
  },
];

const eventTemplate = {
  "event-id": "0",
  date: "27.11.2021",
  starttime: "14:40",
  endtime: "15:10",
  description: "",
  participants: "",
  action: "save",
};

const attemptBooking = async (booking) => {
  const event = {
    ...eventTemplate,
    ...ROOMS[booking.roomName],
    date: getNextOccurence({ weekDay: booking.weekDay }),
    starttime: booking.starttime,
    endtime: booking.endtime,
  };

  return fetch("https://udk-berlin.asimut.net/public/async-event.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(event),
  });
};

console.log(await (await attemptBooking(wantedBookings[0])).text());
