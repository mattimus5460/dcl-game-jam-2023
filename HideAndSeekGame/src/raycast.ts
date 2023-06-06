
let physicsCast = PhysicsCast.instance

const castRay = (origin: Vector3, dir: Vector3, distance: number = 1, id?: number): Promise<RaycastHitEntities> => {
    let ray: Ray = {
        origin: origin,
        direction: dir,
        distance: distance,
    }

    return new Promise((resolve, reject) => physicsCast.hitAll({...physicsCast.getRayFromPositions(origin, dir), distance}, (e) => {
        resolve(e);
    }, id))
};

export default castRay;
