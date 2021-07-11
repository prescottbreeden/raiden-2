import fireball from '../../assets/images/weaponfire/RLiGng-fireball-transparent-picture.png'
import { Bullet } from './Bullet'

export class Spiral extends Bullet {
  constructor(game, ship, i) {
    super(game, ship)

    this.class = 'enemy'
    this.vy = ship.vy
    this.vx = ship.vx
    this.x = ship.x
    this.y = ship.y
    this.radians = Date.now()
    this.w = 20
    this.h = 20
    this.src = fireball
    this.img = null

    this.create()
  }
  create() {
    if (!this.img) {
      this.img = new Image()
      this.img.src = this.src
    }
  }

  draw() {
    this.x += Math.cos(this.radians) * 3
    this.y += Math.sin(this.radians) * 3
    this.context.save()
    this.context.translate(this.x, this.y)
    this.context.drawImage(
      this.img,
      -(this.w / 2),
      -(this.h / 2),
      this.h,
      this.w
    )
    this.context.restore()
  }
}