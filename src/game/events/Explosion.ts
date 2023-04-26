import explosionImg from '../../assets/images/explosion.png';
import { Game } from '../Game';
import { IEnemy } from '../../interfaces/IEnemy.interface';
import { newImage, publicProperty, useState } from '../../utils/general';

export function Explosion(game: Game, enemy: IEnemy) {
  const { readState, updateState } = useState<any>({
    ...enemy,
    src: explosionImg,
    img: newImage(explosionImg),
    col: 0,
    row: 0,
  });

  // cycle through grid of images to animate
  const updateFrame = () => {
    let col = readState('col');
    let row = readState('row');
    col++;
    if (col === 9) {
      row++;
      col %= 9;
    }
    updateState({ row, col });
  };

  const explosionObject = {
    draw: () => {
      updateState({
        y: readState('y') + readState('vy'),
        x: readState('x') + readState('vx'),
      });

      game.context?.drawImage(
        readState('img'),
        100 * readState('col'),
        100 * readState('row'),
        100,
        100,
        readState('x') - 50,
        readState('y') - 50,
        readState('w'),
        readState('h')
      );
      updateFrame();
    },
  };

  // Read-only properties
  Object.defineProperties(explosionObject, {
    ...publicProperty('h', () => readState('h')),
    ...publicProperty('r', () => readState('r')),
    ...publicProperty('w', () => readState('w')),
    ...publicProperty('x', () => readState('x')),
    ...publicProperty('y', () => readState('y')),
    ...publicProperty('vx', () => readState('vx')),
    ...publicProperty('vy', () => readState('vy')),
  });

  return explosionObject;
};
