import * as Movement from '../../utils/movement'
import retroShotBlaster from '../../assets/sfx/retro-shot-blaster-1.mp3'
import minigun from '../../assets/sfx/r2/r2-big-laser-3.mp3'
import { Ball } from '../bullets/Ball'
import { EnemyType } from '../../types/blackbird.type'
import { Game, radian } from '../Game'
import { aimAtPlayer } from '../../utils/weapons'
import { cond, __ } from 'ramda'
import { getPosition, shouldFire } from '../utilities'
import { useState } from '../../utils/general'
import { Spiral } from '../bullets/Spiral'

export const Enemy = (game: Game, props: EnemyType) => {
  const img = new Image()
  img.src = props.src

  const [retrieveState, update] = useState<EnemyType & { game: Game }>({
    ...props,
    game,
    img,
  })

  const enemy = (p?: keyof EnemyType): any | EnemyType =>
    // @ts-ignore
    p ? retrieveState()[p] : retrieveState()

  // @ts-ignore
  Movement[enemy('movement')](game, enemy, update)

  // TODO: abstract me please....
  if (enemy('movement') === 'hover') {
    const firing = setInterval(() => {
      if (enemy('vy') === 0) {
        if (shouldFire(enemy())) {
          const pew = new Audio(minigun)
          pew.play()
          const bullet = new Spiral(game, enemy())
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

  // Public Methods
  const enemyObject = {
    takeDamage,
    draw,
  }

  const publicProperty = (name: string, val: () => any) => ({
    [name]: {
      enumerable: true,
      get: val,
    },
  })

  // Public Read Properties
  Object.defineProperties(enemyObject, {
    ...publicProperty('pointValue', () => enemy('pointValue')),
    ...publicProperty('item', () => enemy('item')),
    ...publicProperty('hp', () => enemy('hp')),
    ...publicProperty('h', () => enemy('h')),
    ...publicProperty('w', () => enemy('w')),
    ...publicProperty('r', () => enemy('r')),
    ...publicProperty('x', () => enemy('x')),
    ...publicProperty('y', () => enemy('y')),
    ...publicProperty('vx', () => enemy('vx')),
    ...publicProperty('vy', () => enemy('vy')),
    ...publicProperty('gy', () => enemy('gy')),
    ...publicProperty('gx', () => enemy('gx')),
  })

  return enemyObject
}
