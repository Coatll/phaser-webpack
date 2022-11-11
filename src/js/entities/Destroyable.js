import Phaser from 'phaser';

//destroyable graphic element/entity

export default class Entity extends Phaser.GameObjects.Sprite {
    constructor(config) {
        if (!config.texture) config.texture = null;
        if (!config.frame) config.frame = null;
        super(config.scene, config.x, config.y, config.texture, config.frame);
        this.scene = config.scene
        this.entityType = config.entityType;
        this.side = config.side; //0 = no side, 1 = player1, 2 = player2, 3 = players' enemy
        this.player = 0; //0 = no player control, 1 = player1, 2 = player2 
        this.canAct = (config.canAct != false);
        this.maxHealth = config.maxHealth;
        this.dmg = config.dmg; //object's damage (or zero)

        this.health = this.maxHealth;
        this.lockedMovement = false;
        this.lockedAttack = false;
        this.speed = 2.75;
        this.state = 'idle';
        this.dx = this.dy = 0;
        //this.advancing = [];

        this.scene.add.existing(this);

        this.enemies = [];
    }

    get isHostile() {
        return this.side > 1;
    }

    /*update() {
        if (this.dx) {
            console.log('setPosition ' + this.x + '+'+this.dx+ ', '+this.y +'+'+ this.dy);
            this.setPosition(this.x + this.dx, this.y + this.dy);
        }
    }*/

    //-------------------------health and death------------------------------

    get damage() {
        return this.dmg || 0;
    }

    get alive() {
        return this.health > 0;
    }

    setHealth(health) {
        //set health + ...
        this.health = health;
        //this.scene.time.delayedCall(500, this.checkDeath, [], this);
    }

    checkDeath(hitTypeNum) {
        //console.log('checkDeath');
        if (!this.alive && this.state != 'dying') {
            this.startDying(hitTypeNum);
            console.log('die! (destroyable)');
        }
        //console.log('Death checked');
    }

    startDying(hitTypeNum = 1) {
        //this.dying = true;
        console.log('destroyaebl startDying '+hitTypeNum);
        this.state = 'dying';
        this.play('death'); //play death animation
        //this.scene.planDeathEffect(this); //general death effect
        //this.tweenStatusFade.restart();
        //this.tweenFade.restart();
        this.scene.time.delayedCall(500, this.die, [], this);
    }

    die() {
        this.destroy();
        //..?
    }

    //--------------------------------------------------------------------
    //-------------------------------movement and animation--------------------------------------------------------

    move(dirX, speed, noAnim = false) {
        if (this.lockedMovement) return;
        if (!speed) speed = this.speed;
        this.dx = dirX * speed;
        if (!noAnim) this.state = 'walk';
        if ((dirX >= 0) == (this.scaleX >=0)) {
            if (!noAnim) this.play('walk', true);
        }
        else {
            if (!noAnim) this.play('stepBack', true);
            this.dx *= 0.6; //back slower
        }
    }

    dontMove() {
        if ((this.state != 'walk') && !this.dx) return;
        if (this.state == 'walk') this.stopPlayingMovement();
        this.state = 'idle';
        //this.dx = 0;
        let slowing = 0.5;
        if (Math.abs(this.dx) < slowing) { this.dx = 0; return; }
        this.dx = (Math.abs(this.dx) - slowing) * Math.sign(this.dx);
        //this.stopPlayingMovement();
    }

    stopPlayingMovement() {
        this.stop();
    }

    /*startAdvancing(dxArray, dirX) {
        //get an array to keep advancing frame by frame
        //dirX = 1 or -1
        this.advancing = [];
        dirX *= 0.5;
        for(var i = 1; i < dxArray.length; i++) {
            this.advancing.push(dxArray[i] * dirX);
        }
        this.advancing.push(0);
        console.log(this.advancing);
    }

    keepAdvancing() {
        //on update
        this.dx = this.advancing.splice(0, 1)[0];
        //console.log(this.advancing);
    }*/

    planNextIdle() {

    }

    getWound(dmg) {

    }

    getHit() {
        //... decrease health...
        this.attacking = 0;
        this.state = 'hit';
        this.lockedAttack = true;
        this.lockedMovement = true;
        this.dx = 0;
        //...
    }

    //---------------------------collision---------------------------------------

    bodyPosition() {
        //changed for descendants
        return {
            x: this.x,
            y: this.y
        }
    }

    attackReach(attackType) {
        return {minX: 0, maxX: 0}
    }

    readyToBlock() {
        //what attacks is the entity ready to block?
        return [];
    }

    //------------------------------AI------------------------------------------

    findBestEnemy() {
        this.bestEnemy = Phaser.Math.RND.pick(this.enemies);
    }

    decideAction() {

    }
}