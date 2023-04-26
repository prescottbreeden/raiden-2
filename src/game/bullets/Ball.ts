import defaults from '../../constants/fireball.json';
import fireballImage from '../../assets/images/weaponfire/RLiGng-fireball-transparent-picture.png';
import { Game } from '../Game';
import { IDrawableBullet } from './BulletFactory';
import { IEnemy } from '../../interfaces/IEnemy.interface';
import { aimAtPlayer } from '../../utils/weapons';
import { newImage, publicProperty, useState } from '../../utils/general';

export const Ball = (game: Game, enemy: IEnemy) => {
  const { readState: bullet, updateState: update } = useState<any>({
    ...enemy,
    ...defaults,
    img: newImage(fireballImage),
    radians: Date.now(),
  });

  if (enemy.aim) {
    update(aimAtPlayer(game, bullet()));
  }

  const draw = () => {
    update({
      vx: bullet('vx') + bullet('gx'),
      vy: bullet('vy') + bullet('gy'),
      y: bullet('y') + bullet('vy'),
      x: bullet('x') + bullet('vx'),
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

  const bulletObject: IDrawableBullet = {
    draw,
  } as IDrawableBullet;

  // Read-only properties
  Object.defineProperties(bulletObject, {
    ...publicProperty('h', () => bullet('h')),
    ...publicProperty('r', () => bullet('r')),
    ...publicProperty('w', () => bullet('w')),
    ...publicProperty('x', () => bullet('x')),
    ...publicProperty('y', () => bullet('y')),
  });

  return bulletObject;
};
