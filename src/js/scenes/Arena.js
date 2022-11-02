
export default class Arena extends Phaser.Scene {
    constructor () {
        super({ key: 'Arena' });
    }

    preload() {
        console.log('preload arena');
        //this.load.setPath('../../assets/images/');
        //this.load.image('player', 'player.png');
        this.load.setPath('../../assets/spine/');
        this.load.spine('warrior', 'Mixtec_warriors.json', 'Mixtec_warriors.atlas')
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
        //var mar = this.add.image(200, 400, 'player');
        var warrior = this.add.spine(400, 600, 'warrior', 'walk', true);
        //console.log(warrior);
        //var goblin = this.add.spine(400, 600, 'goblin', 'walk', true)
        //goblin.setSkinByName('goblingirl')
    }

}