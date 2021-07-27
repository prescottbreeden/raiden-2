import player1Defaults from '../constants/player1.json';
import raidenSprites from '../assets/images/raiden-3-sprites.png';
import { Game } from './Game';
import { HEIGHT, WIDTH } from '..';
import { IPlayer } from '../interfaces/IPlayer.interface';
import { newImage, publicProperty, useState } from '../utils/general';
import { cond, gt, lt, __ } from 'ramda';

export const Player = (game: Game) => {
  const frameWidth = 34;
  const frame = (index: number) => frameWidth * index;

  const leftLaunch = {
    x: WIDTH / 2 - 53, // starting position on launchpad
    y: HEIGHT / 2 + 35, // starting position on launchpad
  };
  const middleLaunch = {
    x: WIDTH / 2 + 9, // starting position on launchpad
    y: HEIGHT / 2 + 35, // starting position on launchpad
  };
  const rightLaunch = {
    x: WIDTH / 2 + 67, // starting position on launchpad
    y: HEIGHT / 2 + 35, // starting position on launchpad
  };

  const { readState: player, updateState: updatePlayer } = useState<IPlayer>({
    ...player1Defaults,
    hitBox: { a: { x: 0, y: 0 }, b: { x: 0, y: 0 }, c: { x: 0, y: 0 } },
    img: newImage(raidenSprites),
    r: player1Defaults.w / 1.4,
    ...middleLaunch,
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
    left: () => updatePlayer({ vx: -4.5 }),
    right: () => updatePlayer({ vx: 4.5 }),
    stopX: () => updatePlayer({ vx: 0 }),
    up: () => updatePlayer({ vy: -4.5 }),
    down: () => updatePlayer({ vy: 4.5 }),
    stopY: () => updatePlayer({ vy: 0 }),
  };

  const rollLeft = () =>
    updatePlayer({ frame: player('frame') > 0 ? player('frame') - 1 : 0 });

  const rollRight = () =>
    updatePlayer({ frame: player('frame') < 10 ? player('frame') + 1 : 10 });

  const flattenOut = () =>
    updatePlayer({
      frame:
        player('frame') < 5
          ? player('frame') + 1
          : player('frame') > 5
          ? player('frame') - 1
          : 5,
    });

  const handleRoll = cond<number, void>([
    [lt(__, 0), rollLeft],
    [gt(__, 0), rollRight],
    [() => true, flattenOut],
  ]);

  const updatePosition = () => {
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

  const drawPlayer = () => {
    game.context?.save();
    game.context?.drawImage(
      player('img'), // img
      frame(player('frame')), // sx
      30, // sy
      frameWidth, // swidth
      45, // sheight
      player('x') - player('w') / 2, // dx
      player('y') - player('h') / 2, // dy
      player('w'), // dwidth
      player('h') // dheight
    );
  };

  const drawExhaust = () => {
    const frameXLocations = [21, 43, 65, 87];
    updatePlayer({ exhaustFrame: (player('exhaustFrame') + 1) % 4 });
    game.context?.save();
    game.context?.drawImage(
      player('img'), // img
      frameXLocations[player('exhaustFrame')], // sx
      99, // sy
      10, // swidth
      10, // sheight
      player('x') + 1, // dx
      player('y') + 30,
      20, // dwidth
      20 // dheight
    );
    game.context?.drawImage(
      player('img'), // img
      frameXLocations[player('exhaustFrame')], // sx
      99, // sy
      10, // swidth
      10, // sheight
      player('x') - 20, // dx
      player('y') + 30,
      20, // dwidth
      20 // dheight
    );
  };

  const changeWeapon = (weaponType: 'spread' | 'blaster') => {
    updatePlayer({
      weaponType,
      weaponStr: player('weaponStr') < 6 ? player('weaponStr') + 1 : 6,
    });
  };

  const update = () => {
    updatePosition();
    currentHitBox();
    handleRoll(player('vx'));
    drawExhaust();
    drawPlayer();

    game.context?.save();
    game.context?.restore();
  };

  const playerObject = {
    changeWeapon,
    move,
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
// game.context?.drawImage(
//   player('img'),
//   -(player('w') / 2),
//   -(player('h') / 2),
//   player('w'),
//   player('h')
// )
// this.context.arc(this.position.x, this.position.y, this.r, 0, 360 * radian, false);
// this.context.strokeStyle = 'white';
// this.context.fillStyle = 'rgba(350, 350, 350, .2)';
// this.context.lineWidth = 2;
// this.context.stroke();
// this.context.fill();

// this.context.save();
// this.context.strokeStyle = 'red';
// this.context.beginPath();
// this.context.moveTo(this.hitBox.a.x, this.hitBox.a.y);
// this.context.lineTo(this.hitBox.b.x, this.hitBox.b.y);
// this.context.lineTo(this.hitBox.c.x, this.hitBox.c.y);
// this.context.lineTo(this.hitBox.a.x, this.hitBox.a.y);
// this.context.stroke();
// this.context.restore();

// this.context.save();
// this.context.fillStyle = 'rgba(250,250,250,.2)';
// this.context.translate(this.x, this.y)
// this.context.fillRect(-(this.w/2), -(this.h/2), this.w, this.h);
// this.context.fill();
// this.context.restore();
