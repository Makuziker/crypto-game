import { GAME_ROOM } from "../constants";
import { getGameState, removePlayer } from "../model";

export const disconnect = (socket, io) => {
  socket.on('disconnect', reason => {
    console.log('Client disconnected', socket.id, reason, new Date().toLocaleTimeString());
    removePlayer(socket.id);
    const gameState = getGameState();
    io.to(GAME_ROOM).emit('ON_GAME_STATE', gameState);
  });
}