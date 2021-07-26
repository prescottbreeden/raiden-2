import defaults from '../../constants/fireball.json';
import fireballImage from '../../assets/images/weaponfire/RLiGng-fireball-transparent-picture.png';
import { newImage, publicProperty, useState } from '../../utils/general';
import { Game } from '../Game';
import { aimAtPlayer } from '../../utils/weapons';
import { IEnemy } from '../../interfaces/IEnemy.interface';

export const Ball = (game: Game, enemy: IEnemy) => {
  const { readState: bullet, updateState: update } = useState<any>({
    ...enemy,
    ...defaults,
    img: newImage(fireballImage),
    radians: Date.now(),
  });

  if (enemy.aim) {
    const { vx, vy } = aimAtPlayer(game, bullet());
    update({ vx, vy });
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

  const bulletObject = {
    draw,
  };

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
