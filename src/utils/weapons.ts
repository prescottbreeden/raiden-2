import minigun from '../assets/sfx/r2/r2-big-laser-3.mp3'
import retroShotBlaster from '../assets/sfx/retro-shot-blaster-1.mp3'
import { Ball } from '../game/bullets/Ball'
import { Enemy, EnemyType, WeaponType } from '../types/blackbird.type'
import { Game } from '../game/Game'
import { SpinCycle } from '../game/bullets/Spiral'
import { getDistance } from '../game/utilities'
import { shouldFire } from '../game/utilities'

export const aimAtPlayer = (game: Game, enemy: EnemyType) => {
  const { x, y } = game.player!
  const distance = getDistance(game.player, enemy)
  return {
    vx: ((x - enemy.x) / distance) * enemy.weaponSpeed,
    vy: ((y - enemy.y) / distance) * enemy.weaponSpeed,
  }
}

const spincycle = (game: Game, enemy: Enemy) => {
  const firing = setInterval(() => {
    if (enemy('vy') === 0) {
      if (shouldFire(enemy())) {
        const pew = new Audio(minigun)
        pew.play()
        game.bulletFactory?.addBullets(SpinCycle(game, enemy()))
      } else {
        clearInterval(firing)
      }
    }
  }, enemy('weaponDelay'))
}

const ball = (game: Game, enemy: Enemy) => {
  console.log(enemy('weaponDelay'))
  const firing = setInterval(() => {
    if (shouldFire(enemy())) {
      const pew = new Audio(retroShotBlaster)
      pew.play()
      game.bulletFactory?.addBullets(Ball(game, enemy()))
    } else {
      clearInterval(firing)
    }
  }, enemy('weaponDelay'))
}

const trishot = (game: Game, enemy: Enemy) => {
  const firing = setInterval(() => {
    if (shouldFire(enemy())) {
      const pew = new Audio(retroShotBlaster)
      pew.play()
      game.bulletFactory?.addBullets(Ball(game, enemy()))
    } else {
      clearInterval(firing)
    }
  }, enemy('weaponDelay'))
}

export const fire = (weaponType: WeaponType) => {
  const weaponTypes = {
    spincycle,
    ball,
    trishot,
    spread: ball, // separate enemy vs player?
    blaster: ball,
  }
  return weaponTypes[weaponType]
}
