export type EnemyType = {
  angle: number
  contain: boolean
  gx: number
  gy: number
  h: number
  hp: number
  img: HTMLImageElement
  item: boolean
  movement: 'parabolic' | 'charge' | 'explore'
  movementSpeed: number
  name: string
  pointValue: number
  r: number
  radians: number
  spin: boolean
  src: any
  tracking: boolean
  vx: number
  vy: number
  w: number
  weaponDelay: number
  weaponSpeed: number
  weaponType: 'ball' | 'spread' | 'blaster'
  x: number
  y: number
}
