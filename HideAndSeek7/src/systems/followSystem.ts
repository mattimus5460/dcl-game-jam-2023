import {Animator, engine, Transform} from "@dcl/sdk/ecs";
import {ZombieC} from "../zombies/zombie";
import {Quaternion, Vector3} from "@dcl/sdk/math";

export function followSystem(dt: number) {
    // iterate over all entiities with a Transform
    for (const [entity, zombieSettings] of engine.getEntitiesWith(ZombieC)) {

        const mutableZC = ZombieC.getMutable(entity)
        if(zombieSettings.attackTimer > 0)
            mutableZC.attackTimer -= dt

        const playerTransform =  Transform.get(engine.PlayerEntity)
        const entityTransform =  Transform.getMutable(entity)

        // Rotate toward player
        const lookAtTarget = Vector3.create(
            playerTransform.position.x,
            entityTransform.position.y,
            playerTransform.position.z
        );
        const direction = Vector3.subtract(lookAtTarget, entityTransform.position);
        entityTransform.rotation = Quaternion.lookRotation(direction)


        // Move Enemy
        const distance = Vector3.distanceSquared(
            entityTransform.position,
            playerTransform.position
        );




        if(distance >= zombieSettings.attackDistance){

            // Move Toward Player
            const forwardVector = Vector3.rotate(Vector3.Forward(), entityTransform.rotation)
            const increment = Vector3.scale(forwardVector, dt * zombieSettings.moveSpeed)
            entityTransform.position = Vector3.add(entityTransform.position, increment)

            //playSingleAnimForEntity(entity, "run")

            Animator.getClip(entity, 'run').playing = true
            Animator.getClip(entity, 'attack').playing = false

            // if(Animator.getClip(entity, "run").playing == false ){
            //     playSingleAnimForEntity(entity, "run")
            // }
        } else {
            // Attack Rangee
            Animator.getClip(entity, 'run').playing = false
            Animator.getClip(entity, 'attack').playing = true


            // if(zombieSettings.attackTimer <= 0){
            //     playSingleAnimForEntity(entity, "attack")
            //     mutableZC.attackTimer = zombieSettings.attackTime
            // }

        }





    }
}
