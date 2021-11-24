import TelegramBot from "node-telegram-bot-api";

const telegramApiKey = process.env.TELEGRAM_API_KEY;
const telegramChatId = process.env.TELEGRAM_CHAT_ID;

export default async function sendMessage(message) {
  const bot = new TelegramBot(telegramApiKey, { polling: false });
  try {
    await bot.sendMessage(telegramChatId, message, {
      parse_mode: "Markdown",
    });
  } catch (err) {
    console.log(
      "Something went wrong when trying to send a Telegram notification",
      err
    );
  }
}
