import playerOne from '../assets/images/mship1.png'
import raidenSprites from '../assets/images/raiden-3-sprites.png'
import { Game } from './Game'
import { HEIGHT, WIDTH } from '..'
import { newImage, publicProperty, useState } from '../utils/general'

export const Player = (game: Game) => {
  const width = 70
  const height = 85
  const frameWidth = 34
  const frame = (index: number) => frameWidth * index

  const { readState: player, updateState: updatePlayer } = useState<any>({
    img: newImage(raidenSprites),
    h: height,
    w: width,
    r: (width / 1.4) * 0.67,
    x: WIDTH / 2,
    y: HEIGHT - height,
    vy: 0,
    vx: 0,
    weaponType: 'spread',
    weaponStr: 1,
    hitBox: { a: '', b: '', c: '' },
    frame: 5,
    exhaustFrame: 0,
  })

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
    })
  }

  const move = {
    left: () => updatePlayer({ vx: -4.5 }),
    right: () => updatePlayer({ vx: 4.5 }),
    stopX: () => updatePlayer({ vx: 0 }),
    up: () => updatePlayer({ vy: -4.5 }),
    down: () => updatePlayer({ vy: 4.5 }),
    stopY: () => updatePlayer({ vy: 0 }),
  }

  const handleRoll = () => {
    if (player('vx') < 0) {
      updatePlayer({ frame: player('frame') > 0 ? player('frame') - 1 : 0 })
    }
    if (player('vx') > 0) {
      updatePlayer({ frame: player('frame') < 10 ? player('frame') + 1 : 10 })
    }
    if (player('vx') === 0) {
      updatePlayer({
        frame:
          player('frame') < 5
            ? player('frame') + 1
            : player('frame') > 5
            ? player('frame') - 1
            : 5,
      })
    }
  }

  const updatePosition = () => {
    updatePlayer({
      y: player('y') + player('vy'),
      x: player('x') + player('vx'),
    })
    if (player('y') + player('h') / 2 > HEIGHT) {
      updatePlayer({ y: HEIGHT - player('h') / 2 })
    } else if (player('y') - player('h') / 2 < 0) {
      updatePlayer({ y: player('h') / 2 })
    }

    if (player('x') + player('w') / 2 > WIDTH) {
      updatePlayer({ x: WIDTH - player('w') / 2 })
    } else if (player('x') - player('w') / 2 < 0) {
      updatePlayer({ x: player('w') / 2 })
    }
  }

  const drawPlayer = () => {
    game.context?.save()
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
    )
  }

  const drawExhaust = () => {
    const exaustFrames = [21, 43, 65, 87]
    updatePlayer({ exhaustFrame: (player('exhaustFrame') + 1) % 4 })
    game.context?.save()
    game.context?.drawImage(
      player('img'), // img
      exaustFrames[player('exhaustFrame')], // sx
      99, // sy
      10, // swidth
      10, // sheight
      player('x') + 1, // dx
      player('y') + 35,
      20, // dwidth
      20 // dheight
    )
    game.context?.drawImage(
      player('img'), // img
      exaustFrames[player('exhaustFrame')], // sx
      99, // sy
      10, // swidth
      10, // sheight
      player('x') - 24, // dx
      player('y') + 35,
      20, // dwidth
      20 // dheight
    )
  }

  const changeWeapon = (weaponType: 'spread' | 'blaster') => {
    updatePlayer({
      weaponType,
      weaponStr: player('weaponStr') < 6 ? player('weaponStr') + 1 : 6,
    })
  }

  const update = () => {
    updatePosition()
    currentHitBox()
    handleRoll()
    drawExhaust()
    drawPlayer()

    game.context?.save()
    game.context?.restore()
  }

  const playerObject = {
    changeWeapon,
    move,
    update,
  }

  // Read-only properties
  Object.defineProperties(playerObject, {
    ...publicProperty<number>('h', () => player('h')),
    ...publicProperty<number>('r', () => player('r')),
    ...publicProperty<number>('w', () => player('w')),
    ...publicProperty<number>('x', () => player('x')),
    ...publicProperty<number>('y', () => player('y')),
    ...publicProperty<number>('vx', () => player('vx')),
    ...publicProperty<number>('vy', () => player('vy')),
    ...publicProperty<number>('weaponType', () => player('weaponType')),
    ...publicProperty<number>('weaponStr', () => player('weaponStr')),
  })

  return playerObject
}
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
