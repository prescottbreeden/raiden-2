import * as Movement from '../../utils/movement'
import * as Weapons from '../../utils/weapons'
import { Game, radian } from '../Game'
import { IEnemy } from '../../interfaces/IEnemy.interface'
import { IStageOptions } from '../../interfaces/IStageOptions.interface'
import { cond } from 'ramda'
import { enemyDefaults } from '../../utils/enemies'
import { images } from '../../utils/images'
import { newImage, publicProperty, useState } from '../../utils/general'

export const Enemy = (game: Game, props: IStageOptions) => {
  const { readState: enemy, updateState: update } = useState<IEnemy>({
    ...enemyDefaults[props.type],
    ...props,
    img: newImage(images[props.type]),
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
    const { x: playerX, y: playerY } = game.player!
    update({
      vx: enemy('vx') + enemy('gx'),
      vy: enemy('vy') + enemy('gy'),
      y: enemy('y') + enemy('vy'),
      x: enemy('x') + enemy('vx'),
    })
    game.context?.save()
    game.context?.translate(enemy('x'), enemy('y'))

    // if enemy.tracking, aim the enemy at player
    if (enemy('tracking') && enemy('movement') !== 'kamakaze') {
      const angle =
        Math.atan2(playerY - enemy('y'), playerX - enemy('x')) - Math.PI / 2
      game.context?.rotate(angle)
    }

    // if enemy is suicidal, rapidly accelerate after it slows down to fire
    if (enemy('movement') === 'kamakaze') {
      if (enemy('vy') <= 0) {
        update({ gy: (enemy('gy') + 0.15) % 2 })
      }
    }

    // if enemy.contain, let it bounce off edges
    if (enemy('contain')) {
      cond([
        [Movement.leavingLeftRight, Movement.reverseVx],
        [Movement.leavingTopBottom, Movement.reverseVy],
      ])({ enemy, update })
    }

    // if enemy.spin rotate it in a circle
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
      enemy('img'),
      -(enemy('w') / 2),
      -(enemy('h') / 2),
      enemy('w'),
      enemy('h')
    )

    game.context?.restore()
  }

  const enemyObject = {
    takeDamage,
    draw,
  }

  // Read-only properties
  Object.defineProperties(enemyObject, {
    ...publicProperty<boolean>('explosion', () => enemy('explosion')),
    ...publicProperty<boolean>('item', () => enemy('item')),
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
