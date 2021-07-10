import { Explosion } from './Explosion';

export class ExplosionFactory {
  constructor(game) {
    this.game = game;
    this.canvas = game.canvas;
    this.explosions = [];
  }

  generateExplosions(enemy) {
    console.log('blewup', enemy);
    const explosion = new Explosion(this.game, enemy);
    this.explosions.push(explosion);
  }
}
