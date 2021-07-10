import { isOnScreen } from '../utilities';
import { Cloud } from './Cloud';

export class CloudFactory {
  constructor(canvas) {
    this.canvas = canvas;
    this.context = this.canvas.getContext('2d');
    this.clouds = [];
  }

  generateClouds() {
    setInterval(() => {
      const cloud = new Cloud(this.canvas);
      const cleanUp = this.clouds.filter(isOnScreen);
      this.clouds = [...cleanUp, cloud];
    }, 2000);
  }
}
