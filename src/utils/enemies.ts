import blackbird from '../constants/blackbird.json';
import spacestation from '../constants/spacestation.json';
import spear from '../constants/spear.json';
import vendor from '../constants/vendor.json';
import whitebird from '../constants/whitebird.json';
import { IEnemy } from '../interfaces/IEnemy.interface';

type EnemyDefaults = {
  [key: string]: IEnemy;
};
export const enemyDefaults: EnemyDefaults = {
  blackbird,
  spacestation,
  spear,
  vendor,
  whitebird,
};
