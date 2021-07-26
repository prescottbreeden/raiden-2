# Raiden - 2

Webpack refactor of previous clone for arcade game "Raiden".

## To Play

- Clone this repository
- `yarn && yarn start`

Because this game is still in dev, players are immune from bullets for testing purposes.

## Roadmap

- [ ] Convert to TypeScript
- [x] Fix spread shot
- [x] Toml parsing for EnemyFactory data
- [x] Script to run all toml directories (ignoring src)
- [x] Make EnemyFactory JSON-configurable
- [x] Carrier launch with launcher animation
- [x] Abstraction for enemy position locations
- [x] Spiral attack
- [x] Raiden ship
- [x] Exhaust animation
- [ ] Render Lives Images with JS
- [ ] Add High Score
- [ ] Circular item floating
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
- [ ] Window size instruction
- [ ] Game Menu / Main Menu options
- [ ] Hide/Show Side Bar
- [ ] Mobile controls? (probably not...)
- [ ] Add Jest / tests
- [ ] Code cleanup / utilities overhaul

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
