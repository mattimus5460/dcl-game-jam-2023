import {
    Animator,
    AvatarAnchorPointType,
    AvatarAttach,
    ColliderLayer,
    engine,
    Entity,
    GltfContainer,
    InputAction,
    Material,
    MeshRenderer,
    pointerEventsSystem,
    removeEntityWithChildren,
    Schemas,
    TextShape,
    Transform,
    TransformType
} from "@dcl/sdk/ecs";
import {activeZombies, connectedRoom} from "../colyseus/gameplay";
import {Color4, Quaternion, Vector3} from "@dcl/sdk/math";
import * as utils from "@dcl-sdk/utils"
import {ammoBar} from "../ui";
import {allBeacons} from "../beacons/beacon";


export class Character {
    entity: Entity

    constructor(modelSrc: string, transform: TransformType) {

        const charEnt = engine.addEntity()
        GltfContainer.create(charEnt, {
            src: modelSrc,
            invisibleMeshesCollisionMask: undefined,
            visibleMeshesCollisionMask: ColliderLayer.CL_POINTER | ColliderLayer.CL_PHYSICS,
        })
        Transform.create(charEnt, transform)

        Animator.create(charEnt, {
            states: [
                {
                    name: "run",
                    clip: "run",
                    playing: true,
                    loop: true,
                    speed: 1,
                    shouldReset: false
                },
                {
                    name: "attack",
                    clip: "attack",
                    loop: true,
                    speed: 1,
                    shouldReset: false
                },
                {
                    name: "impact",
                    clip: "impact",
                    loop: false,
                    speed: 1,
                    shouldReset: true,
                }
            ]
        })

        //Animator.playSingleAnimation(charEnt, "run")

        this.entity = charEnt
    }

}

const enemyDefaults =
    {moveSpeed: 1, attackDistance: 2, attackTimer: 1, attackTime: .5, engageDistance: 16}
export const EnemyComponent = engine.defineComponent("Enemy", {
    moveSpeed: Schemas.Number,
    attackDistance: Schemas.Number,
    engageDistance: Schemas.Number,
    attackTimer: Schemas.Number,
    attackTime: Schemas.Number,
    currentBeaconId: Schemas.Number
}, enemyDefaults)

export class Ghost extends Character {
    health: number;
    serverId: string;
    healthBar: Entity;

    constructor(transform: TransformType, serverId: string) {
        super(Math.random() > .5 ?'models/ghost.glb':'models/BlueGhost.glb', transform);
        this.health = 100
        this.serverId = serverId
        EnemyComponent.create(this.entity, {
            currentBeaconId: allBeacons.length -1,
        })

        TextShape.create(this.entity, {
            text: '' + this.health,
            fontSize: 0,
            height: 2,
            paddingBottom: 5,
        })
        this.healthBar = this.createHealthBar()

        pointerEventsSystem.onPointerDown(
            {
                entity: this.entity,
                opts: {button: InputAction.IA_POINTER, hoverText: 'Attack'},
            },
            function (cmd) {
                console.log('clicked', cmd.hit)

                if(ammoBar.read() <= 0) return

                connectedRoom.send("damage-enemy", serverId)
                ammoBar.decrease(.01)
            }
        )
    }

    createHealthBar() {
        const healthBar = engine.addEntity()
        Transform.create(healthBar, {
            position: Vector3.create(0, 2.25, 0),
            scale: Vector3.create(utils.remap(this.health, 0, 100, 0, .5), 0.05, 0.05),
            parent: this.entity
        })
        MeshRenderer.setBox(healthBar)
        Material.setPbrMaterial(healthBar, {albedoColor: Color4.create(1, 0, 0, .6)})

        return healthBar
    }

    damage(damage: number) {
        this.health -= damage;
        TextShape.getMutable(this.entity).text = '' + this.health
        Transform.getMutable(this.healthBar).scale.x = utils.remap(this.health, 0, 100, 0, .5)

        Animator.getClip(this.entity, "impact").playing = true
    }

    attack() {
        Animator.playSingleAnimation(this.entity, "attack")
    }

    hit(damage: number) {
        this.health -= damage;
        if (this.health <= 0) {
            this.die()
        }
    }

    die() {
        console.log("zombie died")
        removeEntityWithChildren(engine, this.entity)
        engine.removeEntity(this.entity)
        engine.removeEntity(this.healthBar)
        activeZombies.delete(this.serverId)
    }

    // Play walking animation
    walk() {
        Animator.playSingleAnimation(this.entity, "run")
    }

    // Bug workaround: otherwise the next animation clip won't play
    stopAnimations() {
        Animator.stopAllAnimations(this.entity)
    }
}

export const playSingleAnimForEntity = (entity: Entity, animName: string) => {

    console.log("play")
    Animator.playSingleAnimation(entity, animName)


    // console.log("playing", Animator.getClip(entity, animName).playing )
    //
    // if (Animator.getClip(entity, animName).playing == false) {
    //
    // }
}

export const createGhost = (transform: TransformType, attach=false) => {
    const charEnt = engine.addEntity()
    GltfContainer.create(charEnt, {
        src: 'models/ghost.glb'
    })
    Transform.create(charEnt, transform)

    Animator.create(charEnt, {
        states: [
            {
                name: "attack",
                clip: "attack",
                loop: true,
                speed: 1,
                shouldReset: false
            },
        ]
    })

    if(attach){
        const avatarAttach = engine.addEntity()

        AvatarAttach.create(avatarAttach, {
            anchorPointId: AvatarAnchorPointType.AAPT_POSITION
        })

        Transform.getMutable(charEnt).parent = avatarAttach
    }

    Animator.playSingleAnimation(charEnt, "attack")

    utils.timers.setTimeout(
        function() { engine.removeEntity(charEnt) },
        30000
    )

    return charEnt
}


export const createLosingGhosts = () => {
    createGhost({
        position: Vector3.create(17, .25, 35),
        rotation: Quaternion.fromEulerDegrees(0, 180, 0),
        scale: Vector3.create(1, 1, 1)
    })

    createGhost({
        position: Vector3.create(18, .25, 35),
        rotation: Quaternion.fromEulerDegrees(0, 200, 0),
        scale: Vector3.create(1, 1, 1)
    })

    createGhost({
        position: Vector3.create(0, 1, -.75),
        rotation: Quaternion.fromEulerDegrees(0, 0, 0),
        scale: Vector3.create(1, 1, 1)
    }, true)

}


