const bookings = [
  {
    roomName: "K02",
    weekDay: "Monday",
    starttime: "14:10",
    endtime: "16:00",
  },
  // ...
];

const rooms = {
  K02: {
    "location-id": 50,
    location: "Lie-R02 (Überaum)",
    category: 51,
  },
  // ...
};

export default {
  bookings,
  rooms,
};
