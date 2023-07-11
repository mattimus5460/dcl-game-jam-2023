import {Schema, Context, ArraySchema, MapSchema, type} from "@colyseus/schema";

export class Player extends Schema {
    @type("string") name: string;
    @type("number") ranking: number;
    @type("number") points: number;

    constructor(name: string, ranking: number, points: number) {
        super();
        this.name = name;
        this.ranking = ranking;
        this.points = points;
    }
}

export class Position extends Schema {
    @type("number") x: number;
    @type("number") y: number;
    @type("number") z: number;

    constructor(x: number, y: number, z: number) {
        super();
        this.x = x;
        this.y = y;
        this.z = z;
    }
}


export class Enemy extends Schema {
    @type(Position) position: Position;
    @type("number") health: number = 100;
    @type("string") entityId: string;

    constructor(ps: Position, id: string) {
        super();
        this.position = ps;
        this.entityId = id;
    }
}

export class EnergyCrystal extends Schema {
    @type(Position) position: Position;
    @type("number") index: number;
    @type("boolean") isCollected: boolean = false;

    constructor(ps: Position, index: number) {
        super();
        this.position = ps;
        this.index = index;
    }
}

export class Beacon extends Schema {
    @type("number") energyLevel: number;
    constructor(energyLevel: number) {
        super();
        this.energyLevel = energyLevel;
    }
}

export class GameRoomState extends Schema {
    @type("number") countdown: number = 180;
    @type([Enemy]) enemies = new ArraySchema<Enemy>();
    @type({map: Player}) players = new MapSchema<Player>();
    @type([EnergyCrystal]) crystals = new ArraySchema<EnergyCrystal>();
    @type(["number"]) beaconHealths = new ArraySchema<number>();
}
