import carrierSprite from '../../assets/images/raiden-carrier.png';
import { Game } from '../Game';
import { newImage, publicProperty, useState } from '../../utils/general';
import { HEIGHT, WIDTH } from '../..';

export function Carrier(game: Game) {
  const width = 420;
  const height = 900;
  // original had a zoom in start .. the launchers would need to be redrawn
  // const zoomCarrier = {
  //   width: 420 * 2,
  //   height: 900 * 2,
  //   y: HEIGHT - height + 400,
  // };

  const { readState, updateState } = useState<any>({
    img: newImage(carrierSprite),
    h: height,
    w: width,
    x: WIDTH / 2 - width / 2,
    y: HEIGHT - height,
    vy: 0,
    vx: 0,
    launcherFrame: 0,
    launcherX: 304,
    launcherY: (HEIGHT - height) / 2 + 560,
    launcher2X: 365,
    launcher3X: 424,
  });

  const move = {
    left: () => updateState({ vx: -4.5 }),
    right: () => updateState({ vx: 4.5 }),
    stopX: () => updateState({ vx: 0 }),
    up: () => updateState({ vy: -4.5 }),
    down: () => updateState({ vy: 4.5 }),
    stopY: () => updateState({ vy: 0 }),
  };

  const updatePosition = () => {
    updateState({
      y: readState('y') + readState('vy'),
      x: readState('x') + readState('vx'),
    });
  };

  const drawCarrier = () => {
    game.context?.save();
    game.context?.drawImage(
      readState('img'), // img
      0, // sx
      0, // sy
      280, // swidth
      700, // sheight
      readState('x'),
      readState('y'),
      readState('w'), // dwidth
      readState('h') // dheight
    );
  };

  const animateLaunchSequence = () => {
    // --[ lower launcpad ]--
    setTimeout(() => {
      updateState({ launcherFrame: 1 });
    }, 1200);
    setTimeout(() => {
      updateState({ launcherFrame: 2 });
    }, 1400);
    setTimeout(() => {
      updateState({ launcherFrame: 3 });
    }, 1600);

    // --[ accelerate carrier to make it look like taking off ]--
    setTimeout(() => {
      updateState({ vy: 0.5 });
    }, 2000);
    setTimeout(() => {
      updateState({ vy: 1.0 });
    }, 2500);
    setTimeout(() => {
      updateState({ vy: 1.2 });
    }, 2600);
    setTimeout(() => {
      updateState({ vy: 1.5 });
    }, 2700);
    setTimeout(() => {
      updateState({ vy: 2.0 });
    }, 2800);
    setTimeout(() => {
      updateState({ vy: 2.5 });
    }, 2900);
  };

  const drawLauncher = () => {
    updateState({ launcherY: readState('launcherY') + readState('vy') });
    const launcherFrames = [15, 32, 48, 64];
    game.context?.save();
    game.context?.drawImage(
      readState('img'), // img
      561, // sx
      launcherFrames[0], // launcherFrames[readState('launcherFrame')], // sy
      30, // swidth
      17, // sheight
      readState('launcherX'),
      readState('launcherY'),
      44,
      22
    );
    game.context?.save();
    game.context?.drawImage(
      readState('img'), // img
      561, // sx
      launcherFrames[readState('launcherFrame')], // sy
      30, // swidth
      17, // sheight
      readState('launcher2X'),
      readState('launcherY'),
      44,
      22
    );
    game.context?.save();
    game.context?.drawImage(
      readState('img'), // img
      561, // sx
      launcherFrames[0], // launcherFrames[readState('launcherFrame')], // sy
      30, // swidth
      17, // sheight
      readState('launcher3X'),
      readState('launcherY'),
      44,
      22
    );
  };

  const draw = () => {
    updatePosition();
    drawCarrier();
    drawLauncher();

    game.context?.save();
    game.context?.restore();
  };

  const carrierObject = {
    move,
    draw,
    animateLaunchSequence,
  };

  // Read-only properties
  Object.defineProperties(carrierObject, {
    ...publicProperty('h', () => readState('h')),
    ...publicProperty('w', () => readState('w')),
    ...publicProperty('x', () => readState('x')),
    ...publicProperty('y', () => readState('y')),
    ...publicProperty('vx', () => readState('vx')),
    ...publicProperty('vy', () => readState('vy')),
  });

  return carrierObject;
};
