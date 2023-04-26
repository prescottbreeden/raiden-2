import { IEnemy } from './IEnemy.interface';

export type EnemyState = (prop?: keyof IEnemy) => any;
export type Update = (data: Partial<IEnemy>) => IEnemy;

export type IStateObject = {
  readState: EnemyState;
  updateState: Update;
};
