import fetch from "./fetch.js";

import authenticate from "./authenticate.js";
import { getNextOccurence } from "./getNextOccurence.js";
import makeSendTelegramNotifications from "./makeSendTelegramNotifications.js";

const telegramApiKey = process.env.TELEGRAM_API_KEY;
const telegramChatId = process.env.TELEGRAM_CHAT_ID;

const sendTelegramNotification = makeSendTelegramNotifications({
  apiKey: telegramApiKey,
  chatId: telegramChatId,
});

await authenticate({
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
});

const ROOMS = {
  K02: {
    "location-id": 50,
    location: "Lie-R02 (Überaum)",
    category: 51,
  },
  206: {
    "location-id": 57,
    location: "Lie-R206",
    category: 51,
  },
};

const wantedBookings = [
  {
    roomName: "K02",
    weekDay: "Monday",
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
    roomName: "206",
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

  const result = await fetch(
    "https://udk-berlin.asimut.net/public/async-event.php",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(event),
    }
  );

  return result.json();
};

await sendTelegramNotification("Attempting new booking......");
const promises = wantedBookings.map(async (booking) => {
  const result = await attemptBooking(booking);
  const nextOccurence = getNextOccurence({ weekDay: booking.weekDay });

  const successful = result[0].class === "message-success";
  const title = `*${booking.roomName}* on *${booking.weekDay}* (${nextOccurence})`;
  const successMessage = `- ✅ I booked ${title} for you.`;
  const errorMessage = `- ❌ I failed to book ${title} for you. Use Asimut to learn more.`;

  await sendTelegramNotification(successful ? successMessage : errorMessage);
});

await Promise.all(promises);
await sendTelegramNotification("Done.");

console.log(`[${new Date().toLocaleString()}] Script ran successfully`);
