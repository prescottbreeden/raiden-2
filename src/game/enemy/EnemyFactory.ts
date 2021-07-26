import { Enemy } from './Enemy';
import { Game } from '../Game';
import { IEnemy } from '../../interfaces/IEnemy.interface';
import { IEnemyFactory } from '../../interfaces/IEnemyFactory.interface';
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
  const { readState: factory, updateState: update } = useState<IEnemyFactory>({
    enemies: [],
  });

  const addEnemy = (...enemies: any[]) => {
    const cleanUp = factory('enemies').filter(isOnScreen);
    update({ enemies: [...cleanUp, ...enemies] });
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
    ...publicProperty<IEnemy[]>('enemies', () => factory('enemies')),
  });

  return enemyFactory;
};
