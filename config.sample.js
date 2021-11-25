const bookings = [
  {
    weekDay: "Monday",
    starttime: "14:10",
    endtime: "15:35",
  },
  // ...
];

// retrieve this array with `npm run getrooms` and sort it by your
// preference
const roomNames = [
  { title: "Lie-R02 (Überaum)", roomId: "50" },
  { title: "Lie-R03 (Überaum)", roomId: "422" },
  // ...
];

// You can get the category by creating a new booking and noting it from
// the request to `async-event.php`
const CATEGORY = 51;
const rooms = roomNames.map((room) => ({
  "location-id": room.roomId,
  category: CATEGORY,
}));

export default {
  bookings,
  rooms,
  roomNames,
};
