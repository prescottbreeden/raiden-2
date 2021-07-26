import artwork from '../assets/images/title_image.png';
import stage_1 from '../constants/stage_1.json';
import { BulletFactory } from './bullets/BulletFactory';
import { Carrier } from './environment/Carrier';
import { CloudFactory } from './environment/CloudFactory';
import { EnemyFactory } from './enemy/EnemyFactory';
import { ExplosionFactory } from './events/ExplosionFactory';
import { HEIGHT, WIDTH } from '..';
import { ItemFactory } from './events/ItemFactory';
import { Player } from './Player';
import { __, cond, forEach, gt, pipe, prop } from 'ramda';
import { getPointDistance, getDistance } from './utilities';
import { SoundEffect } from './sounds/SoundEffect';
import { GameMusic } from './sounds/GameMusic';

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
  delete: 8,
  q: 81,
  f: 70,
  d: 68,
  s: 83,
  a: 65,
};

export class Game {
  constructor({ difficulty, music, sfx }) {
    this._currentState = INITIAL;
    this._velocity = 1;
    this._stage = 1;
    this._difficulty = difficulty;
    this._playMusic = music;
    this._playSfx = sfx;
    this._score = 0;
    this.frames = [];
    this.fps = 0;
    this.width = WIDTH;
    this.height = HEIGHT;
    this.firing = false;
    this.music = GameMusic();
    this.musicChoice = 'stage1';
    this.sfx = SoundEffect();
    // this.bulletContactSfx = null
    // this.explosionSfx = null
    this.bulletContext = null;
    this.context = null;
    this.player = Player(this);

    this.createCanvas();
    this.createBulletCanvas();
    this.displayFPS();
    // bind event listeners
    this.bindEvents();
  }
  getState = () => this._currentState;
  setCurrentState = (newState) => (this._currentState = newState);

  getVelocity = () => this._velocity;
  setVelocity = (newVelocity) => (this._velocity = newVelocity);

  getDifficulty = () => this._difficulty;

  getScore = () => this._score;
  setScore = (score) => (this._score += score);

  createCanvas = () => {
    const gameNode = document.getElementById('game');
    const canvas = document.createElement('canvas');
    canvas.id = 'ctx';
    canvas.className = 'canvas';
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    gameNode.appendChild(canvas);
    this.context = canvas.getContext('2d');
  };
  createBulletCanvas = () => {
    const bulletNode = document.getElementById('bullets');
    const canvas = document.createElement('canvas');
    canvas.id = 'bullet-ctx';
    canvas.className = 'canvas';
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    bulletNode.appendChild(canvas);
    this.bulletContext = canvas.getContext('2d');
  };

  pewpew = () => {
    if (this.player.weaponType === 'spread') {
      this.sfx.playSfx('spreadshot');
    } else {
      this.sfx.playSfx('blastershot');
    }
    this.bulletFactory.generatePlayerBullets();
  };

  startGame = () => {
    this.sfx.playSfx('selectStart');
    setTimeout(() => {
      this.hideMenu();
      this.setCurrentState(GAME_PLAYING);
      this.start();
      this.music.playMusic(this.musicChoice);
    }, 1000);
  };

  start() {
    this.createObjects();
    this.runGameLoop();
    this.carrier.animateLaunchSequence();
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
      node.textContent = this.fps;
    }, 500);
  }

  createObjects() {
    this.cloudFactory = CloudFactory(this);
    this.carrier = Carrier(this);
    this.bulletFactory = new BulletFactory(this, this.player);
    this.enemyFactory = EnemyFactory(this, stage_1);
    this.explosionFactory = ExplosionFactory(this);
    this.itemFactory = ItemFactory(this);
  }

  // ============================ //
  // ======== GAME MENU ========= //
  // ============================ //

  showMenu() {
    // this.sfx = new Audio(menuJam)
    // this.sfx.playSfx()
    const button = document.createElement('button');
    button.className = 'start-button';
    button.onclick = this.startGame;
    button.textContent = 'Start New Game';

    const menuPane = document.createElement('div');
    menuPane.className = 'menu';
    menuPane.id = 'menu';
    const image = new Image();
    image.className = 'menu__image';
    image.src = artwork;
    const bulletDiv = document.getElementById('bullets');
    bulletDiv.appendChild(menuPane);
    menuPane.appendChild(image);
    menuPane.appendChild(button);
  }

  hideMenu() {
    const menu = document.getElementById('menu');
    menu.style.display = 'none';
  }

  // ============================ //
  // ======== GAME PLAY ========= //
  // ============================ //

  drawGamePlayingScreen() {
    // clear canvi
    this.context.clearRect(0, 0, WIDTH, HEIGHT);
    this.bulletContext.clearRect(0, 0, WIDTH, HEIGHT);

    this.checkCollisions();
    this.checkItemCollection();

    // draw first
    [
      this.cloudFactory.clouds,
      [this.carrier],
      this.explosionFactory.explosions,
      this.itemFactory.items,
    ].forEach(this.drawCollection);

    // draw second
    [this.enemyFactory.enemies, this.bulletFactory.bullets].forEach(
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

  drawCollection(collection) {
    forEach(
      pipe(prop('draw'), (f) => f()),
      collection
    );
  }

  updateScore(score) {
    this.setScore(score);
    const node = document.getElementById('player-score');
    node.textContent = this._score;
  }

  checkCollisions() {
    this.checkSuicides();
    const bullets = this.bulletFactory.bullets;
    const enemies = this.enemyFactory.enemies;
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
          if (checkPlayerBullets < enemy.r + bullet.w / 2) {
            enemy.takeDamage(bullet.power);
            bullets.splice(i, 1);
            if (enemy.hp <= 0) {
              if (enemy.item) {
                this.itemFactory.generateItem(enemy);
              }
              this.updateScore(enemy.pointValue);
              if (enemy.explosion === 'small') {
                this.sfx.playSfx('smallExplosion');
              } else {
                this.sfx.playSfx('explosion');
              }
              this.explosionFactory.generateExplosions(enemy);
              enemies.splice(j, 1);
            }
          }
        }
      }
    }
  }

  checkSuicides() {
    const enemies = this.enemyFactory.enemies;
    for (let i = 0; i < enemies.length; i++) {
      const enemy = enemies[i];
      const distance = getDistance(enemy, this.player);
      if (distance < enemy.r) {
        this.sfx.playSfx('explosion');
        this.setCurrentState(GAME_OVER);
      }
    }
  }

  checkItemCollection() {
    const items = this.itemFactory.items;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const distance = getDistance(item, this.player);
      if (distance < item.w) {
        this.player.changeWeapon(item.type);
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

    window.addEventListener('keyup', function (e) {
      if (game.getState() === GAME_PLAYING) {
        switch (e.keyCode) {
          case KEY_CODE.left:
            if (game.player.vx < 0) {
              game.player.move.stopX();
            }
            break;
          case KEY_CODE.up:
            if (game.player.vy < 0) {
              game.player.move.stopY();
            }
            break;
          case KEY_CODE.right:
            if (game.player.vx > 0) {
              game.player.move.stopX();
            }
            break;
          case KEY_CODE.down:
            if (game.player.vy > 0) {
              game.player.move.stopY();
            }
            break;
          case KEY_CODE.spacebar:
            game.ceaseFire();
            break;
          case KEY_CODE.f:
            console.log('f');
            break;
          default:
            console.log(e.keyCode);
        }
      }
    });

    window.addEventListener('keydown', function (e) {
      if (game.getState() === GAME_PLAYING) {
        switch (e.keyCode) {
          case KEY_CODE.left:
            game.player.move.left();
            break;
          case KEY_CODE.up:
            game.player.move.up();
            break;
          case KEY_CODE.right:
            game.player.move.right();
            break;
          case KEY_CODE.down:
            game.player.move.down();
            break;
          case KEY_CODE.spacebar:
            if (game.firing) return;
            game.shoot();
            break;
          case KEY_CODE.delete:
            window.location.reload();
            break;
        }
      }
    });
  }
}
