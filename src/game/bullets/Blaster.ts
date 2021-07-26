import { newImage, publicProperty, useState } from '../../utils/general';
import spreadSrc from '../../assets/images/weaponfire/M484BulletCollection3.png';
import { Game } from '../Game';
import { IEnemy } from '../../interfaces/IEnemy.interface';

type TempGame = Game & {
  player: IEnemy & {
    weaponStr: number;
  };
};
export const Blaster = (game: TempGame) => {
  const { readState: bullet, updateState: update } = useState<any>({
    class: 'player',
    vy: -20,
    vx: 0,
    power: 5 + game.player.weaponStr * 1.25,
    img: newImage(spreadSrc),
    w: 5,
    h: 10,
  });

  switch (game.player.weaponStr) {
    case 1:
      update({ h: 45, w: 5 });
      break;
    case 2:
      update({ h: 55, w: 10 });
      break;
    case 3:
      update({ h: 75, w: 15 });
      break;
    case 4:
      update({ h: 75, w: 25 });
      break;
    case 5:
      update({ h: 75, w: 35 });
      break;
    case 6:
      update({ h: 75, w: 65 });
      break;
  }

  update({
    x: game.player.x - bullet('w') / 2,
    y: game.player.y,
    power: game.player.weaponStr * 10,
  });

  const drawCenter = () => {
    game.context?.save();
    if (game.context) {
      game.context.fillStyle = 'green';
    }
    game.context?.translate(bullet('x'), bullet('y'));
    game.context?.fillRect(
      bullet('w') / 2,
      0, // replace me with an image eventually
      bullet('w') / 2,
      bullet('h')
    );
    game.context?.restore();
  };

  const draw = () => {
    update({
      y: bullet('y') + bullet('vy'),
      x: bullet('x') + bullet('vx'),
    });
    game.context?.save();

    // blue beam
    game.context?.drawImage(
      bullet('img'), // img
      347, // sx
      200, // sy
      9, // swidth
      30, // sheight
      bullet('x'), // dx
      bullet('y'), // dy
      bullet('w'), // dwidth
      bullet('h') // dheight
    );
    game.context?.restore();
  };

  const bulletObject = {
    draw,
  };

  Object.defineProperties(bulletObject, {
    ...publicProperty('h', () => bullet('h')),
    ...publicProperty('vx', () => bullet('vx')),
    ...publicProperty('vy', () => bullet('vy')),
    ...publicProperty('w', () => bullet('w')),
    ...publicProperty('x', () => bullet('x')),
    ...publicProperty('y', () => bullet('y')),
    ...publicProperty('class', () => bullet('class')),
    ...publicProperty('power', () => bullet('power')),
  });

  return bulletObject;
};
