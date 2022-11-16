export default {
    "language" : "en-US",
    "allowDifferentOrientation" : true,
    "useAtlases" : false,
    "veryClose" : 40,

    "attackTypes" : {
        "shield": ['attack1', 'attack2', 'attackShield', 'attackClose'] //attackType 1,2,3,4
    },

    "attackData" : {
        "shield" : //attacks of shield-wearer + 1h weapon
            [{
                //'attack1'
                minX: 100, maxX: 145, //reach from the body position
                resolveTime: 160, //milliseconds to resolve the attack from the start
                advance: 44,
                hitType: 1, //which hit animation?
            },
            {
                //'attack2'
                minX: 90, maxX: 140,
                resolveTime: 160,
                advance: 44,
                hitType: 2,
            },
            {
                //'attackShield'
                minX: 100, maxX: 155,
                resolveTime: 160,
                advance: 30,
                dmgMultiplier: 0,
                effect: 'break defense',
                hitType: [3, 4]
            },
            {
                //'attackClose'
                minX: 50, maxX: 125,
                resolveTime: 160,
                advance: 0,
                hitType: 1,
            }]
    },

    "hitTypes" : ['hit1', 'hit2', 'hitShield1', 'hitShield2', 'death1', 'death2'],

    "sparkTypes": {
        'block' : {
            number: 20,
            tint: 0x000000,
            scaleX: 0.5,
            scaleY: 2,
            length: [50, 60],
            alpha: [0.8, 0.1],
            duration: 200,
        },
        'bash' : {
            number: 20,
            //tint: 0x000000,
            scaleX: 1,
            scaleY: 1,
            length: [30, 50],
            alpha: [1, 0.8],
            duration: 200,
        }
    }

}
