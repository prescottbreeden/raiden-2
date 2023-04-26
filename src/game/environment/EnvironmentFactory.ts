import cloudPng from '../../assets/images/clouds.png';
import waterPng from '../../assets/images/water_6.png';
import { DrawableImage } from './DrawableImage';
import { Factory } from '../../types/Factory.type';
import { Game } from '../Game';
import { IDrawable } from '../../interfaces/IDrawable.interface';
import { HEIGHT, WIDTH } from '../..';
import { getRandomInt } from '../utilities';
import { isOnScreen } from '../utilities';
import { newImage, publicProperty, useState } from '../../utils/general';

function cloud(game: Game): IDrawable[] {
  return [DrawableImage({
    game,
    context: 'context',
    props: {
      h: 200,
      w: 300,
      x: getRandomInt(0, WIDTH - 300),
      y: 0 - 200,
      img: newImage(cloudPng),
    },
  })];
}

// row of water
function water(game: Game): IDrawable[] {
  // TODO: generating an entire map would be more effective than row by row
  // then we can get rid of the timout and just redraw a matrix on every
  // cycle
  return [
    DrawableImage({
    game,
    context: 'context',
    props: {
      h: 200,
      w: 300,
      x: -100,
      y: -200,
      img: newImage(waterPng),
    },
  }),
    DrawableImage({
    game,
    context: 'context',
    props: {
      h: 200,
      w: 300,
      x: 165,
      y: -200,
      img: newImage(waterPng),
    },
  }),
    DrawableImage({
    game,
    context: 'context',
    props: {
      h: 200,
      w: 300,
      x: 265,
      y: -200,
      img: newImage(waterPng),
    },
  }),
    DrawableImage({
    game,
    context: 'context',
    props: {
      h: 200,
      w: 300,
      x: 400,
      y: -200,
      img: newImage(waterPng),
    },
  }),
    DrawableImage({
    game,
    context: 'context',
    props: {
      h: 200,
      w: 300,
      x: 550,
      y: -200,
      img: newImage(waterPng),
    },
  }),
  ];
}

const backgrounds = {
  cloud,
  water,
};

export function EnvironmentFactory({
  game,
  drawInterval,
  type,
}: {
  type: 'cloud' | 'water';
  drawInterval: number;
  game: Game;
}): Factory {
  const { readState, updateState } = useState<Factory>({ state: [] });

  const addBackground = (backgrounds: IDrawable[]) => {
    updateState({
      state: readState('state').filter(isOnScreen).concat(backgrounds),
    });
  };

  setInterval(() => {
    addBackground(backgrounds[type](game));
  }, drawInterval);

  const factory = {};

  // Read-only properties
  Object.defineProperties(factory, {
    ...publicProperty('state', () => readState('state')),
  });

  return factory as Factory;
}
