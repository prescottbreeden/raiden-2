import spreadSrc from '../../assets/images/weaponfire/M484BulletCollection3.png'
import { newImage, publicProperty, useState } from '../../utils/general'
import { Game } from '../Game'

export const Spread = (
  game: Game,
  ship: any,
  x = 0,
  y = 0,
  { vx, rotate } = { vx: 0, rotate: 0 }
) => {
  const { readState: bullet, updateState: update } = useState<any>({
    class: 'player',
    ship: ship,
    vy: -20,
    // vy: -5,
    vx: vx ? vx : 0,
    power: 4 + ship.weaponStr * 1.25,
    w: 5,
    h: 15,
    img: newImage(spreadSrc),
    rotate: rotate ? rotate : 0,
    x: x !== 0 ? x : ship.x - 5 / 2,
    y: y !== 0 ? y : ship.y,
  })

  const draw = () => {
    update({
      y: bullet('y') + bullet('vy'),
      x: bullet('x') + bullet('vx'),
    })
    game.context?.save()

    // red beam
    game.context?.drawImage(
      bullet('img'), // img
      347, // sx
      68, // sy
      9, // swidth
      30, // sheight
      bullet('x'), // dx
      bullet('y'), // dy
      bullet('w'), // dwidth
      bullet('h') // dheight
    )
    game.context?.rotate(bullet('roate'))

    // larger oval bullet
    // game.context?.drawImage(
    //   bullet('img'), // img
    //   428, // sx
    //   160, // sy
    //   9, // swidth
    //   25, // sheight
    //   bullet('x'), // dx
    //   bullet('y'), // dy
    //   bullet('w'), // dwidth
    //   bullet('h') // dheight
    // )

    // oval red bullet
    // game.context?.drawImage(
    //   bullet('img'), // img
    //   428, // sx
    //   82, // sy
    //   9, // swidth
    //   25, // sheight
    //   bullet('x'), // dx
    //   bullet('y'), // dy
    //   bullet('w'), // dwidth
    //   bullet('h') // dheight
    // )

    game.context?.restore()
  }

  const bulletObject = {
    draw,
  }

  Object.defineProperties(bulletObject, {
    ...publicProperty<number>('h', () => bullet('h')),
    ...publicProperty<number>('vx', () => bullet('vx')),
    ...publicProperty<number>('vy', () => bullet('vy')),
    ...publicProperty<number>('w', () => bullet('w')),
    ...publicProperty<number>('x', () => bullet('x')),
    ...publicProperty<number>('y', () => bullet('y')),
    ...publicProperty<string>('class', () => bullet('class')),
    ...publicProperty<string>('power', () => bullet('power')),
  })

  return bulletObject
}
