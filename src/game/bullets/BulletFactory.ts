import { Blaster } from './Blaster';
import { Spread } from './Spread';
import { isOnScreen } from '../utilities';
import { Game } from '../Game';
import { publicProperty, useState } from '../../utils/general';
import { IEnemy } from '../../interfaces/IEnemy.interface';

type TempGame = Game & {
  player: IEnemy & {
    weaponStr: number;
  };
};

type IBulletFactory = {
  addBullets: (bullets: any[]) => void;
  generatePlayerBullets: () => void;
  bullets: any[];
};
const playerOffset = 2.5;
export const BulletFactory = (game: TempGame) => {
  const { readState: factory, updateState: update } = useState<any>({
    bullets: [],
  });

  const addBullets = (...bullets: any[]) => {
    const cleanUp = factory('bullets').filter(isOnScreen);
    update({ bullets: [...cleanUp, ...bullets] });
  };

  // BLASTER
  const blasterShot = () => {
    addBullets(Blaster(game));
  };

  // SPREAD
  const spread = () => ({
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

  // @ts-ignore
  const bulletFactory: IBulletFactory = {
    addBullets,
    generatePlayerBullets,
  };

  Object.defineProperties(bulletFactory, {
    ...publicProperty('bullets', () => factory('bullets')),
  });

  return bulletFactory;
};
