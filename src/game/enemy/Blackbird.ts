import blackbird from '../../assets/images/blackbird.png'
import defaults from '../../constants/blackbird.json'
import { Enemy } from './Enemy'
import { Game } from '../Game'
import { IStageOptions } from '../../interfaces/IStageOptions.interface'

export const Blackbird = (game: Game, props: IStageOptions) => {
  const attr: any = {
    ...defaults,
    ...props,
    r: 67 / 2.1,
    src: blackbird,
    x: 250,
  }
  return Enemy(game, attr)
}
