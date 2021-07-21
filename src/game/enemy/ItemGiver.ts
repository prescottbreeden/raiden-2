import defaults from '../../constants/itemGiver.json'
import itemGiverImg from '../../assets/images/item-giver-2.png'
import { EnemyType, StageOptions } from '../../types/blackbird.type'
import { Enemy } from './Enemy'
import { Game } from '../Game'

export const ItemGiver = (game: Game, props: StageOptions) => {
  const attr: any = {
    ...defaults,
    ...props,
    r: 40,
    src: itemGiverImg,
  }
  return Enemy(game, attr)
}
