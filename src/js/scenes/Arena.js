
export default class Arena extends Phaser.Scene {
    constructor () {
        super({ key: 'Arena' });
    }

    preload() {
        console.log('preload arena');
        //this.load.setPath('../../assets/images/');
        //this.load.image('player', 'player.png');
        this.load.setPath('../../assets/spine/');
        var spLoader = this.load.spine('warrior', 'Mixtec_warriors.json', 'Mixtec_warriors.atlas');
        this.spData = spLoader.systems.spine.json.entries;
        console.log(this.spData);
        //console.log(this.spData.entries['warrior']);
        ////this.load.spine('mixtecWarrior', 'stretchyman-pro.json', [ 'stretchyman-pma.atlas' ], true);
        //this.load.spine('goblin', 'goblins.json', ['goblins.atlas'], true);

        //update spine json:
        //https://www.visionaire-studio.net/forum/thread/using-dragonbones-pro-free-software-to-create-bone-animations-for-visionaire-5/
        //"skins":{"default":
        //-->
        //"skins":[{"name":"default","attachments":
        //and
        //},"animations":
        //-->
        //}],"animations":
    }

    create() {
        console.log('create arena');
        //console.log(this.spData.entries['warrior']);
        //this.upgradeSpineData('warrior')
        //this.upgradeAllSpineData();
        //var mar = this.add.image(200, 400, 'player');
        var warrior = this.addUpgraded(400, 600, 'warrior', 'walk', false); //this.add.spine(400, 600, 'warrior', 'walk');
        //var warrior2 = this.add.spine(800, 600, 'warrior', 'block1', false);
        //warrior2.setScale(-1, 1);
        //console.log(warrior2.state);
        //warrior2.setAttachment('weapon1','weapon1'); //slotName, attachmentName
        //warrior2.play('block2', false, false) //name, loop, ignoreIfPlaying
        //warrior2.setMix('block1','walk', 0.9);
        //warrior.setMix('walk','block1', 0.5);
        warrior.play('death2', false, false);
        /*
        var qu = ['walk', 'walk', 'attack1', 'block1', 'attack2', 'hit1', 'block2', 'death2']
        var i = 0;
        //qu.forEach(() => {warrior.setEmptyAnimation(i++, i*1);});
        qu.forEach(name => {warrior.setAnimation(i++, name);});
        */
        //console.log(warrior.state);
        //warrior2.setAnimation(0, 'walk'); warrior2.setAnimation(1, 'attack1'); warrior2.setAnimation(2, 'hit1'); warrior2.setAnimation(3, 'death2');
    }

    addUpgraded(x, y, name, anim, loop = false) {
        this.upgradeSpineData(name);
        return this.add.spine(x, y, name, anim, loop);
    }

    upgradeSpineData(skeletonName) {
        //upgrade skin data structure exported for older spine version
        //call in create(), after loading and before adding to scene
        if (!this.upgradeSpineSkins(skeletonName)) return;
        this.upgradeSpineCurves(skeletonName);
    }

    upgradeSpineSkins(skeletonName) {
        //upgrade skins data structure
        var skins, skinsNew;
        skins = this.spData.entries[skeletonName].skins;
        if (skins[0]) {
            console.warn(skeletonName + ' already upgraded');
            return 0;
        }
        skinsNew = [
            {"name":"default","attachments": skins['default']}
        ]
        this.spData.entries[skeletonName].skins = skinsNew;
        return 1;
    }

    upgradeSpineCurves(skeletonName) {
        //upgrade the data structure of animation curves 
        //console.log('upgradeSpineCurves '+ skeletonName);
        const anims = this.spData.entries[skeletonName].animations;
        //console.log(anims);
        for (var anim in anims)
        if (anims.hasOwnProperty(anim)) {
            //console.log(anims[anim]);
            //console.log(anims[anim]['bones'])
            for (var bone in anims[anim]['bones'])
            if (anims[anim]['bones'].hasOwnProperty(bone)) {
                //console.log(bone)
                for (var action in anims[anim]['bones'][bone])
                if (anims[anim]['bones'][bone].hasOwnProperty(action)) {
                    for (var step in anims[anim]['bones'][bone][action])
                    if (anims[anim]['bones'][bone][action].hasOwnProperty(step)) {
                        //console.log(step)
                        for (var entry in anims[anim]['bones'][bone][action][step])
                        if (anims[anim]['bones'][bone][action][step].hasOwnProperty(entry)) {
                            if (entry == "curve") {
                                var step1 = anims[anim]['bones'][bone][action][step];
                                entry = step1[entry];
                                //console.log(entry);
                                if (typeof entry == 'string') continue; // "curve": "stepped"
                                //console.log(typeof entry)
                                //if (typeof entry != 'array') {
                                if (!entry.length) {
                                    console.warn(skeletonName + ' curves already upgraded');
                                    return 0;
                                }
                                if (entry.length != 4) {
                                    console.warn(skeletonName + ' unexpected curve length');
                                    return 0;
                                }
                                step1["c2"] = step1["curve"][1];
                                step1["c3"] = step1["curve"][2];
                                step1["c4"] = step1["curve"][3];
                                step1["curve"] = step1["curve"][0];
                                //console.log(anim + ' curve upgraded');   
                            }
                        }
                    }
                }
            }
        }
        return 1;
    }





    /*upgradeAllSpineData() {
        console.log(this.spData)
        this.spData.forEach(element => {
            this.upgradeSpineData(element);
        });
    }*/

}