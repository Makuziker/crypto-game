import { Eye } from './eye.js';

export class EyePair extends Phaser.GameObjects.Sprite {
  /**
   * Creates a pair of eyes
   * @param  {Phaser.Scene} scene  scene object
   * @param  {Phaser.GameObjects.Sprite} head  Snake head sprite
   * @param  {Number} scale scale of eyes
   */
  constructor(scene, head, scale) {
    super(scene);
    this.scene = scene;
    this.head = head;
    this.scale = scale;
    this.eyes = [];

    const offset = this.getOffset();
    this.leftEye = new Eye(this.scene, this.head, this.scale);
    this.leftEye.updateConstraints([-offset.x, -offset.y]);
    this.eyes.push(this.leftEye);

    this.rightEye = new Eye(this.scene, this.head, this.scale);
    this.rightEye.updateConstraints([offset.x, -offset.y]);
    this.eyes.push(this.rightEye);
  }

  getOffset() {
    const xDim = this.head.width * 0.25;
    const yDim = this.head.width * .125;
    return { x: xDim, y: yDim };
  }

  /**
   * Set the scale of the eyes
   * @param  {Number} scale new scale
   */
   setScale(scale) {
    this.leftEye.setScale(scale);
    this.rightEye.setScale(scale);

    const offset = this.getOffset();
    this.leftEye.updateConstraints([-offset.x, -offset.y]);
    this.rightEye.updateConstraints([offset.x, -offset.y]);
  }

  /**
   * Call from snake update loop
   */
  update() {
    this.leftEye.update();
    this.rightEye.update();
  }

  /**
   * Destroy this eye pair
   */
  destroy() {
    this.leftEye.destroy();
    this.rightEye.destroy();
  }
}

