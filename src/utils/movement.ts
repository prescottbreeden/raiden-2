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

// export const updatePositionAcceleration = ({
//   readState,
//   updateState,
// }: IStateObject) => {
//   return updateState({
//     vx: readState('vx') + readState('gx'),
//     vy: readState('vy') + readState('gy'),
//     y: readState('y') + readState('vy'),
//     x: readState('x') + readState('vx'),
//   });
// };

export const leavingLeftRight = ({ readState }: IStateObject) =>
  any(equals(true), [
    readState('x') <= 5 && readState('vx') < 0,
    readState('x') >= WIDTH - readState('w') && readState('vx') > 0,
  ]);

export const leavingTopBottom = ({ readState }: IStateObject) =>
  any(equals(true), [
    readState('y') <= readState('h') && readState('vy') < 0,
    readState('y') >= HEIGHT - readState('h') && readState('vy') > 0,
  ]);

export const reverseVx = ({ readState, updateState }: IStateObject) =>
  updateState({ vx: readState('vx') * -1 });

export const reverseVy = ({ readState, updateState }: IStateObject) =>
  updateState({ vy: readState('vy') * -1 });

const charge = (game: Game, readState: EnemyState, updateState: Update) => {
  updateState({
    vy: game.getVelocity() * 8,
  });
  const t1 = setTimeout(() => {
    updateState({
      vy: 0,
    });
  }, 700);
  const t2 = setTimeout(() => {
    updateState({
      gx: readState('x') < WIDTH / 2 ? -0.5 : 0.5,
    });
  }, 1400);
  return [t1, t2]
};

const hover = (game: Game, _: EnemyState, updateState: Update) => {
  updateState({
    vy: game.getVelocity() * 8,
    x: WIDTH / 2,
  });
  const t1 = setTimeout(() => {
    updateState({
      vy: 0,
    });
  }, 500);
  const t2 = setTimeout(() => {
    updateState({
      vy: 5,
    });
  }, 20000);
  return [t1,t2]
};

const explore = (game: Game, _: EnemyState, updateState: Update) => {
  // TODO: set X position based on config setting
  // TODO: set Y poisiont based on config setting
  updateState({
    x: getRandomInt(WIDTH * 0.1, WIDTH * 0.9),
    vy: game.getVelocity() * 2,
    vx: getRandomInt(0.1, 0.09) > 0.5 ? 1 : -1,
  });
  return []
};

const parabolic = (game: Game, readState: EnemyState, updateState: Update) => {
  updateState({
    vy: game.getVelocity() * 8,
    vx: readState('x') >= WIDTH / 2 ? 1 : -1,
    gy: -0.05,
  });
  return []
};

const kamakaze = (game: Game, _: EnemyState, updateState: Update) => {
  updateState({
    vy: game.getVelocity() * 8,
  });
  const timeout = setTimeout(() => {
    updateState({
      vy: 0,
    });
  }, 500);

  return [timeout]
};

function spacestationBoss(game: Game, _: EnemyState, updateState: Update) {
  updateState({
    vy: game.getVelocity() * 8,
  });
  const t1 = setTimeout(() => {
    updateState({
      vy: 0,
    });
  }, 500);
  const t2 = setTimeout(() => {
    updateState({
      vy: 5,
    });
  }, 100000);
  return [t1, t2]
}


export const move = (movementType: MovementName) => {
  const lookup = {
    charge,
    dive: () => [],
    explore,
    hover,
    kamakaze,
    parabolic,
    roll: () => [],
    boss: spacestationBoss,
    swoop: () => [],
  };
  return lookup[movementType];
};
