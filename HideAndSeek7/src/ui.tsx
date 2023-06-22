import {engine, Transform,} from '@dcl/sdk/ecs'
import {Color4} from '@dcl/sdk/math'
import ReactEcs, {Button, Label, ReactEcsRenderer, UiEntity} from '@dcl/sdk/react-ecs'
import {Zombie, ZombieC} from "./zombies/zombie";
import * as ui from 'dcl-ui-toolkit'
import {BarStyles} from 'dcl-ui-toolkit'
import * as utils from "@dcl-sdk/utils"

const healthLabel = ui.createComponent(ui.CornerLabel, {value: 'Health', xOffset: -190})
healthLabel.show()

const healthBar = ui.createComponent(ui.UIBar, {value: 1, style: BarStyles.ROUNDSILVER})
healthBar.show()


const ammoLabel = ui.createComponent(ui.CornerLabel, {value: 'Ammo', xOffset: -190})
ammoLabel.show()


const ammoBar = ui.createComponent(ui.UIBar, {value: 1, color: Color4.Blue(), style: BarStyles.ROUNDGOLD})
ammoBar.show()


const minX = 12
const maxX = 19

const minZ = 12
const maxZ = 19
const uiComponent = () => (
    <UiEntity
        uiTransform={{
            width: '300px',
            height: '100%',
            positionType: "absolute",
            position: {right: 10}
        }}
    >
        <UiEntity
            uiTransform={{
                width: 400,
                maxHeight: 160,
                positionType: 'absolute',
                position: {top: 20, right: 150},
                //margin: '16px 0 8px 270px',
                // { top: 4, bottom: 4, left: 4, right: 4 },
                //alignSelf:'flex-end',
                padding: 4,
            }}
            uiBackground={{color: Color4.create(0.1, 0.1, 0.1, 0.91)}}
        >
            <UiEntity
                uiTransform={{
                    width: '100%',
                    height: '100%',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}
                uiBackground={{color: Color4.fromHexString("#343434")}}
            >
                <UiEntity
                    uiTransform={{
                        width: '100%',
                        height: 50,
                        margin: '8px 0'
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: 'images/Hide_seek.png',
                        },
                    }}
                    uiText={{value: '', fontSize: 18}}
                />
                <UiEntity
                    uiTransform={{
                        width: '100%',
                        height: '100%',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}
                    uiBackground={{color: Color4.fromHexString("#343434")}}
                >
                    <Label
                        onMouseDown={() => {
                            console.log('Player Position clicked !')
                        }}
                        value={`Player: ${getPlayerPosition()}`}
                        fontSize={18}
                        uiTransform={{width: '100%', height: 30}}
                    />
                    <Label
                        onMouseDown={() => {
                            console.log('# Cubes clicked !')
                        }}
                        value={`# Zombies: ${[...engine.getEntitiesWith(ZombieC)].length}`}
                        fontSize={18}
                        uiTransform={{width: '100%', height: 30}}
                    />
                    <Button
                        uiTransform={{width: 100, height: 40, margin: 8}}
                        value='Spawn Zombie'
                        variant='primary'
                        fontSize={14}
                        onMouseDown={() => {
                            const z1 = new Zombie({
                                position: {
                                    x: utils.remap(Math.random(), 0, 1, minX, maxX),
                                    y: 0,
                                    z: utils.remap(Math.random(), 0, 1, minZ, maxZ)
                                },
                                rotation: {w: 0, x: 0, y: 0, z: 0},
                                scale: {x: 1, y: 1, z: 1}
                            })
                        }}
                    />
                </UiEntity>
            </UiEntity>

        </UiEntity>
        <UiEntity
            uiTransform={{
                alignSelf: 'center',
                width: '100%',
                height: '500px',
                flexDirection: 'column',
                justifyContent: 'center'
            }}
            uiBackground={{color: Color4.fromHexString("#343434")}}
        >
            <UiEntity
                uiTransform={{
                    width: '100%',
                    height: 100,
                    margin: '8px 0'
                }}
                uiBackground={{
                    textureMode: 'stretch',
                    texture: {
                        src: 'images/Hide_seek.png',
                    },
                }}
                uiText={{value: '', fontSize: 18}}
            />
            <Button
                uiTransform={{width: 100, height: 60, margin: 8, padding: 4}}
                value='Spawn Zombie'
                variant='primary'
                fontSize={14}
                onMouseDown={() => {
                    const z1 = new Zombie({
                        position: {x: 19, y: 0, z: 14},
                        rotation: {w: 0, x: 0, y: 0, z: 0},
                        scale: {x: 1, y: 1, z: 1}
                    })
                }}
            />

            <UiEntity
                uiTransform={{width: '100%'}}>
                <Label
                    onMouseDown={() => {
                        console.log('# Level clicked !')
                    }}
                    value={`Zombies: ${[...engine.getEntitiesWith(ZombieC)].length}`}
                    fontSize={18}
                    uiTransform={{width: '100%', height: 50}}
                />
            </UiEntity>

            <UiEntity
                uiTransform={{width: '100%', height: 1000,}}>
                {ammoLabel.render()}
                {ammoBar.render()}
            </UiEntity>
            <UiEntity
                uiTransform={{width: '100%', height: 100}}>
                {healthLabel.render()}
                {healthBar.render()}
            </UiEntity>


        </UiEntity>
    </UiEntity>
)

function getPlayerPosition() {
    const playerPosition = Transform.getOrNull(engine.PlayerEntity)
    if (!playerPosition) return ' no data yet'
    const {x, y, z} = playerPosition.position
    return `{X: ${x.toFixed(2)}, Y: ${y.toFixed(2)}, z: ${z.toFixed(2)} }`
}

export function setupUi() {

    ReactEcsRenderer.setUiRenderer(uiComponent)

}