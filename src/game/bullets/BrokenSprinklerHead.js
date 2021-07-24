import fireball from '../../assets/images/weaponfire/RLiGng-fireball-transparent-picture.png'

export class BrokenSprinklerHead {
  constructor(game, ship) {
    this.context = game.context
    this.class = 'enemy'
    this.vy = ship.vy
    this.vx = ship.vx
    this.x = ship.x
    this.y = ship.y
    this.radians = Math.random() * Math.PI * 2
    this.w = 20
    this.h = 20
    this.src = fireball
    this.img = null
    this.arc = 2

    this.create()
  }
  create() {
    if (!this.img) {
      this.img = new Image()
      this.img.src = this.src
    }
  }

  draw() {
    this.arc += 0.5
    this.radians += 0.03
    this.x += Math.cos(this.radians) * this.arc
    this.y += Math.sin(this.radians) * this.arc
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
