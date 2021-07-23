import defaults from '../../constants/itemGiver.json'
import itemGiverImg from '../../assets/images/item-giver-2.png'
import { Enemy } from './Enemy'
import { Game } from '../Game'
import { IStageOptions } from '../../interfaces/IStageOptions.interface'

export const ItemGiver = (game: Game, props: IStageOptions) => {
  const attr: any = {
    ...defaults,
    ...props,
    r: 40,
    src: itemGiverImg,
  }
  return Enemy(game, attr)
}
