import defaults from '../../constants/whitebird.json'
import whitebirdImg from '../../assets/images/whitebird.png'
import { EnemyType, StageOptions } from '../../types/blackbird.type'
import { Game } from '../Game'
import { Enemy } from './Enemy'

export const Whitebird = (game: Game, props: StageOptions) => {
  const attr: any = {
    ...defaults,
    ...props,
    r: 67 / 2.1,
    src: whitebirdImg,
    weaponSpeed: game.getVelocity() * defaults.weaponSpeed,
  }
  return Enemy(game, attr)
}
