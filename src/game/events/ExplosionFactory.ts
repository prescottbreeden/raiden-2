import { IEnemy } from '../../interfaces/IEnemy.interface';
import { publicProperty, useState } from '../../utils/general';
import { Game } from '../Game';
import { Explosion } from './Explosion';

export const ExplosionFactory = (game: Game) => {
  const { readState: factory, updateState: update } = useState<any>({
    explosions: [],
  });

  const generateExplosions = (enemy: IEnemy) => {
    const explosion = Explosion(game, enemy);
    const cleanup = factory('explosions').filter(
      (e: any) => e.row + e.col !== 15
    );
    update({ explosions: [...cleanup, explosion] });
  };

  const explosionFactory = {
    generateExplosions,
  };

  Object.defineProperties(explosionFactory, {
    ...publicProperty('explosions', () => factory('explosions')),
  });

  return explosionFactory;
};
