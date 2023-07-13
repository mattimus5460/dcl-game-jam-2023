import {Quaternion, Vector3} from "@dcl/sdk/math";
import {
    engine,
    Entity,
    GltfContainer,
    InputAction,
    inputSystem,
    Material,
    PointerEvents,
    PointerEventType, removeEntityWithChildren,
    TextShape,
    Transform
} from "@dcl/sdk/ecs";
import {badMaterial, createParticlesForParent, goodMaterial} from "../particles";
import {connectedRoom} from "../colyseus/gameplay";
import {ammoBar, base1HealthBar, base2HealthBar, base3HealthBar, baseHealthBar} from "../ui";

const beaconPositions = [
    Vector3.create(11, 0, 9),
    Vector3.create(8, 0, 24),
    Vector3.create(10, 0, 40)
]

export let allBeacons: Beacon[] = []

export const initBeacons = () => {
    allBeacons.forEach((beacon) => {

        removeEntityWithChildren(engine, beacon.entity)
        engine.removeEntity(beacon.entity)

    })

    allBeacons = []

    // initialize beacons
    beaconPositions.forEach((position, i) => {
        allBeacons.push(new Beacon(position, i))
    })
    const homeBeacon = new Beacon(Vector3.create(24, .5, 27), beaconPositions.length, true)
    allBeacons.push(homeBeacon)
}

export class Beacon {
    entity: Entity
    energyLevel = 0
    position: Vector3
    particles: Entity[] = []
    isHome = false
    beaconIndex: number
    isInitialized = false


    constructor(position: Vector3, beaconIndex: number, isHome = false) {
        const beacon = engine.addEntity();
        GltfContainer.create(beacon, {src: isHome ? 'models/GreenOrb.glb' : 'models/RedOrb.glb'})
        Transform.create(beacon, {
            position,
            rotation: isHome ? Quaternion.fromEulerDegrees(0, 0, 0) : Quaternion.fromEulerDegrees(0, -90, 0),
        })
        this.position = position
        this.entity = beacon
        this.beaconIndex = beaconIndex

        if (isHome) {
            this.energyLevel = 100
        }
        this.isHome = isHome

        TextShape.create(this.entity, {
            text: '' + this.energyLevel,
            fontSize: 1,
            height: 2,
            paddingBottom: 5,
        })

        PointerEvents.create(this.entity, {
            pointerEvents: [
                {
                    eventType: PointerEventType.PET_DOWN,
                    eventInfo: {
                        button: InputAction.IA_POINTER,
                        hoverText: 'Add Energy',
                    }
                },
                {
                    eventType: PointerEventType.PET_DOWN,
                    eventInfo: {
                        button: InputAction.IA_PRIMARY,
                        hoverText: 'Take Energy',
                    }
                }
            ]
        })

        engine.addSystem(() => {
            if (inputSystem.isTriggered(InputAction.IA_POINTER, PointerEventType.PET_DOWN, this.entity)) {
                console.log('clicked beacon', beaconIndex)

                if (ammoBar.read() <= 0) return

                ammoBar.decrease(.01)
                connectedRoom.send("add-energy", beaconIndex)
            }

            if (inputSystem.isTriggered(InputAction.IA_PRIMARY, PointerEventType.PET_DOWN, this.entity)) {
                console.log('primary beacon', beaconIndex)

                if (ammoBar.read() >= 1 || this.energyLevel == 0) return

                ammoBar.increase(.01)
                connectedRoom.send("remove-energy", beaconIndex)
            }
        })
        this.particles = createParticlesForParent(beacon, 100, isHome)
    }

    addEnergy(amount: number) {
        this.energyLevel += amount
        TextShape.getMutable(this.entity).text = '' + this.energyLevel
        Material.setPbrMaterial(this.particles[this.energyLevel - 1], goodMaterial)

        if (this.energyLevel > 100) return

        if (this.isHome) {
            baseHealthBar.increase(amount / 100)
        } else {
            switch (this.beaconIndex) {
                case 0:
                    base1HealthBar.increase(amount / 100)
                    break
                case 1:
                    base2HealthBar.increase(amount / 100)
                    break
                case 2:
                    base3HealthBar.increase(amount / 100)
                    break
            }
        }
    }

    removeEnergy(amount: number) {
        this.energyLevel -= amount
        TextShape.getMutable(this.entity).text = '' + this.energyLevel
        Material.setPbrMaterial(this.particles[this.energyLevel - 1], badMaterial)

        if (this.energyLevel > 100) return

        if (this.isHome) {
            baseHealthBar.decrease(amount / 100)
        } else {
            switch (this.beaconIndex) {
                case 0:
                    base1HealthBar.decrease(amount / 100)
                    break
                case 1:
                    base2HealthBar.decrease(amount / 100)
                    break
                case 2:
                    base3HealthBar.decrease(amount / 100)
                    break
            }
        }
    }

    setEnergy(amount: number) {
        const previousEnergyLevel = this.energyLevel
        this.energyLevel = amount
        this.updateEnergyDisplays(previousEnergyLevel)

        if (!this.isInitialized) {
            this.isInitialized = true
            this.particles.forEach((particle, i) => {
                if (i < amount) {
                    Material.setPbrMaterial(particle, goodMaterial)
                } else {
                    Material.setPbrMaterial(particle, badMaterial)
                }
            })
        }
    }

    updateEnergyDisplays(previousEnergyLevel: number) {
        TextShape.getMutable(this.entity).text = '' + this.energyLevel

        Material.setPbrMaterial(this.particles[this.energyLevel - 1],
            (this.energyLevel > previousEnergyLevel) ? goodMaterial : badMaterial)

        if (this.isHome) {
            baseHealthBar.set(this.energyLevel / 100)
        } else {
            switch (this.beaconIndex) {
                case 0:
                    base1HealthBar.set(this.energyLevel / 100)
                    break
                case 1:
                    base2HealthBar.set(this.energyLevel / 100)
                    break
                case 2:
                    base3HealthBar.set(this.energyLevel / 100)
                    break
            }
        }
    }
}