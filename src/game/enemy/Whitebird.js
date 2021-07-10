import * as Motion from '../../utils/movement';
import defaults from '../../constants/whitebird.json';
import retroShotBlaster from '../../assets/sfx/retro-shot-blaster-1.mp3';
import whitebirdImg from '../../assets/images/whitebird.png';
import { Ball } from '../bullets/Ball';
import { Enemy } from './Enemy';
import { aimAtPlayer } from '../../utils/weapons';

export class Whitebird extends Enemy {
  constructor(game, props) {
    super(game);
    const attr = {
      ...defaults,
      ...props,
    };

    // attributes
    this.item = attr.item;
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
}
