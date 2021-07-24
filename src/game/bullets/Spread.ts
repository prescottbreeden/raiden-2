import spreadSrc from '../../assets/images/M484BulletCollection2.png'
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
    vx: vx ? vx : 0,
    power: 4 + ship.weaponStr * 1.25,
    w: 5,
    h: 10,
    img: newImage(spreadSrc),
    rotate: rotate ? rotate : 0,
    // this.x = ship.x - this.w;,
    x: x !== 0 ? x : ship.x - 5 / 2,
    y: y !== 0 ? y : ship.y,
  })

  const draw = () => {
    update({
      y: bullet('y') + bullet('vy'),
      x: bullet('x') + bullet('vx'),
    })
    game.context?.save()
    game.context?.translate(bullet('x'), bullet('y'))
    if (game.context) {
      game.context.fillStyle = 'red'
    }
    game.context?.fillRect(0, 0, bullet('w'), bullet('h'))
    game.context?.rotate(bullet('roate'))
    // this.context.drawImage(
    //   this.img,
    //   100 * this.col,
    //   100 * this.row,
    //   100,
    //   100,
    //   this.x - 50,
    //   this.y - 50,
    //   this.w,
    //   this.h
    // );
    // this.context.drawImage(this.img, 500, 200, 20, 20, 0, 0, 20, 20);
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
