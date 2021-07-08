import {HEIGHT, WIDTH} from "..";
import {getRandomInt} from "../game/utilities";

export const charge = (obj) => {
  obj.vy = obj.game.getVelocity() * 8;
  obj.vx = 0;
  obj.gy = 0;
  obj.gx = 0;
  setTimeout(() => {
    obj.vy = 0;
  }, 700);
  setTimeout(() => {
    obj.gx = obj.x < WIDTH / 2
      ? -0.5
      : 0.5;
  }, 1400);
}

export const parabolic = (obj) => {
  obj.vy = obj.game.getVelocity() * 8;
  obj.g = -0.05;
  // arc left vs arc right based on entrance position
  if (obj.x >= obj.canvas.width / 2) {
    obj.vx = 1;
  } else {
    obj.vx = -1;
  }
}
