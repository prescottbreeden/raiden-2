
export const aimAtPlayer = (enemy) => {
  const player = getPosition(enemy.game.player);
  const distance = getDistance(enemy.game.player, enemy);
  return {
    vx: ((player.x - enemy.x) / distance) * this.weaponSpeed,
    vy: ((player.y - enemy.y) / distance) * this.weaponSpeed,
  }
}
