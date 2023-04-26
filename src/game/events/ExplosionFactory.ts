import { IEnemy } from '../../interfaces/IEnemy.interface';
import { Factory } from '../../types/Factory.type';
import { publicProperty, useState } from '../../utils/general';
import { Game } from '../Game';
import { Explosion } from './Explosion';

export type IExplosionFactory = Factory & {
  generateExplosions: (enemy: IEnemy) => void;
};

export function ExplosionFactory(game: Game): IExplosionFactory {
  const { readState, updateState } = useState<Factory>({ state: [] });

  const generateExplosions = (enemy: IEnemy) => {
    const explosion = Explosion(game, enemy);
    const cleanup = readState('state').filter((e: any) => e.row + e.col !== 15);
    updateState({ state: [...cleanup, explosion] });
  };

  const explosionFactory = {
    generateExplosions,
    state: [], // overwritten
  };

  Object.defineProperties(explosionFactory, {
    ...publicProperty('state', () => readState('state')),
  });

  return explosionFactory;
}
