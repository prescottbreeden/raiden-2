import { getRandomInt } from '../utilities';
import blaster0 from '../../assets/images/orbs/blaster/frame0.png';
import blaster1 from '../../assets/images/orbs/blaster/frame1.png';
import blaster2 from '../../assets/images/orbs/blaster/frame2.png';
import blaster3 from '../../assets/images/orbs/blaster/frame3.png';
import blaster4 from '../../assets/images/orbs/blaster/frame3.png';
import blaster5 from '../../assets/images/orbs/blaster/frame3.png';
import spread0 from '../../assets/images/orbs/spread/frame0.png';
import spread1 from '../../assets/images/orbs/spread/frame1.png';
import spread2 from '../../assets/images/orbs/spread/frame2.png';
import spread3 from '../../assets/images/orbs/spread/frame3.png';
import spread4 from '../../assets/images/orbs/spread/frame3.png';
import spread5 from '../../assets/images/orbs/spread/frame3.png';

const orbs = {
  blaster: [blaster0, blaster1, blaster2, blaster3, blaster4, blaster5],
  spread: [spread0, spread1, spread2, spread3, spread4, spread5],
};

export class Item {
  constructor(game, enemy) {
    this.game = game;
    this.canvas = game.canvas;
    this.context = game.context;

    this.frame = 0;
    this.types = ['blaster', 'spread'];
    // this.index = getRandomInt(0, this.types.length);
    this.index = 1;
    this.prop = this.types[this.index];
    this.src = null;
    this.img = null;
    // this.src = `../../assets/images/orbs/${this.prop}/frame${this.frame}.png`;
    this.x = enemy.x;
    this.y = enemy.y;
    this.h = 50 * 0.67;
    this.w = 50 * 0.67;
    this.r = (this.w / 2) * 0.67;
    this.vx = 2;
    this.vy = 2;

    this.create();
    this.changeWeapon();
  }

  create() {
    this.src = orbs[this.prop][this.frame];
    this.img = new Image();
    this.img.src = this.src;
  }

  changeWeapon() {
    // const item = this;
    // setInterval(function () {
    //   item.index++;
    //   item.index %= item.types.length;
    //   item.prop = item.types[item.index];
    // }, 4000);
  }

  draw() {
    if (this.img != null) {
      this.y += this.vy;
      this.x += this.vx;
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
      this.context.save();
      this.src = orbs.blaster[this.frame];
      this.context.translate(this.x, this.y);
      this.create();
      this.context.drawImage(
        this.img,
        -(this.w / 2),
        -(this.h / 2),
        this.w,
        this.h
      );
      this.context.restore();
      let counter = 0;
      if (counter % 10 === 0) {
        this.frame++;
      }
      counter++;
      counter %= 100;
      this.frame %= 6;
    }
  }
}
