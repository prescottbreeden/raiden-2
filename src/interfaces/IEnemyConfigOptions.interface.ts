import { MovementName } from '../types/MovementName.type'
import { EnemyWeaponName } from '../types/EnemyWeaponName.type'

export type IEnemyConfigOptions = {
  aim: boolean
  angle: number
  contain: boolean
  enter: string
  gx: number
  gy: number
  h: number
  hit: boolean
  hp: number
  item: boolean
  movement: MovementName
  movementSpeed: number
  name: string
  pointValue: number
  r: number
  radians: number
  spin: boolean
  tracking: boolean
  vx: number
  vy: number
  w: number
  weaponDelay: number
  weaponType: EnemyWeaponName
  x: number
  y: number
}
