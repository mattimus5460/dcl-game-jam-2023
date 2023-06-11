export class BigBossZombie extends Entity {
  health: number;
  constructor(model: GLTFShape, health: number, transform: Transform) {
    super();
    log("adding zombie to engine");
    engine.addEntity(this);
    this.addComponent(model);
    this.addComponent(transform);
    this.health = health;

    this.addComponent(new Animator());
    this.getComponent(Animator).addClip(
      new AnimationState("walk", { looping: true })
    );
    this.getComponent(Animator).addClip(
      new AnimationState("attack", { looping: true })
    );
    this.getComponent(Animator).getClip("walk").play();
  }

  // Play attacking animation
  attack() {
    this.getComponent(Animator).getClip("attack").play();
  }

  hit(damage: number) {
    this.health -= damage;
  }

  // Play walking animation
  walk() {
    this.getComponent(Animator).getClip("walk").play();
  }

  // Bug workaround: otherwise the next animation clip won't play
  stopAnimations() {
    this.getComponent(Animator).getClip("walk").stop();
    this.getComponent(Animator).getClip("attack").stop();
  }
}
