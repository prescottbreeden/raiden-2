import { IEnemyConfigOptions } from './IEnemyConfigOptions.interface'

export interface IEnemy extends IEnemyConfigOptions {
  weaponSpeed: number
  img: HTMLImageElement
  src: any
}
