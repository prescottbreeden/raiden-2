import { HEIGHT, WIDTH } from '..'
import { Game } from '../game/Game'
import { getRandomInt } from '../game/utilities'
import { BlackbirdEnemy } from '../types/blackbird.type'
import { any, equals, __ } from 'ramda'

export const defaultAcceleration = { angle: 0, vy: 0, vx: 0, gy: 0, gx: 0 }
export const handleAccelerations = ({ get, set }: any) => {
  return set({
    vx: get('vx') + get('gx'),
    vy: get('vy') + get('gy'),
    y: get('y') + get('vy'),
    x: get('x') + get('vx'),
  })
}
export const charge = (
  game: Game,
  getEnemy: () => BlackbirdEnemy,
  setEnemy: (obj: Partial<BlackbirdEnemy>) => void
) => {
  setEnemy({
    vy: game.getVelocity() * 8,
  })
  setTimeout(() => {
    setEnemy({
      vy: 0,
    })
  }, 700)
  setTimeout(() => {
    setEnemy({
      gx: getEnemy().x < WIDTH / 2 ? -0.5 : 0.5,
    })
  }, 1400)
}

export const parabolic = (
  game: Game,
  getEnemy: () => BlackbirdEnemy,
  setEnemy: (obj: Partial<BlackbirdEnemy>) => void
) => {
  setEnemy({
    vy: game.getVelocity() * 8,
    vx: getEnemy().x >= WIDTH / 2 ? 1 : -1,
    gy: -0.05,
  })
}

export const explore = (
  game: Game,
  getEnemy: () => BlackbirdEnemy,
  setEnemy: (obj: Partial<BlackbirdEnemy>) => void
) => {
  // TODO: set X position based on config setting
  // TODO: set Y poisiont based on config setting
  setEnemy({
    x: getRandomInt(WIDTH * 0.1, WIDTH * 0.9),
    vy: game.getVelocity() * 2,
    vx: getRandomInt(0.1, 0.09) > 0.5 ? 1 : -1,
  })
}
export const leavingLeftRight = ({ get }: any) =>
  any(equals(true), [
    get('x') <= 5 && get('vx') < 0,
    get('x') >= WIDTH - get('w') && get('vx') > 0,
  ])

export const leavingTopBottom = ({ get }: any) =>
  any(equals(true), [
    get('y') <= get('h') && get('vy') < 0,
    get('y') >= HEIGHT - get('h') && get('vy') > 0,
  ])

export const reverseVx = ({ get, set }: any) => set({ vx: get('vx') * -1 })
export const reverseVy = ({ get, set }: any) => set({ vy: get('vy') * -1 })
