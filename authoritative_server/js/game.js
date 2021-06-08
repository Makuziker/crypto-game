const config = {
  type: Phaser.HEADLESS,
  parent: 'phaser-example',
  width: 800,
  height: 600,
  autoFocus: false, // so Phaser does not call window.focus()
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: { y: 0 }
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

function preload() { }

function create() {

}

function update() { }

const game = new Phaser.Game(config);

window.gameLoaded(); // HTTP server ready to start