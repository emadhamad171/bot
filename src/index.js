process.env.NTBA_FIX_319 = 1;


const helper = require('./helpers')
const kb = require("./keyboard-buttons")
const keyboard = require('./keyboard')
const {getSumAirPods} = require("./functions");
const {sendToATableAirPods} = require("./functions");
const {replyChooseColorForSmall} = require("./functions");
const {replyChooseColorForMed} = require("./functions");
const {replyChooseColorForLarge} = require("./functions");
const {replyChooseColorForXLarge} = require("./functions");
const {getSumWatch} = require("./functions");
const {sendToATableWatch} = require("./functions");
const {replyChooseModel} = require("./functions");
const {checkAccess} = require("./functions");
const {getSum} = require("./functions");
const {sendToATable} = require("./functions");
const {getPrices} = require("./functions");
const {bot} = require('./config')
helper.logStart()

let valueMod = Object.values(kb.modifications)
let colorAr = Object.values(kb.color)
let appleSizes = Object.values(kb.sizes)
let appleSmall = Object.values(kb.seriesSmall)
let appleMiddle = Object.values(kb.seriesMedium)
let appleLarge = Object.values(kb.seriesLarge)
let appleXLarge = Object.values(kb.seriesXLarge)
let airPodModel = Object.values(kb.headPhoneModels)


const order = {
    gadgets: [],
}

const watchConfig = {
    model: "",
    generation: "",
    color: "",
    quantity: 0,
    id: "",
    username: "",
    userId: "",
    size: "",
    type: ""

}
let validatorWatch = {
    set: function (obj, prop, value) {
        if (prop === "size") {
            obj.type = "watch"
        }
        if (prop === "generation") {
            obj.type = "phone"
        }
        if (prop === "quantity") {
            if (!Number.isInteger(+value) || +value < 5) {
                throw new TypeError("this is not a number")
            }
            obj[prop] = value
        }
        obj[prop] = value
    }

}
let configProxy = new Proxy(watchConfig, validatorWatch)

function WatchConf(model, generation, color, quantity, size, id, username, userId) {
    this.generation = generation
    this.model = model
    this.color = color
    this.quantity = quantity
    this.id = id
    this.username = username
    this.userId = userId
    this.size = size

}

bot.on("polling_error", (err) => console.log(err));

bot.on('message', msg => {
    const chatId = helper.getChatId(msg)
    if (appleSizes.includes(msg.text)) {
        replyChooseModel(msg.text, chatId)
        configProxy.size = msg.text
    }
    if (airPodModel.includes(msg.text)) {
        configProxy.model = msg.text
    }
    if (appleXLarge.includes(msg.text)) {
        replyChooseColorForXLarge(msg.text, chatId)
        configProxy.model = msg.text
    }
    if (appleLarge.includes(msg.text)) {
        replyChooseColorForLarge(msg.text, chatId)
        configProxy.model = msg.text
    }
    if (appleMiddle.includes(msg.text)) {
        replyChooseColorForMed(msg.text, chatId)
        configProxy.model = msg.text
    }
    if (appleSmall.includes(msg.text)) {
        replyChooseColorForSmall(msg.text, chatId)
        configProxy.model = msg.text

    }
    if (valueMod.includes(msg.text)) {
        bot.sendMessage(chatId, `Выберете цвет:`, {
            reply_markup: {
                keyboard: keyboard.color,
                one_time_keyboard: true
            },

        })
        configProxy.generation = msg.text
        return
    }
    if (colorAr.includes(msg.text) || airPodModel.includes(msg.text)) {
        bot.sendMessage(chatId, `Введите количество, убедитесь что вы вводите число, иначе ваш заказ нельзя будет обработать`,
            {reply_markup: JSON.stringify({force_reply: true})})
            .then((rep) => {
                bot.onReplyToMessage(chatId, rep.message_id, reply => {
                    try {
                        configProxy.quantity = reply.text
                        bot.sendMessage(chatId, `Что делаем дальше ?`, {
                            reply_markup: {
                                keyboard: keyboard.confirm,
                                one_time_keyboard: true
                            }
                        })
                    } catch (e) {
                        order.gadgets = []
                        bot.sendMessage(chatId, `Вы ввели не число или число меньше 5, повторите процедуру повторно \u{274C}`, {
                            reply_markup: {
                                keyboard: keyboard.gadgetsOrder
                            }
                        })
                    }


                })
            })
        configProxy.color = msg.text
        configProxy.userId = msg.from.id
        configProxy.username = msg.from.first_name
    }
    switch (msg.text) {
        case kb.home.price:
            bot.sendMessage(chatId, `Выберете товар \u{1F4C2}:`, {
                reply_markup: {
                    keyboard: keyboard.gadgets,
                    resize_keyboard: true
                }
            })
            break
        case kb.confirm.cont:

            const co = new WatchConf(configProxy.model, configProxy.generation, configProxy.color, configProxy.quantity, configProxy.size, configProxy.id, configProxy.username, configProxy.userId)
            order.gadgets.push(co)

            if (configProxy.type === 'watch') {
                bot.sendMessage(chatId, `Выберете товар \u{1F4C2}:`, {
                    reply_markup: {
                        keyboard: keyboard.sizes,
                        resize_keyboard: true
                    }
                })
            }
            if (configProxy.type === "phone") {
                bot.sendMessage(chatId, `Выберете товар \u{1F4C2}:`, {
                    reply_markup: {
                        keyboard: keyboard.modifications,
                        resize_keyboard: true
                    }
                })
            } else {
                bot.sendMessage(chatId, `Выберете товар \u{1F4C2}:`, {
                    reply_markup: {
                        keyboard: keyboard.headPhoneModels,
                        resize_keyboard: true
                    }
                })
            }

            break
        case kb.confirm.conf:
            const cos = new WatchConf(configProxy.model, configProxy.generation, configProxy.color, configProxy.quantity, configProxy.size, configProxy.id, configProxy.username, configProxy.userId)
            order.gadgets.push(cos)
            if (configProxy.type === 'watch') {
                bot.sendMessage(chatId, `Заказ отправлен \u{2705}`)
                const desc =
                    `<b>Your order \u{1F4DC}:</b>
${order.gadgets.map(row => {
                        return `\u{1F1FA}\u{1F1F8}\n модель:<b>${row.model} - ${row.color}, количество: ${row.quantity} </b>`
                    }).join('\n')}`

                sendToATableWatch(order).then(async (res) => {
                    getSumWatch(order).then((sum) => {
                        bot.sendMessage(chatId, `Ваш заказ оформлен ${desc},\n сумма: ${sum} $`, {
                            parse_mode: "HTML",
                            reply_markup: {
                                keyboard: keyboard.home
                            }
                        }).then(() => {
                            order.gadgets = []
                            configProxy.type = ''
                        })
                    })
                })
            }
            if (configProxy.color === configProxy.model) {
                bot.sendMessage(chatId, `Заказ отправлен \u{2705}`)
                const desc =
                    `<b>Your order \u{1F4DC}:</b>
${order.gadgets.map(row => {
                        return `\u{1F1FA}\u{1F1F8}\n модель:<b>${row.model}, количество: ${row.quantity} </b>`
                    }).join('\n')}`

                sendToATableAirPods(order).then(async (res) => {
                    getSumAirPods(order).then((sum) => {
                        bot.sendMessage(chatId, `Ваш заказ оформлен ${desc},\n сумма: ${sum} $`, {
                            parse_mode: "HTML",
                            reply_markup: {
                                keyboard: keyboard.home
                            }
                        }).then(() => {
                            order.gadgets = []
                        })
                    })
                })
            } if(configProxy.type === "phone") {
                bot.sendMessage(chatId, `Заказ отправлен \u{2705}`)
                const desc =
                    `<b>Your order \u{1F4DC}:</b>
${order.gadgets.map(row => {
                        return `\u{1F1FA}\u{1F1F8}\n модель:<b>${row.generation} - ${row.color}, количество: ${row.quantity} </b>`
                    }).join('\n')}`

                sendToATable(order).then(async (res) => {
                    getSum(order).then((sum) => {
                        bot.sendMessage(chatId, `Ваш заказ оформлен ${desc},\n сумма: ${sum} $`, {
                            parse_mode: "HTML",
                            reply_markup: {
                                keyboard: keyboard.home
                            }
                        }).then(() => {
                            order.gadgets = []
                            configProxy.generation = ''
                            configProxy.type = ''
                        })
                    })
                })
            }
            break
        case kb.confirm.canc:
            order.gadgets = []
            bot.sendMessage(chatId, `Заказ анулирован \u{2705}`, {
                reply_markup: {
                    keyboard: keyboard.gadgetsOrder
                }
            })
            break
        case kb.home.order:
            bot.sendMessage(chatId, `Выберете товар \u{1F4C2}:`, {
                reply_markup: {
                    keyboard: keyboard.gadgetsOrder,
                    resize_keyboard: true
                }
            })
            break
        case kb.gadgetsOrder.iPhone:
            bot.sendMessage(chatId, `Выберете модель с объемом памяти:`, {
                reply_markup: {
                    keyboard: keyboard.modifications,
                    resize_keyboard: true
                }
            })
            break

        case kb.gadgetsOrder.aWatch:
            bot.sendMessage(chatId, `Выберете размер модели:`, {
                reply_markup: {
                    keyboard: keyboard.sizes,
                    resize_keyboard: true
                }
            })
            break
        case kb.gadgetsOrder.aPods:
            bot.sendMessage(chatId, `Выберете модель:`, {
                reply_markup: {
                    keyboard: keyboard.headPhoneModels,
                    resize_keyboard: true
                }
            })
            break
        case kb.back:
            bot.sendMessage(chatId, `Ваш заказ был сброшен, что хотите \u{1F4C3}:`, {
                reply_markup: {
                    keyboard: keyboard.home
                }
            })
            order.gadgets = []
            configProxy = {}
            break

        case kb.gadgets.iPhone:
            bot.sendMessage(chatId, `Выберете количество:`, {
                reply_markup: {
                    keyboard: keyboard.quantity
                }
            })
            break
        case kb.quantity.fivePlus:
            getPrices(msg, 1)
            break
        case kb.quantity.tenPlus:
            getPrices(msg, 2)
            break
        case kb.quantity.fiftyPlus:
            getPrices(msg, 3)
            break
        case kb.quantity.oneHundredPlus:
            getPrices(msg, 4)
            break
        case kb.gadgets.aWatch:
            getPrices(msg, 6)
            break
        case kb.gadgets.aPods:
            getPrices(msg, 7)
            break
    }
})
bot.onText(/\/start/, async (msg) => {
    let res = await checkAccess(msg.from.id)
    if (res.length === 0) {
        const response1 = `К сожалению у вас нет доступа к этому боту`
        bot.sendMessage(helper.getChatId(msg), response1)
    } else {
        const response = `Приветствую ${msg.from.first_name}\n Выберете команду для начала работы`
        bot.sendMessage(helper.getChatId(msg), response, {
            reply_markup: {
                keyboard: keyboard.home
            }
        })
    }
})

bot.onText(/\/help (.+)/, (msg, [source, match]) => {
    bot.sendMessage(helper.getChatId(msg), debug(match))
})

module.exports = {
    bot
}