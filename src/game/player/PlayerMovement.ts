import { cond, gt, lt, pipe, prop, __ } from 'ramda';
import { HEIGHT, WIDTH } from '../..';
import { IPlayer } from '../../interfaces/IPlayer.interface';

export type UpdatePositionProps = {
  player: (p?: keyof IPlayer) => any;
  updatePlayer: (props: Partial<IPlayer>) => void;
};

export const frameWidth = 34;
export const frame = (index: number) => frameWidth * index;
export const frameXLocations = [21, 43, 65, 87];

export const updatePosition = ({ player, updatePlayer }: UpdatePositionProps) => {
  updatePlayer({
    y: player('y') + player('vy'),
    x: player('x') + player('vx'),
  });

  // don't fly off the screen!
  if (player('y') + player('h') / 2 > HEIGHT) {
    updatePlayer({ y: HEIGHT - player('h') / 2 });
  } else if (player('y') - player('h') / 2 < 0) {
    updatePlayer({ y: player('h') / 2 });
  }

  // don't fly off the screen!
  if (player('x') + player('w') / 2 > WIDTH) {
    updatePlayer({ x: WIDTH - player('w') / 2 });
  } else if (player('x') - player('w') / 2 < 0) {
    updatePlayer({ x: player('w') / 2 });
  }
};

const rollLeft = ({ player, updatePlayer }: UpdatePositionProps) =>
  updatePlayer({ frame: player('frame') > 0 ? player('frame') - 1 : 0 });

const rollRight = ({ player, updatePlayer }: UpdatePositionProps) =>
  updatePlayer({ frame: player('frame') < 10 ? player('frame') + 1 : 10 });

const flattenOut = ({ player, updatePlayer }: UpdatePositionProps) =>
  updatePlayer({
    frame:
      player('frame') < 5
        ? player('frame') + 1
        : player('frame') > 5
        ? player('frame') - 1
        : 5,
  });

export const handleRoll = cond<UpdatePositionProps, void>([
  [pipe(prop('player'), (p: any) => p('vx'), lt(__, 0)), rollLeft],
  [pipe(prop('player'), (p: any) => p('vx'), gt(__, 0)), rollRight],
  [() => true, flattenOut],
]);

export const leftLaunch = {
  x: WIDTH / 2 - 53, // starting position on launchpad
  y: HEIGHT / 2 + 35, // starting position on launchpad
};
export const middleLaunch = {
  x: WIDTH / 2 + 9, // starting position on launchpad
  y: HEIGHT / 2 + 35, // starting position on launchpad
};
export const rightLaunch = {
  x: WIDTH / 2 + 67, // starting position on launchpad
  y: HEIGHT / 2 + 35, // starting position on launchpad
};
