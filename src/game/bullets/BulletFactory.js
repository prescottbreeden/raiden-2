import { Spread } from './Spread';
import { Blaster } from './Blaster';
import { isOnScreen } from '../utilities';

const playerOffset = 2.5;
export class BulletFactory {
  constructor(game, ship) {
    this.game = game;
    this.canvas = game.canvas;
    this.context = game.context;
    this.ship = ship;
    this.bullets = [];
  }

  addBullets = (...bullets) => {
    const cleanUp = this.bullets.filter(isOnScreen);
    this.bullets = [...cleanUp, ...bullets];
  };

  // BLASTER
  blasterShot = () => {
    let bullet = new Blaster(this.game, this.ship);
    this.addBullets(bullet);
  };
  spread = () => ({
    1: [new Spread(this.game, this.ship, this.ship.x - playerOffset)],
    2: [
      new Spread(
        this.game,
        this.ship,
        this.ship.x - this.ship.w / 2,
        this.ship.y + this.ship.h / 2
      ),
      new Spread(
        this.game,
        this.ship,
        this.ship.x + this.ship.w / 2 - 5,
        this.ship.y + this.ship.h / 2
      ),
    ],
    3: [
      new Spread(this.game, this.ship, this.ship.x - this.ship.w / 4),
      new Spread(this.game, this.ship, this.ship.x + this.ship.w / 4 - 5),
    ],
    4: [
      new Spread(this.game, this.ship, this.ship.x - this.ship.w / 2, 0, {
        vx: -5,
        rotate: -0.1125,
      }),
      new Spread(this.game, this.ship, this.ship.x + this.ship.w / 2 - 5, 0, {
        vx: -5,
        rotate: -0.1125,
      }),
      new Spread(this.game, this.ship, this.ship.x - this.ship.w / 4, 0, {
        vx: -5,
        rotate: -0.1125,
      }),
      new Spread(this.game, this.ship, this.ship.x + this.ship.w / 4 - 5, 0, {
        vx: -5,
        rotate: -0.1125,
      }),
      new Spread(this.game, this.ship, this.ship.x - this.ship.w / 2, 0, {
        vx: 5,
        rotate: 0.1125,
      }),
      new Spread(this.game, this.ship, this.ship.x + this.ship.w / 2 - 5, 0, {
        vx: 5,
        rotate: 0.1125,
      }),
      new Spread(this.game, this.ship, this.ship.x - this.ship.w / 4, 0, {
        vx: 5,
        rotate: 0.1125,
      }),
      new Spread(this.game, this.ship, this.ship.x + this.ship.w / 4 - 5, 0, {
        vx: 5,
        rotate: 0.1125,
      }),
    ],
    5: [
      new Spread(this.game, this.ship, this.ship.x - this.ship.w / 2, 0, {
        vx: -10,
        rotate: -0.225,
      }),
      new Spread(this.game, this.ship, this.ship.x + this.ship.w / 2 - 5, 0, {
        vx: -10,
        rotate: -0.225,
      }),
      new Spread(this.game, this.ship, this.ship.x - this.ship.w / 4, 0, {
        vx: -10,
        rotate: -0.225,
      }),
      new Spread(this.game, this.ship, this.ship.x + this.ship.w / 4 - 5, 0, {
        vx: -10,
        rotate: -0.225,
      }),
      new Spread(this.game, this.ship, this.ship.x - this.ship.w / 2, 0, {
        vx: 10,
        rotate: 0.225,
      }),
      new Spread(this.game, this.ship, this.ship.x + this.ship.w / 2 - 5, 0, {
        vx: 10,
        rotate: 0.225,
      }),
      new Spread(this.game, this.ship, this.ship.x - this.ship.w / 4, 0, {
        vx: 10,
        rotate: 0.225,
      }),
      new Spread(this.game, this.ship, this.ship.x + this.ship.w / 4 - 5, 0, {
        vx: 10,
        rotate: 0.225,
      }),
    ],
    6: [
      new Spread(this.game, this.ship, this.ship.x - this.ship.w / 2, 0, {
        vx: -20,
        rotate: -0.45,
      }),
      new Spread(this.game, this.ship, this.ship.x + this.ship.w / 2 - 5, 0, {
        vx: -20,
        rotate: -0.45,
      }),
      new Spread(this.game, this.ship, this.ship.x - this.ship.w / 4, 0, {
        vx: -20,
        rotate: -0.45,
      }),
      new Spread(this.game, this.ship, this.ship.x + this.ship.w / 4 - 5, 0, {
        vx: -20,
        rotate: -0.45,
      }),
      new Spread(this.game, this.ship, this.ship.x - this.ship.w / 2, 0, {
        vx: 20,
        rotate: 0.45,
      }),
      new Spread(this.game, this.ship, this.ship.x + this.ship.w / 2 - 5, 0, {
        vx: 20,
        rotate: 0.45,
      }),
      new Spread(this.game, this.ship, this.ship.x - this.ship.w / 4, 0, {
        vx: 20,
        rotate: 0.45,
      }),
      new Spread(this.game, this.ship, this.ship.x + this.ship.w / 4 - 5, 0, {
        vx: 20,
        rotate: 0.45,
      }),
    ],
  });

  // SPREAD SHOT
  spreadShot = () => {
    this.addBullets(...this.spread()['1']);
    if (this.ship.weaponStr > 1) {
      this.addBullets(...this.spread()['2']);
    }
    if (this.ship.weaponStr > 2) {
      this.addBullets(...this.spread()['3']);
    }
    if (this.ship.weaponStr > 3) {
      this.addBullets(...this.spread()['4']);
    }
    if (this.ship.weaponStr > 4) {
      this.addBullets(...this.spread()['5']);
    }
    if (this.ship.weaponStr > 5) {
      this.addBullets(bullet15, bullet16, bullet17, bullet18);
    }
  };
  generatePlayerBullets() {
    const weapon = this.game.player.weaponType;
    if (weapon === 'blaster') {
      this.blasterShot();
    }
    if (weapon === 'spread') {
      this.spreadShot();
    }
  }

  generateEnemyBullets(interval) {}
}
