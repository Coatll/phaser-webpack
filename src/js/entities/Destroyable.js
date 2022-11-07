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

        this.scene.add.existing(this);
    }

    get isHostile() {
        return this.side > 1;
    }

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



}