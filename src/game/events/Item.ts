import * as Movement from '../../utils/movement';
import blaster0 from '../../assets/images/orbs/blaster/frame0.png';
import blaster1 from '../../assets/images/orbs/blaster/frame1.png';
import blaster2 from '../../assets/images/orbs/blaster/frame2.png';
import blaster3 from '../../assets/images/orbs/blaster/frame3.png';
import blaster4 from '../../assets/images/orbs/blaster/frame3.png';
import blaster5 from '../../assets/images/orbs/blaster/frame3.png';
import spread0 from '../../assets/images/orbs/spread/frame0.png';
import spread1 from '../../assets/images/orbs/spread/frame1.png';
import spread2 from '../../assets/images/orbs/spread/frame2.png';
import spread3 from '../../assets/images/orbs/spread/frame3.png';
import spread4 from '../../assets/images/orbs/spread/frame3.png';
import spread5 from '../../assets/images/orbs/spread/frame3.png';
import { Game } from '../Game';
import { IEnemy } from '../../interfaces/IEnemy.interface';
import { cond } from 'ramda';
import { getRandomInt } from '../utilities';
import { newImage, publicProperty, useState } from '../../utils/general';

const orbs: { [key: string]: string[] } = {
  blaster: [blaster0, blaster1, blaster2, blaster3, blaster4, blaster5],
  spread: [spread0, spread1, spread2, spread3, spread4, spread5],
};
const types = ['blaster', 'spread'] as const;

export function Item({ game, enemy }: { game: Game; enemy: IEnemy }) {
  const { readState, updateState } = useState<any>({
    ...enemy,
    frame: 0,
    h: 50 * 0.67,
    r: enemy.w / 2,
    type: types[getRandomInt(0, types.length)],
    vx: 2,
    vy: 2,
    w: 50 * 0.67,
    x: enemy.x,
    y: enemy.y,
  });

  // cycle through weapon types
  const cycle = setInterval(() => {
    const current = types.indexOf(readState('type'));
    updateState({ type: types[(current + 1) % types.length] });
  }, 4000);

  const itemObject = {
    destroy: () => clearInterval(cycle),
    draw: () => {
      updateState({
        y: readState('y') + readState('vy'),
        x: readState('x') + readState('vx'),
      });

      cond([
        [Movement.leavingLeftRight, Movement.reverseVx],
        [Movement.leavingTopBottom, Movement.reverseVy],
      ])({ readState, updateState });

      game.context?.save();
      game.context?.translate(readState('x'), readState('y'));
      game.context?.drawImage(
        newImage(orbs[readState('type')][readState('frame')]),
        -(readState('w') / 2),
        -(readState('h') / 2),
        readState('w'),
        readState('h')
      );
      game.context?.restore();
      let counter = 0;
      if (counter % 10 === 0) {
        updateState({ frame: (readState('frame') + 1) % 6 });
      }
      counter++;
      counter %= 100;
    },
  };

  // Read-only properties
  Object.defineProperties(itemObject, {
    ...publicProperty('h', () => readState('h')),
    ...publicProperty('w', () => readState('w')),
    ...publicProperty('x', () => readState('x')),
    ...publicProperty('y', () => readState('y')),
    ...publicProperty('type', () => readState('type')),
  });

  return itemObject;
}
