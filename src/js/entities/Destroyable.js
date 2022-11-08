import Phaser from 'phaser';

export default class Entity extends Phaser.GameObjects.Sprite {
    constructor(config) {
        if (!config.texture) config.texture = null;
        if (!config.frame) config.frame = null;
        super(config.scene, config.x, config.y, config.texture, config.frame);
        this.scene = config.scene
        this.entityType = config.entityType;
        this.side = config.side; //0 = no side, 1 = player1, 2 = player2, 3 = players' enemy
        this.player = 0; //0 = no player control, 1 = player1, 2 = player2 
        this.maxHealth = config.maxHealth;
        this.dmg = config.dmg; //object's damage (or zero)

        this.health = this.maxHealth;
        this.lockedMovement = false;
        this.lockedAttack = false;
        this.speed = 2.75;
        this.state = 'idle';
        this.dx = this.dy = 0;

        this.scene.add.existing(this);
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

    checkDeath() {
        if (!this.alive && !this.dying) {
            this.startDying();
        }
    }

    startDying() {
        this.dying = true;
        this.play('Die'); //play death animation
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

    move(dirX) {
        if (this.lockedMovement) return;
        this.state = 'walk';
        this.dx = dirX * this.speed;
        if ((dirX >= 0) == (this.scaleX >=0)) this.play('walk', true);
        else {
            this.play('stepBack', true);
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

    planNextIdle() {

    }


}