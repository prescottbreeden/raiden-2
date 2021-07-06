const { context: getField } = require('../utils/general');

const Background = () => {
  const { canvas, context } = getField();
  // specs
  const h = 200;
  const w = 200;
  const x = getRandomInt(0, canvas.width - w);
  const y = 0 - h;
  const img = (new Image().src = src);

  return {
    draw: () => {
      if (img != null) {
        context.drawImage(img, x, y, w, h);
      }
    },
  };
};

export const Game = () => {
  const gameState = 1;
  const velocity = 1;
  const score = 0;
  const { canvas, context } = getField();
  // const background = Background();
  // background.draw();
  context.fillStyle = 'lightblue';
  context.fillRect(0, 0, canvas.width, canvas.height);
};
