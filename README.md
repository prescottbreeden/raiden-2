# Raiden - 2

Webpack refactor of previous clone for arcade game "Raiden".

## To Play

- Clone this repository
- `yarn && yarn start`

Because this game is still in dev, players are immune from bullets for testing purposes.

## Roadmap

- [ ] Add Jest
- [ ] Code cleanup / utilities overhaul
- [x] Fix spread shot
- [x] Create toml parsing for EnemyFactory data
- [x] Create script to run all toml directories (ignoring src)
- [x] Make EnemyFactory JSON-configurable
- [x] Add abstraction for enemy position locations
- [x] Add spiral attack
- [ ] Add sprinkler attack
- [ ] Add powerup random chance item
- [ ] Add abstraction for weapontypes
- [ ] Add abstraction for enemey movement types
- [ ] Add abstraction for simultaneous enemies
- [ ] Add bullet collision for player
- [ ] Add weapon release after player death
- [ ] Add abstraction for stages
- [ ] Add foreground/background w/ enemy shadows
- [ ] Add player bombs
- [ ] Add player missiles
- [ ] Add player lives
- [ ] Add player continue
- [ ] Add high score saving
- [ ] Create dynamic web portal (small: 67%, large: 100%)
- [ ] Create window size detection
- [ ] Create Game Menu / Main Menu options
- [ ] Mobile controls? (probably not...)

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
