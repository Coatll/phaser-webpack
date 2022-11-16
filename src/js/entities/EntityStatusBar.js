import Preloader from '../scenes/Preloader.js';

export default class EntityStatusBar extends Phaser.GameObjects.Image {
    constructor (config) {
        super(config.scene, config.x, config.y, config.texture, config.frame);
        this.scene = config.scene;
        this.owner = config.owner;
        this.preloader = this.scene.preloader;

        this.setPosition(this.owner.x, this.preloader.gameSize.y - 15);

        this.scene.add.existing(this);  //(block1.png) background
        this.setTint(0x000000);
        //let circle = Preloader.getTextureAndFrame('circle');

        this.numCircles = this.numPoints(this.owner.maxHealth); //Math.floor(this.owner.maxHealth * 0.1);
        this.circles = [];
        this.circle0 = this.scene.add.image(this.x, this.y, 'circle');
        this.circleWidth = this.circle0.width + 3;
        this.displayWidth = this.circleWidth * this.numCircles + 12;

        var i;
        for(i = 0; i < this.numCircles; i++) {
            this.circles[i] = this.scene.add.image(this.x, this.y, 'circle');
            this.circles[i].setTint(0xdd0000);
        }
        this.updatePosition(0);
        this.circle0.destroy();

        //this.owner.health -= 70;
        //this.updateHealth();
    }

    numPoints(h) {
        return Math.floor(h * 0.1);
    }

    updatePosition(x) {
        if (!x) x = this.owner.x;
        this.x = x;
        this.width = this.circleWidth * this.numCircles - 6;
        this.circles.forEach((circle, i) => {
            circle.x = this.x + 6 - this.displayWidth/2 + this.circleWidth * (i + 0.5); 
        })
    }

    updateHealth() {
        const numVisible = this.numPoints(this.owner.health);
        //console.log('circles '+this.circles.length+', visible '+numVisible)
        this.showHealthPoints(numVisible);
    }

    showHealthPoints(h) {
        //console.log('show health points '+ h)
        this.circles.forEach((circle, i) => {
            circle.setTint(i < h ? 0xdd0000 : 0x660000); 
        })
    }

    getWound(dmg) {
        //wound animation
        //for now - static
        this.showHealthPoints(this.numPoints(this.owner.health - dmg));
    }

    destroy() {
        let le = this.circles.length;
        do {
            //console.log(le);
            if (le <= 0) return;
            let circle = this.circles.pop();
            circle.destroy();
            le = this.circles.length;
        } while(le > 0);
        this.setActive(false).setVisible(false);
        this.destroy();
    }

}