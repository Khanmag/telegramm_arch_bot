const TelegramAPI = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./options')

const token = '5905279527:AAEhEaP-4tGPzkW-RQ0bB_NoqqCYtMoMBOY'

const bot = new TelegramAPI(token, {polling: true})




const chats = {}

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Number in range 0 ... 9`)
    const randomNum = Math.floor(Math.random() * 10)
    chats[chatId] = randomNum
    await bot.sendMessage(chatId, 'guess!', gameOptions)
}


const start = async () => {
    await bot.setMyCommands([
        {command: '/start', description: 'Start'},
        {command: '/info', description: 'About you'},
        {command: '/game', description: 'Game'},
    ])



    bot.on('message', async (msg) => {
        const text = msg.text;
        const chatId = msg.chat.id
        console.log(msg)
        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://tlgrm.eu/_/stickers/ccd/a8d/ccda8d5d-d492-4393-8bb7-e33f77c24907/1.webp')
            return bot.sendMessage(chatId, `Glad to see you`)
        }
        // bot.sendMessage(chatId, `you send me "${text}"` )
        if (text === '/info') {
            return bot.sendMessage(chatId, `id: ${msg.from.id}\nname: ${msg.from.first_name}\nlogin: ${msg.from.username}`)
        }
        if (text === '/game') {
            return startGame(chatId)
        }
        return bot.sendMessage(chatId, `I don't understand you..(`)
    })

    bot.on('callback_query', msg => {
        const data = msg.data
        const chatId = msg.message.chat.id
        if (data === '/again') {
            return startGame(chatId)
        }
        // bot.sendMessage(chatId, chats[chatId],)
        if (data == chats[chatId]) {
            return bot.sendMessage(chatId, `you choose number ${data} and you win ${chats[chatId]}`, againOptions)
        }
        else {
            return bot.sendMessage(chatId, `you choose number ${data} and you lose ${chats[chatId]}`, againOptions)
        }


    })
}
start()