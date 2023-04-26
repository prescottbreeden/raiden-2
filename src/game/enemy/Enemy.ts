import * as Movement from '../../utils/movement';
import * as Weapons from '../../utils/weapons';
import { Game, radian } from '../Game';
import { IEnemy } from '../../interfaces/IEnemy.interface';
import { IShip } from '../../interfaces/IShip.interface';
import { IStageOptions } from '../../interfaces/IStageOptions.interface';
import { WIDTH } from '../..';
import { cond } from 'ramda';
import { enemyDefaults } from '../../utils/enemies';
import { images } from '../../utils/images';
import { newImage, publicProperty, useState } from '../../utils/general';

// TODO generate left/right entrace properly
const generateRandomEntrance = (defaults: any, props: any): number => {
  return props.enter === 'random'
    ? Math.floor(Math.random() * WIDTH)
    : props.x ?? defaults.x ?? WIDTH / 2;
};

export function Enemy(game: Game, props: IStageOptions) {
  const img = images[props.type]
    ? newImage(images[props.type])
    : newImage(images.spacestation);

  const { readState, updateState } = useState<IEnemy>({
    ...enemyDefaults[props.type],
    ...props,
    img,
    x: generateRandomEntrance(enemyDefaults, props),
  });

  Movement.move(readState('movement'))(game, readState, updateState);
  Weapons.fire(readState('weaponType'))(game, readState);

  // got an inside-out issue with lack of telling factories to clear memory
  // might make sense to go with object pool to just let the objects get reused
  // especially since I already have a shouldFire function
  // const clearCurrentTimeouts = () => {
  //   movementTimeouts.map(clearTimeout);
  //   weaponIntervals.map(clearInterval);
  // };

  const takeDamage = (dmg: number): void => {
    const hp = readState('hp') - dmg;
    updateState({
      hp,
      hit: true,
    });
  };

  const draw = (): void => {
    const { x: playerX, y: playerY } = game.player! as unknown as IShip;
    updateState({
      vx: readState('vx') + readState('gx'),
      vy: readState('vy') + readState('gy'),
      y: readState('y') + readState('vy'),
      x: readState('x') + readState('vx'),
    });
    game.context?.save();
    game.context?.translate(readState('x'), readState('y'));

    // if enemy.tracking, aim the enemy at player
    if (readState('tracking') && readState('movement') !== 'kamakaze') {
      const angle =
        Math.atan2(playerY - readState('y'), playerX - readState('x')) -
        Math.PI / 2;
      game.context?.rotate(angle);
    }

    // if enemy is suicidal, rapidly accelerate after it slows down to fire
    // TODO -- rename 'kamakaze' to something less offensive
    if (readState('movement') === 'kamakaze') {
      if (readState('vy') <= 0) {
        updateState({ gy: (readState('gy') + 0.15) % 2 });
      }
    }

    // if enemy.contain, let it bounce off edges
    if (readState('contain')) {
      cond([
        [Movement.leavingLeftRight, Movement.reverseVx],
        [Movement.leavingTopBottom, Movement.reverseVy],
      ])({ readState, updateState });
    }

    // if enemy.spin rotate it in a circle
    if (readState('spin')) {
      updateState({ angle: readState('angle') + 5 * radian });
      game.context?.rotate(readState('angle'));
    }

    // draw an enemey bubble over the enemy if they took damage
    if (readState('hit')) {
      updateState({ hit: false });
      if (game.context) {
        game.context.beginPath();
        game.context.arc(0, 0, readState('r'), 0, 360 * radian, false);
        game.context.fillStyle = 'rgba(350, 350, 350, .2)';
        game.context.fill();
      }
    }

    // redraw src image
    game.context?.drawImage(
      readState('img'),
      -(readState('w') / 2),
      -(readState('h') / 2),
      readState('w'),
      readState('h')
    );

    game.context?.restore();
  };

  const enemyObject = {
    takeDamage,
    draw,
  };

  // Read-only properties
  Object.defineProperties(enemyObject, {
    ...publicProperty('explosion', () => readState('explosion')),
    ...publicProperty('item', () => readState('item')),
    ...publicProperty('h', () => readState('h')),
    ...publicProperty('hp', () => readState('hp')),
    ...publicProperty('pointValue', () => readState('pointValue')),
    ...publicProperty('r', () => readState('r')),
    ...publicProperty('vx', () => readState('vx')),
    ...publicProperty('vy', () => readState('vy')),
    ...publicProperty('w', () => readState('w')),
    ...publicProperty('x', () => readState('x')),
    ...publicProperty('y', () => readState('y')),
  });

  return enemyObject;
}
