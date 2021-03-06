
const TOKEN = "1627435312:AAEizLZc4Y0ObS5GC5GjlthlbhmBSTJImOk"

const TelegramBot = require('node-telegram-bot-api')

const bot = new TelegramBot(TOKEN, {
     polling: true,
})
module.exports = {
     bot
}