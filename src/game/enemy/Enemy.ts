// @ts-ignore
import retroShotBlaster from '../../assets/sfx/retro-shot-blaster-1.mp3';
import { Ball } from '../bullets/Ball';
import { Game, radian } from '../Game';
import { HEIGHT, WIDTH } from '../..';
import { aimAtPlayer } from '../../utils/weapons';
import { charge } from '../../utils/movement';
import { getPosition, shouldFire } from '../utilities';
import { pipe, prop } from 'ramda';
import { useState, value } from '../../utils/general';

// reusing same call stack
export const EnemyFunction = (game: Game, props: any) => {
  const img = new Image();
  img.src = props.src;

  const [getEnemy, setEnemy] = useState({
    ...props,
    game,
    img,
  });

  charge(game, getEnemy, setEnemy);

  const firing = setInterval(() => {
    if (shouldFire(getEnemy())) {
      const pew = new Audio(retroShotBlaster);
      pew.play();
      const bullet = new Ball(game, getEnemy());
      const { vx, vy } = aimAtPlayer(getEnemy());
      bullet.vx = vx;
      bullet.vy = vy;
      game.bulletFactory?.bullets.push(bullet);
    } else {
      clearInterval(firing);
    }
  }, value(getEnemy()).weaponDelay);

  const takeDamage = (dmg: number) => {
    const current = getEnemy();
    setEnemy({
      ...current,
      hp: current.hp - dmg,
    });
  };
  const draw = () => {
    const { vx, vy, gx, gy, x, y } = getEnemy();
    const updated = setEnemy({
      ...getEnemy(),
      vx: vx + gx,
      vy: vy + gy,
      y: y + vy,
      x: x + vx,
    });

    game.context?.save();
    game.context?.translate(updated.x, updated.y);

    game.context?.drawImage(
      updated.img,
      -(updated.w / 2),
      -(updated.h / 2),
      updated.h,
      updated.w
    );
    game.context?.restore();
  };

  const enemyObject = {
    getEnemy,
    takeDamage,
    draw,
  };

  const createProperty = (name: string, val: () => any) => ({
    [name]: {
      enumerable: true,
      get: val,
    },
  });

  Object.defineProperties(enemyObject, {
    ...createProperty('pointValue', pipe(getEnemy, prop('pointValue'))),
    ...createProperty('item', pipe(getEnemy, prop('item'))),
    ...createProperty('hp', pipe(getEnemy, prop('hp'))),
    ...createProperty('h', pipe(getEnemy, prop('h'))),
    ...createProperty('w', pipe(getEnemy, prop('w'))),
    ...createProperty('r', pipe(getEnemy, prop('r'))),
    ...createProperty('x', pipe(getEnemy, prop('x'))),
    ...createProperty('y', pipe(getEnemy, prop('y'))),
    ...createProperty('vx', pipe(getEnemy, prop('vx'))),
    ...createProperty('vy', pipe(getEnemy, prop('vy'))),
    ...createProperty('g', pipe(getEnemy, prop('g'))),
  });

  return enemyObject;
};

export class Enemy {
  game: Game;
  canvas: HTMLCanvasElement | undefined;
  context: CanvasRenderingContext2D | undefined | null;
  playerPosition: { x: number; y: number };
  angle: number;
  h: number;
  w: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  gx: number;
  gy: number;
  hp: number;
  img: HTMLImageElement;
  weaponDelay: number;
  contain: boolean;
  tracking: boolean;
  spin: boolean;

  constructor(game: Game) {
    this.game = game;
    this.canvas = game.canvas;
    this.context = game.context;
    this.playerPosition = getPosition(game.player);
    this.angle = 0;
    this.h = 0;
    this.w = 0;
    this.x = 0;
    this.y = 0;
    this.vx = 0;
    this.vy = 0;
    this.gx = 0;
    this.gy = 0;
    this.hp = 0;
    this.weaponDelay = 0;
    this.contain = false;
    this.tracking = false;
    this.spin = false;
    this.img = new Image();
  }

  getAngle() {
    this.angle =
      Math.atan2(
        this.playerPosition.y - this.y,
        this.playerPosition.x - this.x
      ) -
      Math.PI / 2;
  }

  fire() {
    throw Error('fire is not implemented');
  }

  movement() {
    throw Error('movement is not implemented');
  }

  shoot() {
    const firing = setInterval(() => {
      const { x, hp, y } = this;
      if (shouldFire({ hp, x, y })) {
        this.fire();
      } else {
        clearInterval(firing);
      }
    }, this.weaponDelay);
  }

  draw() {
    this.vx += this.gx;
    this.vy += this.gy;
    this.y += this.vy;
    this.x += this.vx;

    if (this.contain) {
      if (this.y + this.h > HEIGHT && this.vy > 0) {
        this.y = HEIGHT - this.h;
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
      if (this.x + this.w / 2 > WIDTH && this.vx > 0) {
        this.x = WIDTH - this.w / 2;
        this.vx *= -1;
      }
    }

    this.context?.save();
    this.context?.translate(this.x, this.y);

    if (this.tracking && this.context) {
      this.playerPosition = getPosition(this.game.player);
      this.angle =
        Math.atan2(
          this.playerPosition.y - this.y,
          this.playerPosition.x - this.x
        ) -
        Math.PI / 2;
      this.context.rotate(this.angle);
    }

    if (this.spin && this.context) {
      this.angle += 5 * radian;
      this.context.rotate(this.angle);
    }

    this.context?.drawImage(
      this.img,
      -(this.w / 2),
      -(this.h / 2),
      this.h,
      this.w
    );
    this.context?.restore();
  }
}
