import {
    ColliderLayer,
    engine,
    Entity,
    GltfContainer,
    Material,
    MeshRenderer,
    TextureFilterMode,
    TextureWrapMode,
    Transform
} from '@dcl/sdk/ecs'
import {Color4, Quaternion, Vector3} from '@dcl/sdk/math'

import {setupUi} from './ui'
import {followSystem} from "./systems/followSystem";
import {initGamePlay} from "./colyseus/gameplay";
import './polyfill/delcares'
import {initBeacons} from "./beacons/beacon";
import {setupWeapons} from "./weapon";
import *  as  npc from 'dcl-npc-toolkit'
import {Dialog} from "dcl-npc-toolkit";

export * from '@dcl/sdk'


export const wallTexture = Material.Texture.Common({
    src: 'images/digital_painting_galaxy_lucid_dream_sky_trees__3.jpg',
    filterMode: TextureFilterMode.TFM_BILINEAR,
    wrapMode: TextureWrapMode.TWM_REPEAT
})

export const wallTextureLight = Material.Texture.Common({
    src: 'images/digital_painting_galaxy_lucid_dream_sky_trees.jpg',
    filterMode: TextureFilterMode.TFM_BILINEAR,
    wrapMode: TextureWrapMode.TWM_REPEAT
})


export const wallComponent = engine.defineComponent("wallComponent", {})

export let dreamForestDark: Entity
export let dreamForestLight: Entity

export function main() {
    setupUi()

    initGamePlay()
    initBeacons()

    setupWeapons()

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


    const wall1 = engine.addEntity()
    Material.setPbrMaterial(wall1, {
        texture: wallTexture,
        emissiveTexture: wallTexture,
        emissiveColor: Color4.White()
    })
    MeshRenderer.setPlane(wall1, [
        0, .5,
        0, 1,
        .5, 1,
        .5, .5,
        0, .5,
        0, 1,
        .5, 1,
        .5, .5,
    ])
    Transform.create(wall1, {
        position: Vector3.create(24, 12, 0),
        scale: Vector3.create(48, 24, 48),
        rotation: Quaternion.fromEulerDegrees(0, 0, 0)
    })
    wallComponent.create(wall1)

    const wall2 = engine.addEntity()
    Material.setPbrMaterial(wall2, {
        texture: wallTexture,
        emissiveTexture: wallTexture,
        emissiveColor: Color4.White()
    })

    MeshRenderer.setPlane(wall2, [
        .5, .5,
        .5, 1,
        1, 1,
        1, .5,
        .5, .5,
        .5, 1,
        1, 1,
        1, .5,
    ])
    Transform.create(wall2, {
        position: Vector3.create(24, 12, 48),
        scale: Vector3.create(48, 24, 48),
        rotation: Quaternion.fromEulerDegrees(0, 0, 0)
    })
    wallComponent.create(wall2)

    const wall3 = engine.addEntity()
    Material.setPbrMaterial(wall3, {
        texture: wallTexture,
        emissiveTexture: wallTexture,
        emissiveColor: Color4.White()
    })
    MeshRenderer.setPlane(wall3, [
        0, 0,
        0, 1,
        .5, 1,
        .5, 0,
        0, 0,
        0, 1,
        .5, 1,
        .5, 0,
    ])
    Transform.create(wall3, {
        position: Vector3.create(0, 12, 24),
        scale: Vector3.create(48, 24, 48),
        rotation: Quaternion.fromEulerDegrees(0, 90, 0)
    })
    wallComponent.create(wall3)


    const wall4 = engine.addEntity()
    Material.setPbrMaterial(wall4, {
        texture: wallTexture,
        emissiveTexture: wallTexture,
        emissiveColor: Color4.White()
    })
    MeshRenderer.setPlane(wall4, [
        .5, 0,
        .5, 1,
        1, 1,
        1, 0, 5, 0,
        .5, 1,
        1, 1,
        1, 0,
    ])
    Transform.create(wall4, {
        position: Vector3.create(48, 12, 24),
        scale: Vector3.create(48, 24, 48),
        rotation: Quaternion.fromEulerDegrees(0, 90, 0)
    })
    wallComponent.create(wall4)


    // MeshRenderer.setPlane(wall2, [
    //         .5, 0,
    //         .5, 1,
    //     1, 1,
    //     1, .5,
    //
    //     0, 0,
    //     0, 1,
    //     .5, 1,
    //     .5, 0,
    // ])

    let ILoveCats: Dialog[] = [
        {
            text: `Oh... um, hello there. I'm Sarah. I... I'm scared and I'm stuck in this nightmare. I need your help to escape. Listen closely, okay?`
        },
        {
            text: `To leave this place you must follow these steps: 
            \n1. Defeat the ghosts and collect energy.`
        },
        {
            text: `\n2. Power up the dream beacons to 100 or more using the energy. 
             \n3. Protect the bed beacon from reaching 0 energy.`
        },
        {
            text: `\nYour goal is to power up all 4 beacons to over 100 energy and release the nightmare.`
        },
        {
            text: `Coordinate with friends to strategically manage energy and explore for hidden energy boosts!`
        },
        {
            text: `I believe in you! Let's beat this nightmare together. You've got this!`,
            isEndOfDialog: true
        }
    ]

    let myNPC = npc.create(
        {
            position: Vector3.create(17, 0, 34),
            rotation: Quaternion.fromEulerDegrees(0, 25, 0),
            scale: Vector3.create(1, 1, 1)
        },
        //NPC Data Object
        {
            type: npc.NPCType.CUSTOM,
            model: 'models/GirlLP.glb',
            reactDistance: 3,
            onlyClickTrigger: true,
            onlyETrigger: true,
            textBubble: true,
            idleAnim: 'cry',
            bubbleXOffset: .75,
            bubbleYOffset: -.4,

            onActivate: () => {
                console.log('npc activated');
                //npc.talk(myNPC, ILoveCats)

                npc.talkBubble(myNPC, ILoveCats)
            }
        }
    )


    engine.addSystem(followSystem)
}