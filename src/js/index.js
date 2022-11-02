import Phaser from 'phaser';
//import Preloader from './scenes/Preloader.js';
import Arena from './scenes/Arena.js';
import * as SpinePlugin from './plugins/SpinePlugin.min.js';
//import dragonBones from "./plugins/dragonBones";

const config = {
  type: Phaser.AUTO,
  scale: {
    parent: 'phaser-game',
    width: '100%', //800
    height: '100%', //600
    mode: Phaser.Scale.NONE,
    //mode: Phaser.Scale.FIT,
    //autoCenter: Phaser.DOM.CENTER_BOTH,
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
  scene: [Arena]
};

const game = new Phaser.Game(config);
