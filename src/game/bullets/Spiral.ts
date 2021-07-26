import defaults from '../../constants/fireball.json';
import fireball from '../../assets/images/weaponfire/RLiGng-fireball-transparent-picture.png';
import { Game } from '../Game';
import { newImage, publicProperty, useState } from '../../utils/general';
import { IEnemy } from '../../interfaces/IEnemy.interface';

export const SpinCycle = (game: Game, enemy: IEnemy) => {
  const { readState: bullet, updateState: update } = useState<any>({
    ...enemy,
    ...defaults,
    img: newImage(fireball),
    radians: Date.now(),
  });

  const draw = () => {
    update({
      x: bullet('x') + Math.cos(bullet('radians')) * 3,
      y: bullet('y') + Math.sin(bullet('radians')) * 3,
    });
    game.bulletContext?.save();
    game.bulletContext?.translate(bullet('x'), bullet('y'));
    game.bulletContext?.drawImage(
      bullet('img'),
      -(bullet('w') / 2),
      -(bullet('h') / 2),
      bullet('h'),
      bullet('w')
    );
    game.bulletContext?.restore();
  };

  const bulletObject = {
    draw,
  };

  // Read-only properties
  Object.defineProperties(bulletObject, {
    ...publicProperty('h', () => bullet('h')),
    ...publicProperty('vx', () => bullet('vx')),
    ...publicProperty('vy', () => bullet('vy')),
    ...publicProperty('w', () => bullet('w')),
    ...publicProperty('x', () => bullet('x')),
    ...publicProperty('y', () => bullet('y')),
    ...publicProperty('class', () => bullet('class')),
  });

  return bulletObject;
};
