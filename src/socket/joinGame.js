import { GAME_ROOM } from '../constants';
import { Socket, Server } from 'socket.io';
import { getGameState, spawnNewPlayer } from '../model';

/**
 * @param {Socket} socket
 * @param {Server} io
 */
export const joinGame = (socket, io) => {
  socket.on('JOIN_GAME', async (request) => {
    socket.join(GAME_ROOM);

    spawnNewPlayer(socket.id, request.name);

    const gameState = getGameState();

    io.to(GAME_ROOM).emit('ON_GAME_STATE', gameState);
  });
}