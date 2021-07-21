import minigun from '../assets/sfx/r2/r2-big-laser-3.mp3'
import retroShotBlaster from '../assets/sfx/retro-shot-blaster-1.mp3'
import { Ball } from '../game/bullets/Ball'
import { Enemy, EnemyType, WeaponType } from '../types/blackbird.type'
import { Game } from '../game/Game'
import { SpinCycle } from '../game/bullets/Spiral'
import { getDistance, getPosition } from '../game/utilities'
import { shouldFire } from '../game/utilities'

export const aimAtPlayer = (game: Game, enemy: EnemyType) => {
  const player = getPosition(game.player!)
  const distance = getDistance(game.player, enemy)
  return {
    vx: ((player.x - enemy.x) / distance) * enemy.weaponSpeed,
    vy: ((player.y - enemy.y) / distance) * enemy.weaponSpeed,
  }
}

const spincycle = (game: Game, enemy: Enemy) => {
  const firing = setInterval(() => {
    if (enemy('vy') === 0) {
      if (shouldFire(enemy())) {
        const pew = new Audio(minigun)
        pew.play()
        const bullet = SpinCycle(game, enemy())
        game.bulletFactory?.addBullets(bullet)
      } else {
        clearInterval(firing)
      }
    }
  }, enemy('weaponDelay'))
}

const ball = (game: Game, enemy: Enemy) => {
  const firing = setInterval(() => {
    if (shouldFire(enemy())) {
      const pew = new Audio(retroShotBlaster)
      pew.play()
      const bullet = Ball(game, enemy())
      game.bulletFactory?.addBullets(bullet)
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
      const bullet = Ball(game, enemy())
      game.bulletFactory?.addBullets(bullet)
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
