import blackbird from '../../assets/images/blackbird.png'
import defaults from '../../constants/blackbird.json'
import { EnemyType, StageOptions } from '../../types/blackbird.type'
import { Game } from '../Game'
import { Enemy } from './Enemy'

export const Blackbird = (game: Game, props: StageOptions) => {
  const attr: any = {
    ...defaults,
    ...props,
    r: 67 / 2.1,
    src: blackbird,
    weaponSpeed: game.getVelocity() * defaults.weaponSpeed,
  }
  return Enemy(game, attr)
}
