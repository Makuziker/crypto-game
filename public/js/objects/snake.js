import { Shadow } from './shadow.js';
import { EyePair } from './eyePair.js';
import { CIRCLE_ASSET } from '../constants.js';

export class Snake extends Phaser.GameObjects.Sprite {
  /**
   * @param {string} id From the player's socket.id
   * @param {player} snakeState
   * @param {Phaser.Scene} scene
   * @param {string} texture
   */
  constructor(id, snakeState, scene, texture) {
    super(scene);

    // if (!this.scene.snakes) this.scene.snakes = [];
    // this.scene.snakes.push(this);

    this.snakeId = id;
    this.snakeState = snakeState;
    // this.scale = 10;
    // this.fastSpeed = 200;
    // this.slowSpeed = 130;
    // this.speed = this.slowSpeed;
    // this.rotationSpeedRad = 1 * Math.PI; // radians per second, used to be rotationSpeed = 40
    // this.rotationSpeedDeg = Phaser.Math.RadToDeg(this.rotationSpeedRad);
    // this.angleTolerance = 0.02 * this.rotationSpeedRad;

    this.spriteKey = texture;
    // this.sections = [];
    // this.headPath = [];
    // this.food = [];
    // this.preferredDistance = this.scale;
    // this.queuedSections = 0;
    this.shadow = new Shadow(this.scene, this.sections, this.scale);
    this.sectionGroup = this.scene.add.group();

    this.snakeState.snakeSections.forEach((sectionState, i) => {
      this.addSectionAtPosition(sectionState, -i);
    });

    // this.eyes = new EyePair(this.scene, this.head, this.scale);

    // this.edgeOffset = 4;
    /**
     * The part of the body that can collide with other snakes.
     * Locked to the snake head and slightly smaller.
     */
    // this.edge = this.scene.physics.add.image(this.head.x, this.head.y - this.edgeOffset);
    // this.edge.depth = -1;
    // Todo: create collider object

    this.onDestroyedCallbacks = [];
    this.onDestroyedContexts = [];
  }

  /**
   * Add a section to the snake at a given position
   * @param  {snakeSection} snakeSection
   * @param  {Number} z depth, front sections should overlap back sections
   * @return {Phaser.GameObjects.Image} new section
   */
  addSectionAtPosition({ x, y, rotation, isHead }, z = 0) {
    const sec = this.scene.physics.add.image(x, y, this.spriteKey);
    this.sectionGroup.add(sec);
    sec.setDepth(z);
    sec.setRotation(rotation);
    sec.setCircle(sec.width * 0.5);
    // this.shadow.add(x, y);
    if (isHead) {
      this.head = sec;
      this.head.snake = this;
      this.head.setTexture('snake-head'); // todo add eyes back
      // this.head.body.setVelocity(this.speed, 0);
    }
    return sec;
  }

  /**
   * Add to the queue of new sections
   * @param  {Integer} amount Number of sections to add to queue
   */
  addSectionsAfterLast(amount) {
    this.queuedSections += amount;
  }

  /**
   * Main event loop.
   * Update the snake's GameObjects to the latest values in the GameScene.gameState pointer.
   * @param {number} time
   * @param {number} delta
   */
  update(time, delta) {
    this.sectionGroup.getChildren().forEach((section, i) => {
      section.x = this.snakeState.snakeSections[i].x;
      section.y = this.snakeState.snakeSections[i].y;
      section.rotation = this.snakeState.snakeSections[i].rotation;
    });

    // this.moveHeadToPointer(this.scene.input.activePointer, delta);
    // broken, the entire array shrinks up into the same x/y coordinates
    // perhaps I'll have to use preferredDistance
    // Phaser.Actions.ShiftPosition(this.sectionGroup.getChildren(), this.startingX, this.startingY, 1);
    // this.edge.setPosition(this.head.x, this.head.y);
    // this.eyes.update();
  }


  /**
   *
   * @param {Phaser.Input.Pointer} pointer
   * @param {Number} delta change in time in ms
   */
  moveHeadToPointer(pointer, delta) {
    const angleToPointer = Phaser.Math.Angle.Between(
      this.head.x,
      this.head.y,
      pointer.x,
      pointer.y,
    );

    const angleDelta = Phaser.Math.Angle.Wrap(angleToPointer - this.head.rotation);

    if (Phaser.Math.Within(angleDelta, 0, this.angleTolerance)) {
      this.head.body.setAngularVelocity(0);
    } else {
      this.head.rotation = Phaser.Math.Angle.RotateTo(
        this.head.rotation,
        angleToPointer,
        this.rotationSpeedRad * 0.0001 * delta
      );
      // this.head.body.setAngularVelocity(Math.sign(angleDelta) * this.rotationSpeedDeg);
    }

    // this.scene.physics.velocityFromRotation(this.head.rotation, this.speed, this.head.body.velocity);
  }

  /**
   * Call from the main update loop
   */
  updateOld() {
    var speed = this.speed;
    this.head.body.moveForward(speed);

    //remove the last element of an array that contains points which
    //the head traveled through
    //then move this point to the front of the array and change its value
    //to be where the head is located
    var point = this.headPath.pop();
    point.setTo(this.head.body.x, this.head.body.y);
    this.headPath.unshift(point);

    //place each section of the snake on the path of the snake head,
    //a certain distance from the section before it
    var index = 0;
    var lastIndex = null;
    for (var i = 0; i < this.snakeLength; i++) {

      this.sections[i].body.x = this.headPath[index].x;
      this.sections[i].body.y = this.headPath[index].y;

      //hide sections if they are at the same position
      if (lastIndex && index == lastIndex) {
        this.sections[i].alpha = 0;
      }
      else {
        this.sections[i].alpha = 1;
      }

      lastIndex = index;
      //this finds the index in the head path array that the next point
      //should be at
      index = this.findNextPointIndex(index);
    }

    //continuously adjust the size of the head path array so that we
    //keep only an array of points that we need
    if (index >= this.headPath.length - 1) {
      var lastPos = this.headPath[this.headPath.length - 1];
      this.headPath.push(new Phaser.Point(lastPos.x, lastPos.y));
    }
    else {
      this.headPath.pop();
    }

    //this calls onCycleComplete every time a cycle is completed
    //a cycle is the time it takes the second section of a snake to reach
    //where the head of the snake was at the end of the last cycle
    var i = 0;
    var found = false;
    while (this.headPath[i].x != this.sections[1].body.x &&
      this.headPath[i].y != this.sections[1].body.y) {
      if (this.headPath[i].x == this.lastHeadPosition.x &&
        this.headPath[i].y == this.lastHeadPosition.y) {
        found = true;
        break;
      }
      i++;
    }
    if (!found) {
      this.lastHeadPosition = new Phaser.Point(this.head.body.x, this.head.body.y);
      this.onCycleComplete();
    }

    //update the eyes and the shadow below the snake
    this.eyes.update();
    this.shadow.update();
  }

  /**
   * Find in the headPath array which point the next section of the snake
   * should be placed at, based on the distance between points
   * @param  {Integer} currentIndex Index of the previous snake section
   * @return {Integer}              new index
   */
  findNextPointIndex(currentIndex) {
    var pt = this.headPath[currentIndex];
    //we are trying to find a point at approximately this distance away
    //from the point before it, where the distance is the total length of
    //all the lines connecting the two points
    var prefDist = this.preferredDistance;
    var len = 0;
    var dif = len - prefDist;
    var i = currentIndex;
    var prevDif = null;
    //this loop sums the distances between points on the path of the head
    //starting from the given index of the function and continues until
    //this sum nears the preferred distance between two snake sections
    while (i + 1 < this.headPath.length && (dif === null || dif < 0)) {
      //get distance between next two points
      var dist = Util.distanceFormula(
        this.headPath[i].x, this.headPath[i].y,
        this.headPath[i + 1].x, this.headPath[i + 1].y
      );
      len += dist;
      prevDif = dif;
      //we are trying to get the difference between the current sum and
      //the preferred distance close to zero
      dif = len - prefDist;
      i++;
    }

    //choose the index that makes the difference closer to zero
    //once the loop is complete
    if (prevDif === null || Math.abs(prevDif) > Math.abs(dif)) {
      return i;
    }
    else {
      return i - 1;
    }
  }

  /**
   * Called each time the snake's second section reaches where the
   * first section was at the last call (completed a single cycle)
   */
  onCycleComplete() {
    if (this.queuedSections > 0) {
      var lastSec = this.sections[this.sections.length - 1];
      this.addSectionAtPosition(lastSec.body.x, lastSec.body.y);
      this.queuedSections--;
    }
  }

  /**
   * Set snake scale
   * @param  {Number} scale Scale
   */
  setScale(scale) {
    this.scale = scale;
    this.preferredDistance = 17 * this.scale;

    //update edge lock location with p2 physics
    this.edgeLock.localOffsetB = [
      0, this.game.physics.p2.pxmi(this.head.width * 0.5 + this.edgeOffset)
    ];

    //scale sections and their bodies
    for (var i = 0; i < this.sections.length; i++) {
      var sec = this.sections[i];
      sec.scale.setTo(this.scale);
      sec.body.data.shapes[0].radius = this.game.physics.p2.pxm(sec.width * 0.5);
    }

    //scale eyes and shadows
    this.eyes.setScale(scale);
    this.shadow.setScale(scale);
  }

  /**
   * Increment length and scale
   */
  incrementSize() {
    this.addSectionsAfterLast(1);
    this.setScale(this.scale * 1.01);
  }

  /**
   * Destroy the snake
   */
  destroy() {
    delete this.scene.snakes[this.id];
    this.sectionGroup.destroy(true, true);
    // this.eyes.destroy();
    // this.shadow.destroy();
    // release food

    // call this snake's destruction callbacks
    // for (var i = 0; i < this.onDestroyedCallbacks.length; i++) {
    //   if (typeof this.onDestroyedCallbacks[i] == "function") {
    //     this.onDestroyedCallbacks[i].apply(
    //       this.onDestroyedContexts[i], [this]);
    //   }
    // }
  }

  /**
   * Called when the front of the snake (the edge) hits something
   * @param  {Phaser.Physics.P2.Body} phaserBody body it hit
   */
  edgeContact(phaserBody) {
    //if the edge hits another snake's section, destroy this snake
    if (phaserBody && this.sections.indexOf(phaserBody.sprite) == -1) {
      this.destroy();
    }
    //if the edge hits this snake's own section, a simple solution to avoid
    //glitches is to move the edge to the center of the head, where it
    //will then move back to the front because of the lock constraint
    else if (phaserBody) {
      this.edge.body.x = this.head.body.x;
      this.edge.body.y = this.head.body.y;
    }
  }

  /**
   * Add callback for when snake is destroyed
   * @param  {Function} callback Callback function
   * @param  {Object}   context  context of callback
   */
  addDestroyedCallback(callback, context) {
    this.onDestroyedCallbacks.push(callback);
    this.onDestroyedContexts.push(context);
  }
}