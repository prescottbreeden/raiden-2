import defaults from '../../constants/itemGiver.json'
import itemGiverImg from '../../assets/images/item-giver-2.png'
import { EnemyType } from '../../types/blackbird.type'
import { Enemy } from './Enemy'
import { Game } from '../Game'

export const ItemGiver = (game: Game, props: EnemyType) => {
  const attr: EnemyType = {
    ...defaults,
    ...props,
    src: itemGiverImg,
    h: 80,
    w: 80,
    r: 40,
    // TODO set point value based on current weapon level
    pointValue: 200,
    weaponSpeed: game.getVelocity() * defaults.weaponSpeed,
    weaponType: 'ball',
  }
  return Enemy(game, attr)
}
