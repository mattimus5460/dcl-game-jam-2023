import {AudioSource, engine, Entity, MeshRenderer, PBAudioSource, Transform} from "@dcl/sdk/ecs";
import {Vector3} from "@dcl/sdk/math";

export const ambienceSound:PBAudioSource = { audioClipUrl: "sounds/ambience.mp3"};
export const clickSound:PBAudioSource = { audioClipUrl: "sounds/click.mp3"};
export const newLeaderSound:PBAudioSource = { audioClipUrl: "sounds/new-leader.mp3"};
export const fallSound:PBAudioSource = { audioClipUrl: "sounds/roblox-death-sound.mp3"};
export const finishSound1:PBAudioSource = { audioClipUrl: "sounds/wow.mp3"};
export const finishSound2:PBAudioSource = { audioClipUrl: "sounds/deja-vu.mp3"};
export const countdownRestartSound:PBAudioSource = { audioClipUrl: "sounds/countdown-restart.mp3"};

const backgroundDarkSound:PBAudioSource = { audioClipUrl: "sounds/dark_sound_looped.mp3"};
backgroundDarkSound.loop = false
backgroundDarkSound.volume = 0.5

const backgroundLightSound:PBAudioSource = { audioClipUrl: "sounds/Music_Classical_Classical_GymnopedieNo1_glasspiano_128.mp3"};
backgroundLightSound.loop = false
backgroundDarkSound.volume = 100

const backgroundLoseSound:PBAudioSource = { audioClipUrl: "sounds/Music_Horror_Midnight_Dreary_music_02_chilling_96.mp3"};
backgroundLoseSound.loop = false
backgroundLoseSound.volume = 0.5

let curSoundEntity:Entity|null = null

function playNewSound(clip: PBAudioSource, volume: number) {
    if(curSoundEntity){
        AudioSource.getMutable(curSoundEntity).playing = false
        engine.removeEntity(curSoundEntity)
    }
    clip.playing = true
    let {entity} = play(clip, 1, Vector3.create(24,2,24))
    curSoundEntity = entity
}

export function playDark(){
    playNewSound(backgroundDarkSound, 1)
}

export function playLight(){
    playNewSound(backgroundLightSound, 1)
}

export function playLose(){
    playNewSound(backgroundLoseSound, 1)
}


function play(clip: PBAudioSource, volume: number, position?:Vector3) {
    const entity = engine.addEntity()// new Entity();

    console.log("playing ", clip.audioClipUrl)

    clip.volume = volume

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
    console.log("playing loop", clip.audioClipUrl)
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

    return entity

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