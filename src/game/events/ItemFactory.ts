import { IEnemy } from '../../interfaces/IEnemy.interface';
import { publicProperty, useState } from '../../utils/general';
import { Game } from '../Game';
import { Item } from './Item';

export const ItemFactory = (game: Game) => {
  const { readState: factory, updateState: update } = useState<any>({
    items: [],
  });

  const generateItem = (enemy: IEnemy) => {
    const item = Item(game, enemy);
    update({ items: [...factory('items'), item] });
  };

  const itemFactory = {
    generateItem,
  };

  // Read-only properties
  Object.defineProperties(itemFactory, {
    ...publicProperty<boolean>('items', () => factory('items')),
  });
  return itemFactory;
};
