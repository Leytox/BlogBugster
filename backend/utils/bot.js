import TelegramBot from "node-telegram-bot-api";
import User from "../models/user.model.js";
import dotenv from "dotenv";

dotenv.config();
const token = process.env.TELEGRAM_BOT_API;
const bot = new TelegramBot(token, { polling: true });

bot.onText(/^\/start$/, async function (msg) {
  await bot.sendMessage(msg.chat.id, "Please share your email to verify");
});

bot.on("text", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text.trim();

  // Check if the message is not a /start command and is a valid email
  if (text !== "/start" && isValidEmail(text)) {
    try {
      let user = await User.findOne({ email: text }, null, null);
      if (!user) {
        await bot.sendMessage(chatId, "No user found with this email.");
        return;
      }

      if (user.isActivated) {
        await bot.sendMessage(chatId, "Email already verified.");
        return;
      }

      await bot.sendMessage(
        chatId,
        `Here is your verification code: ||${user.activationCode}||`,
        { parse_mode: "MarkdownV2" },
      );
    } catch (error) {
      console.error(error);
      await bot.sendMessage(
        chatId,
        "An error occurred while verifying the email.",
      );
    }
  } else if (text !== "/start") {
    await bot.sendMessage(chatId, "Please enter a valid email address.");
  }
});

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export default bot;
