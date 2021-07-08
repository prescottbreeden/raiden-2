import './sass/main.scss';
import {Game, GAME_PLAYING} from './game/Game';

export const WIDTH = 500;
export const HEIGHT = window.innerHeight - 50;

window.onload = () => {
  const button = document.createElement('button');
  button.className = 'start-button';
  button.id = 'start-button';
  button.onclick = buildGame;
  button.textContent = 'Start New Game';
  const gameNode = document.getElementById('game');
  gameNode.appendChild(button);
};

function buildGame() {
  const gameNode = document.getElementById('game');
  gameNode.removeChild(document.getElementById('start-button'));
  const canvas = document.createElement('canvas');
  canvas.id = 'ctx';
  canvas.className = 'canvas';
  canvas.width = WIDTH;
  canvas.height = HEIGHT;

  const newGame = new Game(canvas);
  newGame.setState(GAME_PLAYING);
  newGame.start();

  gameNode.appendChild(canvas);
}
