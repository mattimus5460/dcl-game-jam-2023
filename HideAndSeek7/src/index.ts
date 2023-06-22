import {AvatarShape, ColliderLayer, engine, GltfContainer, Transform} from '@dcl/sdk/ecs'
import {Vector3} from '@dcl/sdk/math'
import {bounceScalingSystem, circularSystem, spawnerSystem} from './systems'

import {setupUi} from './ui'
import {followSystem} from "./systems/followSystem";
import {ShootingSystem} from "./systems/shootingSystem";

// Defining behavior. See `src/systems.ts` file.
engine.addSystem(circularSystem)
engine.addSystem(spawnerSystem)
engine.addSystem(bounceScalingSystem)

export function main() {
    setupUi()



    const myAvatar = engine.addEntity()
    AvatarShape.create(myAvatar, {
        id: "",
        emotes: ['urn:decentraland:matic:collections-v2:0xa80aea22d0fe9d34ca72ce304ef427bbefee1f11:2'],
        wearables: [],
        expressionTriggerId: "urn:decentraland:matic:collections-v2:0xa80aea22d0fe9d34ca72ce304ef427bbefee1f11:2",
        expressionTriggerTimestamp: Math.round(+new Date() / 1000)
    })

    AvatarShape.getMutable(myAvatar).expressionTriggerId =  "urn:decentraland:matic:collections-v2:0xa80aea22d0fe9d34ca72ce304ef427bbefee1f11:2"
    AvatarShape.getMutable(myAvatar).expressionTriggerTimestamp =  Math.round((+new Date() / 1000 )+ 20)

    Transform.create(myAvatar, {
        position: Vector3.create(12, 0.25, 12)
    })


    const zombiehouse = engine.addEntity()
    Transform.create(zombiehouse, {
        position: Vector3.create(8, 0.01, 13.2),
        scale: Vector3.create(1, 1, 1),
    });
    GltfContainer.create(zombiehouse, {
            src: "models/Zombiehouse.glb",
            invisibleMeshesCollisionMask: ColliderLayer.CL_PHYSICS,
        }
    )



    engine.addSystem(followSystem)
    engine.addSystem(ShootingSystem)


}