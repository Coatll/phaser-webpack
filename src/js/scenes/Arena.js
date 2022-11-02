
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
        //console.log(this.spData);
        //console.log(warData.entries['warrior']);
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
        var warrior = this.addUpgraded(400, 600, 'warrior', 'walk', true); //this.add.spine(400, 600, 'warrior', 'walk');
        //console.log(warrior);
        //var goblin = this.add.spine(400, 600, 'goblin', 'walk', true)
        //goblin.setSkinByName('goblingirl')
    }

    addUpgraded(x, y, name, anim, loop = false) {
        this.upgradeSpineData(name);
        return this.add.spine(x, y, name, anim, loop);
    }

    upgradeSpineData(skeletonName) {
        //upgrade skin data structure exported for older spine version
        //call in create(), after loading and before adding to scene
        var skins, skinsNew;
        skins = this.spData.entries[skeletonName].skins;
        if (skins[0]) {
            console.warn(skeletonName + ' already upgraded');
            return;
        }
        skinsNew = [
            {"name":"default","attachments": skins['default']}
        ]
        this.spData.entries[skeletonName].skins = skinsNew;
    }

    /*upgradeAllSpineData() {
        console.log(this.spData)
        this.spData.forEach(element => {
            this.upgradeSpineData(element);
        });
    }*/

}