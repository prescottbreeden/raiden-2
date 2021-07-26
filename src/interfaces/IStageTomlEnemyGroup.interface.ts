import { IStageOptions } from './IStageOptions.interface';

export interface IStageTomlEnemies {
  enemies: IStageTomlEnemyGroup[];
}

export interface IStageTomlEnemyGroup {
  timestamp: number;
  types: IStageOptions[];
}
