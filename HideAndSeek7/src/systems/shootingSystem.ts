import {
    ColliderLayer,
    engine,
    InputAction,
    inputSystem,
    PointerEventType,
    RaycastQueryType,
    raycastSystem
} from "@dcl/sdk/ecs";
import {Vector3} from "@dcl/sdk/math";

export function ShootingSystem (){
    if (inputSystem.isTriggered(InputAction.IA_POINTER, PointerEventType.PET_DOWN)){
        // Logic in response to button press
        console.log("click")

        raycastSystem.registerLocalDirectionRaycast(
            {
                entity: engine.PlayerEntity,
                opts: {
                    queryType: RaycastQueryType.RQT_QUERY_ALL,
                    direction: Vector3.Forward(),
                    maxDistance: 30,
                    originOffset: Vector3.create(0, 0.4, 0),
                    collisionMask: ColliderLayer.CL_CUSTOM1 | ColliderLayer.CL_CUSTOM3 | ColliderLayer.CL_POINTER,
                },
            },
            function (raycastResult) {
                if (raycastResult.hits.length > 0) {
                    for (const hit of raycastResult.hits) {
                        if (hit.entityId) {
                            console.log('hit entity ', hit.entityId)
                        }
                    }
                } else {
                    console.log('no entities hit')
                }
            }
        )
    }
}

