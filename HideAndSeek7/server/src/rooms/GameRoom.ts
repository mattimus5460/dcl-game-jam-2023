import {Room, Client} from "colyseus";
import {Enemy, EnemyPosition, GameRoomState, Player} from "./GameRoomState";

const ROUND_DURATION = 60 * 3;
// const ROUND_DURATION = 30;

// const MAX_BLOCK_HEIGHT = 5;
const MAX_BLOCK_HEIGHT = 19;

const SPAWN_FREQUENCY = 5000;

const MAX_ENEMIES = 2;

export class GameRoom extends Room<GameRoomState> {
    private enemiesCount: number = 0;
    private isFinished: boolean = false;

    onCreate(options: any) {
        this.setState(new GameRoomState());

        // set-up the game!
        this.setUp();

        this.onMessage("spawn-enemy", (client: Client, enemy: Enemy) => {


            if (this.state.enemies.length < MAX_ENEMIES) {
                //
                // create a new block at the requested position, if it doesn't yet exist.
                //
                this.createEnemy(enemy.entityId, enemy.position);
            }
        });


        this.onMessage("damage-enemy", (client: Client, entityId: string) => {
            // find enemy by entity id

            console.log("damage-enemy", entityId);

            const enemy = this.state.enemies.find(enemy => enemy.entityId === entityId);

            if(!enemy) {
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


        this.onMessage("fall", (client: Client, atPosition: any) => {
            this.broadcast("fall", atPosition);
        });
    }

    setUp() {

        if (this.state.enemies.length > 0) {
            // clear previous blocks
            this.state.enemies.clear();
        }

        // create first block
        // this.state.enemies.push(
        //   new EnemyPosition().assign({
        //     x: 8,
        //     y: 1,
        //     z: 8,
        //   })
        // );

        this.enemiesCount = 0;
        this.isFinished = false;

        // reset all player's ranking position
        this.state.players.forEach((player) => {
            player.points = 0;
        });

        this.broadcast("start");

        // setup round countdown
        this.state.countdown = ROUND_DURATION;

        // make sure we clear previous interval
        this.clock.clear();

        setInterval(() => {
            if (this.state.enemies.length < MAX_ENEMIES) {
                const x = Math.floor(Math.random() * 16);
                const z = Math.floor(Math.random() * 16);

                this.createEnemy(
                    this.enemiesCount.toString(),
                    new EnemyPosition().assign({
                        x,
                        y: 0,
                        z,
                    }));
            }
        }, SPAWN_FREQUENCY)

        this.clock.setInterval(() => {
            if (this.state.countdown > 0) {
                if (!this.isFinished) {
                    this.state.countdown--;
                }

            } else {
                this.broadcast("restart");

                // countdown reached zero! restart the game!
                this.setUp();
            }
        }, 1000);
    }

    createEnemy(entityId: string, atPosition: EnemyPosition) {
        const enemy = new Enemy();
        enemy.entityId = entityId;
        enemy.position = atPosition;
        this.state.enemies.push(enemy);
        this.enemiesCount++;
    }


    onJoin(client: Client, options: any) {
        const newPlayer = new Player().assign({
            name: options.userData.displayName || "Anonymous",
            ranking: 0,
            points: 0,
        });
        this.state.players.set(client.sessionId, newPlayer);

        console.log(this.roomId, this.roomName, newPlayer.name, "joined! => ", options.userData);
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
