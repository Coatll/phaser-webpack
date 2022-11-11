import Destroyable from './Destroyable';
import Preloader from '../scenes/Preloader';
import Phaser from 'phaser';
import configData from '../config.js';
import EntityStatusBar from './EntityStatusBar';

export default class Skeletal extends Destroyable {
    constructor(config) {
        super({
            scene: config.scene,
            x: config.x,
            y: config.y,
            entityType: config.entityType,
            maxHealth: config.maxHealth,
            dmg: config.dmg,
        })
        this.scene = config.scene;
        this.preloader = this.scene.scene.get('Preloader');
        this.visible = false; //hide the null texture
        this.skel = this.preloader.addUpgraded(this.scene, this.x, this.y, config.key, config.anim, config.loop = false)
        this.setPosition(config.x, config.y);
        //console.log(this.skel)
        this.weaponType = config.weaponType; //['shield', '2handed', 'spear']
        this.side = config.side;
        this.attacking = 0; //number of attack currently using, before hit resolution
        //this.setMixes();
        //console.log(this.skel.stateData)
        //this.skel.stateData.defaultMix = 0.2;
        this.nextIdle = null;
        this.stopPlayingMovement();
        this.skel.on('complete', this.onComplete, this); //after completing animation
        //this.skel.on('start', this.onStart, this); //

        //possible states: ['idle', 'walk', 'attack1', 'attack2', 'attackClose', 'attackShield', 'hitShield1', 'hitShield2', 'hit1', 'hit2', 'death']
        this.body = this.skel.findBone('body');
        this.root = this.skel.findBone('root');
        this.bodySizeX = 25;
        this.determineAttackTypes();
        //console.log(this.bodyPosition());

        this.statusBar = new EntityStatusBar({
            scene: this.scene,
            x: this.x,
            y: this.y,
            texture: 'block',
            owner: this
        })
    }

//---------------------basic overrides-----------------------------------------------------

    setScale(x, y) {
        super.setScale(x, y);
        this.skel.setScale(x, y);
    }

    setColor(color) {
        this.skel.setColor(color);
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
        if (!this.skel) return;
        this.skel.setPosition(x, y);
        if (!this.body) return;
        let bodyPosX = this.x;//this.bodyPosition().x;
        if (this.statusBar && (this.statusBar.x != bodyPosX)) {
            this.statusBar.updatePosition(bodyPosX);
        }
    }

    movePosition(dx, dy) {
        this.setPosition(this.x + dx, this.y + dy);
    }

    setMix(fromName, toName, duration = undefined) {
        this.skel.setMix(fromName, toName, duration);
    }

    setAttachment(slotName, attachmentName) {
        this.skel.setAttachment(slotName, attachmentName);
    }

    setAnimation(trackIndex, animationName, loop = undefined, ignoreIfPlaying = undefined) {
        //this.alignSkeletonToItsBody();
        this.skel.setAnimation(trackIndex, animationName, loop, ignoreIfPlaying);
        /*if (this.displacedX) {
            this.setPosition(this.x + this.body.x * this.skel.scaleX, this.y);
            this.displacedX = 0;
        }*/
    }

    addAnimation(trackIndex, animationName, loop = undefined, delay = undefined) {
        //add animation to the queue
        //this.alignSkeletonToItsBody();
        this.skel.addAnimation(trackIndex, animationName, loop, delay);
    }

    setEmptyAnimation(trackIndex, mixDuration = undefined) {
        this.skel.setEmptyAnimation(trackIndex, mixDuration);
    }

    play(anim, ignoreIfPlaying = undefined) {
        //console.log('skel play '+anim+', ignoreIfPlaying '+ignoreIfPlaying);
        //this.skel.state.timeScale = 1;
        this.skel.play(anim, false, ignoreIfPlaying); //loop=false and ignoreIfPlaying=true
        //this.state = anim;
    }

    clearTrack(trackIndex) {
        this.skel.clearTrack(trackIndex);
    }

    clearTracks() {
        this.skel.clearTracks();
    }

    /*stop() {
        this.skel.play('');
    }*/

//-------------------------------other animations--------------------------------------------------

    setMixes() {
        //set transition times between animations
        //this.setMix('walk','idle', 0.2);
    }

    stopPlayingMovement() {
        //console.log('stopPlayingMovement');
        //this.skel.play('idle', false, false);
        //this.skel.state.timeScale = 0;
        this.setEmptyAnimation(0, 0.2);
        //this.setAnimation(0, 'attack1')
        //this.setAnimation(3, 'blink')
        //this.clearTrack(0);
    }

    onComplete(e) {
        const anim = e.animation;
        if (e.trackIndex > 0) return; //only track 0 listened for changes

        if (this.state == 'dying') this.scene.time.delayedCall(500, this.die, [], this);

        //this.scene.testWorldBounds(this);

        //if (anim.name == 'attackShield') this.alignSkeletonToItsBody();
        this.alignSkeletonToItsBody();
        /*if (!anim) {
            console.log('no anim complete');
            return;
        }*/
        //if (anim.name == 'blink') console.log(e);
        //console.log(e.trackIndex)
        //console.log(anim)
        //return;
        //console.log('complete')
        
        //if not dying or hit...
        this.state = 'idle';
        this.attacking = 0;
        this.lockedAttack = false;
        this.lockedMovement = false;
        if (anim.name == '<empty>' || anim.name == 'idle') this.planNextIdle();
        //problem: idles stop being continued after a timed attack
    }

    /*onStart(e) {
        console.log('onstart')
        const anim = e.animation;
        if (e.trackIndex > 0) return; //only track 0 listened for changes

        if (this.displacedX) {
            this.setPosition(this.x + this.body.x * this.skel.scaleX, this.y);
            this.displacedX = 0;
        }       
    }*/

    planNextIdle() {
        //next idle animation
        return;
        //console.log(this.skel.getCurrentAnimation().name)
        //if (this.skel.getCurrentAnimation()) return;
        //console.log('no animation playing')
        if (!this.nextIdle) {
            var otherAnims = [];
            if (Phaser.Math.RND.between(0, 9) == 0) otherAnims = ['blink']; //sometimes also blink
            this.nextIdle = this.scene.time.delayedCall(Phaser.Math.RND.between(600, 1000), this.doIdle, otherAnims, this)
        }
    }

    doIdle(otherAnims) {
        //do idle animation
        //console.log(otherAnims)
        this.nextIdle = null;
        this.setAnimation(0, 'idle', false, true);
        if (otherAnims) this.setAnimation(1, otherAnims, false, true);
    }

    alignSkeletonToItsBody() {
        //Change skeleton position according to body. (i.e. Save the body position where the animation displaced it.)
        //console.log('alignSkeletonToItsBody: '+this.x+' to '+this.body.x+', scalex '+this.skel.scaleX+'. root '+this.root.x);
        //console.log(this.body);
        if (this.body.x == 0) return;
        this.setPosition(this.x + this.body.x * this.skel.scaleX, this.y);
        //this.displacedX = this.body.x * this.skel.scaleX;
        //this.setAnimation(0, 'idle')
        this.addAnimation(0, 'idle')
        this.body.x = 0;
        //this.root.x = 0;
        //this.body.ax = 0;
        //console.log('aligned: skel '+this.x+', body '+this.body.x);
        //this.body.updateAppliedTransform();
        //this.skel.refresh();
        this.skel.updateSize();
        //console.log(this.body);
    }

    //------------------------------------------actions-----------------------------------------------

    determineAttackTypes() {
        this.attackTypes = configData.attackTypes[this.weaponType];
        //check if corresponding animations exist?
    }

    attack(attackTypeNum) {
        if (this.attacking || this.lockedAttack) return 0;
        const attackType = this.attackTypes[attackTypeNum-1];
        //console.log('attack '+attackTypeNum +', '+attackType);
        this.attacking = attackTypeNum;
        this.lockedAttack = true;
        this.state = attackType;
        this.setAnimation(0, attackType, false);

        const attackData = configData.attackData[this.weaponType][this.attacking-1];
        //if (attackData.advance) this.move(Math.sign(this.scaleX), attackData.advance, true); //attackShield is advancing
        return attackTypeNum;
    }

    whenResolvedAttack() {
        //run class-specific behavior when attack resolved in the scene
        //stop movement in case of advancing attack type
        const attackData = configData.attackData[this.weaponType][this.attacking-1];
        //if (attackData.advance) this.dontMove();
    }

    //-------------------------------------------------------------------------------------------------

    get damage() {
        //damage with specific attack
        //not to be confused with getWound()
        var dmg = this.dmg;
        if (!this.attacking) return dmg;
        var multi = configData.attackData[this.weaponType][this.attacking-1].dmgMultiplier;
        if (multi == undefined) multi = 1;
        return dmg * multi;
    }

    //-----------------------------------------collision-----------------------------------------------

    bodyPosition() {
        return {
            x: this.x + this.body.x * this.skel.scaleX,
            y: this.y + this.body.y
        }
    }

    hitSpan() {
        //hit area on x-axis
        const posX = this.bodyPosition().x;
        return {
            minX: posX - this.bodySizeX,
            maxX: posX + this.bodySizeX
        }
    }

    attackReach(attackTypeNum, includingStep = false) {
        return this.attackReachFromX(this.bodyPosition().x, attackTypeNum, includingStep);
    }

    attackReachFromX(x, attackTypeNum, includingStep = false) {
        var reach = {minX: 0, maxX: 0}
        const scaleX = this.scaleX;
        const data = configData.attackData['shield'][attackTypeNum-1]
        const advance = includingStep ? data.advance : 0;
        if (scaleX > 0) {
            reach.minX = x + (data.minX + advance) * scaleX;
            reach.maxX = x + (data.maxX + advance) * scaleX;
        } else {
            reach.maxX = x + (data.minX + advance) * scaleX;
            reach.minX = x + (data.maxX + advance) * scaleX;
        }
        /*if (includingStep) {
            //include the specific step before the attack
            reach.minX += data.advance * scaleX;
            reach.maxX += data.advance * scaleX;
        }*/
        //console.log(data);
        return reach;
    }

    readyToBlock() {
        var ar = [];
        if (this.state == 'idle') {
            ar = [1, 2];
        } else {
            const cur = this.skel.getCurrentAnimation();
            if (cur == 'hitShield1' || cur == 'block1') ar = 1;
            else if (cur == 'hitShield2' || cur == 'block2') ar = 2;
        }
        return ar;
    }

    getWound(dmg, attackTypeNum) {
        //decrease health...
        this.statusBar.getWound(dmg);
        this.health -= dmg;
        this.checkDeath(configData.attackData[this.weaponType][attackTypeNum-1].hitType);
    }

    checkDeath(hitTypeNum) {
        //console.log('checkDeath');
        if (!this.alive && this.state != 'dying') {
            this.startDying(hitTypeNum);
            console.log('die!');
        }
        //console.log('Death checked');
    }

    startDying(hitTypeNum) {
        //dying with specific anim
        console.log('startDying '+hitTypeNum);
        this.state = 'dying';
        this.setAnimation(0, 'death'+hitTypeNum); //play death animation
        //this.scene.time.delayedCall(500, this.die, [], this);
    }

    getHit(attacker) {
        //console.log('getHit')
        super.getHit();
        var hitTypeNum = configData.attackData[this.weaponType][attacker.attacking-1]['hitType'];
        if (hitTypeNum.length) hitTypeNum = hitTypeNum[Phaser.Math.RND.between(0, hitTypeNum.length-1)]; //if array, choose randomly
        const anim = configData.hitTypes[hitTypeNum-1];
        //console.log('hit with animation '+hitTypeNum+' = '+anim)
        let cur = this.skel.getCurrentAnimation();
        if (!cur || cur.name != anim) this.setAnimation(0, anim, false);
        //this.addAnimation(0, 'idle');

    }

    startDying() {

    }

//--------------------------------AI----------------------------------------------------------------

decideAction() {
    //console.log('decideAction')
    if (this.state == 'idle') {
        //console.log(this.enemies);
        if (!this.bestEnemy) this.findBestEnemy();
        const enemy = this.bestEnemy;
        if (!enemy) return;
        const dir = this.scene.attackDistanceMisplaced(this, enemy, 1, true) * -1;
        
        if (dir) this.move(dir);
        else this.dontMove();
        this.scene.time.delayedCall(Phaser.Math.RND.between(300, 2000), () => {this.state = 'idle';}, [], this)
        this.state = 'planning';
    }
}
}