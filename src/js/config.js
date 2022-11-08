export default {
    "language" : "en-US",
    "allowLandscapeMode" : true,
    "useAtlases" : false,

    "attackTypes" : {
        "shield": ['attack1', 'attack2', 'attackShield', 'attackClose']
    },

    "attackData" : {
        "shield" : { //attacks of shield-wearer + 1h weapon
            "attack1" : {
                minX: 63, maxX: 120 //reach from the body position
            },
            "attack2" : {
                minX: 82, maxX: 145
            },
            "attackClose" : {
                minX: 62, maxX: 123
            },
            "attackShield" : {
                minX: 53, maxX: 100
            },
        }
    },

}
