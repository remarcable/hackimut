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
  - Use Asimut in your browser and create a booking for each room you want to later use. Write down the payload in the network request that is made after you create a booking.
  - In the `bookings` object add all the bookings that should be created automatically. `roomName` should reference the key for the room you created earlier.

This is all you need to automatically create bookings on Asimut. The real benefit of using this project is to let it run automatically at a specified interval:

- [Recommended] Put this script on a server that is running 24/7. Use cronjobs to repeatedly execute this script.
