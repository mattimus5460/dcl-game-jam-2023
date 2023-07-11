import {Animator, engine, Transform} from "@dcl/sdk/ecs";
import {ZombieC} from "../zombies/zombie";
import {Quaternion, Vector3} from "@dcl/sdk/math";
import {healthBar} from "../ui";
import {allBeacons} from "../beacons/beacon";
import {movePlayerTo} from "~system/RestrictedActions";
import {connectedRoom} from "../colyseus/gameplay";

export function followSystem(dt: number) {
    // iterate over all entiities with a Transform
    for (const [entity, zombieSettings] of engine.getEntitiesWith(ZombieC)) {

        const mutableZC = ZombieC.getMutable(entity)
        if (zombieSettings.attackTimer > 0)
            mutableZC.attackTimer -= dt

        const playerTransform = Transform.get(engine.PlayerEntity)
        const entityTransform = Transform.getMutable(entity)

        // Calculate distance from player
        const playerDistance = Vector3.distanceSquared(
            entityTransform.position,
            playerTransform.position
        );

        // If player is within engage distance
        if (playerDistance <= zombieSettings.engageDistance) {


            // Rotate toward player
            const lookAtTarget = Vector3.create(
                playerTransform.position.x,
                entityTransform.position.y,
                playerTransform.position.z
            );
            const direction = Vector3.subtract(lookAtTarget, entityTransform.position);
            entityTransform.rotation = Quaternion.lookRotation(direction)


            if (playerDistance >= zombieSettings.attackDistance) {

                // Move Toward Player
                const forwardVector = Vector3.rotate(Vector3.Forward(), entityTransform.rotation)
                const increment = Vector3.scale(forwardVector, dt * zombieSettings.moveSpeed)
                entityTransform.position = Vector3.add(entityTransform.position, increment)

                Animator.getClip(entity, 'run').playing = true
                Animator.getClip(entity, 'attack').playing = false

            } else {
                // Attack Range
                Animator.getClip(entity, 'run').playing = false
                Animator.getClip(entity, 'attack').playing = true

                if (zombieSettings.attackTimer <= 0) {
                    mutableZC.attackTimer = zombieSettings.attackTime
                    healthBar.decrease(0.01)
                    if (healthBar.read() <= 0) {
                        void movePlayerTo({newRelativePosition: Vector3.create(26, 23, 28)})
                        healthBar.increase(1)
                    }
                }
            }

        } else {

            // Calculate distance from target
            const targetDistance = Vector3.distanceSquared(
                entityTransform.position,
                allBeacons[zombieSettings.currentBeaconId].position
            );

            // Rotate toward set target
            const lookAtTarget = allBeacons[zombieSettings.currentBeaconId].position

            const direction = Vector3.subtract(lookAtTarget, entityTransform.position);
            entityTransform.rotation = Quaternion.lookRotation(direction)

            if (targetDistance <= 1) {
                Animator.getClip(entity, 'run').playing = false
                Animator.getClip(entity, 'attack').playing = true

                // damage beacon
                if (zombieSettings.attackTimer <= 0) {
                    mutableZC.attackTimer = zombieSettings.attackTime

                    //allBeacons[zombieSettings.currentBeaconId].removeEnergy(1)
                    connectedRoom.send("remove-energy", zombieSettings.currentBeaconId)
                }
            } else {

                // Move Toward target
                const forwardVector = Vector3.rotate(Vector3.Forward(), entityTransform.rotation)
                const increment = Vector3.scale(forwardVector, dt * zombieSettings.moveSpeed)
                entityTransform.position = Vector3.add(entityTransform.position, increment)
            }
        }
    }
}
