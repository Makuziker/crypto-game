import {
  BOOT_SCENE,
  CIRCLE_ASSET,
  EYE_BLACK_ASSET,
  EYE_WHITE_ASSET,
  FOOD_ASSET,
  MENU_SCENE,
  TILE_ASSET,
  WHITE_SHADOW_ASSET
} from "../constants.js";

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: BOOT_SCENE });
  }

  preload() {
    const progress = this.add.graphics();
    console.log('loading game...');

    this.load.on('progress', value => {
      progress.clear();
      progress.fillStyle(0xffffff, 1);
      progress.fillRect(0, this.game.config.height / 2, this.game.config.width * value, 60);
    });

    this.load.on('complete', () => {
      progress.destroy();
      this.game.scene.start(MENU_SCENE);
    });

    const assetsPathStr = '../../assets/';
    this.load.image(FOOD_ASSET,         `${assetsPathStr}${FOOD_ASSET}.png`);
    this.load.image(CIRCLE_ASSET,       `${assetsPathStr}${CIRCLE_ASSET}.png`);
    this.load.image(WHITE_SHADOW_ASSET, `${assetsPathStr}${WHITE_SHADOW_ASSET}.png`);
    this.load.image(EYE_BLACK_ASSET,    `${assetsPathStr}${EYE_BLACK_ASSET}.png`);
    this.load.image(EYE_WHITE_ASSET,    `${assetsPathStr}${EYE_WHITE_ASSET}.png`);
    this.load.image(TILE_ASSET,         `${assetsPathStr}${TILE_ASSET}.png`);
    this.load.image('snake-head',      `${assetsPathStr}snake-head.png`);
  }
}