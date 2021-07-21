export type EnemyConfigOptions = {
  angle: number
  contain: boolean
  enter: string
  gx: number
  gy: number
  h: number
  hp: number
  item: boolean
  movement: 'parabolic' | 'charge' | 'explore'
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
  weaponType: 'ball' | 'spread' | 'blaster'
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
