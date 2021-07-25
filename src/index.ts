import './sass/main.scss'
import { Game } from './game/Game'

export const WIDTH = 760
export const HEIGHT = 1000

window.onload = () => {
  const newGame = new Game({
    difficulty: 1,
    music: true,
    sfx: true,
  })
  newGame.showMenu()
}
