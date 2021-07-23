import defaults from '../../constants/spacestation.json'
import spacestationImg from '../../assets/images/spacestation.png'
import { Enemy } from './Enemy'
import { Game } from '../Game'
import { IStageOptions } from '../../interfaces/IStageOptions.interface'

export const SpaceStation = (game: Game, props: IStageOptions) => {
  const attr: any = {
    ...defaults,
    ...props,
    r: 40,
    src: spacestationImg,
  }
  return Enemy(game, attr)
}
