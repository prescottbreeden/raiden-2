import spreadSrc from '../../assets/images/weaponfire/M484BulletCollection3.png';
import { IBullet, IDrawableBullet, TempGame } from './BulletFactory';
import { newImage, publicProperty, useState } from '../../utils/general';

export function Spread(
  game: TempGame,
  x = 0,
  y = 0,
  { vx, rotate } = { vx: 0, rotate: 0 }
):IDrawableBullet {
  const { readState, updateState } = useState<IBullet>({
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
      readState('img'), // img
      347, // sx
      68, // sy
      9, // swidth
      30, // sheight
      readState('x'), // dx
      readState('y'), // dy
      readState('w'), // dwidth
      readState('h') // dheight
    );
  };

  // TODO: util
  const largeOvalBullet = () => {
    game.context?.drawImage(
      readState('img'), // img
      428, // sx
      160, // sy
      9, // swidth
      25, // sheight
      readState('x'), // dx
      readState('y'), // dy
      readState('w'), // dwidth
      readState('h') // dheight
    );
  };

  // TODO: util
  const ovalBullet = () => {
    game.context?.drawImage(
      readState('img'), // img
      428, // sx
      82, // sy
      9, // swidth
      25, // sheight
      readState('x'), // dx
      readState('y'), // dy
      readState('w'), // dwidth
      readState('h') // dheight
    );
  };

  const bulletObject: IDrawableBullet = {
    draw: () => {
      updateState({
        y: readState('y') + readState('vy'),
        x: readState('x') + readState('vx'),
      });
      game.context?.save();
      redBeam();
      game.context?.rotate(readState('rotate'));
      game.context?.restore();
    },
  } as IDrawableBullet;

  Object.defineProperties(bulletObject, {
    ...publicProperty('class', () => readState('class')),
    ...publicProperty('power', () => readState('power')),
    ...publicProperty('h', () => readState('h')),
    ...publicProperty('w', () => readState('w')),
    ...publicProperty('x', () => readState('x')),
    ...publicProperty('y', () => readState('y')),
    ...publicProperty('vx', () => readState('vx')),
    ...publicProperty('vy', () => readState('vy')),
  });

  return bulletObject;
}
