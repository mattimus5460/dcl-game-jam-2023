import { Zombie } from "./zombies/zombie";
import castRay from "./raycast";

// Configuration
const MOVE_SPEED = 1;
const ROT_SPEED = 1;
const ATTACK_DISTANCE = 4;

interface ZombieAttackConfig {
  moveSpeed?: number;
  rotSpeed?: number;
  attackDistance?: number;
  onAttack?: () => void;
}

export class ZombieAttack implements ISystem {
  private zombie: Zombie;
  private transform: Transform;
  private player: Camera;
  private moveSpeed: number;
  private attackDistance: number;
  private rotSpeed: number;
  private createdAt: Date;
  private onAttack: () => void;
  private refreshTimer: number;

  constructor(
    zombie: Zombie,
    player: Camera,
    {
      moveSpeed = MOVE_SPEED,
      rotSpeed = ROT_SPEED,
      attackDistance = ATTACK_DISTANCE,
      onAttack,
    }: ZombieAttackConfig = {}
  ) {
    this.zombie = zombie;
    this.transform = zombie.getComponent(Transform);
    this.player = player;
    this.moveSpeed = moveSpeed;
    this.rotSpeed = rotSpeed;
    this.attackDistance = attackDistance;
    this.onAttack = onAttack;
    this.createdAt = new Date();
    this.refreshTimer = 0;
  }

  async update(dt: number) {
    if (this.refreshTimer > 0) {
      //log(this.refreshTimer);
      this.refreshTimer -= dt;
    }
    // Rotate to face the player
    const lookAtTarget = new Vector3(
      this.player.position.x,
      this.transform.position.y,
      this.player.position.z
    );
    const direction = lookAtTarget.subtract(this.transform.position);
    // this.transform.rotation = Quaternion.Slerp(
    //   this.transform.rotation,
    //   Quaternion.LookRotation(direction),
    //   dt * this.rotSpeed
    // );
    this.transform.rotation = Quaternion.LookRotation(direction);
    const e = await castRay(this.transform.position, this.player.position, 2);

    // if (e.didHit && e?.entities[0]?.entity?.entityId !== this.zombie.uuid) {
    //   log((new Date().getTime() - this.createdAt.getTime()) /1000 )
    //   log(e, dt)
    // }
    const diff = Math.round(
      (new Date().getTime() - this.createdAt.getTime()) / 1000
    );
    if (
      !(e.didHit && e?.entities[0]?.entity?.entityId !== this.zombie.uuid) ||
      diff <= 5
    ) {
      const distance = Vector3.DistanceSquared(
        this.transform.position,
        this.player.position
      ); // Check distance squared as it's more optimized
      if (distance >= this.attackDistance) {
        // Note: Distance is squared so a value of 4 is when the zombie is standing 2m away
        this.zombie.walk();
        const forwardVector = Vector3.Forward().rotate(this.transform.rotation);
        const increment = forwardVector.scale(dt * this.moveSpeed);
        this.transform.translate(increment);
      } else {
        this.zombie.attack();
        if (this.onAttack && this.refreshTimer <= 0) {
          this.onAttack();
          this.refreshTimer = 3;
        }
      }
    } else {
      const forwardVector = Vector3.Backward().rotate(this.transform.rotation);
      const increment = forwardVector.scale(dt * this.moveSpeed);
      this.transform.translate(increment);
    }
    // Continue to move towards the player until it is within 2m away
  }
}
