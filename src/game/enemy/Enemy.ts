import * as Movement from '../../utils/movement'
import retroShotBlaster from '../../assets/sfx/retro-shot-blaster-1.mp3'
import { Ball } from '../bullets/Ball'
import { BlackbirdEnemy } from '../../types/blackbird.type'
import { Game, radian } from '../Game'
import { aimAtPlayer } from '../../utils/weapons'
import { cond, __ } from 'ramda'
import { getPosition, shouldFire } from '../utilities'
import { useState } from '../../utils/general'

export const Enemy = (game: Game, props: any) => {
  const img = new Image()
  img.src = props.src

  const [getEnemy, set] = useState<BlackbirdEnemy>({
    game,
    img,
    ...Movement.defaultAcceleration,
    ...props,
  })

  const get = (property?: keyof BlackbirdEnemy) =>
    // @ts-ignore
    property ? getEnemy()[property] : getEnemy()

  // --[ Run Config Settings ]--
  // @ts-ignore
  Movement[get('movement')](game, get, set)

  // abstract me
  const firing = setInterval(() => {
    if (shouldFire(get())) {
      const pew = new Audio(retroShotBlaster)
      pew.play()
      const bullet = new Ball(game, get())
      const { vx, vy } = aimAtPlayer(get())
      bullet.vx = vx
      bullet.vy = vy
      game.bulletFactory?.bullets.push(bullet)
    } else {
      clearInterval(firing)
    }
  }, get('weaponDelay'))

  const takeDamage = (dmg: number) => {
    set({
      hp: get('hp') - dmg,
    })
  }
  const draw = () => {
    const updated = Movement.handleAccelerations({ get, set })
    game.context?.save()
    game.context?.translate(updated.x, updated.y)

    if (get('tracking')) {
      const { x, y } = getPosition(game.player!)
      const angle = Math.atan2(y - get('y'), x - get('x')) - Math.PI / 2
      game.context?.rotate(angle)
    }

    if (get('contain')) {
      cond([
        [Movement.leavingLeftRight, Movement.reverseVx],
        [Movement.leavingTopBottom, Movement.reverseVy],
      ])({ get, set })
    }

    if (get('spin')) {
      set({
        angle: get('angle') + 5 * radian,
      })
      game.context?.rotate(get('angle'))
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
    get,
    takeDamage,
    draw,
  }

  const publicGetter = (name: string, val: () => any) => ({
    [name]: {
      enumerable: true,
      get: val,
    },
  })

  // Public Read Properties (convenience)
  Object.defineProperties(enemyObject, {
    ...publicGetter('pointValue', () => get('pointValue')),
    ...publicGetter('item', () => get('item')),
    ...publicGetter('hp', () => get('hp')),
    ...publicGetter('h', () => get('h')),
    ...publicGetter('w', () => get('w')),
    ...publicGetter('r', () => get('r')),
    ...publicGetter('x', () => get('x')),
    ...publicGetter('y', () => get('y')),
    ...publicGetter('vx', () => get('vx')),
    ...publicGetter('vy', () => get('vy')),
    ...publicGetter('gy', () => get('gy')),
    ...publicGetter('gx', () => get('gx')),
  })

  return enemyObject
}
