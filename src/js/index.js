import Phaser from 'phaser';
import Preloader from './scenes/Preloader.js';
import Arena from './scenes/Arena.js';
import * as SpinePlugin from './plugins/SpinePlugin.min.js';
//import dragonBones from "./plugins/dragonBones";

const config = {
  type: Phaser.AUTO,
  parent: 'phaser-game',
  backgroundColor: '#222222',
  scale: {
    //width: '100%',
    //height: '100%',
    //mode: Phaser.Scale.NONE,
    width: 1024,
    height: 576,
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.DOM.CENTER_BOTH,
  },

  physics: {

  },
  plugins: {
    scene: [
      { key: 'SpinePlugin', plugin: window.SpinePlugin, mapping: 'spine' }
    ]
    /*scene: [
      { key: "DragonBones", plugin: dragonBones.phaser.plugin.DragonBonesScenePlugin, mapping: "dragonbone" }
    ],*/
  },
  scene: [Preloader]
};

const game = new Phaser.Game(config);
