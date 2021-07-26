import spreadSrc from '../../assets/images/weaponfire/M484BulletCollection3.png';
import { IEnemy } from '../../interfaces/IEnemy.interface';
import { newImage, publicProperty, useState } from '../../utils/general';
import { Game } from '../Game';

type TempGame = Game & {
  player: IEnemy & {
    weaponStr: number;
  };
};
export const Spread = (
  game: TempGame,
  x = 0,
  y = 0,
  { vx, rotate } = { vx: 0, rotate: 0 }
) => {
  const { readState: bullet, updateState: update } = useState<any>({
    class: 'player',
    vy: -20,
    // vy: -5,
    vx: vx ? vx : 0,
    power: 4 + game.player.weaponStr * 1.25,
    w: 5,
    h: 15,
    img: newImage(spreadSrc),
    rotate: rotate ? rotate : 0,
    x: x !== 0 ? x : game.player.x + game.player.w / 2,
    y: y !== 0 ? y : game.player.y,
  });

  // TODO: util
  const redBeam = () => {
    game.context?.drawImage(
      bullet('img'), // img
      347, // sx
      68, // sy
      9, // swidth
      30, // sheight
      bullet('x'), // dx
      bullet('y'), // dy
      bullet('w'), // dwidth
      bullet('h') // dheight
    );
  };

  // TODO: util
  const largeOvalBullet = () => {
    game.context?.drawImage(
      bullet('img'), // img
      428, // sx
      160, // sy
      9, // swidth
      25, // sheight
      bullet('x'), // dx
      bullet('y'), // dy
      bullet('w'), // dwidth
      bullet('h') // dheight
    );
  };

  // TODO: util
  const ovalBullet = () => {
    game.context?.drawImage(
      bullet('img'), // img
      428, // sx
      82, // sy
      9, // swidth
      25, // sheight
      bullet('x'), // dx
      bullet('y'), // dy
      bullet('w'), // dwidth
      bullet('h') // dheight
    );
  };

  const draw = () => {
    update({
      y: bullet('y') + bullet('vy'),
      x: bullet('x') + bullet('vx'),
    });
    game.context?.save();
    redBeam();
    game.context?.rotate(bullet('roate'));

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
