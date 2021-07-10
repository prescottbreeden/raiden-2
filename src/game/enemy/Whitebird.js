import * as Motion from '../../utils/movement';
import defaults from '../../constants/whitebird.json';
import retroShotBlaster from '../../assets/sfx/retro-shot-blaster-1.mp3';
import whitebirdImg from '../../assets/images/whitebird.png';
import { Ball } from '../bullets/Ball';
import { Enemy } from './Enemy';
import { aimAtPlayer } from '../../utils/weapons';
import { getPosition } from '../utilities';
import { radian } from '../Game';

export class Whitebird extends Enemy {
  constructor(game, props) {
    super(game);
    const attr = {
      ...defaults,
      ...props,
    };

    // attributes
    // this.item = attr.item;
    this.item = true;
    this.hp = attr.hp;
    this.pointValue = 100;

    // image
    this.img = new Image();
    this.img.src = whitebirdImg;

    //size
    this.h = 67;
    this.w = 67;
    this.r = this.w / 2.1;

    // position
    this.x = attr.x;
    this.y = attr.y;

    // specs
    this.tracking = attr.tracking;
    this.contain = attr.contain;
    this.spin = attr.spin;
    this.motion = attr.movement;

    // weapons
    this.weaponDelay = attr.weaponDelay;
    this.weaponSpeed = game.getVelocity() * attr.weaponSpeed;
    this.weaponType = attr.weaponType;

    // behavior
    // TODO: make this one scriptable behavior
    this.shoot();
    this.movement();
  }

  movement() {
    Motion.parabolic(this);
  }

  fire() {
    const pew = new Audio(retroShotBlaster);
    pew.play();
    const bullet = new Ball(this.game, this);
    const { vx, vy } = aimAtPlayer(this);
    bullet.vx = vx;
    bullet.vy = vy;
    this.game.bulletFactory.bullets.push(bullet);
  }

  draw() {
    this.vy += this.g;
    this.y += this.vy;
    this.x += this.vx;

    if (this.contain) {
      if (this.y + this.h > this.canvas.height && this.vy > 0) {
        this.y = this.canvas.height - this.h;
        this.vy *= -1;
      } else if (this.y < this.h / 2 && this.vy < 0) {
        this.y = this.h / 2;
        this.vy *= -1;
      } else if (this.x < this.w / 2 && this.vx < 0) {
        this.x = this.w / 2;
        this.vx *= -1;
      } else if (this.x + this.w / 2 > this.canvas.width && this.vx > 0) {
        this.x = this.canvas.width - this.w / 2;
        this.vx *= -1;
      } else {
        console.error('ruh roh');
      }
    }

    this.context.save();
    this.context.translate(this.x, this.y);

    if (this.tracking) {
      this.playerPosition = getPosition(this.game.player);
      // TODO: fix this abstraction
      this.getAngle();
      this.context.rotate(this.angle);
    } else if (this.spin) {
      this.angle += 5 * radian;
      this.context.rotate(this.angle);
    }

    this.context.drawImage(
      this.img,
      -(this.w / 2),
      -(this.h / 2),
      this.h,
      this.w
    );
    this.context.restore();
  }
}
