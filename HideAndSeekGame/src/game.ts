import { setTimeout } from "@dcl/ecs-scene-utils";
import GameManager, { weapon } from "./gameManager";
import * as ui from "@dcl/ui-scene-utils";
import { canvas } from "@dcl/ui-scene-utils";
import * as utils from "@dcl/ecs-scene-utils";
import { Player, player } from "./inventory/player";
import { ITEM_TYPES } from "./inventory/playerInventoryMap";

const manager = new GameManager();
//const player = new Player();

const areaToHide = new Entity();
areaToHide.addComponent(
  new AvatarModifierArea({
    area: { box: new Vector3(32, 6, 32) },
    modifiers: [AvatarModifiers.DISABLE_PASSPORTS],
  })
);
areaToHide.addComponent(
  new Transform({
    position: new Vector3(16, 3, 16),
  })
);
engine.addEntity(areaToHide);

export function SpawnItem(
  model: GLTFShape,
  transform: Transform,
  sound: AudioClip,
  respawnTime: number
) {
  let entity = new Entity();
  engine.addEntity(entity);
  entity.addComponent(model);
  entity.addComponent(transform);

  let soundEntity = new Entity();
  soundEntity.addComponent(new AudioSource(sound));
  soundEntity.addComponent(new Transform());

  engine.addEntity(soundEntity);
  soundEntity.setParent(Attachable.AVATAR);

  /**
   * This trigger allows the player to stand on the same spot and continually
   * pick up an item without having to exit and re-enter the trigger themselves
   */
  entity.addComponent(
    new utils.TriggerComponent(
      new utils.TriggerBoxShape(new Vector3(1.5, 3, 1.5)), // We need a separate trigger instance for each item as we'll be modifying it
      {
        onCameraEnter: () => {
          soundEntity.getComponent(AudioSource).playOnce();
          manager.increaseHealth(1);
          entity.getComponent(Transform).scale.setAll(0);
          const origTriggerPosY = entity.getComponent(utils.TriggerComponent)
            .shape.position.y;
          entity.getComponent(utils.TriggerComponent).shape.position.y = -100; // Move the trigger so that the player exits and re-enters the trigger

          entity.addComponent(
            new utils.Delay(respawnTime, () => {
              entity.getComponent(Transform).scale.setAll(1);
              entity.getComponent(utils.TriggerComponent).shape.position.y =
                origTriggerPosY; // Revert trigger position back to its original position
            })
          );
        },
      }
    )
  );

  return entity;
}

// #1
const myVideoClip = new VideoClip(
  "https://player.vimeo.com/external/833509817.m3u8?s=ca075983c0e8d823791e117b8e07d75aa05df8a7"
);

// #2
const myVideoTexture = new VideoTexture(myVideoClip);
myVideoTexture.play();
myVideoTexture.loop = true;

// #3

const myMaterial = new Material();
myMaterial.albedoTexture = myVideoTexture;
myMaterial.emissiveTexture = myVideoTexture;
myMaterial.emissiveColor = Color3.White();
myMaterial.emissiveIntensity = 0.7;
myMaterial.roughness = 1.0;

// #4
const screen = new Entity();
screen.addComponent(new PlaneShape());
screen.addComponent(
  new Transform({
    position: new Vector3(19.17, 0.9, 11.62),
    rotation: new Quaternion(
      2.806811489129799e-16,
      0.7033095216751099,
      -8.5629160651024e-8,
      0.6957237720489502
    ),
    scale: new Vector3(0.0001, 0.0001, 0.0001),
  })
);
screen.addComponent(myMaterial);

engine.addEntity(screen);

const modArea = new Entity();
modArea.addComponent(
  new CameraModeArea({
    area: { box: new Vector3(32, 6, 32) },
    cameraMode: CameraMode.FirstPerson,
  })
);
modArea.addComponent(
  new Transform({
    position: new Vector3(16, 3, 16),
  })
);
engine.addEntity(modArea);

//Build scene
const _scene = new Entity("_scene");
engine.addEntity(_scene);
const transform = new Transform({
  position: new Vector3(0, 0, 0),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1),
});
_scene.addComponentOrReplace(transform);

const entity = new Entity("entity");
engine.addEntity(entity);
entity.setParent(_scene);
const gltfShape = new GLTFShape(
  "c9b17021-765c-4d9a-9966-ce93a9c323d1/FloorBaseGrass_01/FloorBaseGrass_01.glb"
);
gltfShape.withCollisions = true;
gltfShape.isPointerBlocker = true;
gltfShape.visible = true;
entity.addComponentOrReplace(gltfShape);
const transform2 = new Transform({
  position: new Vector3(8, 0, 8),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1),
});
entity.addComponentOrReplace(transform2);

const entity2 = new Entity("entity2");
engine.addEntity(entity2);
entity2.setParent(_scene);
entity2.addComponentOrReplace(gltfShape);
const transform3 = new Transform({
  position: new Vector3(24, 0, 8),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1),
});
entity2.addComponentOrReplace(transform3);

const entity3 = new Entity("entity3");
engine.addEntity(entity3);
entity3.setParent(_scene);
entity3.addComponentOrReplace(gltfShape);
const transform4 = new Transform({
  position: new Vector3(8, 0, 24),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1),
});
entity3.addComponentOrReplace(transform4);

const entity4 = new Entity("entity4");
engine.addEntity(entity4);
entity4.setParent(_scene);
entity4.addComponentOrReplace(gltfShape);
const transform5 = new Transform({
  position: new Vector3(24, 0, 24),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1),
});
entity4.addComponentOrReplace(transform5);

const zombiehouse = new Entity("zombiehouse");
engine.addEntity(zombiehouse);
zombiehouse.setParent(_scene);
const transform6 = new Transform({
  position: new Vector3(8, 0.01, 13.2),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1),
});
zombiehouse.addComponentOrReplace(transform6);
const gltfShape2 = new GLTFShape(
  "d4ea110e-f3c2-4044-87fa-6143d6f7f67c/Zombiehouse.glb"
);
gltfShape2.withCollisions = true;
gltfShape2.isPointerBlocker = true;
gltfShape2.visible = true;
zombiehouse.addComponentOrReplace(gltfShape2);

function shotgunBox() {
  const weaponBox = new Entity("weaponBox");
  engine.addEntity(weaponBox);
  weaponBox.setParent(_scene);
  const transform60 = new Transform({
    position: new Vector3(15.6, 1.9, 23.81),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(0.5, 0.5, 0.5),
  });
  weaponBox.addComponentOrReplace(transform60);
  const gltfShape20 = new GLTFShape("models/ShotgunB.glb");
  gltfShape20.withCollisions = true;
  gltfShape20.isPointerBlocker = true;
  gltfShape20.visible = true;
  weaponBox.addComponentOrReplace(gltfShape20);
  weaponBox.addComponent(
    new OnPointerDown(
      (e) => {
        const points = manager.getPoints();
        if (points >= 1000) {
          //clipOpen2.play();
          purchase.playOnce();
          weapon.addGun({
            type: "shotgun",
            ammo: 40,
            shape: new GLTFShape("models/Shotgun.glb"),
            damage: 70,
          });
          setTimeout(3 * 1000, () => {
            //clipClose2.play();
            //give shotgun
          });
          manager.deductPoints(1000);
        } else {
          ui.displayAnnouncement("Need more points to buy Shot gun");
        }
      },
      {
        hoverText: "1000 points for a shotgun",
        distance: 2,
      }
    )
  );
  let d2animator = new Animator();

  // Add animator component to the entity
  weaponBox.addComponent(d2animator);

  // Instance animation clip object
  const clipOpen2 = new AnimationState("open", { looping: false });
  const clipClose2 = new AnimationState("closed", { looping: false });
  const idleClip2 = new AnimationState("idle", { looping: false });

  // Add animation clip to Animator component
  d2animator.addClip(clipOpen2);
  d2animator.addClip(clipClose2);
  d2animator.addClip(idleClip2);

  // Add entity to engine
  engine.addEntity(weaponBox);

  //Default Animation
  idleClip2.play();

  //add sound
  let clip = new AudioClip("sounds/sale.mp3");
  let purchase = new AudioSource(clip);
  weaponBox.addComponent(purchase);
}

function machinegunBox() {
  const weaponBox = new Entity("weaponBox");
  engine.addEntity(weaponBox);

  weaponBox.setParent(_scene);
  const transform60 = new Transform({
    position: new Vector3(31.5, 1.9, 23.39),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(0.5, 0.5, 0.5),
  });
  weaponBox.addComponentOrReplace(transform60);
  const gltfShape20 = new GLTFShape("models/RifleB.glb");
  gltfShape20.withCollisions = true;
  gltfShape20.isPointerBlocker = true;
  gltfShape20.visible = true;
  weaponBox.addComponentOrReplace(gltfShape20);
  weaponBox.addComponent(
    new OnPointerDown(
      (e) => {
        const points = manager.getPoints();
        const pointsNeeded = 1000;
        if (points >= pointsNeeded) {
          //clipOpen2.play();
          purchase.playOnce();
          weapon.addGun({
            type: "AK - 47",
            ammo: 70,
            shape: new GLTFShape("models/Rifle.glb"),
            damage: 30,
          });
          setTimeout(3 * 1000, () => {
            //clipClose2.play();
          });
          manager.deductPoints(pointsNeeded);
        } else {
          ui.displayAnnouncement("Need more points to buy Machine gun");
        }
      },
      {
        hoverText: "1000 points for a machinegun",
        distance: 5,
      }
    )
  );
  let d2animator = new Animator();

  // Add animator component to the entity
  weaponBox.addComponent(d2animator);

  // Instance animation clip object
  const clipOpen2 = new AnimationState("open", { looping: false });
  const clipClose2 = new AnimationState("closed", { looping: false });
  const idleClip2 = new AnimationState("idle", { looping: false });

  // Add animation clip to Animator component
  d2animator.addClip(clipOpen2);
  d2animator.addClip(clipClose2);
  d2animator.addClip(idleClip2);

  // Add entity to engine
  engine.addEntity(weaponBox);

  //Default Animation
  idleClip2.play();

  //add sound
  let clip = new AudioClip("sounds/sale.mp3");
  let purchase = new AudioSource(clip);
  weaponBox.addComponent(purchase);
}

shotgunBox();
machinegunBox();

function door1() {
  const payDoor = new Entity("door");
  engine.addEntity(payDoor);
  payDoor.setParent(_scene);
  const transform60 = new Transform({
    position: new Vector3(9.61, 1, 11.3),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(0.5, 0.5, 0.5),
  });
  payDoor.addComponentOrReplace(transform60);
  const gltfShape20 = new GLTFShape("models/irondoor.glb");
  gltfShape20.withCollisions = true;
  gltfShape20.isPointerBlocker = true;
  gltfShape20.visible = true;
  payDoor.addComponentOrReplace(gltfShape20);
  payDoor.addComponent(
    new OnPointerDown(
      (e) => {
        const points = manager.getPoints();
        if (points >= 1000) {
          engine.removeEntity(payDoor);

          manager.deductPoints(1000);
        } else {
          ui.displayAnnouncement("Need more points to buy this door");
        }
      },
      {
        hoverText: "1000 points for a the door",
        distance: 2,
      }
    )
  );

  //add sound
  let clip = new AudioClip("sounds/sale.mp3");
  let purchase = new AudioSource(clip);
  payDoor.addComponent(purchase);
}
function door2() {
  const payDoor = new Entity("door");
  engine.addEntity(payDoor);
  payDoor.setParent(_scene);
  const transform60 = new Transform({
    position: new Vector3(23.73, 0.95, 11.3),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(0.5, 0.5, 0.5),
  });
  payDoor.addComponentOrReplace(transform60);
  const gltfShape20 = new GLTFShape("models/irondoor.glb");
  gltfShape20.withCollisions = true;
  gltfShape20.isPointerBlocker = true;
  gltfShape20.visible = true;
  payDoor.addComponentOrReplace(gltfShape20);
  payDoor.addComponent(
    new OnPointerDown(
      (e) => {
        const points = manager.getPoints();
        if (points >= 1000) {
          engine.removeEntity(payDoor);

          manager.deductPoints(1000);
        } else {
          ui.displayAnnouncement("Need more points to buy this door");
        }
      },
      {
        hoverText: "1000 points for a the door",
        distance: 2,
      }
    )
  );

  //add sound
  let clip = new AudioClip("sounds/sale.mp3");
  let purchase = new AudioSource(clip);
  payDoor.addComponent(purchase);
}
function door3() {
  const payDoor = new Entity("door");
  engine.addEntity(payDoor);
  payDoor.setParent(_scene);
  const transform60 = new Transform({
    position: new Vector3(18.83, 0.95, 11.3),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(0.5, 0.5, 0.5),
  });
  payDoor.addComponentOrReplace(transform60);
  const gltfShape20 = new GLTFShape("models/irondoor.glb");
  gltfShape20.withCollisions = true;
  gltfShape20.isPointerBlocker = true;
  gltfShape20.visible = true;
  payDoor.addComponentOrReplace(gltfShape20);
  payDoor.addComponent(
    new OnPointerDown(
      (e) => {
        const points = manager.getPoints();
        if (points >= 1000) {
          engine.removeEntity(payDoor);

          manager.deductPoints(1000);
        } else {
          ui.displayAnnouncement("Need more points to buy this door");
        }
      },
      {
        hoverText: "1000 points for a the door",
        distance: 2,
      }
    )
  );

  //add sound
  let clip = new AudioClip("sounds/sale.mp3");
  let purchase = new AudioSource(clip);
  payDoor.addComponent(purchase);
}
function door4() {
  const payDoor = new Entity("door");
  engine.addEntity(payDoor);
  payDoor.setParent(_scene);
  const transform60 = new Transform({
    position: new Vector3(13.2, 0.9, 21.1),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(0.5, 0.5, 0.5),
  });
  payDoor.addComponentOrReplace(transform60);
  const gltfShape20 = new GLTFShape("models/irondoor.glb");
  gltfShape20.withCollisions = true;
  gltfShape20.isPointerBlocker = true;
  gltfShape20.visible = true;
  payDoor.addComponentOrReplace(gltfShape20);
  payDoor.addComponent(
    new OnPointerDown(
      (e) => {
        const points = manager.getPoints();
        if (points >= 1000) {
          engine.removeEntity(payDoor);

          manager.deductPoints(1000);
        } else {
          ui.displayAnnouncement("Need more points to buy this door");
        }
      },
      {
        hoverText: "1000 points for a the door",
        distance: 2,
      }
    )
  );

  //add sound
  let clip = new AudioClip("sounds/sale.mp3");
  let purchase = new AudioSource(clip);
  payDoor.addComponent(purchase);
}
function door5() {
  const payDoor = new Entity("door");
  engine.addEntity(payDoor);
  payDoor.setParent(_scene);
  const transform60 = new Transform({
    position: new Vector3(20.2, 0.9, 21.1),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(0.5, 0.5, 0.5),
  });
  payDoor.addComponentOrReplace(transform60);
  const gltfShape20 = new GLTFShape("models/irondoor.glb");
  gltfShape20.withCollisions = true;
  gltfShape20.isPointerBlocker = true;
  gltfShape20.visible = true;
  payDoor.addComponentOrReplace(gltfShape20);
  payDoor.addComponent(
    new OnPointerDown(
      (e) => {
        const points = manager.getPoints();
        if (points >= 1000) {
          engine.removeEntity(payDoor);

          manager.deductPoints(1000);
        } else {
          ui.displayAnnouncement("Need more points to buy this door");
        }
      },
      {
        hoverText: "1000 points for a the door",
        distance: 2,
      }
    )
  );

  //add sound
  let clip = new AudioClip("sounds/sale.mp3");
  let purchase = new AudioSource(clip);
  payDoor.addComponent(purchase);
}
function door6() {
  const payDoor = new Entity("door");
  engine.addEntity(payDoor);
  payDoor.setParent(_scene);
  const transform60 = new Transform({
    position: new Vector3(25.9, 0.9, 15.5),
    rotation: new Quaternion(0, 1, 0, 1),
    scale: new Vector3(0.5, 0.5, 0.5),
  });
  payDoor.addComponentOrReplace(transform60);
  const gltfShape20 = new GLTFShape("models/irondoor.glb");
  gltfShape20.withCollisions = true;
  gltfShape20.isPointerBlocker = true;
  gltfShape20.visible = true;
  payDoor.addComponentOrReplace(gltfShape20);
  payDoor.addComponent(
    new OnPointerDown(
      (e) => {
        const points = manager.getPoints();
        if (points >= 1000) {
          engine.removeEntity(payDoor);

          manager.deductPoints(1000);
        } else {
          ui.displayAnnouncement("Need more points to buy this door");
        }
      },
      {
        hoverText: "1000 points for a the door",
        distance: 2,
      }
    )
  );

  //add sound
  let clip = new AudioClip("sounds/sale.mp3");
  let purchase = new AudioSource(clip);
  payDoor.addComponent(purchase);
}
function door7() {
  const payDoor = new Entity("door");
  engine.addEntity(payDoor);
  payDoor.setParent(_scene);
  const transform60 = new Transform({
    position: new Vector3(6.2, 0.9, 15.5),
    rotation: new Quaternion(0, 1, 0, 1),
    scale: new Vector3(0.5, 0.5, 0.5),
  });
  payDoor.addComponentOrReplace(transform60);
  const gltfShape20 = new GLTFShape("models/irondoor.glb");
  gltfShape20.withCollisions = true;
  gltfShape20.isPointerBlocker = true;
  gltfShape20.visible = true;
  payDoor.addComponentOrReplace(gltfShape20);
  payDoor.addComponent(
    new OnPointerDown(
      (e) => {
        const points = manager.getPoints();
        if (points >= 1000) {
          engine.removeEntity(payDoor);

          manager.deductPoints(1000);
        } else {
          ui.displayAnnouncement("Need more points to buy this door");
        }
      },
      {
        hoverText: "1000 points for a the door",
        distance: 2,
      }
    )
  );

  //add sound
  let clip = new AudioClip("sounds/sale.mp3");
  let purchase = new AudioSource(clip);
  payDoor.addComponent(purchase);
}

door1();
door2();
door3();
door4();
door5();
door6();
door7();

//UI
export class StartingInfo {
  private card: UIImage;

  constructor(texturePath: string) {
    this.card = new UIImage(canvas, new Texture(texturePath));
    this.card.name = "clickable-image";
    // this.card.width = "768px";
    // this.card.height = "420px";
    this.card.width = "1950px";
    this.card.height = "1080px";
    this.card.sourceWidth = 1024;
    this.card.sourceHeight = 530;
    this.card.positionX = 0;
    this.card.positionY = 50;
    this.card.hAlign = "center";
    this.card.vAlign = "center";
    this.card.visible = false;
    this.card.isPointerBlocker = true;
  }

  public hide() {
    this.card.visible = false;
  }

  public show() {
    this.card.visible = true;
    // setTimeout(5 * 1000, () => {
    //   this.card.visible = false;
    // });
  }
}
export const startingInfo = new StartingInfo("images/nightmare.png");

export class StartingHeader {
  private card: UIImage;

  constructor() {
    this.card = new UIImage(canvas, new Texture("images/Hide_seek.png"));
    this.card.name = "clickable-image";
    this.card.width = "862px";
    this.card.height = "215px";
    this.card.sourceWidth = 862;
    this.card.sourceHeight = 215;
    this.card.positionX = 0;
    this.card.positionY = 230;
    this.card.hAlign = "center";
    this.card.vAlign = "center";
    this.card.visible = false;
    this.card.isPointerBlocker = true;
  }

  public show() {
    this.card.visible = true;
  }

  public hide() {
    this.card.visible = false;
  }
}
export const startingHeader = new StartingHeader();

export class StartingInfoExit {
  private card: UIImage;

  constructor() {
    this.card = new UIImage(canvas, new Texture("images/exit_button.png"));
    this.card.name = "clickable-image";
    this.card.width = "278px";
    this.card.height = "87px";
    this.card.sourceWidth = 278;
    this.card.sourceHeight = 87;
    this.card.positionX = 0;
    this.card.positionY = -250;
    this.card.hAlign = "center";
    this.card.vAlign = "center";
    this.card.visible = false;
    this.card.isPointerBlocker = true;
    this.card.onClick = new OnPointerDown(() => {
      startingInfo.hide();
      startingHeader.hide();
      this.card.visible = false;
      //setTimeout(1 * 1000, () => {
      //this.card.visible = false;
      manager.createZombiesForRound();
      //player.inventory.incrementItem(ITEM_TYPES.ICEHEART, 1);
    });
    //});
  }

  public show() {
    this.card.visible = true;
  }
}
export const startingInfoExitButton = new StartingInfoExit();

startingInfo.show();
startingHeader.show();
startingInfoExitButton.show();
