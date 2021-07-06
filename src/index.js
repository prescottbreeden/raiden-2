import './sass/main.scss';
import { Game } from './game/Game';

export const WIDTH = 800;
export const HEIGHT = window.innerHeight - 50;

window.onload = () => {
  console.log('success');
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

  const GAME = new Game(canvas);
  GAME.start();
  gameNode.appendChild(canvas);
}
