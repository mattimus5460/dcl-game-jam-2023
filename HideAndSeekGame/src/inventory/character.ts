export class Character extends Entity {
  health: number;
  attack: number;
  xp: number;
  level: number;
  baseDefense: number;
  maxHealth: number;
  minLuck: number = 0;

  constructor(
    attack: number,
    xp: number,
    level: number,
    health: number = 1,
    baseDefense: number = 0.01
  ) {
    super();
    this.attack = attack;
    this.health = health;
    this.xp = xp;
    this.level = level;
    this.baseDefense = baseDefense;
    this.maxHealth = health;
  }
}
