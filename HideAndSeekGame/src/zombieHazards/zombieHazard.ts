import { ZombieAttack } from "src/zombieAttack";
import { Zombie } from "src/zombies/zombie";

class EnvironmentalHazard {
  private zombies: Zombie[];
  private zombieSystem: { [key: string]: ZombieAttack };

  constructor(
    zombies: Zombie[],
    zombieSystem: { [key: string]: ZombieAttack }
  ) {
    this.zombies = zombies;
    this.zombieSystem = zombieSystem;
  }

  addHazardToZombies() {
    // Add your logic here to add environmental hazards to zombies
    for (const zombie of this.zombies) {
      // Example: Apply poison effect to zombies
      //zombie.applyPoisonEffect();
    }
  }
}
