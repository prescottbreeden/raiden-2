import { Blackbird } from './Blackbird'
import { Whitebird } from './Whitebird'
import { SpaceStation } from './SpaceStation'
import { isOnScreen } from '../utilities'
import { ItemGiver } from './ItemGiver'
import { Game } from '../Game'
import { EnemyType } from '../../types/blackbird.type'

export class EnemyFactory {
  game: Game
  canvas: HTMLCanvasElement | undefined | null
  enemies: EnemyType[]
  config: any
  constructor(game: Game, config = {}) {
    this.game = game
    this.canvas = game.canvas
    this.enemies = []
    this.config = config
  }

  addEnemy = (...enemies: EnemyType[]) => {
    const cleanUp = this.enemies.filter(isOnScreen)
    this.enemies = [...cleanUp, ...enemies]
  }

  // TODO fix types here, enemy config type = enemy type?
  createAllEnemies() {
    const lookup: { [key: string]: (x: EnemyType) => any } = {
      whitebird: (t: EnemyType) => Whitebird(this.game, t),
      blackbird: (t: EnemyType) => Blackbird(this.game, t),
      spacestation: (t: EnemyType) => SpaceStation(this.game, t),
      itemGiver: (t: EnemyType) => ItemGiver(this.game, t),
    }
    const { enemies } = this.config
    enemies.map((enemyGroup: any) => {
      setTimeout(() => {
        enemyGroup.types.map((t: any, i: number) => {
          setTimeout(() => {
            this.addEnemy(lookup[t.type](t))
          }, t.delay * (i + 1))
        })
      }, enemyGroup.timestamp * 1000)
    })
  }
}
