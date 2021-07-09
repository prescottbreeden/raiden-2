import {getPosition, shouldFire} from '../utilities';
// import {radian} from '../Game';

export class Enemy {
  constructor(game) {
    this.game = game;
    this.canvas = game.canvas;
    this.context = game.context;
    this.playerPosition = getPosition(game.player);
    this.angle = 0;
  }

  // TODO: cleanup
  getAngle() {
    this.angle =
      Math.atan2(
        this.playerPosition.y - this.y,
        this.playerPosition.x - this.x
      ) -
      Math.PI / 2;
  }

  shoot() {
    const firing = setInterval(() => {
      if (shouldFire(this)) {
        this.fire()
      } else {
        clearInterval(firing);
      }
    }, this.weaponDelay);
  }

  // debug
  // drawCenter() {
  //   let centerX = this.x;
  //   let centerY = this.y;
  //   this.context.save();
  //   this.context.beginPath();
  //   this.context.strokeStyle = 'yellow';
  //   this.context.arc(centerX, centerY, 33.3, 0, 360 * radian);
  //   this.context.arc(centerX, centerY, 50 * 0.67, 0, 360 * radian);
  //   this.context.stroke();
  //   this.context.restore();
  // }
}
