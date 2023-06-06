import { SpawnItem } from "src/game";
import { SpawnBase } from "./spawnBase";

// Items
const health = SpawnItem(
  new GLTFShape("models/medikit.glb"),
  new Transform({
    position: new Vector3(27.06, 0.75, 8.07),
    scale: new Vector3(0.5, 0.5, 0.5),
  }),
  new AudioClip("sounds/medikitPickup.mp3"),
  300000 // In milliseconds - 5 mins spawn time
);

const health2 = SpawnItem(
  new GLTFShape("models/medikit.glb"),
  new Transform({
    position: new Vector3(8.6, 0.75, 7.06),
    scale: new Vector3(0.5, 0.5, 0.5),
  }),
  new AudioClip("sounds/medikitPickup.mp3"),
  300000 // In milliseconds - 5 mins spawn time
);

const health3 = SpawnItem(
  new GLTFShape("models/medikit.glb"),
  new Transform({
    position: new Vector3(3.71, 0.75, 29.45),
    scale: new Vector3(0.5, 0.5, 0.5),
  }),
  new AudioClip("sounds/medikitPickup.mp3"),
  300000 // In milliseconds - 5 mins spawn time
);

// const ammo = SpawnItem(
//   new GLTFShape("models/ammo.glb"),
//   new Transform({
//     position: new Vector3(8.6, 0.75, 7.06),
//   }),
//   new AudioClip("sounds/ammoPickup.mp3"),
//   1500
// );

// const armor = SpawnItem(
//   new GLTFShape("models/armor.glb"),
//   new Transform({
//     position: new Vector3(3.71, 0.75, 29.45),
//   }),
//   new AudioClip("sounds/armorPickup.mp3"),
//   5000
// );

// Spawn Bases
const spawnBaseRed = new SpawnBase(
  new GLTFShape("models/spawnBaseRed.glb"),
  new Transform({
    position: new Vector3(27.06, 0, 8.07),
    scale: new Vector3(0.5, 0.5, 0.5),
  })
);

const spawnBaseRed2 = new SpawnBase(
  new GLTFShape("models/spawnBaseRed.glb"),
  new Transform({
    position: new Vector3(8.6, 0, 7.06),
    scale: new Vector3(0.5, 0.5, 0.5),
  })
);

const spawnBaseRed3 = new SpawnBase(
  new GLTFShape("models/spawnBaseRed.glb"),
  new Transform({
    position: new Vector3(3.71, 0, 29.45),
    scale: new Vector3(0.5, 0.5, 0.5),
  })
);

// const spawnBaseGreen = new SpawnBase(
//   new GLTFShape("models/spawnBaseGreen.glb"),
//   new Transform({
//     position: new Vector3(8.6, 0, 7.06),
//   })
// );

// const spawnBaseBlue = new SpawnBase(
//   new GLTFShape("models/spawnBaseBlue.glb"),
//   new Transform({
//     position: new Vector3(3.71, 0, 29.45),
//   })
// );
