import {Enemy} from './Enemy';
import {getPosition, getRandomInt} from '../utilities';
import spacestationImg from '../../assets/images/spacestation.png';
import defaults from '../../constants/spacestation.json';

export class SpaceStation extends Enemy {
  constructor(game, props) {
    super(game);
    const attr = {
      ...props,
      ...defaults,
    };

    // attributes
    this.item = attr.item;
    this.hp = attr.hp;
    this.contain = attr.contain;
    this.spin = attr.spin;

    // image
    this.img = new Image();
    this.img.src = spacestationImg;

    // size
    this.h = 80; //120
    this.w = 80; //120
    this.r = this.w / 2;

    // position
    this.x = getRandomInt(this.canvas.width * 0.1, this.canvas.width * 0.9);
    this.y = -this.h;


    // weapon
    this.tracking = attr.tracking;
    this.weaponSpeed = this.game.getVelocity() * attr.weaponSpeed;
    this.weaponType = attr.weaponType;
    this.weaponDelay = attr.weaponDelay;

    // behavior
    this.shoot();
    this.movement();
  }

  movement() {

    // TODO: set X position based on config setting
    this.x = getRandomInt(this.canvas.width * 0.1, this.canvas.width * 0.9);
    // TODO: set Y poisiont based on config setting
    this.y = -this.h;
    // arc left vs arc right based on entrance position
    this.g = 0;
    this.vy = this.game.getVelocity() * 2;
    this.vx = 1;
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
