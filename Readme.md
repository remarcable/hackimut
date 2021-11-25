# Hackimut

Automatic room booking for Asimut. Get notified about your booking status with Telegram.

## Getting started

- Clone the repository

```sh
$ git clone git@github.com:remarcable/hackimut.git
$ cd ./hackimut
$ npm i
```

- Copy `.env.sample` to `.env` and update the url and the credentials. [Create a new telegram bot](https://core.telegram.org/bots/api) and paste the API token. Use [@RawDataBot](https://t.me/RawDataBot) to retrieve your own `chatId` (`message.chat.id`) and add it to `.env` as well. You need it to send messages to yourself.
- Copy `config.sample.js` to `config.js` and update the file with your rooms and your desired bookings.
  - Edit `src/asimut/getRooms.js` with your roomGroupId (see the payload in the devtools network tab to `async-event.php` for the rooms you want to book). Execute `npm run getrooms` and copy/paste them into your config. Sort them by booking priority (the script will try to book the rooms in this order by availability).
  - In the `bookings` object add all the bookings that should be created automatically.

This is all you need to automatically create bookings on Asimut. The real benefit of using this project is to let it run automatically at a specified interval:

- [Recommended] Put this script on a server that is running 24/7. Use cronjobs to repeatedly execute this script.
