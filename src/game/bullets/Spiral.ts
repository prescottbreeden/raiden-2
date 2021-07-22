import fireball from '../../assets/images/weaponfire/RLiGng-fireball-transparent-picture.png'
import { Game } from '../Game'
import { newImage, publicProperty, useState } from '../../utils/general'

export const SpinCycle = (game: Game, ship: any) => {
  const { readState: bullet, updateState: update } = useState<any>({
    class: 'enemy',
    h: 20,
    img: newImage(fireball),
    radians: Date.now(),
    vx: ship.vx,
    vy: ship.vy,
    w: 20,
    x: ship.x,
    y: ship.y,
  })

  const draw = () => {
    update({
      x: bullet('x') + Math.cos(bullet('radians')) * 3,
      y: bullet('y') + Math.sin(bullet('radians')) * 3,
    })
    game.bulletContext?.save()
    game.bulletContext?.translate(bullet('x'), bullet('y'))
    game.bulletContext?.drawImage(
      bullet('img'),
      -(bullet('w') / 2),
      -(bullet('h') / 2),
      bullet('h'),
      bullet('w')
    )
    game.bulletContext?.restore()
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
