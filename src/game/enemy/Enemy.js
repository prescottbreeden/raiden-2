import retroShotBlaster from '../../assets/music/retro-shot-blaster.mp3';
import {Ball} from '../bullets/Ball';
import {getPosition, getDistance, isOnScreen} from '../utilities';
// import {radian} from '../Game';

export class Enemy {
  constructor(game) {
    this.game = game;
    this.canvas = game.canvas;
    this.context = game.context;
    this.playerPosition = getPosition(game.player);

    this.getAngle();
    // specs
  }

  getAngle() {
    this.angle =
      Math.atan2(
        this.playerPosition.y - this.y,
        this.playerPosition.x - this.x
      ) -
      Math.PI / 2;
  }

  setWeaponDelay() {
    if (this.hp > 0 || isOnScreen(this)) {
      const pew = new Audio(retroShotBlaster);
      pew.play();
      const bullet = new Ball(this.game, this);
      const player = getPosition(this.game.player);
      const distance = getDistance(this.game.player, this);
      // what am I calculating here?
      bullet.vx = ((player.x - this.x) / distance) * this.weaponSpeed;
      bullet.vy = ((player.y - this.y) / distance) * this.weaponSpeed;
      this.game.bulletFactory.bullets.push(bullet);
    }
  }
  // this method is caching the initial load state
  // and so it never knows when to stop firing
  shoot() {
    const firing = setInterval(() => {
      this.setWeaponDelay()
      if (this.hp <= 0 || !isOnScreen(this)) {
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
