import {Blackbird} from './Blackbird';
import {Whitebird} from './Whitebird';
import {SpaceStation} from './SpaceStation';
import {isOnScreen} from '../utilities';

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

  addBlackbird = (t) => {
    const enemy = new Blackbird(this.game, t);
    this.addEnemy(enemy);
  };

  addWhitebird = (t) => {
    const enemy = new Whitebird(this.game, t);
    this.addEnemy(enemy);
  };

  addSpacestation = (t) => {
    const enemy = new SpaceStation(this.game, t);
    this.addEnemy(enemy);
  };

  createAllEnemies() {
    const lookup = {
      whitebird: () => this.addWhitebird(),
      blackbird: () => this.addBlackbird(),
      spacestation: () => this.addSpacestation(),
    };
    const {enemies} = this.config;
    enemies.map((enemyGroup) => {
      setTimeout(() => {
        enemyGroup.types.map((t, i) => {
          setTimeout(() => {
            lookup[t.type](t);
          }, t.delay * (i + 1));
        });
      }, enemyGroup.timestamp * 1000);
    });
  }
}
