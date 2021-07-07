import { Blackbird } from './Blackbird';
import { Whitebird } from './Whitebird';
import { SpaceStation } from './SpaceStation';
import { isOnScreen } from '../utilities';

export class EnemyFactory {
  constructor(game, config = {}) {
    this.game = game;
    this.canvas = game.canvas;
    this.enemies = [];
    this.config = config;
  }

  addEnemy = (...enemies) => {
    const cleanUp = this.enemies.filter(isOnScreen);
    this.enemies = [...cleanUp, ...enemies];
  };

  addBlackbird = () => {
    const enemy = new Blackbird(this.game);
    this.addEnemy(enemy);
  };

  addWhitebird = () => {
    const enemy = new Whitebird(this.game);
    this.addEnemy(enemy);
  };

  addSpacestation = () => {
    const enemy = new SpaceStation(this.game);
    this.addEnemy(enemy);
  };

  createAllEnemies() {
    const lookup = {
      whitebird: () => this.addWhitebird(),
      blackbird: () => this.addBlackbird(),
      spacestation: () => this.addSpacestation(),
    };
    const { enemies } = this.config;
    enemies.map((e, i) => {
      setTimeout(() => {
        e.types.map((t, i) => {
          setTimeout(() => {
            lookup[t.type]();
          }, e.delay * (i + 1));
        });
      }, e.timestamp * 1000);
    });
  }
}
