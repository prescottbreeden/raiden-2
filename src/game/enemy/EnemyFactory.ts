import { Game } from '../Game'
import { IEnemy } from '../../interfaces/IEnemy.interface'
import { IStageOptions } from '../../interfaces/IStageOptions.interface'
import {
  IStageTomlEnemies,
  IStageTomlEnemyGroup,
} from '../../interfaces/IStageTomlEnemyGroup.interface'
import { isOnScreen } from '../utilities'
import { publicProperty, useState } from '../../utils/general'
import { Enemy } from './Enemy'

export interface EnemyFactory {
  game: Game
  enemies: IEnemy[]
  config: IStageTomlEnemyGroup[]
}

export const EnemyFactory = (game: Game, props: IStageTomlEnemies) => {
  const { readState: factory, updateState: update } = useState<EnemyFactory>({
    game,
    enemies: [],
    config: props.enemies,
  })

  const addEnemy = (...enemies: any[]) => {
    const cleanUp = factory('enemies').filter(isOnScreen)
    update({
      enemies: [...cleanUp, ...enemies],
    })
  }

  const createAllEnemies = () => {
    factory('config').forEach((enemyGroup: IStageTomlEnemyGroup) => {
      setTimeout(() => {
        enemyGroup.types.map((options: IStageOptions, i: number) => {
          setTimeout(() => {
            addEnemy(Enemy(factory('game'), options))
          }, options.delay * (i + 1))
        })
      }, enemyGroup.timestamp * 1000)
    })
  }

  const enemyFactory = {
    createAllEnemies,
  }

  Object.defineProperties(enemyFactory, {
    ...publicProperty<IEnemy[]>('enemies', () => factory('enemies')),
  })

  return enemyFactory
}
