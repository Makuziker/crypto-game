import { GAME_SCENE, MENU_SCENE } from '../constants.js';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: MENU_SCENE });
  }
  init() {
    // first hook, where you can instantiate plugins, transfer data between scenes
  }

  preload() {

  }

  create() {
    this.add.text(this.game.config.width / 2, 100, 'Main Menu', { fill: 'white' });

    this.add.text(this.game.config.width / 2, 200, 'Enter Game', { fill: 'limegreen' })
      .setInteractive()
      .on('pointerdown', () => {
        console.log('Entering Game Scene');
        this.scene.start(GAME_SCENE);
      });
  }

  update() {
    // re-runs every 16ms
  }
}

/*
<div id="instructions-container">
<p>Food is the game's currency</p>
<p>When a player joins a game, some of their food is distributed throughout the arena, and some is stored in their tail</p>
<p>Eat food to grow larger</p>
<p>Using speed boost costs food</p>
<p>Running into an opponent's tail results in death and loss of food</p>
<p>Kill other players to eat their dropped food</p>
<p>Chase down fast particles to lock in some of your food into winnings</p>
<p>Exiting back to menu while alive will bring back your original size in food and forfeit the rest</p>
</div>
<div id="currency-container">
<p>Your Food: 500</p>
<button>Buy 1000 Food</button>
<button>Buy 5000 food</button>
<button>Sell Food</button>
</div>
<div class="form-container">
<input type="text" placeholder="Enter a name" id="name-input" />
<button onclick="joinGame()">ENTER GAME (Costs 100 Food)</button>
</div>
<input type="text">
*/