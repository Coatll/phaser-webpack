import Destroyable from './Destroyable';
import Preloader from '../scenes/Preloader';
import Phaser from 'phaser';
import configData from '../config.js';

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
        this.attacking = 0; //number of attack currently using, before hit resolution
        //this.setMixes();
        //console.log(this.skel.stateData)
        //this.skel.stateData.defaultMix = 0.2;
        this.nextIdle = null;
        this.stopPlayingMovement();
        this.skel.on('complete', this.onComplete, this); //after completing animation

        //possible states: ['idle', 'walk', 'attack1', 'attack2', 'attackClose', 'attackShield', 'hitShield1', 'hitShield2', 'hit1', 'hit2', 'death']
        this.body = this.skel.findBone('body');
        this.determineAttackTypes();
        //console.log(this.bodyPosition());
    }

//---------------------basic overrides-----------------------------------------------------

    setScale(x, y) {
        this.skel.setScale(x, y);
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
        if (!this.skel) return;
        this.skel.setPosition(x, y);
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
        this.skel.setAnimation(trackIndex, animationName, loop, ignoreIfPlaying);
    }

    addAnimation(trackIndex, animationName, loop = undefined, delay = undefined) {
        //add animation to the queue
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
        if (anim.name == '<empty>' || anim.name == 'idle') this.planNextIdle();
        //problem: idles stop being continued after a timed attack
    }

    planNextIdle() {
        //next idle animation
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

    //------------------------------------------actions-----------------------------------------------

    determineAttackTypes() {
        this.attackTypes = configData.attackTypes[this.weaponType];
        //check if corresponding animations exist?
    }

    attack(attackTypeNum) {
        if (this.attacking || this.lockedAttack) return 0;
        console.log('attack '+attackTypeNum)
        const attackType = this.attackTypes[attackTypeNum-1];
        this.attacking = attackTypeNum;
        this.state = attackType;
        this.setAnimation(0, attackType, false);
        return attackTypeNum;
    }

    //-----------------------------------------collision-----------------------------------------------

    bodyPosition() {
        return {
            x: this.x + this.body.x,
            y: this.y + this.body.y
        }
    }

    attackReach(attackType) {
        return attackReachFromX(this.bodyPosition().x, attackType);
    }

    attackReachFromX(x, attackType) {
        var reach = {minX: 0, maxX: 0}
        const scaleX = this.skel.scaleX;
        const data = configData.attackData['shield'][attackType]
        reach.minX = data.minX;
        reach.maxX = data.maxX;
        return reach;
    }
}