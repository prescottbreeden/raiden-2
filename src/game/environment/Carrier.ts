import carrierSprite from '../../assets/images/raiden-carrier.png'
import { Game } from '../Game'
import { newImage, publicProperty, useState } from '../../utils/general'
import { HEIGHT, WIDTH } from '../..'

export const Carrier = (game: Game) => {
  const width = 420
  const height = 900

  const { readState: carrier, updateState: updateCarrier } = useState<any>({
    img: newImage(carrierSprite),
    h: height,
    w: width,
    x: WIDTH / 2 - width / 2,
    y: HEIGHT - height,
    vy: 0,
    vx: 0,
    launcherFrame: 0,
    launcherX: 325,
    launcherY: HEIGHT / 2 + 90,
  })

  const currentHitBox = () => {
    updateCarrier({
      hitBox: {
        a: {
          x: carrier('x'),
          y: carrier('y') - carrier('r'),
        },
        b: {
          x: carrier('x') - carrier('r') * 0.66,
          y: carrier('y') + carrier('r') * 0.66,
        },
        c: {
          x: carrier('x') + carrier('r') * 0.66,
          y: carrier('y') + carrier('r') * 0.66,
        },
      },
    })
  }

  const move = {
    left: () => updateCarrier({ vx: -4.5 }),
    right: () => updateCarrier({ vx: 4.5 }),
    stopX: () => updateCarrier({ vx: 0 }),
    up: () => updateCarrier({ vy: -4.5 }),
    down: () => updateCarrier({ vy: 4.5 }),
    stopY: () => updateCarrier({ vy: 0 }),
  }

  const updatePosition = () => {
    updateCarrier({
      y: carrier('y') + carrier('vy'),
      x: carrier('x') + carrier('vx'),
    })
  }

  const drawCarrier = () => {
    game.context?.save()
    // game.context?.translate(carrier('x'), carrier('y'))
    game.context?.drawImage(
      carrier('img'), // img
      0, // sx
      0, // sy
      280, // swidth
      700, // sheight
      carrier('x'),
      carrier('y'),
      carrier('w'), // dwidth
      carrier('h') // dheight
    )
  }
  const animateLaunchSequence = () => {
    setTimeout(() => {
      updateCarrier({ launcherFrame: 1 })
    }, 1200)
    setTimeout(() => {
      updateCarrier({ launcherFrame: 2 })
    }, 1400)
    setTimeout(() => {
      updateCarrier({ launcherFrame: 3 })
    }, 1600)

    setTimeout(() => {
      updateCarrier({ vy: 0.5 })
    }, 2000)
    setTimeout(() => {
      updateCarrier({ vy: 1.0 })
    }, 2500)
    setTimeout(() => {
      updateCarrier({ vy: 1.2 })
    }, 2600)
    setTimeout(() => {
      updateCarrier({ vy: 1.5 })
    }, 2700)
    setTimeout(() => {
      updateCarrier({ vy: 2.0 })
    }, 2800)
    setTimeout(() => {
      updateCarrier({ vy: 2.5 })
    }, 2900)
  }

  const drawLauncher = () => {
    updateCarrier({ launcherY: carrier('launcherY') + carrier('vy') })
    const launcherFrames = [15, 32, 48, 64]
    game.context?.save()
    game.context?.drawImage(
      carrier('img'), // img
      561, // sx
      launcherFrames[carrier('launcherFrame')], // sy
      30, // swidth
      17, // sheight
      carrier('launcherX'),
      carrier('launcherY'),
      44,
      22
    )
  }

  const draw = () => {
    updatePosition()
    currentHitBox()
    drawCarrier()
    drawLauncher()

    game.context?.save()
    game.context?.restore()
  }

  const carrierObject = {
    move,
    draw,
    animateLaunchSequence,
  }

  // Read-only properties
  Object.defineProperties(carrierObject, {
    ...publicProperty<number>('h', () => carrier('h')),
    ...publicProperty<number>('w', () => carrier('w')),
    ...publicProperty<number>('x', () => carrier('x')),
    ...publicProperty<number>('y', () => carrier('y')),
    ...publicProperty<number>('vx', () => carrier('vx')),
    ...publicProperty<number>('vy', () => carrier('vy')),
  })

  return carrierObject
}
// game.context?.drawImage(
//   carrier('img'),
//   -(carrier('w') / 2),
//   -(carrier('h') / 2),
//   carrier('w'),
//   carrier('h')
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
