import defaults from '../../constants/whitebird.json';
import whitebirdImg from '../../assets/images/whitebird.png';
import {Enemy} from './Enemy';
import {getPosition, getRandomInt} from '../utilities';
import * as Motion from '../../utils/movement';

export class Whitebird extends Enemy {
  constructor(game, props) {
    super(game);
    const attr = {
      ...props,
      ...defaults,
    };

    // attributes
    this.item = attr.item;
    this.hp = attr.hp;

    // image
    this.img = new Image();
    this.img.src = whitebirdImg;

    //size
    this.h = 67;
    this.w = 67;
    this.r = this.w / 2.1;

    // position
    this.x = attr.x
    this.y = attr.y

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
      this.getAngle();
      this.context.rotate(this.angle);
    }

    if (this.spin) {
      this.angle += 5;
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
