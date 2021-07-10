import blackbird from '../../assets/images/blackbird.png';
import defaults from '../../constants/blackbird.json';
import { Enemy, EnemyFunction } from './Enemy';

export const Blackbird = (game, props) => {
  const attr = {
    ...defaults,
    ...props,
    src: blackbird,
    h: 67,
    w: 67,
    r: 67 / 2.1,
    pointValue: 100,
    weaponSpeed: game.getVelocity() * defaults.weaponSpeed,
    weaponType: 'ball',
  };
  return EnemyFunction(game, attr);
};
