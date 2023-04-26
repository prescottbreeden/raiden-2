import { Ball } from '../game/bullets/Ball';
import { EnemyState } from '../interfaces/IStateObject.interface';
import { EnemyWeaponName } from '../types/EnemyWeaponName.type';
import { Game } from '../game/Game';
import { IEnemy } from '../interfaces/IEnemy.interface';
// import { IShip } from '../interfaces/IShip.interface';
import { SpinCycle } from '../game/bullets/Spiral';
import { getDistance } from '../game/utilities';
import { shouldFire } from '../game/utilities';

export const aimAtPlayer = (game: Game, enemy: IEnemy) => {
  const distance = getDistance(game.player, enemy);
  return {
    vx: ((game.player.x - enemy.x) / distance) * enemy.weaponSpeed,
    vy: ((game.player.y - enemy.y) / distance) * enemy.weaponSpeed,
  };
};

const spincycle = (game: Game, enemy: EnemyState) => {
  const firing = setInterval(() => {
    if (!game.bulletFactory) return;
    if (enemy('vy') === 0) {
      if (shouldFire(enemy())) {
        game.sfx.playSfx('minigun');
        game.bulletFactory.addBullets(SpinCycle(game, enemy()));
      } else {
        clearInterval(firing);
      }
    }
  }, enemy('weaponDelay'));
  return [firing];
};

const ball = (game: Game, enemy: EnemyState) => {
  game.bulletFactory?.addBullets(Ball(game, enemy()));
  const firing = setInterval(() => {
    if (shouldFire(enemy())) {
      game.sfx.playSfx('retroShotBlaster');
      game.bulletFactory?.addBullets(Ball(game, enemy()));
    } else {
      clearInterval(firing);
    }
  }, enemy('weaponDelay'));
  return [firing];
};

const trishot = (game: Game, enemy: EnemyState) => {
  const firing = setInterval(() => {
    if (!game.bulletFactory) return;
    if (shouldFire(enemy())) {
      game.sfx.playSfx('retroShotBlaster');
      game.bulletFactory.addBullets(
        Ball(game, { ...enemy(), vx: 0, vy: enemy('weaponSpeed') }),
        Ball(game, { ...enemy(), vx: -2, vy: enemy('weaponSpeed') }),
        Ball(game, { ...enemy(), vx: 2, vy: enemy('weaponSpeed') })
      );
    } else {
      clearInterval(firing);
    }
  }, enemy('weaponDelay'));
  return [firing];
};

// this seems to work well
const setAsyncTimeout = (cb: Function, timout: number) => new Promise(resolve => {
  setTimeout(() => {
    cb();
    resolve(undefined);
  }, timout);
})

const spacestationBoss = async (game: Game, enemy: EnemyState) => {
  let firing: NodeJS.Timer;
  await setAsyncTimeout(() => {
      firing = setInterval(() => {
        if (!game.bulletFactory) return;
        if (shouldFire(enemy())) {
          game.sfx.playSfx('retroShotBlaster');
          game.bulletFactory.addBullets(
            Ball(game, { ...enemy(), vx: 0, vy: enemy('weaponSpeed') }),
            Ball(game, { ...enemy(), vx: -2, vy: enemy('weaponSpeed') }),
            Ball(game, { ...enemy(), vx: 2, vy: enemy('weaponSpeed') })
          );
        } else {
          clearInterval(firing);
        }
      }, 600);
  }, 500)

  await setAsyncTimeout(() => {
    clearInterval(firing)
  }, 5000)

  await setAsyncTimeout(() => {
    clearInterval(firing)
    firing = setInterval(() => {
      if (!game.bulletFactory) return;
      if (enemy('vy') === 0) {
        if (shouldFire(enemy())) {
          game.sfx.playSfx('minigun');
          game.bulletFactory.addBullets(SpinCycle(game, enemy()));
        } else {
          clearInterval(firing);
        }
      }
    }, 50);
  }, 2500)

  await setAsyncTimeout(() => {
    clearInterval(firing)
  }, 5000)

  await setAsyncTimeout(() => {
      firing = setInterval(() => {
        if (!game.bulletFactory) return;
        if (shouldFire(enemy())) {
          game.sfx.playSfx('retroShotBlaster');
          game.bulletFactory.addBullets(
            Ball(game, { ...enemy(), vx: 0, vy: enemy('weaponSpeed') }),
            Ball(game, { ...enemy(), vx: -2, vy: enemy('weaponSpeed') }),
            Ball(game, { ...enemy(), vx: 2, vy: enemy('weaponSpeed') })
          );
        } else {
          clearInterval(firing);
        }
      }, 600);
  }, 2500)

  await setAsyncTimeout(() => {
    clearInterval(firing)
  }, 5000)

  await setAsyncTimeout(() => {
    clearInterval(firing)
    firing = setInterval(() => {
      if (!game.bulletFactory) return;
      if (enemy('vy') === 0) {
        if (shouldFire(enemy())) {
          game.sfx.playSfx('minigun');
          game.bulletFactory.addBullets(SpinCycle(game, enemy()));
        } else {
          clearInterval(firing);
        }
      }
    }, 50);
  }, 2500)

  await setAsyncTimeout(() => {
    clearInterval(firing)
  }, 5000)

  await setAsyncTimeout(() => {
    clearInterval(firing)
    firing = setInterval(() => {
      if (!game.bulletFactory) return;
      if (enemy('vy') === 0) {
        if (shouldFire(enemy())) {
          game.sfx.playSfx('minigun');
          game.bulletFactory.addBullets(SpinCycle(game, enemy()));
        } else {
          clearInterval(firing);
        }
      }
    }, 50);
  }, 2500)

  return [];
};

export const fire = (weaponType: EnemyWeaponName) => {
  const weaponTypes = {
    ball,
    flak: ball,
    rip: ball,
    shotgun: ball,
    sniper: ball,
    spincycle,
    sprinkler: ball,
    trishot,
    boss: spacestationBoss,
  };
  return weaponTypes[weaponType];
};
