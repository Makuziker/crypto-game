import { CIRCLE_ASSET, GAME_SCENE, MENU_SCENE, TILE_ASSET } from "../constants.js";
import { Snake } from "../objects/snake.js";
import { initSocketListeners, disconnect, playerAction } from "../socket/index.js";

export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: GAME_SCENE });

    /**
     * @type {GameState}
     */
    this.gameState = {};

    /**
    * @type {Object.<string, Snake>}
    */
    this.snakes = {};
  }

  init() {
  }

  preload() {
  }

  create() {
    this.socket = io();
    initSocketListeners(this.socket, this);
    this.background = this.add.tileSprite(0, 0, 4000, 4000, TILE_ASSET);
    this.background.setDepth(-9999);
    this.createExitButton();
    // this.cameras.main.setBounds(0, 0, this.background.displayWidth, this.background.displayHeight);

    this.input.on('pointermove', pointer => this.handlePointer(this.socket, pointer));
    this.input.on('pointerdown', pointer => this.handlePointer(this.socket, pointer));
    this.input.on('pointerup',   pointer => this.handlePointer(this.socket, pointer));
  }


  update(time, delta) {
    if (this.gameState.players) {
      const socketIds = Object.keys(this.gameState.players);
      const snakeIds = Object.keys(this.snakes);

      // delete snakes for non-existant socket IDs
      for (const id of snakeIds) {
        if (!socketIds.includes(id)) {
          this.snakes[id].destroy();
        }
      }

      for (const id of socketIds) {
        // spawn new snakes for each new socket ID
        if (!this.snakes[id]) {
          this.snakes[id] = new Snake(
            id,
            this.gameState.players[id],
            this,
            CIRCLE_ASSET
          );
        } else {
          // update the existing snake's position and rotation
          this.snakes[id].update(time, delta);
        }
      }
    }
  }

  updateGameState(newState) {
    // console.log(this.gameState, newState);
    this.gameState = {
      ...newState
    };
  }

  /**
   * Callback method, using `this` will not point to GameScene
   * @param socket
   * @param {Phaser.Input.Pointer} pointer
   */
  handlePointer(socket, pointer) {
    playerAction(socket, {
      pointerX: pointer.x,
      pointerY: pointer.y,
      isSpeeding: pointer.leftButtonDown()
    });
  }

  createExitButton() {
    this.add.text(10, 10, 'Exit', { fill: 'orange' })
      .setInteractive()
      .setScrollFactor(0, 0)
      .on('pointerdown', () => {
        console.log('Exiting to Menu');
        disconnect(this.socket);
        this.scene.start(MENU_SCENE);
      });
  }
}

/*
function create() {
  var self = this;
  this.socket = io();
  this.otherPlayers = this.physics.add.group();

  this.socket.on('currentPlayers', function (players) {
    Object.keys(players).forEach(function (id) {
      if (players[id].playerId === self.socket.id) {
        addPlayer(self, players[id]);
      } else {
        addOtherPlayers(self, players[id]);
      }
    });
  });

  this.socket.on('newPlayer', function (playerInfo) {
    addOtherPlayers(self, playerInfo);
  });

  this.socket.on('disconnect', function (playerId) {
    self.otherPlayers.getChildren().forEach(function (otherPlayer) {
      if (playerId === otherPlayer.playerId) {
        otherPlayer.destroy();
      }
    });
  });

  this.socket.on('playerMoved', function (playerInfo) {
    self.otherPlayers.getChildren().forEach(function (otherPlayer) {
      if (playerInfo.playerId === otherPlayer.playerId) {
        otherPlayer.setRotation(playerInfo.rotation);
        otherPlayer.setPosition(playerInfo.x, playerInfo.y);
      }
    });
  });

  this.cursors = this.input.keyboard.createCursorKeys();

  this.blueScoreText = this.add.text(16, 16, '', { fontSize: '32px', fill: '#0000FF' });
  this.redScoreText = this.add.text(584, 16, '', { fontSize: '32px', fill: '#FF0000' });

  this.socket.on('scoreUpdate', function (scores) {
    self.blueScoreText.setText('Blue: ' + scores.blue);
    self.redScoreText.setText('Red: ' + scores.red);
  });

  this.socket.on('starLocation', function (starLocation) {
    if (self.star) self.star.destroy();
    self.star = self.physics.add.image(starLocation.x, starLocation.y, 'star');
    self.physics.add.overlap(self.ship, self.star, function () {
      this.socket.emit('starCollected');
    }, null, self);
  });
}

function update() {
  if (this.ship) {
    // emit player movement
    var x = this.ship.x;
    var y = this.ship.y;
    var r = this.ship.rotation;
    if (this.ship.oldPosition && (x !== this.ship.oldPosition.x || y !== this.ship.oldPosition.y || r !== this.ship.oldPosition.rotation)) {
      this.socket.emit('playerMovement', { x: this.ship.x, y: this.ship.y, rotation: this.ship.rotation });
    }

    // save old position data
    this.ship.oldPosition = {
      x: this.ship.x,
      y: this.ship.y,
      rotation: this.ship.rotation
    };

    if (this.cursors.left.isDown) {
      this.ship.setAngularVelocity(-150);
    } else if (this.cursors.right.isDown) {
      this.ship.setAngularVelocity(150);
    } else {
      this.ship.setAngularVelocity(0);
    }

    if (this.cursors.up.isDown) {
      this.physics.velocityFromRotation(this.ship.rotation + 1.5, 100, this.ship.body.acceleration);
    } else {
      this.ship.setAcceleration(0);
    }

    this.physics.world.wrap(this.ship, 5);
  }
}

function addPlayer(self, playerInfo) {
  self.ship = self.physics.add.image(playerInfo.x, playerInfo.y, 'ship').setOrigin(0.5, 0.5).setDisplaySize(53, 40);
  if (playerInfo.team === 'blue') {
    self.ship.setTint(0x0000ff);
  } else {
    self.ship.setTint(0xff0000);
  }
  self.ship.setDrag(100);
  self.ship.setAngularDrag(100);
  self.ship.setMaxVelocity(200);
}

function addOtherPlayers(self, playerInfo) {
  const otherPlayer = self.add.sprite(playerInfo.x, playerInfo.y, 'otherPlayer').setOrigin(0.5, 0.5).setDisplaySize(53, 40);
  if (playerInfo.team === 'blue') {
    otherPlayer.setTint(0x0000ff);
  } else {
    otherPlayer.setTint(0xff0000);
  }
  otherPlayer.playerId = playerInfo.playerId;
  self.otherPlayers.add(otherPlayer);
}
*/