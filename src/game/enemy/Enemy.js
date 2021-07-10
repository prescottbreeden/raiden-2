import retroShotBlaster from '../../assets/sfx/retro-shot-blaster-1.mp3';
import { Ball } from '../bullets/Ball';
import { aimAtPlayer } from '../../utils/weapons';
import { charge } from '../../utils/movement';
import { getPosition, shouldFire } from '../utilities';
import { useState, value } from '../../utils/general';
import { pipe, prop } from 'ramda';

// reusing same call stack
export const EnemyFunction = (game, props) => {
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
      game.bulletFactory.bullets.push(bullet);
    } else {
      clearInterval(firing);
    }
  }, value(getEnemy()).weaponDelay);

  const takeDamage = (dmg) => {
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

    game.context.save();
    game.context.translate(updated.x, updated.y);

    game.context.drawImage(
      updated.img,
      -(updated.w / 2),
      -(updated.h / 2),
      updated.h,
      updated.w
    );
    game.context.restore();
  };

  const enemyObject = {
    getEnemy,
    takeDamage,
    draw,
  };

  const createProperty = (name, val) => ({
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

// const getAngle = () => {
//   const angle =
//     Math.atan2(
//       getPosition(game.player).y - value(enemy).y,
//       getPosition(game.player).x - value(enemy).x
//     ) -
//     Math.PI / 2;
//   setEnemy({ ...value(enemy), angle });
// };
// if (enemy.contain) {
//   if (enemy.y + enemy.h > HEIGHT && enemy.vy > 0) {
//     enemy.y = HEIGHT - enemy.h;
//     enemy.vy *= -1;
//   }
//   if (enemy.y < enemy.h / 2 && enemy.vy < 0) {
//     enemy.y = enemy.h / 2;
//     enemy.vy *= -1;
//   }
//   if (enemy.x < enemy.w / 2 && enemy.vx < 0) {
//     enemy.x = enemy.w / 2;
//     enemy.vx *= -1;
//   }
//   if (enemy.x + enemy.w / 2 > WIDTH && enemy.vx > 0) {
//     enemy.x = WIDTH - enemy.w / 2;
//     enemy.vx *= -1;
//   }
// }
// if (this.tracking) {
//   this.playerPosition = getPosition(this.game.player);
//   this.angle =
//     Math.atan2(
//       this.playerPosition.y - this.y,
//       this.playerPosition.x - this.x
//     ) -
//     3.141 / 2;
//   this.context.rotate(this.angle);
// }

// if (this.spin) {
//   this.angle += 5 * radian;
//   this.context.rotate(this.angle);
// }

export class Enemy {
  constructor(game) {
    this.game = game;
    this.canvas = game.canvas;
    this.context = game.context;
    this.playerPosition = getPosition(game.player);
    this.angle = 0;
  }

  // TODO: cleanup
  getAngle() {
    this.angle =
      Math.atan2(
        this.playerPosition.y - this.y,
        this.playerPosition.x - this.x
      ) -
      Math.PI / 2;
  }

  shoot() {
    const firing = setInterval(() => {
      if (shouldFire(this)) {
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
