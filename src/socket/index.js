import { Server } from 'socket.io';
import { playerAction } from './playerAction';
import { disconnect } from './disconnect';
import { joinGame } from './joinGame';

let initialized = false;

/**
 * Initialize socket.io server and event listeners
 * @param {Server} server httpServer
 * @returns {Server} io
 */
export default async function initializeSockets(server) {
  if (initialized) return;

  const io = new Server(server);

  io.on('connection', socket => {
    console.log('New client connected:', socket.id, new Date().toLocaleTimeString());

    const listeners = [
      disconnect,
      joinGame,
      playerAction
    ];
    listeners.forEach(cb => cb(socket, io));
  });

  initialized = true;
  return io;
}