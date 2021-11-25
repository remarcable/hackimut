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
  const { weekDay, starttime, endtime } = booking;
  const { room } = result;
  const nextOccurence = getNextOccurence({ weekDay });

  const title = `*${
    room.title ?? "something"
  }* on *${weekDay}* (${nextOccurence} ${starttime}-${endtime})`;
  const successMessage = `- ✅ I've booked ${title} for you, sir!`;
  const errorMessage = `- ❌ I attempted to book ${title} but failed :(`;

  return result.success ? successMessage : errorMessage;
};

const messages = await Promise.all(
  config.bookings.map(async (booking) => {
    const result = await bookRoom(booking);

    if (result.skip) {
      return null;
    }

    return makeTelegramMessage(booking, result);
  })
);

if (messages.filter((message) => !!message).length > 0) {
  await sendTelegramMessage(messages.join("\n"));
}

// For the logs:
console.log(`[${new Date().toLocaleString()}] Script ran successfully`);
