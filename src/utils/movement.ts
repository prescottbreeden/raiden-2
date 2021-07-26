import { Game } from '../game/Game';
import { HEIGHT, WIDTH } from '..';
import { any, equals, __ } from 'ramda';
import { getRandomInt } from '../game/utilities';
import {
  EnemyState,
  IStateObject,
  Update,
} from '../interfaces/IStateObject.interface';
import { MovementName } from '../types/MovementName.type';

export const updatePositionAcceleration = ({ enemy, update }: IStateObject) => {
  return update({
    vx: enemy('vx') + enemy('gx'),
    vy: enemy('vy') + enemy('gy'),
    y: enemy('y') + enemy('vy'),
    x: enemy('x') + enemy('vx'),
  });
};

export const leavingLeftRight = ({ enemy }: IStateObject) =>
  any(equals(true), [
    enemy('x') <= 5 && enemy('vx') < 0,
    enemy('x') >= WIDTH - enemy('w') && enemy('vx') > 0,
  ]);

export const leavingTopBottom = ({ enemy }: IStateObject) =>
  any(equals(true), [
    enemy('y') <= enemy('h') && enemy('vy') < 0,
    enemy('y') >= HEIGHT - enemy('h') && enemy('vy') > 0,
  ]);

export const reverseVx = ({ enemy, update }: IStateObject) =>
  update({ vx: enemy('vx') * -1 });

export const reverseVy = ({ enemy, update }: IStateObject) =>
  update({ vy: enemy('vy') * -1 });

const charge = (game: Game, enemy: EnemyState, update: Update) => {
  update({
    vy: game.getVelocity() * 8,
  });
  setTimeout(() => {
    update({
      vy: 0,
    });
  }, 700);
  setTimeout(() => {
    update({
      gx: enemy('x') < WIDTH / 2 ? -0.5 : 0.5,
    });
  }, 1400);
};

const hover = (game: Game, _: EnemyState, update: Update) => {
  update({
    vy: game.getVelocity() * 8,
    x: WIDTH / 2,
  });
  setTimeout(() => {
    update({
      vy: 0,
    });
  }, 500);
  setTimeout(() => {
    update({
      vy: 5,
    });
  }, 20000);
};

const explore = (game: Game, _: EnemyState, update: Update) => {
  // TODO: set X position based on config setting
  // TODO: set Y poisiont based on config setting
  update({
    x: getRandomInt(WIDTH * 0.1, WIDTH * 0.9),
    vy: game.getVelocity() * 2,
    vx: getRandomInt(0.1, 0.09) > 0.5 ? 1 : -1,
  });
};

const parabolic = (game: Game, enemy: EnemyState, update: Update) => {
  update({
    vy: game.getVelocity() * 8,
    vx: enemy('x') >= WIDTH / 2 ? 1 : -1,
    gy: -0.05,
  });
};

const kamakaze = (game: Game, _: EnemyState, update: Update) => {
  update({
    vy: game.getVelocity() * 8,
  });
  setTimeout(() => {
    update({
      vy: 0,
    });
  }, 500);
};
export const move = (movementType: MovementName) => {
  const lookup = {
    charge,
    dive: () => null,
    explore,
    hover,
    kamakaze,
    parabolic,
    roll: () => null,
    swoop: () => null,
  };
  return lookup[movementType];
};
