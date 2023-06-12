import * as ui from "@dcl/ui-scene-utils";
import { getUserData } from "@decentraland/Identity";
import { setTimeout } from "@dcl/ecs-scene-utils";
import { LEVEL_TYPES } from "src/LevelManager/types";
import { PlayerInventory } from "./playerInventory";
import { Character } from "./character";
const LAMBDA_URL = "https://lqcuxsaurh.execute-api.us-east-1.amazonaws.com"; //new

export class Player extends Character {
  static instance: Player;
  public lastLogin: number;
  public username: string;
  public inventory: PlayerInventory;

  static getInstance(): Player {
    if (!this.instance) {
      this.instance = new this(1, 0, 1, 100);
    }
    return this.instance;
  }

  constructor(attack: number, xp: number, level: number, health: number = 1) {
    super(attack, xp, level, health);
    this.inventory = new PlayerInventory();
  }
}

interface LevelItem {
  type: LEVEL_TYPES;
  level: number;
  xp: number;
}

interface onUpdatePayload {
  type: LEVEL_TYPES;
  level: number;
  xp: number;
  total: number;
  levelChange?: boolean;
}

class LevelManager {
  levels: Record<LEVEL_TYPES | string, LevelItem>;

  public onUpdate?: (payload: onUpdatePayload) => void;

  constructor() {
    this.levels = {};
  }
}
export const player = Player.getInstance();
