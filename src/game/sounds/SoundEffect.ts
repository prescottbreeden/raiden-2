import blastershot from '../../assets/sfx/r2/r2-blue-beam.mp3';
import explosion from '../../assets/sfx/explosion1.mp3';
import fullPower from '../../assets/sfx/r2/full-power.mp3';
import itemPickip from '../../assets/sfx/r2/r2-medal.mp3';
import minigun from '../../assets/sfx/r2/r2-big-laser-3.mp3';
import retroShotBlaster from '../../assets/sfx/retro-shot-blaster-1.mp3';
import selectStart from '../../assets/sfx/r2/select-start.mp3';
import smallExplosion from '../../assets/sfx/r2/pew-1.mp3';
import spreadshot from '../../assets/sfx/r2/r2-blaster-splat-1.mp3';
import { cond, equals } from 'ramda';

const sfx: { [key: string]: string } = {
  blastershot,
  explosion,
  fullPower,
  itemPickip,
  minigun,
  retroShotBlaster,
  selectStart,
  smallExplosion,
  spreadshot,
};
export const SoundEffect = () => {
  let enemySfx = new Audio();
  let explosionSfx = new Audio();
  let gameSfx = new Audio();
  let playerSfx = new Audio();

  // channel :: HTMLAudioElement -> string -> unit
  const channel = (audio: HTMLAudioElement) => (sound: string) => {
    const nextTrack = new Audio();
    nextTrack.src = sfx[sound];
    audio = nextTrack;
    audio.play();
  };

  // playerSfx :: string -> unit
  const playSfx = cond([
    // player channel
    [equals('itemPickip'), channel(playerSfx)],
    [equals('fullPower'), channel(playerSfx)],

    // enemy channel
    [equals('retroShotBlaster'), channel(enemySfx)],
    [equals('minigun'), channel(enemySfx)],

    // explosion channel
    [equals('smallExplosion'), channel(explosionSfx)],
    [equals('explosion'), channel(explosionSfx)],

    // game channel
    [equals('blastershot'), channel(gameSfx)],
    [equals('spreadshot'), channel(gameSfx)],
    [() => true, channel(gameSfx)],
  ]);

  // changeVolume :: number -> unit
  const changeVolume = (num: number) => {
    enemySfx.volume = num / 10;
    explosionSfx.volume = num / 10;
    gameSfx.volume = num / 10;
    playerSfx.volume = num / 10;
  };

  return {
    changeVolume,
    playSfx,
  };
};
