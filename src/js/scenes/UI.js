import configData from '../config.js'

//user interface

export default class UI extends Phaser.Scene {
    constructor() {
        super({ key: 'UI' });
    }

    preload() {
        this.load.setPath('../../assets/images/');
        //this.load.image('block', 'block1.png');
        //this.load.image('circle', 'circle1.png');
    }

    start() {
        
    }

    
}