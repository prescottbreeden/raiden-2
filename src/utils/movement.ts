import { HEIGHT, WIDTH } from '..'
import { Game } from '../game/Game'
import { getRandomInt } from '../game/utilities'
import { BlackbirdEnemy } from '../types/blackbird.type'
import { any, equals, __ } from 'ramda'

type Enemy = (prop?: keyof BlackbirdEnemy) => any
type Update = (data: Partial<BlackbirdEnemy>) => BlackbirdEnemy
type MOFO = {
  enemy: Enemy
  update: Update
}

export const defaultAcceleration: Partial<BlackbirdEnemy> = {
  angle: 0,
  vy: 0,
  vx: 0,
  gy: 0,
  gx: 0,
  radians: 0,
}
export const handleAccelerations = ({ enemy, update }: MOFO) => {
  return update({
    vx: enemy('vx') + enemy('gx'),
    vy: enemy('vy') + enemy('gy'),
    y: enemy('y') + enemy('vy'),
    x: enemy('x') + enemy('vx'),
  })
}
export const charge = (game: Game, enemy: Enemy, update: Update) => {
  update({
    vy: game.getVelocity() * 8,
  })
  setTimeout(() => {
    update({
      vy: 0,
    })
  }, 700)
  setTimeout(() => {
    update({
      gx: enemy('x') < WIDTH / 2 ? -0.5 : 0.5,
    })
  }, 1400)
}

export const hover = (game: Game, _: Enemy, update: Update) => {
  update({
    vy: game.getVelocity() * 8,
    x: WIDTH / 2,
  })
  setTimeout(() => {
    update({
      vy: 0,
    })
  }, 500)
  setTimeout(() => {
    update({
      vy: 5,
    })
  }, 20000)
}

export const explore = (game: Game, _: Enemy, update: Update) => {
  // TODO: set X position based on config setting
  // TODO: set Y poisiont based on config setting
  update({
    x: getRandomInt(WIDTH * 0.1, WIDTH * 0.9),
    vy: game.getVelocity() * 2,
    vx: getRandomInt(0.1, 0.09) > 0.5 ? 1 : -1,
  })
}

export const parabolic = (game: Game, enemy: Enemy, update: Update) => {
  update({
    vy: game.getVelocity() * 8,
    vx: enemy('x') >= WIDTH / 2 ? 1 : -1,
    gy: -0.05,
  })
}

export const leavingLeftRight = ({ enemy }: MOFO) =>
  any(equals(true), [
    enemy('x') <= 5 && enemy('vx') < 0,
    enemy('x') >= WIDTH - enemy('w') && enemy('vx') > 0,
  ])

export const leavingTopBottom = ({ enemy }: MOFO) =>
  any(equals(true), [
    enemy('y') <= enemy('h') && enemy('vy') < 0,
    enemy('y') >= HEIGHT - enemy('h') && enemy('vy') > 0,
  ])

export const reverseVx = ({ enemy, update }: MOFO) =>
  update({ vx: enemy('vx') * -1 })
export const reverseVy = ({ enemy, update }: MOFO) =>
  update({ vy: enemy('vy') * -1 })
