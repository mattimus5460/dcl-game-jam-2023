import {
  Animator,
  ColliderLayer,
  engine,
  Entity,
  GltfContainer,
  InputAction,
  pointerEventsSystem,
  removeEntityWithChildren,
  Schemas,
  TextShape,
  Transform,
  TransformType
} from '@dcl/sdk/ecs'
import { activeZombies, connectedRoom } from '../colyseus/gameplay'

export class Character {
  entity: Entity

  constructor(modelSrc: string, transform: TransformType) {
    console.log('adding character', modelSrc, transform)
    const charEnt = engine.addEntity()
    GltfContainer.create(charEnt, {
      src: modelSrc,
      invisibleMeshesCollisionMask: undefined,
      visibleMeshesCollisionMask: ColliderLayer.CL_POINTER | ColliderLayer.CL_PHYSICS
    })
    Transform.create(charEnt, transform)

    Animator.create(charEnt, {
      states: [
        {
          name: 'run',
          clip: 'run',
          playing: true,
          loop: true,
          speed: 1,
          shouldReset: false
        },
        {
          name: 'attack',
          clip: 'attack',
          loop: true,
          speed: 1,
          shouldReset: false
        }
      ]
    })

    //Animator.playSingleAnimation(charEnt, "run")

    this.entity = charEnt
  }
}

const zombieDefaults = { moveSpeed: 1, attackDistance: 2, attackTimer: 1.5, attackTime: 1.5 }
export const ZombieC = engine.defineComponent(
  'Zombie',
  {
    moveSpeed: Schemas.Number,
    attackDistance: Schemas.Number,
    attackTimer: Schemas.Number,
    attackTime: Schemas.Number
  },
  zombieDefaults
)

export class Zombie extends Character {
  health: number
  serverId: string

  constructor(transform: TransformType, serverId: string) {
    super('models/ghost.glb', transform)
    this.health = 100
    this.serverId = serverId
    ZombieC.create(this.entity)

    TextShape.create(this.entity, {
      text: '' + this.health
    })

    pointerEventsSystem.onPointerDown(
      {
        entity: this.entity,
        opts: { button: InputAction.IA_POINTER, hoverText: 'Shoot' }
      },
      function (cmd) {
        console.log('clicked', cmd.hit)

        connectedRoom.send('damage-enemy', serverId)
      }
    )
  }

  damage(damage: number) {
    this.health -= damage
    TextShape.getMutable(this.entity).text = '' + this.health
  }

  attack() {
    Animator.playSingleAnimation(this.entity, 'attack')
  }

  hit(damage: number) {
    this.health -= damage

    console.log(this.health)
    if (this.health <= 0) {
      console.log('die')
      this.die()
    }
  }

  die() {
    console.log('zombie died')
    removeEntityWithChildren(engine, this.entity)
    engine.removeEntity(this.entity)
    activeZombies.delete(this.serverId)
  }

  // Play walking animation
  walk() {
    Animator.playSingleAnimation(this.entity, 'run')
  }

  // Bug workaround: otherwise the next animation clip won't play
  stopAnimations() {
    Animator.stopAllAnimations(this.entity)
  }
}

export const playSingleAnimForEntity = (entity: Entity, animName: string) => {
  console.log('play')
  Animator.playSingleAnimation(entity, animName)

  // console.log("playing", Animator.getClip(entity, animName).playing )
  //
  // if (Animator.getClip(entity, animName).playing == false) {
  //
  // }
}
