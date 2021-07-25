import minigun from '../assets/sfx/r2/r2-big-laser-3.mp3'
import retroShotBlaster from '../assets/sfx/retro-shot-blaster-1.mp3'
import { Ball } from '../game/bullets/Ball'
import { EnemyState } from '../interfaces/IStateObject.interface'
import { EnemyWeaponName } from '../types/EnemyWeaponName.type'
import { Game } from '../game/Game'
import { IEnemy } from '../interfaces/IEnemy.interface'
import { IShip } from '../interfaces/IShip.interface'
import { SpinCycle } from '../game/bullets/Spiral'
import { getDistance } from '../game/utilities'
import { shouldFire } from '../game/utilities'

export const aimAtPlayer = (game: Game, enemy: IEnemy) => {
  const { x, y } = game.player! as unknown as IShip
  const distance = getDistance(game.player, enemy)
  return {
    vx: ((x - enemy.x) / distance) * enemy.weaponSpeed,
    vy: ((y - enemy.y) / distance) * enemy.weaponSpeed,
  }
}

const spincycle = (game: Game, enemy: EnemyState) => {
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

const ball = (game: Game, enemy: EnemyState) => {
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

const trishot = (game: Game, enemy: EnemyState) => {
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

export const fire = (weaponType: EnemyWeaponName) => {
  const weaponTypes = {
    ball,
    flak: ball,
    rip: ball,
    shotgun: ball,
    sniper: ball,
    spincycle,
    sprinkler: ball,
    trishot,
  }
  return weaponTypes[weaponType]
}
