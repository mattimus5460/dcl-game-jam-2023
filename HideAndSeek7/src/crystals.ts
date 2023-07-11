import {Quaternion, Vector3} from "@dcl/sdk/math";
import {Animator, engine, Entity, GltfContainer, InputAction, pointerEventsSystem, Transform} from "@dcl/sdk/ecs";
import {ammoBar} from "./ui";
import {connectedRoom} from "./colyseus/gameplay";

export let allCrystals:Entity[] = []

export const createCrystal = (position: Vector3, serverId:number) => {
    const crystal = engine.addEntity()
    GltfContainer.create(crystal, {src: 'models/Health_Potion.glb'})
    Transform.create(crystal, {
        position,
        scale: Vector3.create(2, 2, 2),
        rotation: Quaternion.fromEulerDegrees(0, 0,0)
    })

    pointerEventsSystem.onPointerDown(
        {
            entity: crystal,
            opts: {button: InputAction.IA_POINTER, hoverText: 'Collect Energy'},
        },
        function (cmd) {

            if(ammoBar.read() >= 1) return

            connectedRoom.send("collect-energy-crystal", serverId)
            ammoBar.increase(.1)
        }
    )
    if(allCrystals[serverId]) {
        engine.removeEntity(allCrystals[serverId])
    }
    allCrystals[serverId] = crystal
}

export const removeCrystal = (serverId:number) => {
    console.log('removing crystal', serverId, allCrystals[serverId])
    if(allCrystals[serverId]) {
        engine.removeEntity(allCrystals[serverId])
    }
}
