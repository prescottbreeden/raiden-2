import defaults from '../../constants/spacestation.json'
import spacestationImg from '../../assets/images/spacestation.png'
import { EnemyType, StageOptions } from '../../types/blackbird.type'
import { Enemy } from './Enemy'
import { Game } from '../Game'

export const SpaceStation = (game: Game, props: StageOptions) => {
  const attr: any = {
    ...defaults,
    ...props,
    r: 40,
    src: spacestationImg,
  }
  return Enemy(game, attr)
}
