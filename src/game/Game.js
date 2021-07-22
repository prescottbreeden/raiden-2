import artwork from '../assets/images/artwork.jpg'
import blastershot from '../assets/sfx/r2/r2-blue-beam.mp3'
import explosionSound from '../assets/sfx/explosion1.mp3'
import itemPickip from '../assets/sfx/r2/r2-medal.mp3'
import playerOne from '../assets/images/mship1.png'
import raidenJam from '../assets/music/soundtrack.mp3'
import spreadshot from '../assets/sfx/r2/r2-blaster-splat-1.mp3'
import stage_1 from '../constants/stage_1.json'
import { BulletFactory } from './bullets/BulletFactory'
import { CloudFactory } from './environment/CloudFactory'
import { EnemyFactory } from './enemy/EnemyFactory'
import { ExplosionFactory } from './events/ExplosionFactory'
import { HEIGHT, WIDTH } from '..'
import { ItemFactory } from './events/ItemFactory'
import { Player } from './Player'
import { Sound } from './Sound'
import { getPointDistance, getDistance } from './utilities'

export const radian = Math.PI / 180
export const INITIAL = 1
export const GAME_PLAYING = 2
export const GAME_OVER = 3
export const KEY_CODE = {
  left: 37,
  up: 38,
  right: 39,
  down: 40,
  spacebar: 32,
  enter: 13,
  f: 70,
  d: 68,
  s: 83,
  a: 65,
}

export class Game {
  constructor({ difficulty, music, sfx }) {
    this._currentState = INITIAL
    this._velocity = 1
    this._difficulty = difficulty
    this._music = music
    this._sfx = sfx
    this._score = 0
    this.frames = []
    this.fps = 0
    this.width = WIDTH
    this.height = HEIGHT

    this.createCanvas()
    this.createBulletCanvas()
    this.displayFPS()
    // bind event listeners
    this.bindEvents()
  }
  getState = () => this._currentState
  setCurrentState = (newState) => (this._currentState = newState)

  getVelocity = () => this._velocity
  // setVelocity = (newVelocity) => (this._velocity = newVelocity);

  getDifficulty = () => this._difficulty

  getMusic = () => this._music
  toggleMusic = () => (this._music = !this._music)

  getScore = () => this._score
  setScore = (score) => (this._score += score)

  createCanvas = () => {
    const gameNode = document.getElementById('game')
    const canvas = document.createElement('canvas')
    canvas.id = 'ctx'
    canvas.className = 'canvas'
    canvas.width = this.width
    canvas.height = this.height
    gameNode.appendChild(canvas)
    this.canvas = canvas
    this.context = canvas.getContext('2d')
  }
  createBulletCanvas = () => {
    const bulletNode = document.getElementById('bullets')
    const canvas = document.createElement('canvas')
    canvas.id = 'bullet-ctx'
    canvas.className = 'bullet-canvas'
    canvas.width = this.width
    canvas.height = this.height
    bulletNode.appendChild(canvas)
    this.bulletCanvas = canvas
    this.bulletContext = canvas.getContext('2d')
  }

  pewpew = () => {
    if (this.player.weaponType === 'spread') {
      const pew = new Audio(spreadshot)
      pew.play()
    } else {
      const pew = new Audio(blastershot)
      pew.play()
    }
    this.bulletFactory.generatePlayerBullets()
  }

  startGame = () => {
    this.setCurrentState(GAME_PLAYING)
    this.start()
    this.hideMenu()
  }

  start() {
    this.createObjects()
    this.runGameLoop()
    this.cloudFactory.generateClouds()
    this.enemyFactory.createAllEnemies()
  }

  runGameLoop() {
    switch (this.getState()) {
      case INITIAL:
        break
      case GAME_PLAYING:
        this.drawGamePlayingScreen()
        break
      case GAME_OVER:
        this.drawGameOverScreen()
        break
    }
    window.requestAnimationFrame(() => {
      const now = performance.now()
      while (this.frames.length > 0 && this.frames[0] <= now - 1000) {
        this.frames.shift()
      }
      this.frames.push(now)
      this.fps = this.frames.length
      this.runGameLoop()
    })
  }

  displayFPS() {
    setInterval(() => {
      const node = document.getElementById('fps')
      node.textContent = this.fps
    }, 500)
  }

  createObjects() {
    this.cloudFactory = new CloudFactory(this.canvas)
    this.player = new Player(playerOne, this.canvas)
    this.bulletFactory = new BulletFactory(this, this.player)
    this.enemyFactory = EnemyFactory(this, stage_1)
    this.explosionFactory = new ExplosionFactory(this)
    this.itemFactory = new ItemFactory(this)
  }

  // ============================ //
  // ======== GAME MENU ========= //
  // ============================ //

  showMenu() {
    const button = document.createElement('button')
    button.className = 'start-button'
    button.onclick = this.startGame
    button.textContent = 'Start New Game'

    const menuPane = document.createElement('div')
    menuPane.className = 'menu'
    menuPane.id = 'menu'
    const image = new Image()
    image.className = 'menu__image'
    image.src = artwork
    const bulletDiv = document.getElementById('bullets')
    bulletDiv.appendChild(menuPane)
    menuPane.appendChild(image)
    menuPane.appendChild(button)
  }

  hideMenu() {
    const menu = document.getElementById('menu')
    menu.style.display = 'none'
  }

  // ============================ //
  // ======== GAME PLAY ========= //
  // ============================ //

  drawGamePlayingScreen() {
    if (this.getMusic()) {
      this.toggleMusic()
      this.soundtrack = new Sound(raidenJam)
    }

    // clear canvas
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.bulletContext.clearRect(0, 0, this.canvas.width, this.canvas.height)
    // this.canvas.width = this.canvas.width;

    // draw clouds
    this.checkCollisions()
    this.checkItemCollection()
    this.drawClouds()
    this.drawBullets()
    this.drawEnemies()
    this.drawExplosions()
    this.drawItems()

    // draw player
    this.player.update()
  }

  // ============================ //
  // ======== GAME OVER ========= //
  // ============================ //

  drawGameOverScreen() {
    this.context.fillStyle = 'black'
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)

    this.context.fillStyle = 'white'
    this.context.font = '36 Courier'
    this.context.fillText(
      'game over',
      this.canvas.width / 2 - 100,
      this.canvas.height / 2
    )
  }

  // ============================ //
  // ======== FUNCTIONS ========= //
  // ============================ //

  drawCollection(collection) {
    collection.forEach((obj) => obj.draw())
  }

  drawEnemies() {
    this.drawCollection(this.enemyFactory.enemies)
  }

  drawBullets() {
    this.drawCollection(this.bulletFactory.bullets)
  }

  drawClouds() {
    const clouds = this.cloudFactory.clouds
    clouds.forEach((cloud) => {
      cloud.draw()
      cloud.y += this.getVelocity()
    })
  }

  updateScore(score) {
    this.setScore(score)
    const node = document.getElementById('player-score')
    node.textContent = this._score
  }

  checkCollisions() {
    this.checkSuicides()
    const bullets = this.bulletFactory.bullets
    const enemies = this.enemyFactory.enemies
    for (let i = 0; i < bullets.length; i++) {
      for (let j = 0; j < enemies.length; j++) {
        const enemy = enemies[j]
        const bullet = bullets[i]
        if (bullet) {
          if (bullet.class != 'player') {
            continue
          }
          // as a bullet gets wider, the center has to be moved appropriately for distance
          const checkPlayerBullets = getPointDistance(
            enemy.x,
            enemy.y,
            bullet.x + bullet.w / 2,
            bullet.y
          )
          if (checkPlayerBullets < enemy.r + bullet.w / 2) {
            // TODO: finish abstracting
            if (enemy.takeDamage) {
              enemy.takeDamage(bullet.power)
            } else {
              enemy.hp -= bullet.power
            }
            bullets.splice(i, 1)
            if (enemy.hp <= 0) {
              if (enemy.item) {
                console.log('item is true')
                this.itemFactory.generateItem(enemy)
              }
              this.updateScore(enemy.pointValue)
              const hit = new Audio(explosionSound)
              hit.play()
              const enemyCopy = { ...enemy }
              this.explosionFactory.generateExplosions(enemyCopy)
              enemies.splice(j, 1)
            }
          }
        }
      }
    }
  }

  checkSuicides() {
    const enemies = this.enemyFactory.enemies
    for (let i = 0; i < enemies.length; i++) {
      const enemy = enemies[i]
      const distance = getDistance(enemy, this.player)
      if (distance < enemy.r) {
        const hit = new Audio(explosionSound)
        hit.play()
        this.setCurrentState(GAME_OVER)
      }
    }
  }

  drawExplosions() {
    const explosions = this.explosionFactory.explosions
    for (let i = 0; i < explosions.length; i++) {
      const explosion = explosions[i]
      explosion.draw()
      if (explosion.row + explosion.col === 15) {
        explosions.splice(i, 1)
      }
    }
  }

  drawItems() {
    const items = this.itemFactory.items
    items.forEach((item) => item.draw())
  }

  // TODO: seems overkill to check every item for a collision...
  checkItemCollection() {
    const items = this.itemFactory.items
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      const distance = getDistance(item, this.player)
      if (distance < item.w) {
        this.player.weaponType = item.prop
        items.splice(i, 1)
        const chaching = new Audio(itemPickip)
        chaching.play()
        // TODO: mod number here?
        this.player.weaponStr += 1
        if (this.player.weaponStr > 6) {
          this.player.weaponStr = 6
        }
      }
    }
  }

  reset() {}

  ceaseFire() {
    clearInterval(this.playerFire)
  }

  shoot() {
    if (this.player.weaponStr > 5) {
      this.playerFire = setInterval(this.pewpew, 75)
    } else if (this.player.weaponStr > 3) {
      this.playerFire = setInterval(this.pewpew, 100)
    } else {
      this.playerFire = setInterval(this.pewpew, 150)
    }
  }

  // ============================ //
  // ===== EVENT LISTENERS ====== //
  // ============================ //

  bindEvents() {
    let down = false
    let game = this

    window.addEventListener('keyup', function (e) {
      if (game.getState() === GAME_PLAYING) {
        switch (e.keyCode) {
          case KEY_CODE.left:
            if (game.player.vx < 0) {
              game.player.vx = 0
            }
            break
          case KEY_CODE.up:
            if (game.player.vy < 0) {
              game.player.vy = 0
            }
            break
          case KEY_CODE.right:
            if (game.player.vx > 0) {
              game.player.vx = 0
            }
            break
          case KEY_CODE.down:
            if (game.player.vy > 0) {
              game.player.vy = 0
            }
            break
          case KEY_CODE.spacebar:
            game.ceaseFire()
            down = false
        }
      }
    })

    window.addEventListener('keydown', function (e) {
      if (game.getState() === GAME_PLAYING) {
        switch (e.keyCode) {
          case KEY_CODE.left:
            game.player.vx = -4.5
            break
          case KEY_CODE.up:
            game.player.vy = -4.5
            break
          case KEY_CODE.right:
            game.player.vx = 4.5
            break
          case KEY_CODE.down:
            game.player.vy = 4.5
            break
          case KEY_CODE.spacebar:
            if (down) return
            down = true
            game.shoot()
        }
      }
    })
  }
}
