export class Bullet {
  constructor(game, ship) {
    this.canvas = game.canvas
    this.context = game.context
    this.ship = ship
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
