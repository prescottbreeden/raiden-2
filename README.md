# Raiden - 2

Webpack refactor of previous clone for arcade game "Raiden".

## To Play

- Clone this repository
- `yarn && yarn start`

Because this game is still in dev, players are immune from bullets for testing purposes.

## Roadmap

- [x] Fix spread shot
- [x] Toml parsing for EnemyFactory data
- [x] Script to run all toml directories (ignoring src)
- [x] Make EnemyFactory JSON-configurable
- [x] Carrier launch with launcher animation
- [x] Abstraction for enemy position locations
- [x] Spiral attack
- [x] Raiden ship
- [x] Exhaust animation
- [ ] Sprinkler attack
- [ ] Powerup random chance item
- [x] Abstraction for weapontypes
- [x] Abstraction for enemey movement types
- [ ] Abstraction for simultaneous enemies
- [ ] Bullet collision for player
- [ ] Weapon release after player death
- [ ] Abstraction for stages
- [ ] Foreground/background w/ enemy shadows
- [ ] Player bombs
- [ ] Player missiles
- [ ] Player lives
- [ ] Player continue
- [ ] High score saving
- [ ] Dynamic web portal (small: 67%, large: 100%)
- [ ] Window size detection
- [ ] Game Menu / Main Menu options
- [ ] Mobile controls? (probably not...)
- [ ] Add Jest
- [ ] Code cleanup / utilities overhaul

## Bug list

- [ ] Memory leak once 800 spear mobs attack with sprinkler mobs
- [ ] Game over doesn't stop player weapon firing

## Point logic

figure out multiplier for difficulty setting?

- I'm scared = \* 1
- Come get some = \* 2
- I am death incarnate = \* 5

### points per enemy type

- easy enemy
- med enemy
- hard enemy
- boss

### points per weapon str

#### Primary weapons

- lv1
- lv2
- lv3
- lv4
- max?

#### Secondary weapons

- lv1
- lv2
- max?

#### Bombs

- same as max primary?

### Ending level bonus

- lives remaining
- bombs remaining
