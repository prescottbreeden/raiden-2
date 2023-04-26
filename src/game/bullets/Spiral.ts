import defaults from '../../constants/fireball.json';
import fireball from '../../assets/images/weaponfire/RLiGng-fireball-transparent-picture.png';
import { Game } from '../Game';
import { IBullet, IDrawableBullet } from './BulletFactory';
import { IEnemy } from '../../interfaces/IEnemy.interface';
import { newImage, publicProperty, useState } from '../../utils/general';

export function SpinCycle(game: Game, enemy: IEnemy) {
  const { readState, updateState } = useState<any>({
    ...defaults,
    x: enemy.x,
    y: enemy.y,
    vx: enemy.vx,
    vy: enemy.vy,
    img: newImage(fireball),
    radians: Date.now(), // party
  });

  const draw = () => {
    updateState({
      x: readState('x') + Math.cos(readState('radians')) * 3,
      y: readState('y') + Math.sin(readState('radians')) * 3,
    });
    game.bulletContext?.save();
    game.bulletContext?.translate(readState('x'), readState('y'));
    game.bulletContext?.drawImage(
      readState('img'),
      -(readState('w') / 2),
      -(readState('h') / 2),
      readState('h'),
      readState('w')
    );
    game.bulletContext?.restore();
  };

  const bulletObject: IDrawableBullet = {
    draw,
  } as IDrawableBullet;

  // Read-only properties
  Object.defineProperties(bulletObject, {
    ...publicProperty('h', () => readState('h')),
    ...publicProperty('vx', () => readState('vx')),
    ...publicProperty('vy', () => readState('vy')),
    ...publicProperty('w', () => readState('w')),
    ...publicProperty('x', () => readState('x')),
    ...publicProperty('y', () => readState('y')),
    ...publicProperty('class', () => readState('class')),
  });

  return bulletObject;
};
