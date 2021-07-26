import { Cloud, ICloud } from './Cloud';
import { Game } from '../Game';
import { ICloudFactory } from '../../interfaces/ICloudFactory.interface';
import { isOnScreen } from '../utilities';
import { publicProperty, useState } from '../../utils/general';

export const CloudFactory = (game: Game) => {
  const { readState: factory, updateState: update } = useState<ICloudFactory>({
    clouds: [],
  });

  const addClouds = (...clouds: any[]) => {
    const cleanUp = factory('clouds').filter(isOnScreen);
    update({ clouds: [...cleanUp, ...clouds] });
  };

  const cloudLaunch = () => {
    const launch = setInterval(() => {
      addClouds(Cloud(game));
    }, 200);

    setTimeout(() => {
      clearInterval(launch);
    }, 6800);
  };

  setInterval(() => {
    addClouds(Cloud(game));
  }, 2000);

  const cloudFactory = {
    cloudLaunch,
  };

  Object.defineProperties(cloudFactory, {
    ...publicProperty<ICloud[]>('clouds', () => factory('clouds')),
  });

  return cloudFactory;
};
