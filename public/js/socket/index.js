export function initSocketListeners(socket, scene) {
  socket.on('connect', () => {
    socket.emit('JOIN_GAME', { name: 'brogan' });
  });

  socket.on('ON_GAME_STATE', state => scene.updateGameState(state));
}


/**
 * @param {Socket} socket
 * @param {PlayerControls} controls
 */
export function playerAction(socket, controls) {
  socket.emit('PLAYER_ACTION', controls);
}

export function disconnect(socket) {
  socket.disconnect();
}