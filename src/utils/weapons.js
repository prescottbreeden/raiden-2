import { getDistance, getPosition } from '../game/utilities';

export const aimAtPlayer = (enemy) => {
  const player = getPosition(enemy.game.player);
  const distance = getDistance(enemy.game.player, enemy);
  return {
    vx: ((player.x - enemy.x) / distance) * enemy.weaponSpeed,
    vy: ((player.y - enemy.y) / distance) * enemy.weaponSpeed,
  };
};
