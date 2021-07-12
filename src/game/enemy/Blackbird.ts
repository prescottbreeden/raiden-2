import blackbird from '../../assets/images/blackbird.png'
import defaults from '../../constants/blackbird.json'
import { EnemyType } from '../../types/blackbird.type'
import { Game } from '../Game'
import { Enemy } from './Enemy'

export const Blackbird = (game: Game, props: EnemyType) => {
  const attr: EnemyType = {
    ...defaults,
    ...props,
    src: blackbird,
    h: 67,
    w: 67,
    r: 67 / 2.1,
    pointValue: 100,
    weaponSpeed: game.getVelocity() * defaults.weaponSpeed,
    weaponType: 'ball',
  }
  return Enemy(game, attr)
}
