import { Enemy } from './Enemy';
import { Factory } from '../../types/Factory.type';
import { Game } from '../Game';
import { IStageOptions } from '../../interfaces/IStageOptions.interface';
import {
  IStageTomlEnemies,
  IStageTomlEnemyGroup,
} from '../../interfaces/IStageTomlEnemyGroup.interface';
import { isOnScreen } from '../utilities';
import { publicProperty, useState } from '../../utils/general';

export const EnemyFactory = (
  game: Game,
  { enemies: enemyData }: IStageTomlEnemies
) => {
  const { readState, updateState: update } = useState<Factory>({ state: [] });

  // create array of enemy slots
  // everytime we add an enemy, take the first empty
  // everytime an enemy is is destroyed, trigger destroy on object to clear all
  // timeouts
  const addEnemy = (...enemies: any[]) => {
    update({ state: readState('state').filter(isOnScreen).concat(enemies) });
  };

  enemyData.forEach((enemyGroup: IStageTomlEnemyGroup) => {
    setTimeout(() => {
      enemyGroup.types.map((options: IStageOptions, index: number) => {
        setTimeout(() => {
          addEnemy(Enemy(game, options));
        }, options.delay * (index + 1));
      });
    }, enemyGroup.timestamp * 1000);
  });

  const enemyFactory = {};

  Object.defineProperties(enemyFactory, {
    ...publicProperty('state', () => readState('state')),
  });

  return enemyFactory;
};
