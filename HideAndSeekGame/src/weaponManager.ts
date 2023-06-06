// Colors to cycle through (7 main colours)
export const gunShapes: GLTFShape[] = [
  new GLTFShape("models/pistol.glb"),
  new GLTFShape("models/rifle.glb"),
  new GLTFShape("models/shotgun.glb")
]

export class WeaponsManager {

  public static weaponIndex: number = 0

    public static nextWeapon(): void {
      WeaponsManager.weaponIndex < gunShapes.length - 1
        ? WeaponsManager.weaponIndex++
        : (WeaponsManager.weaponIndex = 0)
    }
    public static previousWeapon(): void {
      WeaponsManager.weaponIndex == 0
        ? WeaponsManager.weaponIndex = gunShapes.length - 1
        : WeaponsManager.weaponIndex--
    }
}
