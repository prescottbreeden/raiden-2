import { Blaster } from './Blaster';
import { Game } from '../Game';
import { IEnemy } from '../../interfaces/IEnemy.interface';
import { Spread } from './Spread';
import { isOnScreen } from '../utilities';
import { publicProperty, useState } from '../../utils/general';
import { Factory } from '../../types/Factory.type';
import { IDrawable } from '../../interfaces/IDrawable.interface';

export type IBullet = {
  class: string;
  vy: number;
  vx: number;
  power: number;
  w: number;
  h: number;
  img: HTMLImageElement;
  rotate: number;
  x: number;
  y: number;
};

export type IDrawableBullet = IBullet & IDrawable;

export type TempGame = Game & {
  player: IEnemy & {
    weaponStr: number;
  };
};

export type IBulletFactory = {
  state: IDrawableBullet[];
  addBullets: (...bullet: IDrawableBullet[]) => void;
  generatePlayerBullets: () => void;
};

const playerOffset = 2.5;
export const BulletFactory = (game: TempGame) => {
  const { readState, updateState } = useState<Factory>({ state: [] });

  const addBullets = (...bullets: IDrawableBullet[]) => {
    updateState({
      state: readState('state')
        .filter(isOnScreen)
        .concat(bullets),
    });
  };

  // BLASTER
  // most straight forward, just gets bigger and stronger with each level
  const blasterShot = () => {
    addBullets(Blaster(game));
  };

  // SPREAD
  // each level of spread adds additional bullets at different angles and
  // vertical/horizontal velocities to create the spray-effect
  // TODO: this could be abstracted much better probably
  const spread = (): { [key: string]: IDrawableBullet[] } => ({
    1: [Spread(game, game.player.x - playerOffset)],
    2: [
      Spread(
        game,
        game.player.x - game.player.w / 2,
        game.player.y + game.player.h / 2
      ),
      Spread(
        game,
        game.player.x + game.player.w / 2 - 5,
        game.player.y + game.player.h / 2
      ),
    ],
    3: [
      Spread(game, game.player.x - game.player.w / 4),
      Spread(game, game.player.x + game.player.w / 4 - 5),
    ],
    4: [
      Spread(game, game.player.x - game.player.w / 2, 0, {
        vx: -5,
        rotate: -0.1125,
      }),
      Spread(game, game.player.x + game.player.w / 2 - 5, 0, {
        vx: -5,
        rotate: -0.1125,
      }),
      Spread(game, game.player.x - game.player.w / 4, 0, {
        vx: -5,
        rotate: -0.1125,
      }),
      Spread(game, game.player.x + game.player.w / 4 - 5, 0, {
        vx: -5,
        rotate: -0.1125,
      }),
      Spread(game, game.player.x - game.player.w / 2, 0, {
        vx: 5,
        rotate: 0.1125,
      }),
      Spread(game, game.player.x + game.player.w / 2 - 5, 0, {
        vx: 5,
        rotate: 0.1125,
      }),
      Spread(game, game.player.x - game.player.w / 4, 0, {
        vx: 5,
        rotate: 0.1125,
      }),
      Spread(game, game.player.x + game.player.w / 4 - 5, 0, {
        vx: 5,
        rotate: 0.1125,
      }),
    ],
    5: [
      Spread(game, game.player.x - game.player.w / 2, 0, {
        vx: -10,
        rotate: -0.225,
      }),
      Spread(game, game.player.x + game.player.w / 2 - 5, 0, {
        vx: -10,
        rotate: -0.225,
      }),
      Spread(game, game.player.x - game.player.w / 4, 0, {
        vx: -10,
        rotate: -0.225,
      }),
      Spread(game, game.player.x + game.player.w / 4 - 5, 0, {
        vx: -10,
        rotate: -0.225,
      }),
      Spread(game, game.player.x - game.player.w / 2, 0, {
        vx: 10,
        rotate: 0.225,
      }),
      Spread(game, game.player.x + game.player.w / 2 - 5, 0, {
        vx: 10,
        rotate: 0.225,
      }),
      Spread(game, game.player.x - game.player.w / 4, 0, {
        vx: 10,
        rotate: 0.225,
      }),
      Spread(game, game.player.x + game.player.w / 4 - 5, 0, {
        vx: 10,
        rotate: 0.225,
      }),
    ],
    6: [
      Spread(game, game.player.x - game.player.w / 2, 0, {
        vx: -20,
        rotate: -0.45,
      }),
      Spread(game, game.player.x + game.player.w / 2 - 5, 0, {
        vx: -20,
        rotate: -0.45,
      }),
      Spread(game, game.player.x - game.player.w / 4, 0, {
        vx: -20,
        rotate: -0.45,
      }),
      Spread(game, game.player.x + game.player.w / 4 - 5, 0, {
        vx: -20,
        rotate: -0.45,
      }),
      Spread(game, game.player.x - game.player.w / 2, 0, {
        vx: 20,
        rotate: 0.45,
      }),
      Spread(game, game.player.x + game.player.w / 2 - 5, 0, {
        vx: 20,
        rotate: 0.45,
      }),
      Spread(game, game.player.x - game.player.w / 4, 0, {
        vx: 20,
        rotate: 0.45,
      }),
      Spread(game, game.player.x + game.player.w / 4 - 5, 0, {
        vx: 20,
        rotate: 0.45,
      }),
    ],
  });

  // SPREAD SHOT
  const spreadShot = () => {
    addBullets(...spread()[1]);
    if (game.player.weaponStr > 1) {
      addBullets(...spread()[2]);
    }
    if (game.player.weaponStr > 2) {
      addBullets(...spread()[3]);
    }
    if (game.player.weaponStr > 3) {
      addBullets(...spread()[4]);
    }
    if (game.player.weaponStr > 4) {
      addBullets(...spread()[5]);
    }
    if (game.player.weaponStr > 5) {
      addBullets(...spread()[6]);
    }
  };

  const generatePlayerBullets = () => {
    const weapon = game.player.weaponType;
    if (weapon === 'blaster') {
      blasterShot();
    }
    if (weapon === 'spread') {
      spreadShot();
    }
  };

  const bulletFactory: IBulletFactory = {
    addBullets,
    generatePlayerBullets,
    state: [],
  };

  Object.defineProperties(bulletFactory, {
    ...publicProperty('state', () => readState('state')),
  });

  return bulletFactory;
};
