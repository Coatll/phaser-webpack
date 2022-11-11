import Destroyable from '../entities/Destroyable';
import Skeletal from '../entities/Skeletal';
import configData from '../config.js'

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

        this.preloader.loadSpine(this, 'warrior', 'warrior_shield.json', 'warrior_shield.atlas');
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
        this.minX = 20; this.maxX = this.preloader.gameSize - this.minX;
        this.groundY = 510;

        this.arenaCenter = {x: this.preloader.gameSize.x / 2, y: this.preloader.gameSize.y / 2}
        this.background = this.add.image(this.arenaCenter.x, this.arenaCenter.y, 'bg');
        this.background.setOrigin(0.5, 0.5);
        this.foreground = this.add.image(this.arenaCenter.x, this.preloader.gameSize.y - 0, 'fg').setOrigin(0.5, 1);

        this.bgLayer = this.add.layer();
        this.battleLayer = this.add.layer();
        this.fgLayer = this.add.layer();

        this.entityGroup = this.add.group(); //group of moving entities
        //console.log(this.sys)

        var warrior = this.createEntity(this.arenaCenter.x - 200, this.groundY, 'warrior', 0);
        this.setAsPlayer(warrior, 1);
        var warrior2 = this.tempEnemy = this.createEntity(this.arenaCenter.x + 200, this.groundY, 'warrior', 3);
        warrior2.setScale(-1, 1);

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
        
        //console.log(warrior2.state);
        warrior2.setAttachment('weapon1','weapon1'); //slotName, attachmentName
        //console.log(warrior2.player+','+warrior2.canAct)
        this.debugAttack = 1; //1-4
        //warrior2.play('block2', false, false) //name, loop, ignoreIfPlaying
        //warrior2.setMix('death1','walk', 0.9);
        //warrior.setMix('walk','block1', 0.5);
        //warrior.play('death2', false, false);
        /*
        var qu = ['walk', 'walk', 'attack1', 'block1', 'attack2', 'hit1', 'block2', 'death2']
        var i = 0;
        //qu.forEach(() => {warrior.setEmptyAnimation(i++, i*1);});
        qu.forEach(name => {warrior.setAnimation(i++, name);});
        */
        //console.log(warrior.skel.state);
        //warrior2.setAnimation(0, 'walk'); warrior2.setAnimation(1, 'attack1'); warrior2.setAnimation(2, 'hit1'); warrior2.setAnimation(3, 'death2');
        this.bgLayer.add(this.background);
        this.fgLayer.add(this.foreground);

        this.cursors = this.input.keyboard.createCursorKeys();
        //console.log(this.cursors)
        //this.input.keyboard.on('keydown', this.onKeyDown);
        this.findEnemiesForAll();
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
                weaponType: 'shield',
                side: side,
                dmg: 100,
                maxHealth: 100,

                key: 'warrior',
                anim: 'idle',
                loop: true
            });
            this.battleLayer.add(e);
            this.battleLayer.add(e.skel);
            this.entityGroup.add(e);
        return e;
    }

    setAsPlayer(who, number) {
        //set an entity as controlled by player 1 or 2
        if (number == 1) this.player = who;
        this['player'+number] = who;
        who.player = number;
    }

    update() {
        this.testKeys();
        this.entityGroup.children.iterate((child) => {this.entityUpdate(child)}, this);

        //if (this.player1.dx || this.tempEnemy.dx) this.debugTestDistance(this.tempEnemy, this.player1, true); //if movement, test distance
    }

    testKeys() {
        
        if (this.cursors.up.isDown) {
            if (this.cursors.shift.isDown) {
                this.attack(this.player1, 1);
                this.lastKeyExecuted = 1;
            }
        }
        else if (this.cursors.down.isDown) {
            if (this.cursors.shift.isDown) {
                this.attack(this.player1, 2);
                this.lastKeyExecuted = 2;
            }
        }
        else if (this.cursors.left.isDown) {
            if (this.cursors.shift.isDown) {
                this.attack(this.player1, 4);
                this.lastKeyExecuted = 4;
            }
            else this.player1.move(-1);
        }
        else if (this.cursors.right.isDown) {
            if (this.cursors.shift.isDown) {
                this.attack(this.player1, 3);
                this.lastKeyExecuted = 3;
            }
            else this.player1.move(1);
        } else {
            this.lastKeyExecuted = 0;
        }

        if (!this.cursors.left.isDown && !this.cursors.right.isDown) {
            this.player1.dontMove();
        }
    }

    /*onKeyDown(e) {
        var key = e.key
        console.log(key);
    }*/

//-----------------------attacks-------------------------------------------------

    attackDistanceMisplaced(e1, e2, attackTypeNum, includingStep = false) {
        //-1 too left, 1 too righ, 0 = good distance
        //includingStep = including the specific step before attack
        var attackType = configData.attackTypes['shield'][attackTypeNum-1];
        var attackSpan = e1.attackReach(attackTypeNum, includingStep);
        var hitSpan = e2.hitSpan();
        //console.log(attackSpan.minX+','+attackSpan.maxX+' vs '+hitSpan.minX+','+hitSpan.maxX);
        /*
        console.log('attack type '+attackTypeNum+'('+attackType+')'+'x-distance of bodies: '+(e2.bodyPosition().x-e1.bodyPosition().x)+
        '. Needs to be between '+(attackSpan.minX - e1.x - e2.bodySizeX * Math.abs(e2.scaleX))+'-'+(attackSpan.maxX - e1.x + e2.bodySizeX * Math.abs(e2.scaleX)));
        */

        if (attackSpan.maxX < hitSpan.minX) return -1;
        if (attackSpan.minX > hitSpan.maxX) return 1;
        return 0;
    }

    debugTestDistance(attacker, defender, includingStep) {
        var v = false;
        if (!this.attackDistanceMisplaced(attacker, defender, this.debugAttack, includingStep)) {
            defender.setColor(0xff0000);
            v = true;
        }
        else {
            defender.setColor(0xffffff);
        }
        //console.log(v)
        return v;
    }

    entityUpdate(e) {
        //if (e.advancing.length) e.keepAdvancing();
        if (!e.player && e.canAct) e.decideAction();

        if (e.dx) {
            //console.log('setPosition ' + e.x + '+'+e.dx+ ', '+e.y +'+'+ e.dy);
            e.setPosition(e.x + e.dx, e.y + e.dy);
        }

        this.testWorldBounds(e); //TODO: check only on movement
        //e.planNextIdle();

    }

    testWorldBounds(entity) {
        const bodyPos = entity.bodyPosition();
        const tooLeft = bodyPos.x >= 0 ? 0 : -bodyPos.x;
        const tooRight = bodyPos.x <= this.preloader.gameSize.x ? 0 : this.preloader.gameSize.x - bodyPos.x;
        if (tooLeft || tooRight) {
            console.log('entity at '+bodyPos.x+' out of the world bounds. gamesize x '+this.preloader.gameSize.x);
            entity.setPosition(entity.x + tooRight + tooLeft, entity.y);
            //entity.skel.updateSize();
        }
    }

    attackResolveDelay(weaponType, attackTypeNum) {
        //return configData
        let v = configData.attackData[weaponType][attackTypeNum-1].resolveTime;
        //console.log('attackResolveDelay '+weaponType+','+attackTypeNum+' = '+v);
        return v;
    }

    attack(entity, attackTypeNum) {
        if (this.lastKeyExecuted != attackTypeNum)
            entity.attack(attackTypeNum);
        this.time.delayedCall(this.attackResolveDelay(entity.weaponType, attackTypeNum), this.resolveAttack, [entity], this);
    }

    resolveAttack(entity) {
        if (!entity.attacking) return 0;
        //console.log('resolveAttack');
        //let hit = this.debugTestDistance();
        //if (hit) {this.time.delayedCall(500, () => {this.tempEnemy.skel.setColor(0xffffff)}, [], this)}; //return the color back
        this.entityGroup.children.iterate((entity2) => {
            if ((entity2 == entity) || (entity2.state == 'dying')) return;
            if (this.attackDistanceMisplaced(entity, entity2, entity.attacking)) return; //miss
            if (entity2.blocking == entity.attacking) this.block(entity, entity2); //block
                else this.harm(entity, entity2); //harm
        })
        entity.whenResolvedAttack();
        entity.attacking = 0;
        //..
    }

    block(attacker, defender) {
        //...
    }

    harm(attacker, defender) {
        //console.log('damage '+attacker.damage)
        defender.getWound(attacker.damage, attacker.attacking);
        defender.getHit(attacker);
        //...
    }

//------------------------------AI-----------------------------------------------------------

    findEnemiesForAll() {
        this.entityGroup.children.iterate((entity) => {this.findEnemies(entity);})
    }

    findEnemies(entity) {
        //generalized for any number of entities on the scene. Determining this.enemies and this.bestEnemy for the entity
        if (entity.player) return; //only non-players
        entity.enemies = [];
        this.entityGroup.children.iterate((e) => {
            if (e.side != entity.side) entity.enemies.push(e);
        })
        //console.log(entity.enemies);
        entity.bestEnemy = entity.findBestEnemy();
    }

//------------------------------------------------------------------------------------------

}