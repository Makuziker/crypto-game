/**
 * @typedef {{
 *  isHead: boolean,
 *  x: number,
 *  y: number,
 *  rotation: number
 * }} snakeSection
 */
/**
 * @typedef {{
 *  name: string,
 *  isAlive: boolean,
 *  isSpeeding: boolean,
 *  snakeLength: number
 *  snakeSections: snakeSection[]
 * }} player
 */
/**
 * @typedef {Object.<string, player>} players
 */
/**
 * @typedef {{
 *  id: string,
 *  x: number,
 *  y: number,
 *  value: number
 * }} foodItem
 */
/**
 * @typedef {Object.<string, foodItem>} food
 */
/**
 * @typedef {{
 *  players: players
 *  food: food
 * }} GameState
 */

/**
 * @typedef {{
 *  pointerX: number,
 *  pointerY: number,
 *  isSpeeding: boolean
 * }} PlayerControls
 */