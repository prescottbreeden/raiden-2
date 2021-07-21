import * as Movement from '../../utils/movement'
import * as Weapons from '../../utils/weapons'
import { EnemyType } from '../../types/blackbird.type'
import { Game, radian } from '../Game'
import { cond, __ } from 'ramda'
import { getPosition } from '../utilities'
import { newImage, publicProperty, useState } from '../../utils/general'

export const Enemy = (game: Game, props: EnemyType) => {
  const { readState: enemy, updateState: update } = useState<EnemyType>({
    ...props,
    img: newImage(props.src),
    weaponSpeed: game.getVelocity() * props.weaponSpeed,
  })

  Movement.move(enemy('movement'))(game, enemy, update)
  Weapons.fire(enemy('weaponType'))(game, enemy)

  const takeDamage = (dmg: number): void => {
    update({
      hp: enemy('hp') - dmg,
      hit: true,
    })
  }

  const draw = (): void => {
    const updated = Movement.updatePositionAcceleration({ enemy, update })
    game.context?.save()
    game.context?.translate(updated.x, updated.y)

    // if tracking enemy, aim the enemy at player
    if (enemy('tracking')) {
      const { x, y } = getPosition(game.player!)
      const angle = Math.atan2(y - enemy('y'), x - enemy('x')) - Math.PI / 2
      game.context?.rotate(angle)
    }

    // if contain enemy, let it bounce off edges
    if (enemy('contain')) {
      cond([
        [Movement.leavingLeftRight, Movement.reverseVx],
        [Movement.leavingTopBottom, Movement.reverseVy],
      ])({ enemy, update })
    }

    // if spin enemy, rotate it in a circle
    if (enemy('spin')) {
      update({ angle: enemy('angle') + 5 * radian })
      game.context?.rotate(enemy('angle'))
    }

    // draw an enemey bubble over the enemy if they took damage
    if (enemy('hit')) {
      update({ hit: false })
      if (game.context) {
        game.context.beginPath()
        game.context.arc(0, 0, enemy('r'), 0, 360 * radian, false)
        game.context.fillStyle = 'rgba(350, 350, 350, .2)'
        game.context.fill()
      }
    }

    // redraw src image
    game.context?.drawImage(
      updated.img,
      -(updated.w / 2),
      -(updated.h / 2),
      updated.h,
      updated.w
    )

    game.context?.restore()
  }

  const enemyObject = {
    takeDamage,
    draw,
  }

  // Read-only properties
  Object.defineProperties(enemyObject, {
    ...publicProperty<boolean>('item', () => enemy('item')),
    ...publicProperty<number>('gx', () => enemy('gx')),
    ...publicProperty<number>('gy', () => enemy('gy')),
    ...publicProperty<number>('h', () => enemy('h')),
    ...publicProperty<number>('hp', () => enemy('hp')),
    ...publicProperty<number>('pointValue', () => enemy('pointValue')),
    ...publicProperty<number>('r', () => enemy('r')),
    ...publicProperty<number>('vx', () => enemy('vx')),
    ...publicProperty<number>('vy', () => enemy('vy')),
    ...publicProperty<number>('w', () => enemy('w')),
    ...publicProperty<number>('x', () => enemy('x')),
    ...publicProperty<number>('y', () => enemy('y')),
  })

  return enemyObject
}
