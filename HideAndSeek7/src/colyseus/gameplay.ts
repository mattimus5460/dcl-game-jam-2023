//import * as ui from '@dcl/ui-scene-utils';
import {connect} from "./connection";
import {updateLeaderboard} from './leaderboard';
import {ambienceSound, countdownRestartSound, playLoop, playOnce} from './sound';
import {log} from '../back-ports/backPorts';
import {engine, Entity, GltfContainer, Transform} from '@dcl/sdk/ecs';
import {Vector3} from '@dcl/sdk/math';
import {Ghost, EnemyComponent} from "../enemies/ghost";
import {Enemy, EnergyCrystal} from "../../server/src/rooms/GameRoomState";
import {Room} from 'colyseus.js';
import {ammoBar, healthBar, increaseZombiesForRound, setCountdown, setZombiesForRound} from "../ui";
import {allBeacons, initBeacons} from "../beacons/beacon";
import {allCrystals, createCrystal, removeCrystal} from "../crystals";
import {dreamForestDark, dreamForestLight, mapComponent} from "../index";

export let connectedRoom: Room<any>;
export let activeZombies: Map<string, Ghost> = new Map<string, Ghost>();

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

        function spawnEnemy(x: number, y: number, z: number, entityId: string) {

            const z1 = new Ghost({
                position: {
                    x: x,
                    y: y,
                    z: z
                },
                rotation: {w: 0, x: 0, y: 1, z: 0},
                scale: {x: 1, y: 1, z: 1}
            }, entityId)

            activeZombies.set(entityId, z1)
            increaseZombiesForRound(1)

            return z1.entity;
        }

        function damageEnemy(entityId: string) {
            let curZombie = activeZombies.get(entityId)

            if (curZombie)
                curZombie.damage(10);
        }

        function destroyEnemy(entityId: string) {
            let curZombie = activeZombies.get(entityId)

            if (curZombie)
                curZombie.die();
        }

        function createEnergyCrystal(position: Vector3, id: number) {
            createCrystal(position, id)
        }

        function resetGame() {
            allCrystals.forEach((crystal) => engine.removeEntity(crystal));

            for (const [entity, zombieSettings] of engine.getEntitiesWith(EnemyComponent)) {
                engine.removeEntity(entity);
            }



            ammoBar.set(1)
            healthBar.set(1)
        }
        //
        // -- Colyseus / Schema callbacks --
        // https://docs.colyseus.io/state/schema/
        //
        let lastEnemy: Entity;
        room.state.enemies.onAdd = (enemy: Enemy, i: number) => {
            log("room.state.enemies.onAdd", "ENTRY")
            lastEnemy = spawnEnemy(enemy.position.x, enemy.position.y, enemy.position.z, enemy.entityId);
        };

        room.state.enemies.onRemove = (enemy: Enemy, i: number) => {
            log("room.state.enemies.onRemove", "ENTRY")
        };

        room.state.players.onAdd = (player: any, sessionId: string) => {
        }
        room.state.players.onRemove = () => {
        }

        room.state.crystals.onAdd = (crystal: EnergyCrystal) => {
            createEnergyCrystal(
                Vector3.create(crystal.position.x, crystal.position.y, crystal.position.z), crystal.index)
        }


        // Beacons
        room.state.beaconHealths.onAdd = (energyLevel: number, i: number) => {
            log("room.beaconHealths.onAdd", "ENTRY", energyLevel)
            allBeacons[i].setEnergy(energyLevel)
        }

        room.state.beaconHealths.onChange = (changeValue: number, i: number) => {
            log("room.beaconHealths.onChange", "ENTRY", changeValue, i)
            allBeacons[i].setEnergy(changeValue)
        }

        // Enemies
        room.onMessage("enemy-damaged", (entityId: string) => {
            log("room.onMessage.enemy-damaged", "ENTRY", entityId)
            damageEnemy(entityId)

        });
        room.onMessage("enemy-destroyed", (entityId: string) => {
            log("room.onMessage.enemy-destroyed", "ENTRY", entityId)
            destroyEnemy(entityId)
            ammoBar.increase(.05)
        });



        // Energy
        room.onMessage("add-energy", (beaconId: number) => {
            log("room.onMessage.add-energy", "ENTRY", beaconId)
            if(!allBeacons[beaconId]) return;
            allBeacons[beaconId].addEnergy(1)
        });
        room.onMessage("remove-energy", (beaconId: number) => {
            log("room.onMessage.remove-energy", "ENTRY", beaconId)
            if(!allBeacons[beaconId]) return;
            allBeacons[beaconId].removeEnergy(1)
        });
        room.onMessage("collect-energy-crystal", (crystalId: number) => {
            log("room.onMessage.collect-energy-crystal", "ENTRY", crystalId)
            removeCrystal(crystalId)
        });
        room.onMessage("create-energy-crystal", (crystal: EnergyCrystal) => {
            createEnergyCrystal(
                Vector3.create(crystal.position.x, crystal.position.y, crystal.position.z), crystal.index)
        })


        // Game
        room.onMessage("initialize-game", (data: any) => {
            log("room.onMessage.initialize-game", "ENTRY", data)


        });

        room.state.listen("countdown", (num: number) => {
            log("countdown", num)
            //countdown.set(num);
        })
        room.state.listen("countdown", (num: number) => {
            log("countdown", num)
            setCountdown(num)
        })
        room.onMessage("start", () => {
            log("room.onMessage.start", "ENTRY")

            setZombiesForRound(0)
            Transform.getMutable(dreamForestDark).scale = Vector3.create(.99, .99, .99)
            Transform.getMutable(dreamForestLight).scale =  Vector3.Zero()

            initBeacons()
            //countdown.show();
        });
        room.onMessage("game-win", () => {
            log("room.onMessage.game-win", "ENTRY")

            Transform.getMutable(dreamForestDark).scale = Vector3.Zero()
            Transform.getMutable(dreamForestLight).scale = Vector3.create(.99, .99, .99)

            resetGame()

        });
        room.onMessage("finished", () => {
            try {
                //ui.displayAnnouncement(`${highestPlayer.name} wins!`, 8, Color4.White(), 60);

            } catch (e) {
                console.log("room.onMessage.finished", "caught error", e)
                console.error(e)
            }
            // countdown.hide();
        });
        room.onMessage("restart", () => {
            playOnce(countdownRestartSound);
            resetGame()
            setZombiesForRound(0)
            initBeacons()

            Transform.getMutable(dreamForestDark).scale = Vector3.create(.99, .99, .99)
            Transform.getMutable(dreamForestLight).scale =  Vector3.Zero()
        });

        room.onLeave((code) => {
            log("onLeave, code =>", code);
        });

    }).catch((err) => {
        //error(err);
        console.error(err)

    });

}