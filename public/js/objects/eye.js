// import { EYE_BLACK_ASSET, EYE_WHITE_ASSET } from "../constants.js";

export class Eye extends Phaser.GameObjects.Sprite {
  /**
   * The black and white parts of a snake eye, with constraints
   * @param  {Phaser.Scene} scene scene object
   * @param  {Phaser.GameObjects.Sprite} head  snake head sprite
   * @param  {Number} scale scale of the new eye
   */
  constructor(scene, head, scale) {
    super(scene);
    this.scene = scene;
    this.head = head;
    this.scale = scale;
    this.eyeGroup = this.scene.add.group();
    // this.collisionGroup = this.game.physics.p2.createCollisionGroup();

    // constraints that will hold the circles in place
    // the lock will hold the white circle on the head, and the distance
    // constraint (dist) will keep the black circle within the white one
    this.lock = null;
    this.dist = null;

    this.whiteCircle = new Phaser.Geom.Circle(this.head.x, this.head.y, this.scale);
    this.whiteGraphics = this.scene.add.graphics({ fillStyle: { color: 0xffffff } });
    this.whiteGraphics.fillCircleShape(this.whiteCircle);

    this.blackCircle = new Phaser.Geom.Circle(
      this.whiteCircle.getPoint(0.75).x,
      this.whiteCircle.getPoint(0.75).y,
      this.scale * 0.5
    );
    this.blackGrapics = this.scene.add.graphics({ fillStyle: { color: 0x000000 }});
    this.blackGrapics.fillCircleShape(this.blackCircle);

    //initialize the circle sprites
    // this.whiteCircle = this.scene.add.image(
    //   this.head.body.x, this.head.body.y, EYE_WHITE_ASSET
    // );

    // this.whiteCircle = this.initCircle(this.whiteCircle);

    // this.blackCircle = this.scene.add.image(
    //   this.whiteCircle.body.x, this.whiteCircle.body.y, EYE_BLACK_ASSET
    // );
    // this.blackCircle = this.initCircle(this.blackCircle);
    // this.blackCircle.body.mass = 0.01;

    // this.target = new Phaser.Geom.Line(this.blackCircle.x, this.blackCircle.y, 0, 0);
    // this.boundary = new Phaser.Geom.Circle(
    //   this.blackCircle.x, this.blackCircle.y, this.whiteCircle.width / 2
    // );
  }

  /**
   * Initialize a circle, whether it is the black or white one
   * @param  {Phaser.GameObjects.Image} circle sprite to initialize
   * @return {Phaser.GameObjects.Image}        initialized circle
   */
  initCircle(circle) {
    // circle.scale = this.scale;
    // circle.body.clearShapes();
    //give the circle a circular physics body
    // circle.setCircle(circle.width * 0.5);
    // circle.body.addCircle(circle.width * 0.5);
    // circle.body.setCollisionGroup(this.collisionGroup);
    // circle.body.collides([]);
    // this.eyeGroup.add(circle);
    // return circle;
  }

  /**
   * Ensure that the circles of the eye are constrained to the head
   * @param  {Float32Array} offset Array in the form [x,y] of offset from the snake head
   */
  updateConstraints([x, y]) {
    this.currentOffsetX = x;
    this.currentOffsetY = y;
    // this.whiteCircle.setPosition(offset[0], offset[1]);

    // //change where the lock constraint of the white circle is if it already exists
    // if (this.lock) {
    //   this.lock.localOffsetB = [
    //     this.game.physics.p2.pxmi(offset[0]),
    //     this.game.physics.p2.pxmi(Math.abs(offset[1]))
    //   ];
    // }
    // //create a lock constraint if it doesn't already exist
    // else {
    //   this.lock = this.game.physics.p2.createLockConstraint(
    //     this.whiteCircle.body, this.head.body, offset, 0
    //   );
    // }

    // //change the distance of the distance constraint for
    // //the black circle if it exists already
    // if (this.dist) {
    //   this.dist.distance = this.game.physics.p2.pxm(this.whiteCircle.width * 0.25);
    // }
    // //create a distance constraint if it doesn't exist already
    // else {
    //   this.dist = this.game.physics.p2.createDistanceConstraint(
    //     this.blackCircle.body, this.whiteCircle.body, this.whiteCircle.width * 0.25
    //   );
    // }
  }

  /**
   * Set the eye scale
   * @param  {Number} scale new scale
   */
  setScale(scale) {
    this.scale = scale;
    // for (var i = 0; i < this.eyeGroup.children.length; i++) {
    //   var circle = this.eyeGroup.children[i];
    //   circle.scale.setTo(this.scale);
    //   //change the radii of the circle bodies using pure p2 physics
    //   circle.body.data.shapes[0].radius = this.game.physics.p2.pxm(circle.width * 0.5);
    // }
  }

  /**
   * Call from the update loop
   */
  update() {
    this.whiteCircle.setPosition(
      this.head.x + this.currentOffsetX,
      this.head.y + this.currentOffsetY
    );
    this.whiteGraphics.clear();
    this.whiteGraphics.fillCircleShape(this.whiteCircle);

    this.blackCircle.setPosition(
      this.whiteCircle.getPoint(0.75).x,
      this.whiteCircle.getPoint(0.75).y + this.blackCircle.radius,
    );
    this.blackGrapics.clear();
    this.blackGrapics.fillCircleShape(this.blackCircle);

    this.rotation = this.head.rotation;

    // const mousePosX = this.game.input.activePointer.worldX;
    // const mousePosY = this.game.input.activePointer.worldY;
    // const headX = this.head.body.x;
    // const headY = this.head.body.y;
    // const angle = Math.atan2(mousePosY - headY, mousePosX - headX);
    // const force = 300;
    // move the black circle of the eye towards the mouse
    // this.blackCircle.body.moveRight(force * Math.cos(angle));
    // this.blackCircle.body.moveDown(force * Math.sin(angle));
  }

  /**
   * Destroy this eye
   */
  destroy() {
    this.whiteCircle.destroy();
    this.blackCircle.destroy();
    // this.game.physics.p2.removeConstraint(this.lock);
    // this.game.physics.p2.removeConstraint(this.dist);
  }
}
