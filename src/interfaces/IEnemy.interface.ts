import { IShip } from './IShip.interface'

export interface IEnemy extends IShip {
  aim: boolean
  angle: number
  contain: boolean
  enter: string
  hit?: boolean
  hp: number
  item: boolean
  movement: string
  movementSpeed: number
  pointValue: number
  radians: number
  spin: boolean
  tracking: boolean
  weaponDelay: number
  weaponSpeed: number
  x: number
  y: number
}
