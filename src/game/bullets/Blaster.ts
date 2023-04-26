import spreadSrc from '../../assets/images/weaponfire/M484BulletCollection3.png';
import { IBullet, IDrawableBullet, TempGame } from './BulletFactory';
import { newImage, publicProperty, useState } from '../../utils/general';

export function Blaster(game: TempGame): IDrawableBullet {
  const { readState, updateState } = useState<IBullet>({
    class: 'player',
    vy: -20,
    vx: 0,
    power: 5 + game.player.weaponStr * 1.25,
    img: newImage(spreadSrc),
    w: 5,
    h: 10,

    // different than spread type
    rotate: 0,
    x: 0,
    y: 0,
  });

  switch (game.player.weaponStr) {
    case 1:
      updateState({ h: 45, w: 5 });
      break;
    case 2:
      updateState({ h: 55, w: 10 });
      break;
    case 3:
      updateState({ h: 75, w: 15 });
      break;
    case 4:
      updateState({ h: 75, w: 25 });
      break;
    case 5:
      updateState({ h: 75, w: 35 });
      break;
    case 6:
      updateState({ h: 75, w: 65 });
      break;
  }

  updateState({
    x: game.player.x - readState('w') / 2,
    y: game.player.y,
    power: game.player.weaponStr * 10,
  });

  // don't remember what this was for...
  const drawCenter = () => {
    game.context?.save();
    if (game.context) {
      game.context.fillStyle = 'green';
    }
    game.context?.translate(readState('x'), readState('y'));
    game.context?.fillRect(
      readState('w') / 2,
      0, // replace me with an image eventually
      readState('w') / 2,
      readState('h')
    );
    game.context?.restore();
  };

  const draw = () => {
    updateState({
      y: readState('y') + readState('vy'),
      x: readState('x') + readState('vx'),
    });
    game.context?.save();

    // blue beam
    game.context?.drawImage(
      readState('img'), // img
      347, // sx
      200, // sy
      9, // swidth
      30, // sheight
      readState('x'), // dx
      readState('y'), // dy
      readState('w'), // dwidth
      readState('h') // dheight
    );
    game.context?.restore();
  };

  const bulletObject: IDrawableBullet = {
    draw,
  } as IDrawableBullet;

  Object.defineProperties(bulletObject, {
    ...publicProperty('h', () => readState('h')),
    ...publicProperty('vx', () => readState('vx')),
    ...publicProperty('vy', () => readState('vy')),
    ...publicProperty('w', () => readState('w')),
    ...publicProperty('x', () => readState('x')),
    ...publicProperty('y', () => readState('y')),
    ...publicProperty('class', () => readState('class')),
    ...publicProperty('power', () => readState('power')),
  });

  return bulletObject;
}
