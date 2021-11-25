import cheerio from "cheerio";
import fetch from "../fetch.js";

import authenticate from "./authenticate.js";

await authenticate({
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
});

// Execute this with `npm run getrooms` to get a list of all rooms
// with their respective ids. They will be used as a prioritized
// list to always get the best room possible
const BASE_URL = process.env.ASIMUT_BASE_URL;
async function getRooms(roomGroupId) {
  const res = await fetch(
    `${BASE_URL}/public/index.php?dato=20211126&akt=visgruppe&id=${roomGroupId}`
  );

  const html = await res.text();
  const $ = cheerio.load(html);
  const rooms = $("#function-span .chart-row .event-location")
    .toArray()
    .map((el) => ({
      title: el.attribs.title,
      roomId: el.attribs.rel,
    }));

  return rooms;
}

const roomGroupId = 7;
console.log(await getRooms(roomGroupId));
