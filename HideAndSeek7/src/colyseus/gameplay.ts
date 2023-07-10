//import * as ui from '@dcl/ui-scene-utils';
import {connect} from "./connection";
import {updateLeaderboard} from './leaderboard';
import {
    ambienceSound,
    countdownRestartSound,
    fallSound,
    finishSound1,
    finishSound2,
    newLeaderSound,
    playLoop,
    playOnce,
    playOnceRandom
} from './sound';
import {log} from '../back-ports/backPorts';
import {engine, Entity, GltfContainer, Transform} from '@dcl/sdk/ecs';
import {Quaternion, Vector3} from '@dcl/sdk/math';
import {Zombie} from "../zombies/zombie";
import {Enemy} from "../../server/src/rooms/GameRoomState";
import {Room} from 'colyseus.js';

const floor = engine.addEntity()//new Entity('entity')
GltfContainer.create(floor, {src: "models/FloorBaseGrass_02/FloorBaseGrass_02.glb"})
Transform.create(floor, {
    position: Vector3.create(8, 0, 8),
    rotation: Quaternion.create(0, 0, 0, 1),
    scale: Vector3.create(1, 1, 1),
})


export let connectedRoom: Room<any>;
export let activeZombies: Map<string, Zombie> = new Map<string, Zombie>();

export function initGamePlay() {
    // play ambient music
    playLoop(ambienceSound, 0.4);

    updateLeaderboard(["- Nobody -"]);

//
// Connect to Colyseus server! 
// Set up the scene after connection has been established.
//

    connect("my_room").then((room) => {
        log("Connected!");
        connectedRoom = room;
        // create UI countdown
        //const countdown = new ui.UICounter(0, -30, 30, Color4.White(), 50, false);

        let lastBlockTouched: number = 0;

        function onTouchBlock(y: number) {
            // send block index and player position to Colyseus server
            lastBlockTouched = y;
            room.send("touch-block", y);
        }

        function refreshLeaderboard() {
            try {
                // get all players names sorted by their ranking
                const allPlayers = Array.from(room.state.players.values()).sort((a: any, b: any) => {
                    return b.ranking - a.ranking;
                }).map((player: any, i: number) => `${i + 1}. ${player.name} - ${player.ranking}`);

                updateLeaderboard(allPlayers);
            } catch (e) {
                console.error("refreshLeaderboard", "caught error", e)
            }

        }

        // The "floor" object was originally named "entity" from the Decentraland Builder.
        // I exported it from the "./scene" file to be able to attach custom behaviour.
        // utils.triggers.enableDebugDraw(true)
        //
        // addRepeatTrigger(
        //     Vector3.create(16, 2, 16), Vector3.create(0, 0, 0),
        //     (entity:Entity) => {
        //         log('player.enter.floorTriggerShape',entity)
        //         if (lastBlockTouched > 2 && lastBlockTouched < 20) {
        //             room.send("fall", Transform.get(engine.PlayerEntity).position);
        //         }
        //     },
        //     floor,
        //     false,
        //     () => {
        //         log('player.exit.floorTriggerShape')
        //     }
        // )

        /// --- Spawner function ---
        function spawnEnemy(x: number, y: number, z: number, entityId: string) {

            const z1 = new Zombie({
                position: {
                    x: x,
                    y: y,
                    z: z
                },
                rotation: {w: 0, x: 0, y: 0, z: 0},
                scale: {x: 1, y: 1, z: 1}
            }, entityId)

            activeZombies.set(entityId, z1)

            return z1.entity;
        }


        function damageEnemy(entityId: string) {
            let curZombie = activeZombies.get(entityId)

            console.log(curZombie)

            if (curZombie)
                curZombie.damage(10);

        }

        function destroyEnemy(entityId: string) {
            let curZombie = activeZombies.get(entityId)

            console.log(curZombie)

            if (curZombie)
                curZombie.die();

        }


        //
        // -- Colyseus / Schema callbacks --
        // https://docs.colyseus.io/state/schema/
        //
        let allBoxes: Entity[] = [];
        let lastEnemy: Entity;
        room.state.enemies.onAdd = (enemy: Enemy, i: number) => {
            log("room.state.enemies.onAdd", "ENTRY")
            lastEnemy = spawnEnemy(enemy.position.x, enemy.position.y, enemy.position.z, enemy.entityId);
            allBoxes.push(lastEnemy);
        };

        room.state.enemies.onRemove = (enemy: Enemy, i: number) => {
            log("room.state.enemies.onRemove", "ENTRY")

        };

        let highestRanking = 0;
        let highestPlayer: any = undefined;
        room.state.players.onAdd = (player: any, sessionId: string) => {
            player.listen("ranking", (newRanking: number) => {
                if (newRanking > highestRanking) {
                    if (player !== highestPlayer) {
                        highestPlayer = player;

                        playOnce(newLeaderSound);
                    }
                    highestRanking = newRanking;
                }

                refreshLeaderboard();
            });
        }

        // when a player leaves, remove it from the leaderboard.
        room.state.players.onRemove = () => {
            refreshLeaderboard();
        }

        room.state.listen("countdown", (num: number) => {
            log("countdown", num)
            //countdown.set(num);
        })

        room.state.listen("countdown", (num: number) => {
            log("countdown", num)
            //countdown.set(num);
        })

        room.onMessage("start", () => {
            log("room.onMessage.start", "ENTRY")
            // remove all previous boxes
            allBoxes.forEach((box) => engine.removeEntity(box));
            allBoxes = [];

            lastBlockTouched = 0;
            highestRanking = 0;
            highestPlayer = undefined;

            //countdown.show();
        });

        room.onMessage("enemy-damaged", (entityId: string) => {
            log("room.onMessage.enemy-damaged", "ENTRY", entityId)
            damageEnemy(entityId)

        });

        room.onMessage("enemy-destroyed", (entityId: string) => {
            log("room.onMessage.enemy-destroyed", "ENTRY", entityId)
            destroyEnemy(entityId)

        });


        room.onMessage("fall", (atPosition) => {
            playOnce(fallSound, 1, Vector3.create(atPosition.x, atPosition.y, atPosition.z));
        })

        room.onMessage("finished", () => {
            try {
                //ui.displayAnnouncement(`${highestPlayer.name} wins!`, 8, Color4.White(), 60);
                log("finished", `${highestPlayer?.name} wins!`)
                playOnceRandom([finishSound1, finishSound2]);
            } catch (e) {
                console.log("room.onMessage.finished", "caught error", e)
                console.error(e)
            }

            // countdown.hide();
        });

        room.onMessage("restart", () => {
            playOnce(countdownRestartSound);
        });

        room.onLeave((code) => {
            log("onLeave, code =>", code);
        });

    }).catch((err) => {
        //error(err);
        console.error(err)

    });

}