import explosionImg from '../../assets/images/explosion.png';
import { IEnemy } from '../../interfaces/IEnemy.interface';
import { newImage, publicProperty, useState } from '../../utils/general';
import { Game } from '../Game';

export const Explosion = (game: Game, enemy: IEnemy) => {
  const { readState: explosion, updateState: update } = useState<any>({
    ...enemy,
    src: explosionImg,
    img: newImage(explosionImg),
    col: 0,
    row: 0,
  });

  const updateFrame = () => {
    let col = explosion('col');
    let row = explosion('row');
    col++;
    if (col === 9) {
      row++;
      col %= 9;
    }
    update({ row, col });
  };
  const draw = () => {
    update({
      y: explosion('y') + explosion('vy'),
      x: explosion('x') + explosion('vx'),
    });

    game.context?.drawImage(
      explosion('img'),
      100 * explosion('col'),
      100 * explosion('row'),
      100,
      100,
      explosion('x') - 50,
      explosion('y') - 50,
      explosion('w'),
      explosion('h')
    );
    // cycle through grid of images to animate
    updateFrame();
  };

  const explosionObject = {
    draw,
  };

  // Read-only properties
  Object.defineProperties(explosionObject, {
    ...publicProperty('h', () => explosion('h')),
    ...publicProperty('r', () => explosion('r')),
    ...publicProperty('w', () => explosion('w')),
    ...publicProperty('x', () => explosion('x')),
    ...publicProperty('y', () => explosion('y')),
    ...publicProperty('vx', () => explosion('vx')),
    ...publicProperty('vy', () => explosion('vy')),
  });

  return explosionObject;
};
