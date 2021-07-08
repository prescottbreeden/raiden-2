import blackbird from '../../assets/images/blackbird.png';
import defaults from '../../constants/blackbird.json';
import {Enemy} from './Enemy';
import {getPosition} from '../utilities';
import * as Motion from '../../utils/movement';

export class Blackbird extends Enemy {
  constructor(game, props) {
    super(game);
    const attr = {
      ...props,
      ...defaults,
    };

    // attributes
    this.hp = attr.hp;
    this.item = attr.item;

    // image
    this.img = new Image();
    this.img.src = blackbird;

    // size
    this.h = 67; // 100;
    this.w = 67; // 100;
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
    this.weaponType = 'ball';

    // behavior
    // TODO: make this one scriptable behavior
    this.shoot();
    this.movement();
  }

  movement() {
    Motion.charge(this);
  }

  draw() {
    this.vx += this.gx;
    this.vy += this.gy;
    this.y += this.vy;
    this.x += this.vx;

    if (this.contain) {
      if (this.y + this.h > this.canvas.height && this.vy > 0) {
        this.y = this.canvas.height - this.h;
        this.vy *= -1;
      }
      if (this.y < this.h / 2 && this.vy < 0) {
        this.y = this.h / 2;
        this.vy *= -1;
      }
      if (this.x < this.w / 2 && this.vx < 0) {
        this.x = this.w / 2;
        this.vx *= -1;
      }
      if (this.x + this.w / 2 > this.canvas.width && this.vx > 0) {
        this.x = this.canvas.width - this.w / 2;
        this.vx *= -1;
      }
    }

    this.context.save();
    this.context.translate(this.x, this.y);

    if (this.tracking) {
      this.playerPosition = getPosition(this.game.player);
      this.angle =
        Math.atan2(
          this.playerPosition.y - this.y,
          this.playerPosition.x - this.x
        ) -
        3.141 / 2;
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
