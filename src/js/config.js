export default {
    "language" : "en-US",
    "allowLandscapeMode" : true,
    "useAtlases" : false,

    "attackTypes" : {
        "shield": ['attack1', 'attack2', 'attackShield', 'attackClose'] //attackType 1,2,3,4
    },

    "attackData" : {
        "shield" : //attacks of shield-wearer + 1h weapon
            [{
                //'attack1'
                minX: 90, maxX: 150, //reach from the body position
                resolveTime: 160, //milliseconds to resolve the attack from the start
            },
            {
                //'attack2'
                minX: 80, maxX: 140,
                resolveTime: 160,
            },
            {
                //'attackShield'
                minX: 100, maxX: 155,
                resolveTime: 160,
                advance: 7, //advance speed until resolved
                dmgMultiplier: 0,
                effect: 'break defense'
            },
            {
                //'attackClose'
                minX: 50, maxX: 125,
                resolveTime: 160,
            }]
    },


}
