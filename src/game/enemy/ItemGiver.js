import retroShotBlaster from '../../assets/sfx/retro-shot-blaster-1.mp3';
import defaults from '../../constants/itemGiver.json';
import itemGiverImg from '../../assets/images/item-giver-2.png';
import { Ball } from '../bullets/Ball';
import { Enemy } from './Enemy';
import { aimAtPlayer } from '../../utils/weapons';
import { getRandomInt } from '../utilities';

export class ItemGiver extends Enemy {
  constructor(game, props) {
    super(game);
    const attr = {
      ...defaults,
      ...props,
    };

    // attributes
    this.item = attr.item;
    this.hp = attr.hp;
    this.contain = attr.contain;
    this.spin = attr.spin;
    // TODO set point value based on current weapon level
    this.pointValue = 500;

    // image
    this.img = new Image();
    this.img.src = itemGiverImg;

    // size
    this.h = 80; //120
    this.w = 80; //120
    this.r = this.w / 2;

    // position
    this.x = getRandomInt(this.canvas.width * 0.1, this.canvas.width * 0.9);
    this.y = -this.h;
    this.angle = 0;

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

  fire() {
    const pew = new Audio(retroShotBlaster);
    pew.play();
    const bullet = new Ball(this.game, this);
    const { vx, vy } = aimAtPlayer(this);
    bullet.vx = vx;
    bullet.vy = vy;
    this.game.bulletFactory.bullets.push(bullet);
  }
}
