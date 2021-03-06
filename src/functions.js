const GoogleSpreadsheet = require('google-spreadsheet')
const {promisify} = require('util')
const creds = require('../client_secret.json')
const helper = require('./helpers')
const {bot} = require('./config')
const token = '1gcRlstfsz8D5nzaw6ISaCQS_n1DDrtZt3wplP9GQGMs'
const kb = require("./keyboard-buttons")
const keyboard = require("./keyboard");

const getPrices = async (msg, numSpreadSheet) => {
    const doc = new GoogleSpreadsheet(token)
    await promisify(doc.useServiceAccountAuth)(creds)
    const info = await promisify(doc.getInfo)()
    const sheet = info.worksheets[numSpreadSheet]
    const rows = await promisify(sheet.getRows)({
        offset: 1
    })
    if (numSpreadSheet === 6) {
        let mid = Math.ceil(rows.length / 2)
        let parts = {
            left: rows.slice(0, mid),
            right: rows.slice(mid)
        };
        const title =
            `<b>Price from ${sheet.title}</b>
<i>Apple</i>
${rows.map(row => {
                return `\u{1F1FA}\u{1F1F8}\n <b>${row.name} - ${row.price} $</b>`
            }).join('\n')}`
        const next =
            `<b>Price from ${sheet.title}</b>
<i>Apple</i>
${parts.right.map(row => {
                return `\u{1F1FA}\u{1F1F8}\n <b>${row.name} - ${row.price} $</b>`
            }).join('\n')}`

        await bot.sendPhoto(helper.getChatId(msg), "./src/logo.jpg", {
            // caption: title,
            parse_mode: "HTML"

        })
        await bot.sendMessage(helper.getChatId(msg), title, {
            parse_mode: "HTML"

        })


    }
    const title =
        `<b>Price from ${sheet.title}</b>
<i>Apple</i>
${rows.map(row => {
            return `\u{1F1FA}\u{1F1F8}\n <b>${row.name} - ${row.price} $</b>`
        }).join('\n')}`

    await bot.sendPhoto(helper.getChatId(msg), "./src/logo.jpg", {
        caption: title,
        parse_mode: "HTML"

    })

}
const sendToATable = async (obj) => {
    const doc = new GoogleSpreadsheet(token)
    await promisify(doc.useServiceAccountAuth)(creds)
    const info = await promisify(doc.getInfo)()
    const shet = info.worksheets[8]
    obj.gadgets.map(async config => {
        await promisify(shet.addRow)(config)
    })


}

const allPromises = (arrayOfPricw) => {
    return Promise.all(arrayOfPricw).then(responses => {
        return responses.reduce((a, b) => {
            return a + b;
        })
    })
}
const getArrOfPricesForCombine = async (arrOfObj, sheet) => {
    let arrayOfPricw = await arrOfObj.gadgets.map(async (product) => {
        let qs = product.generation + " " + product.color
        convertor(qs, product)
        const row = await promisify(sheet.getRows)({
            query: `id = ${product.id}`
        })

        let rowPrice = +row[0].price
        let qua = +product.quantity
        return rowPrice * qua
    })
    return arrayOfPricw
}
const sendToATableWatch = async (obj) => {
    const doc = new GoogleSpreadsheet(token)
    await promisify(doc.useServiceAccountAuth)(creds)
    const info = await promisify(doc.getInfo)()
    const shet = info.worksheets[9]
    obj.gadgets.map(async config => {
        await promisify(shet.addRow)(config)
    })
}
const sendToATableAirPods = async (obj) => {
    const doc = new GoogleSpreadsheet(token)
    await promisify(doc.useServiceAccountAuth)(creds)
    const info = await promisify(doc.getInfo)()
    const shet = info.worksheets[10]
    obj.gadgets.map(async config => {
        await promisify(shet.addRow)(config)
    })
}
const getSumWatch = async (arr) => {
    const doc = new GoogleSpreadsheet(token)
    await promisify(doc.useServiceAccountAuth)(creds)
    const info = await promisify(doc.getInfo)()
    const shet = info.worksheets[6]
    return  await getArrOfPriceForWatchAir(arr, shet)

}
const getSumAirPods = async (arr)=> {
    const doc = new GoogleSpreadsheet(token)
    await promisify(doc.useServiceAccountAuth)(creds)
    const info = await promisify(doc.getInfo)()
    const shet = info.worksheets[7]
    return  await getArrOfPriceForAir(arr, shet)
}
const getArrOfPriceForWatchAir = async (arrOfObj, sheet) => {
    let arrayOfPricw = await arrOfObj.gadgets.map(async (product) => {
        let qs = `${product.model} ${product.color}`
        convertor(qs, product)
        const row = await promisify(sheet.getRows)({
            query: `id = ${product.id}`
        })
        let rowPrice = +row[0].price
        let qua = +product.quantity
        return rowPrice * qua
    })
    return allPromises(arrayOfPricw)
}
const getArrOfPriceForAir = async (arrOfObj, sheet) => {
    let arrayOfPricw = await arrOfObj.gadgets.map(async (product) => {
        let qs = `${product.model}`
        convertor(qs, product)
        const row = await promisify(sheet.getRows)({
            query: `id = ${product.id}`
        })
        let rowPrice = +row[0].price
        let qua = +product.quantity
        return rowPrice * qua
    })
    return allPromises(arrayOfPricw)
}
const priceForOne = async (config, sheet) => {
    let qs = config.generation + " " + config.color

    convertor(qs, config)
    const row = await promisify(sheet.getRows)({
        query: `id = ${config.id}`
    })
    let rowPrice = +row[0].price
    let qua = +config.quantity
    return rowPrice * qua
}

const getSum = async (arrOfObj) => {
    const doc = new GoogleSpreadsheet(token)
    await promisify(doc.useServiceAccountAuth)(creds)
    const info = await promisify(doc.getInfo)()
    let total = 0
    for (let i = 0; i < arrOfObj.gadgets.length; i++) {
        total = total + +arrOfObj.gadgets[i].quantity
    }
    if (arrOfObj.gadgets.length > 1) {

        if (total >= 5 && total < 10) {
            const sheet = info.worksheets[1]
            let arrayOfPricw = await getArrOfPricesForCombine(arrOfObj, sheet)

            return await allPromises(arrayOfPricw)
        }
        if (total >= 10 && total < 50) {
            const sheet = info.worksheets[2]
            let arrayOfPricw = await getArrOfPricesForCombine(arrOfObj, sheet)
            return await allPromises(arrayOfPricw)
        }
        if (total >= 50 && total < 100) {
            const sheet = info.worksheets[3]
            let arrayOfPricw = await getArrOfPricesForCombine(arrOfObj, sheet)
            return await allPromises(arrayOfPricw)
        }
        if (total >= 100) {
            const sheet = info.worksheets[4]
            let arrayOfPricw = await getArrOfPricesForCombine(arrOfObj, sheet)
            return await allPromises(arrayOfPricw)
        }


    } else {
        let pr = arrOfObj.gadgets[0]
        if (total >= 5 && total < 10) {
            const sheet = info.worksheets[1]
            return await priceForOne(pr, sheet)

        }

        if (total >= 10 && total < 50) {
            const sheet = info.worksheets[2]
            return await priceForOne(pr, sheet)

        }
        if (total >= 50 && total < 100) {
            const sheet = info.worksheets[3]
            return await priceForOne(pr, sheet)

        }
        if (total >= 100) {
            const sheet = info.worksheets[4]
            return await priceForOne(pr, sheet)

        }
    }


}
const checkAccess = async (userId) => {

    const doc = new GoogleSpreadsheet(token)
    await promisify(doc.useServiceAccountAuth)(creds)
    const info = await promisify(doc.getInfo)()
    const shet = info.worksheets[11]

    const row = await promisify(shet.getRows)({
        query: `id = ${userId}`
    })
    return row

}


const replyChooseModel = (msg, chatId) => {
    switch (msg) {
        case kb.sizes.small:
            bot.sendMessage(chatId, `Выберете доступную модель с данным размером:`, {
                reply_markup: {
                    keyboard: keyboard.seriesSmall,
                    resize_keyboard: true
                }
            })
            break
        case kb.sizes.medium:
            bot.sendMessage(chatId, `Выберете доступную модель с данным размером:`, {
                reply_markup: {
                    keyboard: keyboard.seriesMedium,
                    resize_keyboard: true
                }
            })
            break
        case kb.sizes.large:
            bot.sendMessage(chatId, `Выберете доступную модель с данным размером:`, {
                reply_markup: {
                    keyboard: keyboard.seriesLarge,
                    resize_keyboard: true
                }
            })
            break
        case kb.sizes.xLarge:
            bot.sendMessage(chatId, `Выберете доступную модель с данным размером:`, {
                reply_markup: {
                    keyboard: keyboard.seriesXLarge,
                    resize_keyboard: true
                }
            })
            break
    }

}
const replyChooseColorForSmall = (msg, chatId) => {
    switch (msg) {

        case kb.seriesSmall.gpsCellularThree:
            bot.sendMessage(chatId, `Выберете доступный цвет для выбранной модели:`, {
                reply_markup: {
                    keyboard: keyboard.smallColor.smallGpsCellular,
                    resize_keyboard: true
                }
            })
            break
        case kb.seriesSmall.gpsThree:
            bot.sendMessage(chatId, `Выберете доступный цвет для выбранной модели:`, {
                reply_markup: {
                    keyboard: keyboard.smallColor.smallGps,
                    resize_keyboard: true
                }
            })
            break



    }
}
const replyChooseColorForMed = (msg, chatId) => {
    switch (msg){
        case kb.seriesMedium.nikeGpsSix:
            bot.sendMessage(chatId, `Выберете доступный цвет для выбранной модели:`, {
                reply_markup: {
                    keyboard: keyboard.mediumColor.nikeGpsSix,
                    resize_keyboard: true
                }
            })
            break
        case kb.seriesMedium.gpsCellurarSix:
            bot.sendMessage(chatId, `Выберете доступный цвет для выбранной модели:`, {
                reply_markup: {
                    keyboard: keyboard.mediumColor.gpsCellurarSix,
                    resize_keyboard: true
                }
            })
            break
        case kb.seriesMedium.gpsSix:
            bot.sendMessage(chatId, `Выберете доступный цвет для выбранной модели:`, {
                reply_markup: {
                    keyboard: keyboard.mediumColor.gpsSix,
                    resize_keyboard: true
                }
            })
            break
        case kb.seriesMedium.seGps:
            bot.sendMessage(chatId, `Выберете доступный цвет для выбранной модели:`, {
                reply_markup: {
                    keyboard: keyboard.mediumColor.seGps,
                    resize_keyboard: true
                }
            })
            break
    }
}
const replyChooseColorForLarge = (msg, chatId) => {
    switch (msg) {
        case kb.seriesLarge.gpsThree:
            bot.sendMessage(chatId, `Выберете доступный цвет для выбранной модели:`, {
                reply_markup: {
                    keyboard: keyboard.largeColor,
                    resize_keyboard: true
                }
            })
            break
    }
}
const replyChooseColorForXLarge =(msg, chatId) => {
    switch (msg){
        case kb.seriesXLarge.nikeGpsCellularSix:
            bot.sendMessage(chatId, `Выберете доступный цвет для выбранной модели:`, {
                reply_markup: {
                    keyboard: keyboard.xLargeColor.nikeGpsCellularSix,
                    resize_keyboard: true
                }
            })
            break
        case kb.seriesXLarge.nikeGpsSix:
            bot.sendMessage(chatId, `Выберете доступный цвет для выбранной модели:`, {
                reply_markup: {
                    keyboard: keyboard.xLargeColor.nikeGpsSix,
                    resize_keyboard: true
                }
            })
            break
        case kb.seriesXLarge.gpsCellularSix:
            bot.sendMessage(chatId, `Выберете доступный цвет для выбранной модели:`, {
                reply_markup: {
                    keyboard: keyboard.xLargeColor.gpsCellularSix,
                    resize_keyboard: true
                }
            })
            break
        case kb.seriesXLarge.gpsSix:
            bot.sendMessage(chatId, `Выберете доступный цвет для выбранной модели:`, {
                reply_markup: {
                    keyboard: keyboard.xLargeColor.gpsSix,
                    resize_keyboard: true
                }
            })
            break
        case kb.seriesXLarge.gpsFive:
            bot.sendMessage(chatId, `Выберете доступный цвет для выбранной модели:`, {
                reply_markup: {
                    keyboard: keyboard.xLargeColor.gpsFive,
                    resize_keyboard: true
                }
            })
            break
        case kb.seriesXLarge.seGps:
            bot.sendMessage(chatId, `Выберете доступный цвет для выбранной модели:`, {
                reply_markup: {
                    keyboard: keyboard.xLargeColor.seGps,
                    resize_keyboard: true
                }
            })
            break
    }
}

const convertor = (conf, config) => {
    if (conf === "12 Pro 128GB Pacific Blue") {config.id = 1}
    if (conf === "12 Pro 128GB Gold") {config.id = 2}
    if (conf === "12 Pro 128GB Graphite") {config.id = 3}
    if (conf === "12 Pro 128GB Silver") {config.id = 4}
    if (conf === "12 Pro 256GB Pacific Blue") {config.id = 5}
    if (conf === "12 Pro 256GB Gold") {config.id = 6}
    if (conf === "12 Pro 256GB Graphite") {config.id = 7}
    if (conf === "12 Pro 256GB Silver") {config.id = 8}
    if (conf === "12 Pro 512GB Pacific Blue") {config.id = 9}
    if (conf === "12 Pro 512GB Gold") {config.id = 10}
    if (conf === "12 Pro 512GB Graphite") {config.id = 11}
    if (conf === "12 Pro 512GB Silver") {config.id = 12}
    if (conf === "12 Pro Max 128GB Pacific Blue") {config.id = 13}
    if (conf === "12 Pro Max 128GB Gold") {config.id = 14}
    if (conf === "12 Pro Max 128GB Graphite") {config.id = 15}
    if (conf === "12 Pro Max 128GB Silver") {config.id = 16}
    if (conf === "12 Pro Max 256GB Pacific Blue") {config.id = 17}
    if (conf === "12 Pro Max 256GB Gold") {config.id = 18}
    if (conf === "12 Pro Max 256GB Graphite") {config.id = 19}
    if (conf === "12 Pro Max 256GB Silver") {config.id = 20}
    if (conf === "12 Pro Max 512GB Pacific Blue") {config.id = 21}
    if (conf === "12 Pro Max 512GB Gold") {config.id = 22}
    if (conf === "12 Pro Max 512GB Graphite") {config.id = 23}
    if (conf === "12 Pro Max 512GB Silver") {config.id = 24}
    if (conf === "Watch Nike Series 6 GPS + Cellular, 44mm Aluminum Case Space Gray") {config.id = 25}
    if (conf === "Watch Nike Series 6 GPS + Cellular, 44mm Aluminum Case Silver") {config.id = 26}
    if (conf === "Watch Nike Series 6 GPS, 44mm Aluminum Case Space Gray") {config.id = 27}
    if (conf === "Watch Nike Series 6 GPS, 44mm Aluminum Case Silver") {config.id = 28}
    if (conf === "Watch Nike Series 6 GPS, 40mm Aluminum Case Space Gray"){config.id = 29}
    if (conf === "Watch Nike Series 6 GPS, 40mm Aluminum Case Silver") {config.id = 30}
    if (conf === "Watch Series 6 GPS, 44mm Aluminum Case Blue") {config.id = 31}
    if (conf === "Watch Series 6 GPS, 44mm Aluminum Case Silver") {config.id = 32}
    if (conf === "Watch SE GPS, 40mm Aluminum Case Space Gray") {config.id = 33}
    if (conf === "Watch SE GPS, 40mm Aluminum Case Gold") {config.id = 34}
    if (conf === "Watch SE GPS, 40mm Aluminum Case Silver") {config.id = 35}
    if (conf === "Watch SE GPS, 44mm Aluminum Case Space Gray") {config.id = 36}
    if (conf === "Watch Series 3 GPS + Cellular, 38mm Aluminum Case Space Gray"){config.id = 37}
    if (conf === "Watch Series 3 GPS, 38mm Aluminum Case Silver"){config.id = 38}
    if (conf === "Watch Series 3 GPS, 42mm Aluminum Case Space Gray") {config.id = 39}
    if (conf === "Watch Series 5 GPS, 44mm Aluminum Case Gold") {config.id = 40}
    if (conf === "Watch Series 5 GPS, 44mm Aluminum Case Silver") {config.id = 41}
    if (conf === "Watch Series 6 GPS + Cellular, 44mm Aluminum Case Space Gray") {config.id = 42}
    if (conf === "Watch Series 6 GPS + Cellular, 44mm Aluminum Case Blue") {config.id = 43}
    if (conf === "Watch Series 6 GPS + Cellular, 44mm Aluminum Case Gold") {config.id = 44}
    if (conf === "Watch Series 6 GPS + Cellular, 44mm Aluminum Case Red") {config.id = 45}
    if (conf === "Watch Series 6 GPS + Cellular, 40mm Aluminum Case Space Gray") {config.id = 46}
    if (conf === "Watch Series 6 GPS + Cellular, 40mm Aluminum Case Blue") {config.id = 47}
    if (conf === "Watch Series 6 GPS + Cellular, 40mm Aluminum Case Gold") {config.id = 48}
    if (conf === "Watch Series 6 GPS + Cellular, 40mm Aluminum Case Silver") {config.id = 49}
    if (conf === "Watch Series 6 GPS + Cellular, 40mm Stainless Steel Case Graphite") {config.id = 50}
    if (conf === "Watch Series 6 GPS + Cellular, 40mm Stainless Steel Case Silver") {config.id = 51}
    if (conf === "Watch Series 6 GPS, 40mm Aluminum Case Silver") {config.id = 52}
    if (conf === "Watch Series 6 GPS, 44mm Aluminum Case Blue") {config.id = 53}
    if (conf === "Watch Series 6 GPS, 44mm Aluminum Case Silver") {config.id = 54}
    if (conf === "AirPods 2") {config.id = 55}
    if (conf === "AirPods 2 Wireless") {config.id = 56}
    if (conf === "AirPods Pro") {config.id = 57}
    if (conf === "AirPods Max Space Gray") {config.id = 58}
    if (conf === "AirPods Max Silver") {config.id = 59}
    if (conf === "AirPods Max Green") {config.id = 60}
    if (conf === "AirPods Max Sky Blue") {config.id = 61}
    if (conf === "AirPods Max Pink") {config.id = 62}

}
module.exports = {
    getPrices,
    sendToATable,
    getSum,
    checkAccess,
    replyChooseModel,
    replyChooseColorForSmall,
    replyChooseColorForMed,
    replyChooseColorForLarge,
    replyChooseColorForXLarge,
    sendToATableWatch,
    getSumWatch,
    sendToATableAirPods,
    getSumAirPods
}