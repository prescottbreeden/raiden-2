import * as Movement from '../../utils/movement'
import retroShotBlaster from '../../assets/sfx/retro-shot-blaster-1.mp3'
// import minigun from '../../assets/sfx/r2/r2-big-laser.mp3'
import minigun from '../../assets/sfx/r2/r2-big-laser-3.mp3'
import { Ball } from '../bullets/Ball'
import { EnemyType } from '../../types/blackbird.type'
import { Game, radian } from '../Game'
import { aimAtPlayer } from '../../utils/weapons'
import { cond, __ } from 'ramda'
import { getPosition, shouldFire } from '../utilities'
import { useState } from '../../utils/general'
import { Spiral } from '../bullets/Spiral'

export const Enemy = (game: Game, props: any) => {
  const img = new Image()
  img.src = props.src

  const [retrieveState, update] = useState<EnemyType>({
    game,
    img,
    angle: 0,
    vy: 0,
    vx: 0,
    gy: 0,
    gx: 0,
    radians: 0,
    ...props,
  })

  const enemy = (p?: keyof EnemyType) =>
    // @ts-ignore
    p ? retrieveState()[p] : retrieveState()

  // --[ Run Config Settings ]--
  if (enemy('movement') === 'hover') {
    Movement.hover(game, enemy, update)
  } else if (enemy('movement') === 'parabolic') {
    Movement.parabolic(game, enemy, update)
  } else if (enemy('movement') === 'charge') {
    Movement.charge(game, enemy, update)
  } else if (enemy('movement') === 'explore') {
    Movement.explore(game, enemy, update)
  } else {
    console.error('FACK', enemy('movement'))
    Movement.charge(game, enemy, update)
  }

  // abstract me
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

  const takeDamage = (dmg: number) => {
    update({
      hp: enemy('hp') - dmg,
    })
  }
  const draw = () => {
    const updated = Movement.handleAccelerations({ enemy, update })

    // if (enemy('movement') === 'hover') {
    //   const radians = enemy('radians') + 0.03
    //   const x = enemy('x') + Math.cos(radians) * 2
    //   const y = enemy('y') + Math.sin(radians) * 2
    //   update({
    //     radians,
    //     x,
    //     y,
    //   })
    // }

    game.context?.save()
    game.context?.translate(updated.x, updated.y)

    if (enemy('tracking')) {
      const { x, y } = getPosition(game.player!)
      const angle = Math.atan2(y - enemy('y'), x - enemy('x')) - Math.PI / 2
      game.context?.rotate(angle)
    }

    if (enemy('contain')) {
      cond([
        [Movement.leavingLeftRight, Movement.reverseVx],
        [Movement.leavingTopBottom, Movement.reverseVy],
      ])({ enemy, update })
    }

    if (enemy('spin')) {
      update({
        angle: enemy('angle') + 5 * radian,
      })
      game.context?.rotate(enemy('angle'))
    }

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

  // Public Read Properties (convenience)
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
