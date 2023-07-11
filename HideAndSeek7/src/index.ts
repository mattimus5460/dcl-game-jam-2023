import {AvatarShape, ColliderLayer, engine, Entity, GltfContainer, Schemas, Transform} from '@dcl/sdk/ecs'
import {Quaternion, Vector3} from '@dcl/sdk/math'

import {setupUi} from './ui'
import {followSystem} from "./systems/followSystem";
import {ShootingSystem} from "./systems/shootingSystem";
import {initGamePlay} from "./colyseus/gameplay";
import './polyfill/delcares'
import {initBeacons} from "./beacons/beacon";
import {Schema} from "@colyseus/schema";

export * from '@dcl/sdk'

export const mapComponent = engine.defineComponent("mapComponent", {
    lightSrc: Schemas.String,
    darkSrc: Schemas.String
})

export let dreamForestDark: Entity
export let dreamForestLight: Entity

export function main() {
    setupUi()

    initGamePlay()
    initBeacons()

    dreamForestDark = engine.addEntity()
    GltfContainer.create(dreamForestDark, {
        invisibleMeshesCollisionMask: ColliderLayer.CL_PHYSICS,
        src: 'models/LucidDreams_Map.glb',
    })
    Transform.create(dreamForestDark, {
        position: Vector3.create(24, 0, 24),
        rotation: Quaternion.create(0, 0, 0, 1),
        scale: Vector3.create(0.999, 0.999, 0.999),
    })

    dreamForestLight = engine.addEntity()
    GltfContainer.create(dreamForestLight, {
        invisibleMeshesCollisionMask: ColliderLayer.CL_PHYSICS,
        src: 'models/Light_LucidDreams_Map.glb',
    })
    Transform.create(dreamForestLight, {
        position: Vector3.create(24, 0, 24),
        rotation: Quaternion.create(0, 0, 0, 1),
        scale: Vector3.create(0, 0, 0),
    })


    // const myAvatar = engine.addEntity()
    // AvatarShape.create(myAvatar, {
    //     id: "",
    //     emotes: ['urn:decentraland:matic:collections-v2:0xa80aea22d0fe9d34ca72ce304ef427bbefee1f11:2'],
    //     wearables: [],
    //     expressionTriggerId: "urn:decentraland:matic:collections-v2:0xa80aea22d0fe9d34ca72ce304ef427bbefee1f11:2",
    //     expressionTriggerTimestamp: Math.round(+new Date() / 1000)
    // })
    //
    // AvatarShape.getMutable(myAvatar).expressionTriggerId = "urn:decentraland:matic:collections-v2:0xa80aea22d0fe9d34ca72ce304ef427bbefee1f11:2"
    // AvatarShape.getMutable(myAvatar).expressionTriggerTimestamp = Math.round((+new Date() / 1000) + 20)
    //
    // Transform.create(myAvatar, {
    //     position: Vector3.create(12, 0.25, 12)
    // })

    //
    // const zombiehouse = engine.addEntity()
    // Transform.create(zombiehouse, {
    //     position: Vector3.create(8, 0.01, 13.2),
    //     scale: Vector3.create(1, 1, 1),
    // });
    // GltfContainer.create(zombiehouse, {
    //         src: "models/Zombiehouse.glb",
    //         invisibleMeshesCollisionMask: ColliderLayer.CL_PHYSICS,
    //     }
    // )

    engine.addSystem(followSystem)
    engine.addSystem(ShootingSystem)
}