export default {
    "language" : "en-US",

    'excludeAnimCopies' : [ //which anims exclude from being copied?
        ['All',  'Win', 'Upgrade'], //first index is hero name. Next are animation names to be excluded
        ['Skeleton', 'LowHealth'], ['Giant', 'LowHealth'], ['Berserker', 'LowHealth'], ['Bomber', 'LowHealth'], 
        ['Goblin', 'LowHealth'], ['Naga', 'LowHealth']

    ],
    'copyFrom' : { //priority: indexes of sharedAnimNames to copy animations from
      'Skeleton' : [1, 0, 2],
    },

    "allowLandscapeMode" : true,
    "useAtlases" : false,

    "enemyBackColor" : 0x993300,
    "playerBackColor" : 0x004488,


}
