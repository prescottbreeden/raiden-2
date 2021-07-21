export type Movement = 'parabolic' | 'charge' | 'explore' | 'hover'

export type WeaponType = 'ball' | 'spread' | 'blaster' | 'spincycle'

export type EnemyConfigOptions = {
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
  movement: Movement
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
  weaponType: WeaponType
  x: number
  y: number
}

export interface EnemyType extends EnemyConfigOptions {
  weaponSpeed: number
  img: HTMLImageElement
  src: any
}

export interface StageOptions {
  delay: number
  enter: string
  type: string
}

export interface StageTomlEnemyGroup {
  timestamp: number
  types: StageOptions[]
}

export interface StageTomlEnemies {
  enemies: StageTomlEnemyGroup[]
}
export type Enemy = (prop?: keyof EnemyType) => any
export type Update = (data: Partial<EnemyType>) => EnemyType
export type MOFO = {
  enemy: Enemy
  update: Update
}
