import { IEnemy } from '../../interfaces/IEnemy.interface';
import {Factory} from '../../types/Factory.type';
import { publicProperty, useState } from '../../utils/general';
import { Game } from '../Game';
import { Item } from './Item';

export type IItemFactory = Factory & {
  generateItem: (enemy: IEnemy) => void
}

export function ItemFactory(game: Game): IItemFactory {
  const { readState, updateState } = useState<Factory>({ state: [] });

  const generateItem = (enemy: IEnemy) => {
    const item = Item({game, enemy});
    updateState({ state: [...readState('state'), item] });
  };

  const itemFactory = {
    generateItem,
    state: [], //overwritten
  };

  // Read-only properties
  Object.defineProperties(itemFactory, {
    ...publicProperty('state', () => readState('state')),
  });
  return itemFactory;
};
