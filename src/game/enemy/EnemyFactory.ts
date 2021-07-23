import { Blackbird } from './Blackbird'
import { Game } from '../Game'
import { IEnemy } from '../../interfaces/IEnemy.interface'
import { IStageOptions } from '../../interfaces/IStageOptions.interface'
import {
  IStageTomlEnemies,
  IStageTomlEnemyGroup,
} from '../../interfaces/IStageTomlEnemyGroup.interface'
import { ItemGiver } from './ItemGiver'
import { SpaceStation } from './SpaceStation'
import { Spear } from './Spear'
import { Whitebird } from './Whitebird'
import { isOnScreen } from '../utilities'
import { publicProperty, useState } from '../../utils/general'

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

  const addEnemy = (...enemies: IEnemy[]) => {
    const cleanUp = factory('enemies').filter(isOnScreen)
    update({
      enemies: [...cleanUp, ...enemies],
    })
  }

  const createAllEnemies = () => {
    const selectEnemy: { [key: string]: (x: IStageOptions) => any } = {
      whitebird: (toml: IStageOptions) => Whitebird(factory('game'), toml),
      blackbird: (toml: IStageOptions) => Blackbird(factory('game'), toml),
      spacestation: (toml: IStageOptions) =>
        SpaceStation(factory('game'), toml),
      itemGiver: (toml: IStageOptions) => ItemGiver(factory('game'), toml),
      spear: (toml: IStageOptions) => Spear(factory('game'), toml),
    }
    factory('config').forEach((enemyGroup: IStageTomlEnemyGroup) => {
      setTimeout(() => {
        enemyGroup.types.map((t: IStageOptions, i: number) => {
          setTimeout(() => {
            addEnemy(selectEnemy[t.type](t))
          }, t.delay * (i + 1))
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
