import * as PlayerMovement from './player/PlayerMovement';
import player1Defaults from '../constants/player1.json';
import raidenSprites from '../assets/images/raiden-3-sprites.png';
import { Game } from './Game';
import { IPlayer } from '../interfaces/IPlayer.interface';
import { cond, gt, lt, subtract, __ } from 'ramda';
import { newImage, publicProperty, useState } from '../utils/general';
import { HEIGHT, WIDTH } from '..';

export const Player = (game: Game) => {
  const { readState: player, updateState: updatePlayer } = useState<IPlayer>({
    ...player1Defaults,
    afterBurner: false,
    hitBox: { a: { x: 0, y: 0 }, b: { x: 0, y: 0 }, c: { x: 0, y: 0 } },
    img: newImage(raidenSprites),
    r: player1Defaults.w / 1.4,
    x: WIDTH / 2 + 9, // starting position on launchpad
    y: HEIGHT / 2 + 35, // starting position on launchpad
  });

  const currentHitBox = () => {
    updatePlayer({
      hitBox: {
        a: {
          x: player('x'),
          y: player('y') - player('r'),
        },
        b: {
          x: player('x') - player('r') * 0.66,
          y: player('y') + player('r') * 0.66,
        },
        c: {
          x: player('x') + player('r') * 0.66,
          y: player('y') + player('r') * 0.66,
        },
      },
    });
  };

  const move = {
    left: () => !game.lockControls && updatePlayer({ vx: -4.5 }),
    right: () => !game.lockControls && updatePlayer({ vx: 4.5 }),
    stopX: () => !game.lockControls && updatePlayer({ vx: 0 }),
    up: () => !game.lockControls && updatePlayer({ vy: -4.5 }),
    down: () => !game.lockControls && updatePlayer({ vy: 4.5 }),
    stopY: () => !game.lockControls && updatePlayer({ vy: 0 }),
  };

  const dynamicExhaust = cond<number, number>([
    [lt(__, 5), subtract(__, 5)],
    [gt(__, 5), subtract(5)],
    [() => true, () => 0],
  ]);

  const toggleAfterBurner = () => {
    updatePlayer({ afterBurner: !player('afterBurner') });
  };

  // TODO: create logic to accelerate and deccelerate afterburner
  const rightExhaust = () => {
    const dx = player('x') + 1 + dynamicExhaust(player('frame'));
    game.context?.drawImage(
      player('img'), // img
      PlayerMovement.frameXLocations[player('exhaustFrame')], // sx
      99, // sy
      10, // swidth
      10, // sheight
      dx,
      player('y') + 30, // dy
      20, // dwidth
      player('afterBurner') ? 40 : 20 // dheight
    );
  };

  const leftExhaust = () => {
    const dx = player('x') - 20 + dynamicExhaust(player('frame')) * -1;
    game.context?.drawImage(
      player('img'), // img
      PlayerMovement.frameXLocations[player('exhaustFrame')], // sx
      99, // sy
      10, // swidth
      10, // sheight
      dx,
      player('y') + 30, // dy
      20, // dwidth
      player('afterBurner') ? 40 : 20 // dheight
    );
  };

  const drawExhaust = () => {
    updatePlayer({ exhaustFrame: (player('exhaustFrame') + 1) % 4 });
    game.context?.save();
    rightExhaust();
    leftExhaust();
  };

  const changeWeapon = (weaponType: 'spread' | 'blaster') => {
    updatePlayer({
      weaponType,
      weaponStr: player('weaponStr') < 6 ? player('weaponStr') + 1 : 6,
    });
  };

  const drawPlayer = () => {
    game.context?.save();
    game.context?.drawImage(
      player('img'), // img
      PlayerMovement.frame(player('frame')), // sx
      30, // sy
      PlayerMovement.frameWidth, // swidth
      45, // sheight
      player('x') - player('w') / 2, // dx
      player('y') - player('h') / 2, // dy
      player('w'), // dwidth
      player('h') // dheight
    );
  };

  const update = () => {
    PlayerMovement.updatePosition({ player, updatePlayer });
    PlayerMovement.handleRoll({ player, updatePlayer });
    currentHitBox();
    drawExhaust();
    drawPlayer();

    game.context?.restore();
  };

  const playerObject = {
    changeWeapon,
    move,
    toggleAfterBurner,
    update,
  };

  // Read-only properties
  Object.defineProperties(playerObject, {
    ...publicProperty('h', () => player('h')),
    ...publicProperty('r', () => player('r')),
    ...publicProperty('vx', () => player('vx')),
    ...publicProperty('vy', () => player('vy')),
    ...publicProperty('w', () => player('w')),
    ...publicProperty('weaponStr', () => player('weaponStr')),
    ...publicProperty('weaponType', () => player('weaponType')),
    ...publicProperty('x', () => player('x')),
    ...publicProperty('y', () => player('y')),
  });

  return playerObject;
};
