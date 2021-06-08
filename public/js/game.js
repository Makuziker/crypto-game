import { BootScene } from './scenes/bootScene.js';
import { MenuScene } from './scenes/menuScene.js';
import { GameScene } from './scenes/gameScene.js';

class Game extends Phaser.Game {
  constructor() {
    super({
      type: Phaser.AUTO,
      parent: 'game-container',
      width: window.innerWidth, // window.devicePixelRatio?
      height: window.innerHeight,
      physics: {
        default: 'arcade',
        // arcade: {
        //   debug: true,
        //   debugShowBody: true,
        //   gravity: { y: 0 }
        // }
      },
      scene: [
        BootScene,
        MenuScene,
        GameScene
      ]
    });
  }
}

new Game();
