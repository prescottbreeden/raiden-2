import fireball from '../../assets/images/weaponfire/RLiGng-fireball-transparent-picture.png'
import { Game } from '../Game'
import { publicProperty, useState } from '../../utils/general'

export const SpinCycle = (game: Game, ship: any) => {
  const img = new Image()
  img.src = fireball

  const [readState, update] = useState<any>({
    class: 'enemy',
    h: 20,
    img,
    radians: Date.now(),
    vx: ship.vx,
    vy: ship.vy,
    w: 20,
    x: ship.x,
    y: ship.y,
  })

  const bullet = (p?: keyof any): any | any =>
    // @ts-ignore
    p ? readState()[p] : readState()

  const draw = () => {
    update({
      x: bullet('x') + Math.cos(bullet('radians')) * 3,
      y: bullet('y') + Math.sin(bullet('radians')) * 3,
    })
    game.context?.save()
    game.context?.translate(bullet('x'), bullet('y'))
    game.context?.drawImage(
      bullet('img'),
      -(bullet('w') / 2),
      -(bullet('h') / 2),
      bullet('h'),
      bullet('w')
    )
    game.context?.restore()
  }

  const bulletObject = {
    draw,
  }

  // Read-only properties
  Object.defineProperties(bulletObject, {
    ...publicProperty<number>('h', () => bullet('h')),
    ...publicProperty<number>('vx', () => bullet('vx')),
    ...publicProperty<number>('vy', () => bullet('vy')),
    ...publicProperty<number>('w', () => bullet('w')),
    ...publicProperty<number>('x', () => bullet('x')),
    ...publicProperty<number>('y', () => bullet('y')),
    ...publicProperty<string>('class', () => bullet('class')),
  })

  return bulletObject
}
