import {AvatarAnchorPointType, AvatarAttach, engine, executeTask, GltfContainer, Transform} from "@dcl/sdk/ecs";
import {Quaternion, Vector3} from "@dcl/sdk/math";
import {onEnterSceneObservable, onLeaveSceneObservable} from "@dcl/sdk/observables";
import {getPlayersInScene} from "~system/Players";


const createWeaponAndAttach = (userId?: string) => {
    const weaponParent = engine.addEntity()
    const weapon = engine.addEntity()
    GltfContainer.create(weapon, {
        src: "models/Staff.glb"
    })
    Transform.create(weapon, {
        position: Vector3.create(.005, .1, .1),
        scale: Vector3.create(1, 1, 1),
        rotation: Quaternion.fromEulerDegrees(90, 0, 20),
        parent: weaponParent
    })

    if (!userId) {
        AvatarAttach.create(weaponParent, {
            anchorPointId: AvatarAnchorPointType.AAPT_RIGHT_HAND
        })
    } else {
        AvatarAttach.create(weaponParent, {
            avatarId: userId,
            anchorPointId: AvatarAnchorPointType.AAPT_RIGHT_HAND
        })
    }

}

export function setupWeapons() {

    createWeaponAndAttach()

    // Get all players already in scene
    executeTask(async () => {
        let {players} = await getPlayersInScene({})
        players.forEach((player: { userId: string; }) => {
            console.log("player is nearby: ", player.userId)
            createWeaponAndAttach(player.userId)
        })
    })

    // Event when player enters scene
    onEnterSceneObservable.add((player) => {
        console.log("player entered scene: ", player.userId)
        createWeaponAndAttach(player.userId)
    })

    // Event when player leaves scene
    onLeaveSceneObservable.add((player) => {
        console.log("player left scene: ", player.userId)
    })

}

