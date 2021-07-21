import defaults from '../../constants/fireball.json'
import fireballImage from '../../assets/images/weaponfire/RLiGng-fireball-transparent-picture.png'
import { newImage, publicProperty, useState } from '../../utils/general'
import { Game } from '../Game'
import { EnemyType } from '../../types/blackbird.type'
import { aimAtPlayer } from '../../utils/weapons'

export const Ball = (game: Game, enemy: EnemyType) => {
  const { readState: bullet, updateState: update } = useState<any>({
    ...enemy,
    ...defaults,
    img: newImage(fireballImage),
    radians: Date.now(),
  })

  if (enemy.aim) {
    const { vx, vy } = aimAtPlayer(game, bullet())
    update({ vx, vy })
  }

  const draw = () => {
    update({
      vx: bullet('vx') + bullet('gx'),
      vy: bullet('vy') + bullet('gy'),
      y: bullet('y') + bullet('vy'),
      x: bullet('x') + bullet('vx'),
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
    ...publicProperty<number>('r', () => bullet('r')),
    ...publicProperty<number>('w', () => bullet('w')),
    ...publicProperty<number>('x', () => bullet('x')),
    ...publicProperty<number>('y', () => bullet('y')),
  })

  return bulletObject
}
