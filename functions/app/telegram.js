const TelegramBot = require('node-telegram-bot-api');
const functions = require('firebase-functions');

const bot = new TelegramBot(functions.config().telegram.token, { polling: true });

bot.on('polling_error', (err) => {
  console.log(err);
})

module.exports = {
  bot
}
