import { Bullet } from './Bullet';
import bulletSrc from '../../assets/images/M484BulletCollection2.png';

export class Spread extends Bullet {
  constructor(game, ship, x = 0, y = 0, { vx, rotate } = { vx: 0, rotate: 0 }) {
    super(game, ship);

    this.class = 'player';
    this.ship = ship;
    this.vy = -20;
    this.vx = vx ? vx : 0;
    this.power = 4 + ship.weaponStr * 1.25;
    this.w = 5;
    this.h = 10;
    this.img = null;
    this.rotate = rotate ? rotate : 0;
    // this.x = ship.x - this.w;
    x !== 0 ? (this.x = x) : (this.x = ship.x - this.w / 2);
    y !== 0 ? (this.y = y) : (this.y = ship.y);

    this.create();
  }

  create() {
    if (this.img === null) {
      this.img = new Image(bulletSrc);
    }
  }

  draw() {
    this.y += this.vy;
    this.x += this.vx;
    this.context.save();
    this.context.translate(this.x, this.y);
    this.context.fillStyle = 'red';
    this.context.fillRect(0, 0, this.w, this.h);
    this.context.rotate(this.rotate);
    // this.context.drawImage(
    //   this.img,
    //   100 * this.col,
    //   100 * this.row,
    //   100,
    //   100,
    //   this.x - 50,
    //   this.y - 50,
    //   this.w,
    //   this.h
    // );
    // this.context.drawImage(this.img, 500, 200, 20, 20, 0, 0, 20, 20);
    this.context.restore();
  }
}
