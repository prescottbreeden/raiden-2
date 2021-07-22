import blackbird from '../../assets/images/blackbird.png'
import defaults from '../../constants/blackbird.json'
import { EnemyType, StageOptions } from '../../types/blackbird.type'
import { Game } from '../Game'
import { Enemy } from './Enemy'

export const Blackbird = (game: Game, props: StageOptions) => {
  const attr: any = {
    ...defaults,
    ...props,
    // tracking: false,
    r: 67 / 2.1,
    src: blackbird,
    x: 250,
  }
  return Enemy(game, attr)
}
