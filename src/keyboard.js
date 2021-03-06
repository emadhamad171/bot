const kb = require('./keyboard-buttons')
module.exports = {
    home: [
        [kb.home.price],
        [kb.home.order]
    ],
    gadgets: [
        [kb.gadgets.aPods, kb.gadgets.aWatch],
        [kb.gadgets.iPhone],
        [kb.back]
    ],
    quantity: [
        [kb.quantity.fivePlus, kb.quantity.fiftyPlus, kb.quantity.tenPlus],
        [kb.quantity.oneHundredPlus],
        [kb.back]

    ],
    gadgetsOrder: [
        [kb.gadgetsOrder.aPods, kb.gadgetsOrder.aWatch],
        [kb.gadgetsOrder.iPhone],
        [kb.back]
    ],
    modifications: [
        [kb.modifications.pro128],
        [kb.modifications.pro256],
        [kb.modifications.pro512],
        [kb.modifications.proMax128],
        [kb.modifications.proMax256],
        [kb.modifications.proMax512],
        [kb.back]

    ],
    color: [
        [kb.color.blueP],
        [kb.color.goldP],
        [kb.color.greyP],
        [kb.color.silverP],
        [kb.back]

    ],
    sizes: [
        [kb.sizes.small],
        [kb.sizes.medium],
        [kb.sizes.large],
        [kb.sizes.xLarge],
        [kb.back]


    ],
    confirm: [
        [kb.confirm.conf],
        [kb.confirm.cont],
        [kb.confirm.canc],

    ],
    seriesSmall: [
        [kb.seriesSmall.gpsCellularThree],
        [kb.seriesSmall.gpsThree],
        [kb.back]


    ],
    seriesMedium: [
        [kb.seriesMedium.nikeGpsSix],
        [kb.seriesMedium.gpsCellurarSix],
        [kb.seriesMedium.gpsSix],
        [kb.seriesMedium.seGps],
        [kb.back]

    ],
    seriesLarge: [
        [kb.seriesLarge.gpsThree],
        [kb.back]

    ],
    headPhoneModels: [
        [kb.headPhoneModels.airTwo],
        [kb.headPhoneModels.airTwoWir],
        [kb.headPhoneModels.airPro],
        [kb.headPhoneModels.maxBlue],
        [kb.headPhoneModels.maxGreen],
        [kb.headPhoneModels.maxSg],
        [kb.headPhoneModels.maxSlv],


    ],
    seriesXLarge: [
        [kb.seriesXLarge.nikeGpsCellularSix],
        [kb.seriesXLarge.nikeGpsSix],
        [kb.seriesXLarge.gpsCellularSix],
        [kb.seriesXLarge.gpsSix],
        [kb.seriesXLarge.seGps],
        [kb.seriesXLarge.gpsFive],
        [kb.back]

    ],

    smallColor: {
        smallGpsCellular: [
            [kb.color.space],
            [kb.back]

        ],
        smallGps: [
            [kb.color.silver],
            [kb.back]

        ]
    },
    mediumColor: {
        nikeGpsSix: [
            [kb.color.space],
            [kb.color.silver],
            [kb.back]

        ],
        gpsCellurarSix: [
            [kb.color.space],
            [kb.color.silver],
            [kb.color.blueW],
            [kb.color.gold],
            [kb.color.silverS],
            [kb.color.grey],
            [kb.back]

        ],
        gpsSix: [
            [kb.color.silver],
            [kb.back]

        ],
        seGps: [
            [kb.color.space],
            [kb.color.gold],
            [kb.color.silver],
            [kb.back]
        ]

    },
    largeColor: [
        [kb.color.space],
        [kb.back]

    ],
    xLargeColor: {
        nikeGpsCellularSix: [
            [kb.color.space],
            [kb.color.silver],
        ],
        nikeGpsSix: [
            [kb.color.space],
            [kb.color.silver],
        ],
        gpsCellularSix: [
            [kb.color.space],
            [kb.color.gold],
            [kb.color.blueW],
            [kb.color.red],
            [kb.back]

        ],
        gpsSix: [
            [kb.color.silver],
            [kb.color.blueW],
            [kb.back]

        ],
        seGps: [
            [kb.color.space],
            [kb.back]

        ],
        gpsFive: [
            [kb.color.silver],
            [kb.color.gold],
            [kb.back]

        ]
    }


}
