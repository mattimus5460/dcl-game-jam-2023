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


    engine.addSystem(followSystem)
}