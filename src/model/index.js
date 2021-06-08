const food = {
  'abcd': {
    id: 'abcd',
    x: 100,
    y: 150,
    value: 1
  }
};

const players = {};

const cashInParticles = {};

export function getFood() {
  return food;
}

export function getGameState() {
  return {
    food: getFood(),
    players: getPlayerData()
  }
}

export function getPlayerData() {
  return players;
}

export function spawnNewPlayer(id, name) {
  const x = Math.random() * 200;
  const y = Math.random() * 200;
  const rotation = Math.PI * 1.5; // faces upward in Phaser
  players[id] = {
    name: name || 'anonymous',
    isAlive: true,
    isSpeeding: false,
    snakeLength: 1,
    snakeSections: [
      {
        isHead: true,
        x,
        y,
        rotation
      },
      {
        isHead: false,
        x,
        y: y + 10,
        rotation
      }
    ]
  }
}

export function removePlayer(id) {
  delete players[id];
}
