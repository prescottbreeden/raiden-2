import { Blackbird } from './Blackbird'
import {
  EnemyType,
  StageOptions,
  StageTomlEnemies,
  StageTomlEnemyGroup,
} from '../../types/blackbird.type'
import { Game } from '../Game'
import { ItemGiver } from './ItemGiver'
import { SpaceStation } from './SpaceStation'
import { Whitebird } from './Whitebird'
import { isOnScreen } from '../utilities'
import { publicProperty, useState } from '../../utils/general'
import { Spear } from './Spear'

export interface EnemyFactory {
  game: Game
  enemies: EnemyType[]
  config: StageTomlEnemyGroup[]
}

export const EnemyFactory = (game: Game, props: StageTomlEnemies) => {
  const { readState: factory, updateState: update } = useState<EnemyFactory>({
    game,
    enemies: [],
    config: props.enemies,
  })

  const addEnemy = (...enemies: EnemyType[]) => {
    const cleanUp = factory('enemies').filter(isOnScreen)
    update({
      enemies: [...cleanUp, ...enemies],
    })
  }

  const createAllEnemies = () => {
    const selectEnemy: { [key: string]: (x: StageOptions) => any } = {
      whitebird: (toml: StageOptions) => Whitebird(factory('game'), toml),
      blackbird: (toml: StageOptions) => Blackbird(factory('game'), toml),
      spacestation: (toml: StageOptions) => SpaceStation(factory('game'), toml),
      itemGiver: (toml: StageOptions) => ItemGiver(factory('game'), toml),
      spear: (toml: StageOptions) => Spear(factory('game'), toml),
    }
    factory('config').forEach((enemyGroup: StageTomlEnemyGroup) => {
      setTimeout(() => {
        enemyGroup.types.map((t: StageOptions, i: number) => {
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
    ...publicProperty<EnemyType[]>('enemies', () => factory('enemies')),
  })

  return enemyFactory
}
