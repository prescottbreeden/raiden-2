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
import { useState } from '../../utils/general'

export interface EnemyFactory {
  game: Game
  canvas: HTMLCanvasElement | undefined | null
  enemies: EnemyType[]
  config: StageTomlEnemyGroup[]
}

export const EnemyFactory = (game: Game, props: StageTomlEnemies) => {
  const [retrieveState, update] = useState<EnemyFactory>({
    game,
    canvas: game.canvas,
    enemies: [],
    config: props.enemies,
  })

  const factory = (p?: keyof EnemyFactory): any | EnemyFactory =>
    // @ts-ignore
    p ? retrieveState()[p] : retrieveState()

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

  const publicProperty = (name: string, val: () => any) => ({
    [name]: {
      enumerable: true,
      get: val,
    },
  })

  // Public Read Properties
  Object.defineProperties(enemyFactory, {
    ...publicProperty('enemies', () => factory('enemies')),
  })

  return enemyFactory
}
