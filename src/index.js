import config from "../config.js";

import authenticate from "./asimut/authenticate.js";
import bookRoom from "./asimut/bookRoom.js";
import { getNextOccurence } from "./getNextOccurence.js";
import sendTelegramMessage from "./telegram/sendMessage.js";

await authenticate({
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
});

const makeTelegramMessage = (booking, result) => {
  const { roomName, weekDay, starttime, endtime } = booking;
  const nextOccurence = getNextOccurence({ weekDay });

  const successful = result[0].class === "message-success";
  const title = `*${roomName}* on *${weekDay}* (${nextOccurence} ${starttime}-${endtime})`;
  const successMessage = `- ✅ I booked ${title} for you.`;
  const errorMessage = `- ❌ I failed to book ${title} for you.`;

  return successful ? successMessage : errorMessage;
};

const messages = await Promise.all(
  config.bookings.map(async (booking) => {
    const result = await bookRoom(booking);
    return makeTelegramMessage(booking, result);
  })
);

await sendTelegramMessage(`Attempting to book your rooms 😏

${messages.join("\n")}`);

// For the logs:
console.log(`[${new Date().toLocaleString()}] Script ran successfully`);
