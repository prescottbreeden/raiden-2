import artwork from '../assets/images/title_image.png';
import playerLife from '../assets/images/raiden-player-red.png';
import stage_1 from '../constants/stage_1.json';
import { BulletFactory, IBulletFactory } from './bullets/BulletFactory';
import { Carrier } from './environment/Carrier';
import { EnemyFactory } from './enemy/EnemyFactory';
import { EnvironmentFactory } from './environment/EnvironmentFactory';
import { ExplosionFactory, IExplosionFactory } from './events/ExplosionFactory';
import { GameMusic } from './sounds/GameMusic';
import { HEIGHT, WIDTH } from '..';
import { IItemFactory, ItemFactory } from './events/ItemFactory';
import { Player } from './Player';
import { SoundEffect } from './sounds/SoundEffect';
import { __, cond, gt, pipe, prop } from 'ramda';
import { getPointDistance, getDistance } from './utilities';
import { newImage } from '../utils/general';
import { Factory } from '../types/Factory.type';
// import { IEnemy } from '../interfaces/IEnemy.interface';
// import { IPlayer } from '../interfaces/IPlayer.interface';

export const radian = Math.PI / 180;
export const INITIAL = 1;
export const GAME_PLAYING = 2;
export const GAME_OVER = 3;
export const KEY_CODE = {
  left: 37,
  up: 38,
  right: 39,
  down: 40,
  spacebar: 32,
  enter: 13,
  delete: 46,
  q: 81,
  f: 70,
  d: 68,
  s: 83,
  a: 65,
};

export class Game {
  private _currentState: number;
  private _velocity: number;
  private _stage: number;
  private _stageClear: boolean;
  private _difficulty: number;
  private _playSfx: boolean;
  private _playMusic: boolean;
  private _score: number;

  height: number;
  width: number;

  //contexts
  context: null | any;
  bulletContext: any;
  groundContext: any;

  frames: any[];
  fps: number;
  lockControls: boolean;
  firing: boolean;
  music: any; // instance of music?
  musicChoice: string;
  sfx: any; // instance of sfx
  carrier: any;

  player: any;
  playerFire: any;

  // factories
  bulletFactory: IBulletFactory;
  cloudFactory: Factory;
  groundFactory: Factory;
  enemyFactory: any;
  explosionFactory: IExplosionFactory;
  itemFactory: IItemFactory;

  constructor({
    difficulty,
    music,
    sfx,
  }: {
    difficulty: number;
    music: boolean;
    sfx: boolean;
  }) {
    this._currentState = INITIAL;
    this._velocity = 1;
    this._stage = 1;
    this._stageClear = false;
    this._difficulty = difficulty;
    this._playMusic = music;
    this._playSfx = sfx;
    this._score = 0;

    this.frames = [];
    this.fps = 0;
    this.width = WIDTH;
    this.lockControls = true;
    this.height = HEIGHT;
    this.firing = false;
    this.music = GameMusic();
    this.musicChoice = 'stage1';
    this.sfx = SoundEffect();
    // this.bulletContactSfx = null
    // this.explosionSfx = null

    // canvas contextx
    this.groundContext = null;
    this.bulletContext = null;
    this.context = null;

    this.createCanvas();
    this.createGroundCanvas();
    this.createBulletCanvas();
    this.displayFPS();

    // bind event listeners
    this.bindEvents();

    // game elements
    this.player = Player(this);

    // factories
    this.cloudFactory = { state: [] };
    this.groundFactory = { state: [] };
    this.carrier = null;
    this.enemyFactory = { state: [] };
    this.explosionFactory = { state: [], generateExplosions: () => undefined };
    this.itemFactory = { state: [], generateItem: (_enemy) => undefined };
    this.bulletFactory = {
      addBullets: () => undefined,
      state: [],
      generatePlayerBullets: () => undefined,
    };
  }
  getState = () => this._currentState;
  setCurrentState = (newState: number) => (this._currentState = newState);

  getVelocity = () => this._velocity;
  setVelocity = (newVelocity: number) => (this._velocity = newVelocity);

  getDifficulty = () => this._difficulty;

  getScore = () => this._score;
  setScore = (score: number) => (this._score += score);

  createCanvas = () => {
    const gameNode = document.getElementById('game');
    const canvas = document.createElement('canvas');
    canvas.id = 'ctx';
    canvas.className = 'canvas';
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    canvas.style.backgroundColor = '#0884ce';
    if (gameNode) {
      gameNode.appendChild(canvas);
      this.context = canvas.getContext('2d');
    }
  };

  createGroundCanvas = () => {
    const groundNode = document.getElementById('ground');
    const canvas = document.createElement('canvas');
    canvas.id = 'bullet-ctx';
    canvas.className = 'canvas';
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    if (groundNode) {
      groundNode.appendChild(canvas);
      this.groundContext = canvas.getContext('2d');
    }
  };

  createBulletCanvas = () => {
    const bulletNode = document.getElementById('bullets');
    const canvas = document.createElement('canvas');
    canvas.id = 'bullet-ctx';
    canvas.className = 'canvas';
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    if (bulletNode) {
      bulletNode.appendChild(canvas);
      this.bulletContext = canvas.getContext('2d');
    }
  };

  pewpew = () => {
    if (this.player.weaponType === 'spread') {
      this.sfx.playSfx('spreadshot');
    } else {
      this.sfx.playSfx('blastershot');
    }
    this.bulletFactory?.generatePlayerBullets();
  };

  startGame = () => {
    this.sfx.playSfx('selectStart');
    setTimeout(() => {
      this.setCurrentState(GAME_PLAYING);
      this.start();
      this.music.playMusic(this.musicChoice);
      this.setLives();
      this.hideMenu();
    }, 700)
    setTimeout(() => {
      this.player.toggleAfterBurner();
    }, 2800);
    setTimeout(() => {
      this.lockControls = false;
      this.player.toggleAfterBurner();
    }, 7000);
    setTimeout(() => {
      this.music.playMusic('boss')
    }, 90000)
  };

  start() {
    this.createObjects();
    this.runGameLoop();
    this.carrier.animateLaunchSequence();
  }

  setLives() {
    const lifeNode = document.getElementById('player-lives');
    [newImage(playerLife), newImage(playerLife), newImage(playerLife)].forEach(
      (l) => {
        l.className = 'player-ship';
        if (lifeNode) lifeNode.appendChild(l);
      }
    );
  }

  runGameLoop() {
    switch (this.getState()) {
      case INITIAL:
        break;
      case GAME_PLAYING:
        this.drawGamePlayingScreen();
        break;
      case GAME_OVER:
        this.ceaseFire();
        this.drawGameOverScreen();
        break;
    }
    window.requestAnimationFrame(() => {
      const now = performance.now();
      while (this.frames.length > 0 && this.frames[0] <= now - 1000) {
        this.frames.shift();
      }
      this.frames.push(now);
      this.fps = this.frames.length;
      this.runGameLoop();
    });
  }

  displayFPS() {
    setInterval(() => {
      const node = document.getElementById('fps');
      if (node) node.textContent = String(this.fps);
    }, 500);
  }

  createObjects() {
    this.cloudFactory = EnvironmentFactory({
      game: this,
      drawInterval: 8000,
      type: 'cloud',
    });
    // this.groundFactory = EnvironmentFactory({
    //   game: this,
    //   drawInterval: 3000,
    //   type: 'water',
    // });
    this.carrier = Carrier(this);
    this.bulletFactory = BulletFactory(this);
    this.enemyFactory = EnemyFactory(this, stage_1);
    this.explosionFactory = ExplosionFactory(this);
    this.itemFactory = ItemFactory(this);
  }

  // ============================ //
  // ======== GAME MENU ========= //
  // ============================ //

  showMenu() {
    this.music.playMusic('menu');

    // Menu Pane
    const menuPane = document.createElement('div');
    menuPane.className = 'menu';
    menuPane.id = 'menu';
    const image = new Image();
    image.className = 'menu__image';
    image.src = artwork;

    // Start Game Button
    const button = document.createElement('button');
    button.className = 'start-button';
    button.onclick = this.startGame;
    button.textContent = 'Press Start';

    // Show Options Menu Button
    const options = document.createElement('button');
    options.className = 'options-button';
    options.onclick = () => {
      console.log('show options');
    };
    options.textContent = 'Options';

    const bulletDiv = document.getElementById('bullets');
    if (bulletDiv) bulletDiv.appendChild(menuPane);

    menuPane.appendChild(image);
    menuPane.appendChild(button);
    menuPane.appendChild(options);
  }

  showOptionsMenu() {
    // TODO implement me!
  }

  hideMenu() {
    const menu = document.getElementById('menu');
    if (menu) menu.style.display = 'none';
  }

  // ============================ //
  // ======== GAME PLAY ========= //
  // ============================ //

  // TODO: update to have factories do their own drawing so they can remove dead objects
  drawGamePlayingScreen() {
    // clear canvi
    this.context.clearRect(0, 0, WIDTH, HEIGHT);
    this.bulletContext.clearRect(0, 0, WIDTH, HEIGHT);

    this.checkCollisions();
    this.checkItemCollection();

    // draw first
    [
      this.groundFactory?.state ?? [],
      this.cloudFactory?.state ?? [],
      [this.carrier],
      this.explosionFactory?.state ?? [],
      this.itemFactory?.state ?? [],
    ].forEach(this.drawCollection);

    // draw second
    [this.enemyFactory?.state ?? [], this.bulletFactory?.state ?? []].forEach(
      this.drawCollection
    );

    // draw last
    this.player.update();
  }

  // ============================ //
  // ======== GAME OVER ========= //
  // ============================ //

  drawGameOverScreen() {
    this.context.fillStyle = 'black';
    this.context.fillRect(0, 0, WIDTH, HEIGHT);

    this.context.fillStyle = 'white';
    this.context.font = '36 Courier';
    this.context.fillText('game over', WIDTH / 2 - 100, HEIGHT / 2);
  }

  // ============================ //
  // ======== FUNCTIONS ========= //
  // ============================ //

  drawCollection(collection: any[]) {
    collection.forEach((c) => c.draw());
  }

  updateScore(score: any) {
    this.setScore(score);
    const node = document.getElementById('player-score');
    if (node) node.textContent = String(this._score);
    const highscore = document.getElementById('player-high-score');
    if (highscore && this._score > Number(highscore.textContent)) {
      highscore.textContent = String(this._score);
    }
  }

  checkCollisions() {
    this.checkSuicides();
    const bullets = this.bulletFactory?.state ?? [];
    const enemies = this.enemyFactory?.state ?? [];

    for (let i = 0; i < bullets.length; i++) {
      for (let j = 0; j < enemies.length; j++) {
        const enemy = enemies[j];
        const bullet = bullets[i];
        if (bullet) {
          if (bullet.class != 'player') {
            continue;
          }
          // as a bullet gets wider, the center has to be moved appropriately for distance
          const checkPlayerBullets = getPointDistance(
            enemy.x,
            enemy.y,
            bullet.x + bullet.w / 2,
            bullet.y
          );
          // TODO remove bang
          if (checkPlayerBullets < enemy.r! + bullet.w / 2) {
            (enemy as any).takeDamage(bullet.power); // TODO: hmmmmm
            bullets.splice(i, 1);
            if (enemy.hp <= 0) {
              if (enemy.item) {
                this.itemFactory?.generateItem(enemy);
              }
              this.updateScore(enemy.pointValue);
              if (enemy.explosion === 'small') {
                this.sfx.playSfx('smallExplosion');
              } else {
                this.sfx.playSfx('explosion');
              }
              this.explosionFactory?.generateExplosions(enemy);
              enemies.splice(j, 1);
            }
          }
        }
      }
    }
  }

  checkSuicides() {
    const enemies = this.enemyFactory?.enemies ?? [];
    for (let i = 0; i < enemies.length; i++) {
      const enemy = enemies[i];
      const distance = getDistance(enemy, this.player);
      // TODO remove bang
      if (distance < enemy.r) {
        this.sfx.playSfx('explosion');
        this.setCurrentState(GAME_OVER);
      }
    }
  }

  checkItemCollection() {
    const items = this.itemFactory?.state ?? [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const distance = getDistance(item, this.player);
      // TODO whoopsies
      if (distance < (item as any).w) {
        this.player.changeWeapon((item as any).type);
        items.splice(i, 1);
        if (this.player.weaponStr === 6) {
          this.sfx.playSfx('fullPower');
        } else {
          this.sfx.playSfx('itemPickip');
        }
        if (this.firing) {
          this.shoot();
        }
      }
    }
  }

  reset() {}

  ceaseFire() {
    this.firing = false;
    clearInterval(this.playerFire);
  }

  shoot() {
    this.firing = true;
    clearInterval(this.playerFire);
    const delay = cond([
      [pipe(prop('weaponStr'), gt(__, 5)), () => 75],
      [pipe(prop('weaponStr'), gt(__, 3)), () => 100],
      [() => true, () => 150],
    ])(this.player);
    this.playerFire = setInterval(this.pewpew, delay);
  }

  // ============================ //
  // ===== EVENT LISTENERS ====== //
  // ============================ //

  bindEvents() {
    let game = this;

    // TODO make configurable in options and apply one keybinding set at a time
    // wasted cycles to have multiple bindings at once
    const keygroups = {
      up: ['ArrowUp', 'k', 'w'],
      down: ['ArrowDown', 'j', 's'],
      right: ['ArrowRight', 'l', 'd'],
      left: ['ArrowLeft', 'h', 'a'],
      fire: [' '],
    };

    window.addEventListener('keyup', function (e) {
      if (game.getState() === GAME_PLAYING) {
        if (keygroups.up.includes(e.key)) {
          if (game.player.vy < 0) {
            game.player.move.stopY();
          }
        } else if (keygroups.down.includes(e.key)) {
          if (game.player.vy > 0) {
            game.player.move.stopY();
          }
        } else if (keygroups.left.includes(e.key)) {
          if (game.player.vx < 0) {
            game.player.move.stopX();
          }
        } else if (keygroups.right.includes(e.key)) {
          if (game.player.vx > 0) {
            game.player.move.stopX();
          }
        } else if (keygroups.fire.includes(e.key)) {
          game.ceaseFire();
        }
      }
    });

    window.addEventListener('keydown', function (e) {
      if (game.getState() === GAME_PLAYING) {
        if (keygroups.up.includes(e.key)) {
          game.player.move.up();
        } else if (keygroups.down.includes(e.key)) {
          game.player.move.down();
        } else if (keygroups.left.includes(e.key)) {
          game.player.move.left();
        } else if (keygroups.right.includes(e.key)) {
          game.player.move.right();
        } else if (keygroups.fire.includes(e.key)) {
          if (game.firing) return;
          game.shoot();
        } else if (e.key === 'Delete') {
          window.location.reload();
        }
      }
    });
  }
}
