import {Enemy} from './Enemy';
import {getPosition, getRandomInt} from '../utilities';
import blackbird from '../../assets/images/blackbird.png';
import defaults from '../../constants/blackbird.json';

export class Blackbird extends Enemy {
  constructor(game, props) {
    super(game);
    const attr = {
      ...props,
      ...defaults,
    };

    // attributes
    this.hp = 10;
    this.item = attr.item;

    // image
    this.img = new Image();
    this.img.src = blackbird;

    // size
    this.h = 67; // 100;
    this.w = 67; // 100;
    this.r = this.w / 2.1;

    // position

    // specs
    this.tracking = attr.tracking;
    this.contain = attr.contain;
    this.spin = attr.spin;

    // this.vy = game.getVelocity() * 8 * 2 / 3;

    this.weaponDelay = 1000;
    this.weaponSpeed = game.getVelocity() * attr.weaponSpeed;
    this.weaponType = 'ball';

    this.shoot();
    this.movement();
  }

  movement() {
    // TODO: set X position based on config setting
    this.x = getRandomInt(this.canvas.width * 0.1, this.canvas.width * 0.9);
    // TODO: set Y poisiont based on config setting
    this.y = -this.h;
    this.vy = this.game.getVelocity() * 8;
    this.g = -0.05;
    // arc left vs arc right based on entrance position
    if (this.x >= this.canvas.width / 2) {
      this.vx = 1;
    } else {
      this.vx = -1;
    }
  }

  draw() {
    this.vy += this.g;
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
