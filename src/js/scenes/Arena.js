import Destroyable from '../entities/Destroyable';
import Skeletal from '../entities/Skeletal';

export default class Arena extends Phaser.Scene {
    constructor () {
        super({ key: 'Arena' });
    }

    preload() {
        console.log('preload arena');
        this.preloader = this.scene.get('Preloader');
        this.load.setPath('../../assets/images/');
        this.load.image('bg', 'tresCastillos.jpg'); //'tenochGray.jpg'
        this.load.image('fg', 'tresForeground.png');
        this.load.setPath('../../assets/spine/');

        this.preloader.loadSpine(this, 'warrior', 'Mixtec_warriors.json', 'Mixtec_warriors.atlas');
        //var spLoader = this.load.spine('warrior', 'Mixtec_warriors.json', 'Mixtec_warriors.atlas');
        //this.spData = spLoader.systems.spine.json.entries;
        //console.log(this.spData);
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
        //console.log(this.preloader.screenSize());
        //console.log(this.spData.entries['warrior']);
        //this.upgradeSpineData('warrior')
        //this.upgradeAllSpineData();
        //var mar = this.add.image(200, 400, 'player');
        this.arenaCenter = {x: this.preloader.gameSize.x / 2, y: this.preloader.gameSize.y / 2}
        this.background = this.add.image(this.arenaCenter.x, this.arenaCenter.y, 'bg');
        this.background.setOrigin(0.5, 0.5);
        this.foreground = this.add.image(this.arenaCenter.x, this.preloader.gameSize.y + 20, 'fg').setOrigin(0.5, 1);

        this.bgLayer = this.add.layer();
        this.battleLayer = this.add.layer();
        this.fgLayer = this.add.layer();

        this.entityGroup = this.add.group(); //group of moving entities
        //console.log(this.sys)

        var warrior = this.createEntity(400, 510, 'warrior', 0);
        var warrior2 = this.createEntity(800, 510, 'warrior', 3);

        //var warrior = this.preloader.addUpgraded(this, 400, 510, 'warrior', 'walk', false); //this.add.spine(400, 600, 'warrior', 'walk');
        //var warrior2 = this.add.spine(800, 500, 'warrior', 'block1', false);
        /*let warrior2 = this.make.spine({
            x: 800, y: 510, key: 'warrior', //'warrior.Warrior_shield', - impractical, DragonBones can't use multiple skeletons
            scale: 1,
            //skinName: 'square_Green',
            animationName: 'block1', loop: false,
            //slotName: 'hat', attachmentName: 'images/La_14'
        });*/
        //this.battleLayer.add([warrior, warrior2]);
        warrior2.setScale(-1, 1);
        //console.log(warrior2.state);
        warrior2.setAttachment('weapon1','weapon1'); //slotName, attachmentName
        warrior2.play('block2', false, false) //name, loop, ignoreIfPlaying
        //warrior2.setMix('death1','walk', 0.9);
        //warrior.setMix('walk','block1', 0.5);
        //warrior.play('death2', false, false);
        /*
        var qu = ['walk', 'walk', 'attack1', 'block1', 'attack2', 'hit1', 'block2', 'death2']
        var i = 0;
        //qu.forEach(() => {warrior.setEmptyAnimation(i++, i*1);});
        qu.forEach(name => {warrior.setAnimation(i++, name);});
        */
        //console.log(warrior.state);
        //warrior2.setAnimation(0, 'walk'); warrior2.setAnimation(1, 'attack1'); warrior2.setAnimation(2, 'hit1'); warrior2.setAnimation(3, 'death2');
        this.bgLayer.add(this.background);
        this.fgLayer.add(this.foreground);

    }

    createEntity(x, y, entityType, side) {
        //side - as remarked in Destroyable.js: Basically 0 or 3. (0 = no side, 1 = player1, 2 = player2, 3 = players' enemy.)
        let e;
        if (entityType == "warrior") //temporary
            e = new Skeletal({
                scene: this,
                x: x,
                y: y,
                entityType: entityType,
                side: side,
                dmg: 10,
                maxHealth: 100,

                key: 'warrior',
                anim: 'walk',
                loop: false
            });
            this.battleLayer.add(e);
            this.entityGroup.add(e);
        return e;
    }

    setAsPlayer(who, number) {
        //set an entity as controlled by player 1 or 2
        if (number == 1) this.player = who;
        this['player'+number] = who;
        who.player = number;
    }

}