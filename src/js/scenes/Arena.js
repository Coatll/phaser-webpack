import Destroyable from '../entities/Destroyable';
import Skeletal from '../entities/Skeletal';
import configData from '../config.js'
import Preloader from './Preloader';

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
        this.shadowLayer = this.add.layer();
        this.battleLayer = this.add.layer();
        this.fgLayer = this.add.layer();

        this.entityGroup = this.add.group(); //group of moving entities
        //console.log(this.sys)

        var warrior = this.createEntity(this.arenaCenter.x - 200, this.groundY, 'warrior', 0);
        this.setAsPlayer(warrior, 1);
        var warrior2 = this.tempEnemy = this.createEntity(this.arenaCenter.x + 200, this.groundY, 'warrior', 3);
        warrior2.setScale(-1, 1);

        warrior.setCustomSkin({
            head: 'Man1',
            body: 'Man2',
            weapon: '2',
            necklace: '1',
            knee: '1',
            helm: '1'
        });

        warrior2.setCustomSkin({
            head: 'Man2',
            body: 'Man1',
            weapon: '1',
            necklace: '2',
            knee: '2',
            helm: '2'
        });
        
        //console.log(warrior2.state);
        //warrior2.setAttachment('weapon1','weapon1'); //slotName, attachmentName
        //warrior2.setAttachment('head','headMan2a');
        //this.debugAttack = 1; //1-4
        
        this.bgLayer.add(this.background);
        this.fgLayer.add(this.foreground);

        this.cursors = this.input.keyboard.createCursorKeys();
        //console.log(this.cursors)
        //this.input.keyboard.on('keydown', this.onKeyDown);
        this.findEnemiesForAll();
        this.end = 0;
        /*
        //rotate not working
        this.sparks = this.add.particles('spark');
        this.sparkEmitter = this.sparks.createEmitter({
            //x: x,
            //y: y,
            //radial: true,
            //angle: {start: 0, end: 360, step: 36},
            //quantity: numMiddleClouds,
            scale: {min: 0.5, max: 1},
            speed: {min: 150, max: 200},
            lifeSpan: 50,
            angle: {random: [0, 360]},
            rotate: {onEmit: (particle) => {return particle.angle} },
            alpha: {start: 1, end: 0.3},
            //tint: 0x333333,
        });
        */
       this.cameras.main.fadeIn(200);
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
                dmg: 10,
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
        if (!this.player1) return;
        if (this.end) return;
        var forwardAttack, backAttack;
        if (this.player1.scaleX > 0) {
            forwardAttack = 3;
            backAttack = 4;
        } else {
            forwardAttack = 4;
            backAttack = 3;
        }
        
        if (this.cursors.up.isDown) {
            if (this.cursors.shift.isDown) {
                this.attack(this.player1, 1);
                //this.lastKeyExecuted = 1;
            } else {
                this.block(this.player1, 1);
            }
            this.lastKeyExecuted = 1;
        }
        else if (this.cursors.down.isDown) {
            if (this.cursors.shift.isDown) {
                this.attack(this.player1, 2);
                //this.lastKeyExecuted = 2;
            } else {
                this.block(this.player1, 2);
            }
            this.lastKeyExecuted = 2;
        }
        else if (this.cursors.left.isDown) {
            if (this.cursors.shift.isDown) {
                this.attack(this.player1, backAttack);
                this.lastKeyExecuted = 4;
            }
            else this.player1.move(-1);
        }
        else if (this.cursors.right.isDown) {
            if (this.cursors.shift.isDown) {
                this.attack(this.player1, forwardAttack);
                this.lastKeyExecuted = 3;
            }
            else this.player1.move(1);
        } else {
            this.lastKeyExecuted = 0;
        }

        if (!this.cursors.left.isDown && !this.cursors.right.isDown) {
            this.player1.dontMove();
        }

        if (this.cursors.space.isDown) {
            this.player1.flip();
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

        if (attackSpan.maxX < hitSpan.minX) return attackSpan.maxX - hitSpan.minX; //-1
        if (attackSpan.minX > hitSpan.maxX) return attackSpan.minX - hitSpan.maxX; //1
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

        if (e.canAct) {
            e.testInstinct();                   //automatic reactions
            if (!e.player) e.decideAction();    //AI
        }
        
        //if (e.dx) {
            e.setPosition(e.x + e.dx, e.y + e.dy); //walking
        //}

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

    block(entity, blockTypeNum) {
        if (this.lastKeyExecuted != blockTypeNum) {
            //console.log('block '+blockTypeNum)
            entity.block(blockTypeNum);
        }
    }

    attack(entity, attackTypeNum) {
        if (this.lastKeyExecuted != attackTypeNum) {
            entity.attack(attackTypeNum);
            this.time.delayedCall(this.attackResolveDelay(entity.weaponType, attackTypeNum), this.resolveAttack, [entity], this);
        }
    }

    resolveAttack(entity) {
        if (!entity.attacking) {
            //console.log('no longer attacking');
            return 0;
        }
        //let hit = this.debugTestDistance();
        //if (hit) {this.time.delayedCall(500, () => {this.tempEnemy.skel.setColor(0xffffff)}, [], this)}; //return the color back
        this.entityGroup.children.iterate((entity2) => {
            if ((entity2 == entity) || (entity2.state == 'dying')) {
                return;
            }
            //console.log('resolveAttack. attacking '+entity.attacking+', blocking '+entity2.blocking);
            if (this.attackDistanceMisplaced(entity, entity2, entity.attacking)) {
                //console.log('missed');
                return; //miss
            }
            if ((Math.sign(entity2.scaleX) != Math.sign(entity.scaleX)) && (entity2.blocking == entity.attacking)) this.resolveBlock(entity, entity2); //blocking and facing => block
                else this.harm(entity, entity2); //harm
        })
        entity.whenResolvedAttack();
        entity.attacking = 0;
        //..
    }

    resolveBlock(attacker, defender) {
        console.log('blocked!');
        //this.sparkEmitter.explode(10, (attacker.x + defender.x) *0.5, attacker.y - 100);
        this.sparkAnimation((attacker.bodyPosition().x + defender.x) *0.5, attacker.y - 130, 'block')
    }

    harm(attacker, defender) {
        //console.log('damage '+attacker.damage)
        if (attacker.damage <= 0) this.sparkAnimation((attacker.bodyPosition().x + defender.x) *0.5, attacker.y - 130, 'bash'); //sparks
        else {
            const defPos = this.woundPosition(attacker.attackData(attacker.attacking).hitType, defender); //blood
            this.spillBlood(defPos.x, defPos.y, 6);
        }
        defender.getHit(attacker);
        defender.getWound(attacker.damage, attacker.attacking);
        
        //...
    }

    woundPosition(hitType, defender) {
        //either at the bottom of the body, or at the neck
        console.log('woundPosition '+hitType)
        const bodyPos = defender.bodyPosition();
        const headPos = defender.headPosition();
        let defPos = (hitType == 2 ? bodyPos 
            :
            {
                x: headPos.x - 60 * defender.scaleX,
                y: headPos.y - 40 * defender.scaleY,
                //x: (bodyPos.x + headPos.x) * 0.5,
                //y: (bodyPos.y + headPos.y) * 0.5,
            }
            );
        return defPos;
    }

    cleanAfterDeath(entity) {
        this.findEnemiesForAll(true);
    }

//------------------------------AI-----------------------------------------------------------

    findEnemiesForAll(afterKill = false) {
        this.entityGroup.children.iterate((entity) => {this.findEnemies(entity, afterKill);})
        this.checkEnd();
    }

    findEnemies(entity, afterKill = false) {
        //generalized for any number of entities on the scene. Determining this.enemies and this.bestEnemy for the entity
        //if (entity.player) return; //only non-players
        if (entity.state == 'dying') return;
        entity.enemies = [];
        this.entityGroup.children.iterate((e) => {
            if (e.side != entity.side && e.state != 'dying') entity.enemies.push(e);
        })
        //console.log(entity.enemies);
        if (afterKill) {
            //console.log('about to exult')
            this.end = entity.side + 1;
            entity.exult();
        }
        entity.bestEnemy = entity.findBestEnemy();
    }

//----------------------------effects--------------------------------------------------------------

    sparkAnimation(x, y, type) {
        //type: 'block' or 'bash'
        const data = configData['sparkTypes'][type];
        for(let n = data.number; n>0; n--) {
            const length =  Phaser.Math.Between(data.length[0], data.length[1]);
            const dur = data.duration;
            const rot = Phaser.Math.Between(0, 360);
            const dx = Math.cos(rot) * length;
            const dy = Math.sin(rot) * length;
            let spark = this.add.image(x + dx * 0.3, y + dy * 0.3, 'spark').setScale(data.scaleX, data.scaleY)
            if (data.tint != undefined) spark.setTint(data.tint);
            this.bgLayer.add(spark);
            spark.rotation = rot;
            this.tweens.add( {
                targets: spark,
                x: '+='+dx,
                y: '+='+dy,
                alpha: {from: data.alpha[0], to: data.alpha[1]},
                duration: dur,
                ease: 'Quad.easeOut',
                onComplete: () => {spark.destroy()}
            })
        }
    }

    spillBlood(x, y, n) {
        console.log('spill Blood '+x+','+y);
        
        const bloodStream = this.add.particles('blood');
        const wound = this.add.image(x, y, 'blood');
        const rect = new Phaser.Geom.Rectangle(0, 0, this.preloader.gameSize.x, this.preloader.gameSize.y);
        const bloodFlow = bloodStream.createEmitter({
            x:x,
            y:y,
            scale: 0.75,
            speed: { min: 600, max: 800 },
            angle: { min: 240, max: 300 },
            //tint: 0xaa0000,
            gravityY: 4000,
            deathZone: { type: 'onLeave', source: rect }
        });
        bloodFlow.explode(n, x, y);
        this.time.delayedCall(100, wound.destroy, [], wound);

        /*const wound = this.add.image(x, y, 'circle').setTint(0xaa0000);
        for(; n > 0; n--) {
            const angle = Phaser.Math.Between(240, 300);
            const speed = 30;
            let drop = this.add.image(x, y, 'blood1'); 
            this.tweens.add({
                targets: drop,
                y: this.preloader.gamesize,
                ease: 'Quad.easeIn'
            })
        }*/
    }

//-------------------------------------------------------------------------------------------------

    checkEnd() {
        if (this.end) {
            this.time.delayedCall(2500, this.cameras.main.fadeOut, [200], this.cameras.main)
        }
    }

}