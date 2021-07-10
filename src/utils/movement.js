import { HEIGHT, WIDTH } from '..';
import { getRandomInt } from '../game/utilities';

export const charge = (game, getEnemy, setEnemy) => {
  setEnemy({
    ...getEnemy(),
    vy: game.getVelocity() * 8,
    vx: 0,
    gy: 0,
    gx: 0,
  });
  setTimeout(() => {
    setEnemy({
      ...getEnemy(),
      vy: 0,
    });
  }, 700);
  setTimeout(() => {
    setEnemy({
      ...getEnemy(),
      gx: getEnemy().x < WIDTH / 2 ? -0.5 : 0.5,
    });
  }, 1400);
};

export const parabolic = (obj) => {
  obj.vy = obj.game.getVelocity() * 8;
  obj.gy = -0.05;
  // arc left vs arc right based on entrance position
  if (obj.x >= obj.canvas.width / 2) {
    obj.vx = 1;
  } else {
    obj.vx = -1;
  }
};
