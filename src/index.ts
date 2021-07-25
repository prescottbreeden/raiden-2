import './sass/main.scss'
import { Game } from './game/Game'

export const WIDTH = 760
export const HEIGHT = 1000

window.onload = () => {
  const game = document.getElementById('game')
  if (game) {
    game.style.width = `${WIDTH}px`
    game.style.height = `${HEIGHT}px`
  }
  const newGame = new Game({
    difficulty: 1,
    music: true,
    sfx: true,
  })
  newGame.showMenu()
}
