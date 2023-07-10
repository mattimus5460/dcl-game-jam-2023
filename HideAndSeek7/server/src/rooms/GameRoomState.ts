import {Schema, Context, ArraySchema, MapSchema, type} from "@colyseus/schema";

export class Player extends Schema {
    @type("string") name: string;
    @type("number") ranking: number;
    @type("number") points: number;
}

export class EnemyPosition extends Schema {
    @type("number") x: number;
    @type("number") y: number;
    @type("number") z: number;
}


export class Enemy extends Schema {
    @type(EnemyPosition) position: EnemyPosition;
    @type("number") health: number = 100;
    @type("string") entityId: string;
}


export class GameRoomState extends Schema {
    @type("number") countdown: number;
    @type([Enemy]) enemies = new ArraySchema<Enemy>();
    @type({map: Player}) players = new MapSchema<Player>();
}
