import { GAME_ROOM } from '../constants';
import { Socket, Server } from 'socket.io';
import { getGameState } from '../model';

/**
 * @param {Socket} socket
 * @param {Server} io
 */
export const playerAction = (socket, io) => {
  socket.on('PLAYER_ACTION', async (controls) => {
    const gameState = getGameState();
    io.to(GAME_ROOM).emit('ON_GAME_STATE', gameState);
  });
}