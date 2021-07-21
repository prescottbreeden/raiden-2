import * as Movement from '../../utils/movement'
import retroShotBlaster from '../../assets/sfx/retro-shot-blaster-1.mp3'
import minigun from '../../assets/sfx/r2/r2-big-laser-3.mp3'
import { Ball } from '../bullets/Ball'
import { EnemyType } from '../../types/blackbird.type'
import { Game, radian } from '../Game'
import { aimAtPlayer } from '../../utils/weapons'
import { cond, __ } from 'ramda'
import { getPosition, shouldFire } from '../utilities'
import { publicProperty, useState } from '../../utils/general'
import { SpinCycle } from '../bullets/Spiral'

export const Enemy = (game: Game, props: EnemyType) => {
  const img = new Image()
  img.src = props.src

  const [readState, update] = useState<EnemyType & { game: Game }>({
    ...props,
    game,
    img,
    weaponSpeed: game.getVelocity() * props.weaponSpeed,
  })

  const enemy = (p?: keyof EnemyType): any | EnemyType =>
    // @ts-ignore
    p ? readState()[p] : readState()

  // @ts-ignore
  Movement[enemy('movement')](game, enemy, update)

  // TODO: abstract me please....
  if (enemy('movement') === 'hover') {
    const firing = setInterval(() => {
      if (enemy('vy') === 0) {
        if (shouldFire(enemy())) {
          const pew = new Audio(minigun)
          pew.play()
          const bullet = SpinCycle(game, enemy())
          game.bulletFactory?.bullets.push(bullet)
        } else {
          clearInterval(firing)
        }
      }
    }, 50)
  } else {
    const firing = setInterval(() => {
      if (shouldFire(enemy())) {
        const pew = new Audio(retroShotBlaster)
        pew.play()
        const bullet = new Ball(game, enemy())
        const { vx, vy } = aimAtPlayer(enemy())
        bullet.vx = vx
        bullet.vy = vy
        game.bulletFactory?.bullets.push(bullet)
      } else {
        clearInterval(firing)
      }
    }, enemy('weaponDelay'))
  }

  const takeDamage = (dmg: number): void => {
    update({
      hp: enemy('hp') - dmg,
    })
  }

  const draw = (): void => {
    // update position and velocities
    const updated = Movement.handleAccelerations({ enemy, update })
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
      update({
        angle: enemy('angle') + 5 * radian,
      })
      game.context?.rotate(enemy('angle'))
    }

    // redraw image
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
