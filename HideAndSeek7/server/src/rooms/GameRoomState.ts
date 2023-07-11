import {Schema, Context, ArraySchema, MapSchema, type} from "@colyseus/schema";

export class Player extends Schema {
    @type("string") name: string;
    @type("number") ranking: number;
    @type("number") points: number;
}

export class Position extends Schema {
    @type("number") x: number;
    @type("number") y: number;
    @type("number") z: number;
}


export class Enemy extends Schema {
    @type(Position) position: Position;
    @type("number") health: number = 100;
    @type("string") entityId: string;
}

export class EnergyCrystal extends Schema {
    @type(Position) position: Position;
    @type("number") index: number;
    @type("boolean") isCollected: boolean = false;
}

export class Beacon extends Schema {
    @type("number") energyLevel: number;
}

export class GameRoomState extends Schema {
    @type("number") countdown: number;
    @type([Enemy]) enemies = new ArraySchema<Enemy>();
    @type({map: Player}) players = new MapSchema<Player>();
    @type([EnergyCrystal]) crystals = new ArraySchema<EnergyCrystal>();
    @type(["number"]) beaconHealths = new ArraySchema<number>();
}
