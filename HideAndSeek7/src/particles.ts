import {engine, Entity, Material, MeshRenderer, PBMaterial_PbrMaterial, Schemas, Transform} from '@dcl/sdk/ecs'
import {Color4, Quaternion, Vector3} from '@dcl/sdk/math'
import * as utils from "@dcl-sdk/utils";

// Particles
export const Particle = engine.defineComponent('Particle', {
    life: Schemas.Float,
    seed: Schemas.Float,
    zSeed: Schemas.Float,
    width: Schemas.Number,
    height: Schemas.Number,
    speed: Schemas.Number,
})

export function particleSystem(dt: number) {
    for (const [entity] of engine.getEntitiesWith(Particle, Transform)) {
        const particle = Particle.getMutable(entity)

        particle.life += dt * particle.speed // Particle speed
        particle.life %= 1 // Reset particle life

        const transform = Transform.getMutable(entity)
        transform.position = Vector3.create(particle.seed, particle.life * particle.height, particle.zSeed)
    }
}


//engine.addSystem(particleSystem)

// Setup particles
export const badMaterial: PBMaterial_PbrMaterial = {
    metallic: 1,
    albedoColor: Color4.create(0.5, 1.5, 2, .1),
    emissiveColor: Color4.Red(),
    emissiveIntensity: 200
}

export const goodMaterial: PBMaterial_PbrMaterial = {
    metallic: 1,
    albedoColor: Color4.create(0.5, 1.5, 2, .1),
    emissiveColor: Color4.White(),
    emissiveIntensity: 200
}

// Initialise particles
const MAX_PARTICLES = 256

export const createParticlesForParent = (entity: Entity, count: number, isHome: boolean) => {
    const allParticlesForParent = []

    for (let i = 0; i < count; i++) {

        const particleEntity = engine.addEntity()
        MeshRenderer.setSphere(particleEntity)
        Material.setPbrMaterial(particleEntity, isHome ? goodMaterial : badMaterial)

        Particle.create(particleEntity, {
            life: Math.random(),
            seed: utils.remap(Math.random(), 0, 1, -6, 6),
            zSeed: utils.remap(Math.random(), 0, 1, -6, 6),
            height: 5,
            speed: .015
        })

        const pc = Particle.get(particleEntity)
        Transform.create(particleEntity, {
            position: Vector3.create(pc.seed, pc.life * pc.height, pc.zSeed),
            rotation: Quaternion.fromEulerDegrees(0, 0, 0),
            scale: Vector3.create(0.025, 0.025, .025),
            parent: entity
        })

        allParticlesForParent.push(particleEntity)
    }
    return allParticlesForParent
}
