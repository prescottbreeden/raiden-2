import { WIDTH } from '../..'
import spear from '../../assets/images/spear.png'
import defaults from '../../constants/spear.json'
import { EnemyType, StageOptions } from '../../types/blackbird.type'
import { Game } from '../Game'
import { getRandomInt } from '../utilities'
import { Enemy } from './Enemy'

export const Spear = (game: Game, props: StageOptions) => {
  const attr: any = {
    ...defaults,
    ...props,
    r: 80 / 2.1,
    src: spear,
    x: getRandomInt(WIDTH * 0.1, WIDTH * 0.9),
  }
  return Enemy(game, attr)
}
