import {Client, Room} from "colyseus";
import {Beacon, Enemy, EnergyCrystal, GameRoomState, Player, Position} from "./GameRoomState";
import {ArraySchema} from "@colyseus/schema";

const ROUND_DURATION = 60 * 3;
// const ROUND_DURATION = 30;

// const MAX_BLOCK_HEIGHT = 5;
const MAX_BLOCK_HEIGHT = 19;

const SPAWN_FREQUENCY = 15000;

const MAX_ENEMIES = 10;

const SPAWN_POSITIONS = [
    {x: 24, y: .2, z: 4},
    {x: 45, y: .5, z: 10},
    {x: 40, y: .85, z: 24},
    {x: 38, y: .5, z: 5},
];


const ENERGY_POSITIONS = [
    {x: 39, y: 1, z: 41},
    {x: 38, y: 1, z: 39},
    {x: 35, y: 1, z: 38},
    {x: 36, y: 1, z: 40},
    {x: 34, y: 1, z: 41},
]

export class GameRoom extends Room<GameRoomState> {
    private enemiesCount: number = 0;
    private isFinished: boolean = false;
    private spawnInterval: NodeJS.Timeout;

    onCreate(options: any) {
        this.setState(new GameRoomState());

        // set-up the game!
        this.setUp();

        this.onMessage("spawn-enemy", (client: Client, enemy: Enemy) => {

            if (this.state.enemies.length < MAX_ENEMIES) {
                this.createEnemy(enemy.entityId, enemy.position);
            }
        });


        this.onMessage("damage-enemy", (client: Client, entityId: string) => {
            //console.log("damage-enemy", entityId);

            // find enemy by entity id
            const enemy = this.state.enemies.find(enemy => enemy.entityId === entityId);

            if (!enemy) {
                console.log("enemy not found", entityId);
                return;
            }

            enemy.health -= 10;

            if (enemy.health <= 0) {
                //remove enemy from enemies
                this.state.enemies.splice(this.state.enemies.indexOf(enemy), 1);

                this.broadcast("enemy-destroyed", enemy.entityId);
            } else {
                this.broadcast("enemy-damaged", enemy.entityId);
            }

        });

        this.onMessage("add-energy", (client: Client, beaconId: number) => {
            //this.broadcast("add-energy", beaconId);
            this.state.beaconHealths[beaconId] += 10;

            if (!this.isFinished && this.state.beaconHealths.filter(health => health < 100).length === 0) {
                this.broadcast("game-win");
                this.isFinished = true
                this.state.countdown = 30;
            }
        });

        this.onMessage("remove-energy", (client: Client, beaconId: number) => {
            //this.broadcast("remove-energy", beaconId);
            this.state.beaconHealths[beaconId] -= 1;
        });

        this.onMessage("collect-energy-crystal", (client: Client, crystalId: number) => {
            console.log("collect-energy", this.state.crystals.length, crystalId);
            this.state.crystals[crystalId].isCollected = true
            this.broadcast("collect-energy-crystal", crystalId);


            // check if all crystals have been collected
            if (this.state.crystals.filter(crystal => !crystal.isCollected).length === 0) {

                setTimeout(() => {
                    this.spawnEnergyCrystals()
                }, 5000);
            }
        });

        this.onMessage("fall", (client: Client, atPosition: any) => {
            this.broadcast("fall", atPosition);
        });
    }

    spawnEnergyCrystals() {
        ENERGY_POSITIONS.forEach((position, i) => {
            this.createEnergyCrystal(new Position().assign({
                x: position.x,
                y: position.y,
                z: position.z,
            }), i);
        })
    }

    resetState() {
        if (this.state.enemies.length > 0) {
            // clear previous enemies
            this.state.enemies.clear();
            this.state.crystals.clear();
        }

        clearInterval(this.spawnInterval)

        this.enemiesCount = 0;
    }

    setUp() {

        this.resetState()

        this.isFinished = false;

        // reset all player's ranking position
        this.state.players.forEach((player) => {
            player.points = 0;
        });

        // setup round countdown
        this.state.countdown = ROUND_DURATION;

        // make sure we clear previous interval
        this.clock.clear();

        this.spawnInterval =
            setInterval(() => {
                if(this.isFinished) return

                SPAWN_POSITIONS.forEach((position) => {

                    if (this.state.enemies.length < MAX_ENEMIES) {
                        this.createEnemy(
                            this.enemiesCount.toString(),
                            new Position().assign({
                                x: position.x,
                                y: position.y,
                                z: position.z,
                            }));
                    }
                })
            }, SPAWN_FREQUENCY)

        this.spawnEnergyCrystals()

        this.state.beaconHealths = new ArraySchema<number>()
        this.state.beaconHealths.push(0)
        this.state.beaconHealths.push(0)
        this.state.beaconHealths.push(0)
        this.state.beaconHealths.push(100)

        this.broadcast("start");

        this.clock.setInterval(() => {
            if (this.state.countdown > 0) {
                this.state.countdown--;

                // if (!this.isFinished) {
                //     this.state.countdown--;
                // }
            } else {
                this.broadcast("restart");

                // countdown reached zero! restart the game!
                this.setUp();
            }
        }, 1000);
    }

    createEnemy(entityId: string, atPosition: Position) {
        const enemy = new Enemy();
        enemy.entityId = entityId;
        enemy.position = atPosition;
        this.state.enemies.push(enemy);
        this.enemiesCount++;
    }

    createEnergyCrystal(atPosition: Position, index: number = 0) {
        const energyCrystal = new EnergyCrystal();
        energyCrystal.position = atPosition;
        energyCrystal.index = index;
        this.state.crystals[index] = energyCrystal

        this.broadcast("create-energy-crystal", energyCrystal)
    }


    onJoin(client: Client, options: any) {
        const newPlayer = new Player().assign({
            name: options.userData.displayName || "Anonymous",
            ranking: 0,
            points: 0,
        });
        this.state.players.set(client.sessionId, newPlayer);

        console.log(this.roomId, this.roomName, newPlayer.name, "joined! => ", options.userData);

        this.broadcast("initialize-game", {
            userId: options.userData.data.userId
        })
    }

    onLeave(client: Client, consented: boolean) {
        const player = this.state.players.get(client.sessionId);
        console.log(player.name, "left!");

        this.state.players.delete(client.sessionId);
    }

    onDispose() {
        console.log(this.roomId, this.roomName, "Disposing room...");
    }

}
