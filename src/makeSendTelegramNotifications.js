import TelegramBot from "node-telegram-bot-api";

export default function makeSendTelegramNotifications({ apiKey, chatId }) {
  const bot = new TelegramBot(apiKey, { polling: false });
  return async (message) => {
    try {
      await bot.sendMessage(chatId, message, {
        parse_mode: "Markdown",
      });
    } catch (err) {
      console.log(
        "Something went wrong when trying to send a Telegram notification",
        err
      );
    }
  };
}
