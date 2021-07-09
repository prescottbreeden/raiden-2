import './sass/main.scss';
import {Game} from './game/Game';

export const WIDTH = 500;
export const HEIGHT = window.innerHeight - 50;

window.onload = () => {
  const newGame = new Game({
    difficulty: 1,
    music: true,
    sfx: true,
  });
  newGame.showMenu();
};

