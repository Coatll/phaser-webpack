import configData from '../config.js';
import Arena from './Arena.js';
//import Gui from '../core/GuiPads.js';
//import Pads from './Pads.js';
import en_us from '../lang/en_us.json';
import cs_cz from '../lang/cs_cz.json';
//import DBmanager from '../../shared/src/scenes/DBmanager.js';

export default class Preloader extends Phaser.Scene {
    constructor () {
        //console.log('preloader')
        super({ key: 'Preloader' });
    }

    preload() {
        console.log('preload');
        //this.facebook.once('startgame', this.startGame, this); //**FB
        //this.facebook.showLoadProgress(this); //**FB

        /*this.load.baseURL = 'src/assets/img/';
        this.load.multiatlas('atlas', 'atlas.json');
        this.load.multiatlas('atlas2', 'atlas2.json');*/

        this.load.setPath('../../assets/images/');
        this.load.image('block', 'block1.png');
        this.load.image('circle', 'circle1.png');
    }

    create() {
        this.orientationAngle = 0;
        if (configData['allowLandscapeMode']) {
            this.testOrientation();
        }

        //loadBoneAnims();
        this.startGame();
    }

    /*loadBoneAnims() {
      this.dbManager = this.scene.add('DBmanager', DBmanager, true, {x: 0, y: 0});
      this.dbManager.events.on('dbready', this.onDBready, this);
    }*/

    onDBready() {
        if (!this.arena) this.startGame();
    }

    startGame() {
        //console.log('startGame');
        this.gameSize = {x: this.game.scale.width, y: this.game.scale.height};
        this.lang();
        //this.pads = this.scene.add('Pads', Pads, true, {x: 0, y: 0});
        this.startArena();

        /* //already in arena.js:
        if (configData['allowLandscapeMode']) {
          this.scale.on('orientationchange', (ori) => {
              this.blockScreen((ori == Phaser.Scale.LANDSCAPE) != this.isLandscape(), this.angleOfOrientation(ori))
          })
        }*/
    }

    lang() {
        const langFiles = {
            'cs-CZ' : cs_cz,
            'en-US' : en_us
        }
        const lang = window.navigator.userLanguage || window.navigator.language;
        this.texts = langFiles[lang];
        if (!this.texts) this.texts = langFiles[configData['language']]; //en_us;
        //console.log('language texts:')
        //console.log(this.texts)
    }

  screenSize() {
      const screenW = this.scale.parent.clientWidth;
      const screenH = this.scale.parent.clientHeight;
      const size = {x: screenW, y: screenH};
      return size;
  }

  //-----------------------------------resizing------------------------------------------

  /* //already in arena.js:
  blockScreen(value, angle) {
    //block (true) or unblock (false)
    console.log('blockScreen '+angle);
    if (value) {
        document.getElementById('phaser-game').style.visibility = 'hidden';
        document.getElementById('change-orientation').style.visibility = 'visible';
    } else {
        document.getElementById('phaser-game').style.visibility = 'visible';
        document.getElementById('change-orientation').style.visibility = 'hidden';
    }
  }*/

  angleOfOrientation(ori) {
    let angle = 0;
    switch(ori) {
        case 'landscape-primary': angle = 90; break;
        case 'landscape-secondary': angle = 90; break;
        case 'portrait-primary': angle = 0; break;
        case 'portrait-secondary': angle = 180; break;
    }
    return angle;
  }

  isLandscape() {
      if (!configData['allowLandscapeMode']) return false;
      return Math.abs(this.orientationAngle) == 90;
  }

  testOrientation() {
    //test orientation
    const ori = this.scale.orientation; //screen.msOrientation || screen.mozOrientation || (screen.orientation || {}).type;
    //this.scale.lockOrientation(ori); //lock the orientation to its initial state
    let newAngle = (this.scale.parent.clientWidth > this.scale.parent.clientHeight ? 90 : 0) //this.angleOfOrientation(ori);
    const dif = newAngle - this.orientationAngle;
    console.log('preloader: orientation %s, change %i', ori, dif);
    if (dif == 0) return; //nothing to change
    //this.reorientAll(dif);
    this.orientationAngle += dif;
}

  //-------------------------

    startArena() {
        console.log('starting the arena');
        this.arena = this.scene.add('Arena', Arena, true, {x: 0, y: 0});
    }

    /*addGui() {
        this.gui = this.scene.add('Gui', Gui, true, {x: 0, y: 0});
    }*/

    /*screenSize() {
        const w = window,
        d = document,
        e = d.documentElement,
        g = d.getElementsByTagName('body')[0];
        const screenW = w.innerWidth || e.clientWidth || g.clientWidth;
        const screenH = w.innerHeight|| e.clientHeight|| g.clientHeight;
        return {x: screenW, y:screenH}
    }*/

    //-------------------------

    langText(str) {
        //text in the current language for the key string str
        //return configData['texts'][configData['language']][str];
        return this.texts[str];
    }

    static getTextureAndFrame(key, atlas = null) {
        //depending on what the app version uses (atlases or single images), decide what is texture and what is frame
        //it is assumed that base64 images would be in single form, whereas normal images would be in atlases
        const value = {texture: null, frame: null}
        if (configData['useAtlases']) {
            if (!atlas) atlas = 'atlas';
            value.texture = atlas;
            value.frame = key;
        } else {
            value.texture = key;
            value.frame = null;
        }
        return value;
    }

    //----------------------------spine--------------------------------------------------

    loadSpine(scene, key, jsonfile, atlas) {
        //load spine to scene
        var spLoader = scene.load.spine( key, jsonfile, atlas);
        this.spData = spLoader.systems.spine.json.entries;
        //console.log(this.spData);
    }

    addUpgraded(sc, x, y, key, anim, loop = false) {
        this.upgradeSpineData(key);
        return sc.add.spine(x, y, key, anim, loop);
    }

    upgradeSpineData(key) {
        //upgrade skin data structure exported for older spine version
        //call in create(), after loading and before adding to scene
        if (!this.upgradeSpineSkins(key)) return;
        this.upgradeSpineCurves(key);
    }

    upgradeSpineSkins(key) {
        //upgrade skins data structure
        var skins, skinsNew;
        skins = this.spData.entries[key].skins;
        if (skins[0]) {
            console.warn(key + ' already upgraded');
            return 0;
        }
        skinsNew = [
            {"name":"default","attachments": skins['default']}
        ]
        this.spData.entries[key].skins = skinsNew;
        return 1;
    }

    upgradeSpineCurves(key) {
        //upgrade the data structure of animation curves 
        //console.log('upgradeSpineCurves '+ key);
        const anims = this.spData.entries[key].animations;
        //console.log(anims);
        for (var anim in anims)
        if (anims.hasOwnProperty(anim)) {
            //console.log(anims[anim]);
            //console.log(anims[anim]['bones'])
            for (var bone in anims[anim]['bones'])
            if (anims[anim]['bones'].hasOwnProperty(bone)) {
                //console.log(bone)
                for (var action in anims[anim]['bones'][bone])
                if (anims[anim]['bones'][bone].hasOwnProperty(action)) {
                    for (var step in anims[anim]['bones'][bone][action])
                    if (anims[anim]['bones'][bone][action].hasOwnProperty(step)) {
                        //console.log(step)
                        for (var entry in anims[anim]['bones'][bone][action][step])
                        if (anims[anim]['bones'][bone][action][step].hasOwnProperty(entry)) {
                            if (entry == "curve") {
                                var step1 = anims[anim]['bones'][bone][action][step];
                                entry = step1[entry];
                                //console.log(entry);
                                if (typeof entry == 'string') continue; // "curve": "stepped"
                                //console.log(typeof entry)
                                //if (typeof entry != 'array') {
                                if (!entry.length) {
                                    console.warn(key + ' curves already upgraded');
                                    return 0;
                                }
                                if (entry.length != 4) {
                                    console.warn(key + ' unexpected curve length');
                                    return 0;
                                }
                                step1["c2"] = step1["curve"][1];
                                step1["c3"] = step1["curve"][2];
                                step1["c4"] = step1["curve"][3];
                                step1["curve"] = step1["curve"][0];
                                //console.log(anim + ' curve upgraded');   
                            }
                        }
                    }
                }
            }
        }
        return 1;
    }

    /*upgradeAllSpineData() {
        console.log(this.spData)
        this.spData.forEach(element => {
            this.upgradeSpineData(element);
        });
    }*/

//--------------------------------------------------------------------------------------------------------------

}
