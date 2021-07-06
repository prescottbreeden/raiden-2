import './sass/main.scss';
import soundtrack from './assets/music/soundtrack.mp3';
// import blaster from './assets/music/blaster.mp3';
import { Sound } from './game/Sound';
import { Game } from './game/Game';

const raidenJam = Sound(soundtrack);
raidenJam.play();

// setInterval(() => {
//   const pew = Sound(blaster);
//   pew.play();
// }, 100);

Game();
