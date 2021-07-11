import defaults from '../../constants/spacestation.json';
import spacestationImg from '../../assets/images/spacestation.png';
import { BlackbirdEnemy } from '../../types/blackbird.type';
import { Enemy } from './Enemy';
import { Game } from '../Game';

export const SpaceStation = (game: Game, props: BlackbirdEnemy) => {
  const attr: BlackbirdEnemy = {
    ...defaults,
    ...props,
    src: spacestationImg,
    h: 80,
    w: 80,
    r: 40,
    pointValue: 500,
    weaponSpeed: game.getVelocity() * defaults.weaponSpeed,
    weaponType: 'ball',
  };
  return Enemy(game, attr);
};
