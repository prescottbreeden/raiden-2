import defaults from '../../constants/whitebird.json'
import whitebirdImg from '../../assets/images/whitebird.png'
import { Game } from '../Game'
import { Enemy } from './Enemy'
import { IStageOptions } from '../../interfaces/IStageOptions.interface'

export const Whitebird = (game: Game, props: IStageOptions) => {
  const attr: any = {
    ...defaults,
    ...props,
    r: 67 / 2.1,
    src: whitebirdImg,
    x: 500,
  }
  return Enemy(game, attr)
}
