import * as utils from "@dcl/ecs-scene-utils"

// Cooldown for firing the rifle
@Component("cooldown")
export class Cooldown {}

export class Rifle extends Entity {
  constructor(model: GLTFShape, transform: Transform) {
    super()
    this.addComponent(model)
    this.addComponent(transform)

    this.addComponent(new Animator())
    this.getComponent(Animator).addClip(new AnimationState("reload", { looping: false }))
    this.getComponent(Animator).addClip(new AnimationState("fire", { looping: false }))
    this.getComponent(Animator).getClip("reload").play()
  }

  // Play gun fire animation
  playFireAnim() {
    this.stopAnimations()
    this.getComponent(Animator).getClip("fire").play()
    this.addComponent(new Cooldown())
    this.addComponent(
      new utils.Delay(333, () => {
        this.removeComponent(Cooldown)
      })
    )
  }

  // Bug workaround: otherwise the next animation clip won't play
  stopAnimations() {
    this.getComponent(Animator).getClip("reload").stop()
    this.getComponent(Animator).getClip("fire").stop()
  }
}
