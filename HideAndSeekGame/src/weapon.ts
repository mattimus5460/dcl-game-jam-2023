// BUG: Issue with having all combining all the animations contained within the bucket...
// Only able to play through each animation once only so am now using a workaround where the
// paint animations are separated and the child of the bucket (might be to do with the way animation is setup)

import { Rifle } from "./rifle"
import {gunShapes} from "./weaponManager";
import * as ui from "@dcl/ui-scene-utils";

// Paint shapes
const weaponShapes: GLTFShape[] = [
  new GLTFShape("models/pistol.glb"),
  new GLTFShape("models/rifle.glb"),
  new GLTFShape("models/shotgun.glb"),
]


const weapons: Entity[] = []

interface GunInventory {
  type: string;
  shape: GLTFShape;
  ammo: number;
  damage: number;
}

// const AmmoCounter = new ui.UICounter()
export class Weapon {

  gun?: Rifle
  currentIdx?: number;
  public weaponIndex: number = 0
  inventory: GunInventory[]
  private ammo: ui.UICounter;
  constructor() {
    this.currentIdx = 0;
    this.inventory = [{
      type: 'pistol',
      shape: new GLTFShape("models/pistol.glb"),
      ammo: -1,
      damage: 10
    }];

    this.gun = new Rifle(this.inventory[0].shape, new Transform())
    this.ammo = new ui.UICounter(0,  -40, 550);
    this.ammo.hide();
    // this.ammo.show();

    engine.addEntity(this.gun);
    this.gun.getComponent(Transform).position.set(0.15, -0.2, 0.4)
    this.gun.getComponent(Transform).rotation = Quaternion.Euler(-3, 0, 0)
    this.gun.getComponent(Transform).scale.set(.5, .5, .5)
    this.gun.setParent(Attachable.FIRST_PERSON_CAMERA)
  }

  addGun(gun: GunInventory) {
    let found = false;
    for (let g = 0; g < this.inventory.length; g++) {
      if (this.inventory[g].type === gun.type) {
        found = true;
        this.inventory[g] = {
          ...gun,
          ammo: this.inventory[g].ammo + gun.ammo
        }
      }
    }

    if (!found) {
      this.inventory.push(gun);
      this.weaponIndex = this.inventory.length - 1;
      this.switchWeaponAnim(this.weaponIndex)
    }
  }

  //Switching weapons
  switchWeaponAnim(weaponIndex: number) {
    this.currentIdx = weaponIndex;

    if (this.inventory[this.currentIdx].ammo >= 0) {
      this.ammo.show();
      this.ammo.set(this.inventory[this.currentIdx].ammo);
    } else {
      this.ammo.hide();
    }
    //Create rifle
    if(this.gun){
      engine.removeEntity(this.gun);
    }
    this.gun = new Rifle(this.inventory[this.currentIdx].shape, new Transform())
    engine.addEntity(this.gun);
    this.gun.getComponent(Transform).position.set(0.15, -0.2, 0.4)
    this.gun.getComponent(Transform).rotation = Quaternion.Euler(-3, 0, 0)
    this.gun.getComponent(Transform).scale.set(.5, .5, .5)
    this.gun.setParent(Attachable.FIRST_PERSON_CAMERA)
  }
  public nextWeapon(): void {
    this.weaponIndex < this.inventory.length - 1
        ? this.weaponIndex++
        : (this.weaponIndex = 0)
  }
  public previousWeapon(): void {
    this.weaponIndex == 0
        ? this.weaponIndex = this.inventory.length - 1
        : this.weaponIndex--
  }

  reduceAmmo(by = 1) {
    if (this.inventory[this.weaponIndex].ammo - by >= 0) {
      this.inventory[this.weaponIndex].ammo -= by;
      this.ammo.set(this.inventory[this.weaponIndex].ammo);
    }
  }
  getAmmo() {
    return this.inventory[this.weaponIndex].ammo;
  }
  getDamage() {
    return this.inventory[this.weaponIndex].damage
  }
}
