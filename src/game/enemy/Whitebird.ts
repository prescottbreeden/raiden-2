import defaults from '../../constants/whitebird.json';
import whitebirdImg from '../../assets/images/whitebird.png';
import { BlackbirdEnemy } from '../../types/blackbird.type';
import { Game } from '../Game';
import { Enemy } from './Enemy';

export const Whitebird = (game: Game, props: BlackbirdEnemy) => {
  const attr: BlackbirdEnemy = {
    ...defaults,
    ...props,
    src: whitebirdImg,
    h: 67,
    w: 67,
    r: 67 / 2.1,
    pointValue: 100,
    weaponSpeed: game.getVelocity() * defaults.weaponSpeed,
    weaponType: 'ball',
  };
  return Enemy(game, attr);
};
