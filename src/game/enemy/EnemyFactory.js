import {Blackbird} from './Blackbird';
import {Whitebird} from './Whitebird';
import {SpaceStation} from './SpaceStation';
import {isOnScreen} from '../utilities';
import {ItemGiver} from './ItemGiver';

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

  createAllEnemies() {
    const lookup = {
      whitebird: (t) => new Whitebird(this.game, t),
      blackbird: (t) => new Blackbird(this.game, t),
      spacestation: (t) => new SpaceStation(this.game, t),
      itemGiver: (t) => new ItemGiver(this.game, t),
    };
    const {enemies} = this.config;
    enemies.map((enemyGroup) => {
      setTimeout(() => {
        enemyGroup.types.map((t, i) => {
          setTimeout(() => {
            this.addEnemy(lookup[t.type](t));
          }, t.delay * (i + 1));
        });
      }, enemyGroup.timestamp * 1000);
    });
  }
}
