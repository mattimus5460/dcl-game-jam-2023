import { AudioSource, PBAudioSource, Transform, engine } from "@dcl/sdk/ecs";
import { Vector3 } from "@dcl/sdk/math";

export const ambienceSound:PBAudioSource = { audioClipUrl: "sounds/ambience.mp3"};
export const clickSound:PBAudioSource = { audioClipUrl: "sounds/click.mp3"};
export const newLeaderSound:PBAudioSource = { audioClipUrl: "sounds/new-leader.mp3"};
export const fallSound:PBAudioSource = { audioClipUrl: "sounds/roblox-death-sound.mp3"};
export const finishSound1:PBAudioSource = { audioClipUrl: "sounds/wow.mp3"};
export const finishSound2:PBAudioSource = { audioClipUrl: "sounds/deja-vu.mp3"};
export const countdownRestartSound:PBAudioSource = { audioClipUrl: "sounds/countdown-restart.mp3"};

function play(clip: PBAudioSource, volume: number, position?:Vector3) {
    const entity = engine.addEntity()// new Entity();

    let pos = position
    if(pos === undefined){
        const pposTran = Transform.getOrNull(engine.PlayerEntity)
        if(pposTran){
            pos = pposTran.position
        }else{
            console.log("sound.ts","play","WARNING unable to get player pos so using Vecto3.zero() for ",clip)
            pos = Vector3.Zero()
        } 
    }
    Transform.create(entity,
        {
            position: pos
        })
    AudioSource.create(entity,clip)

    return { entity };
}

export function playLoop(clip: PBAudioSource, volume: number = 1) {
    const newArgs = {...clip}
    newArgs.loop = true
    newArgs.playing = true 
    const { entity } = play(clip, volume);
}

export function playOnce(clip: PBAudioSource, volume: number = 1, position?: Vector3) {
    const newArgs = {...clip}
    newArgs.loop = false
    newArgs.playing = true
    const { entity } = play(newArgs, volume, position);

    /*// FIXME: this is probably not the best practice to remove an entity once the sound has finished...
    class SoundRemoverWhenFinished implements ISystem {
        totalTime: number = 0;
        update(dt: number) {
            if (this.totalTime > 7) { // play up to 7 seconds
                engine.removeEntity(entity);
                engine.removeSystem(removeSoundWhenFinished);
            }
            this.totalTime += dt;
            // ...
        }
    }
    const removeSoundWhenFinished = new SoundRemoverWhenFinished();

    audio.loop = false;
    audio.playOnce();

    engine.addSystem(removeSoundWhenFinished);*/
}

export function playOnceRandom(clips: PBAudioSource[], volume: number = 1) {
    // select a random sound to play
    playOnce(clips[Math.floor(Math.random() * clips.length)]);
}