import {engine, Transform,} from '@dcl/sdk/ecs'
import {Color4} from '@dcl/sdk/math'
import ReactEcs, {Label, ReactEcsRenderer, UiEntity} from '@dcl/sdk/react-ecs'
import {EnemyComponent} from "./enemies/ghost";
import * as ui from 'dcl-ui-toolkit'
import {BarStyles} from 'dcl-ui-toolkit'

const healthLabel = ui.createComponent(ui.CornerLabel, {value: 'Health', xOffset: -190})
healthLabel.show()

export const healthBar = ui.createComponent(ui.UIBar, {value: 1, style: BarStyles.ROUNDSILVER})
healthBar.show()

const ammoLabel = ui.createComponent(ui.CornerLabel, {value: 'Energy', xOffset: -190})
ammoLabel.show()

export const ammoBar = ui.createComponent(ui.UIBar, {value: 1, color: Color4.Blue(), style: BarStyles.ROUNDSILVER})
ammoBar.show()

let zombiesForRound = 0
export const setZombiesForRound = (value: number) => {
    zombiesForRound = value
}

export const increaseZombiesForRound = (value: number) => {
    zombiesForRound += value
}

let countdown = 0

export const setCountdown = (value: number) => {
    countdown = value
}

const baseHealthLabel = ui.createComponent(ui.CornerLabel, {value: 'Bed Energy', xOffset: -190})
baseHealthLabel.show()

export const baseHealthBar = ui.createComponent(ui.UIBar, {value: 1, color: Color4.Green(), style: BarStyles.ROUNDGOLD})
baseHealthBar.show()

const base1HealthLabel = ui.createComponent(ui.CornerLabel, {value: 'Beacon 1 Energy', xOffset: -190})
base1HealthLabel.show()

export const base1HealthBar = ui.createComponent(ui.UIBar, {value: 0, color: Color4.Green(), style: BarStyles.ROUNDSILVER})
base1HealthBar.show()

const base2HealthLabel = ui.createComponent(ui.CornerLabel, {value: 'Beacon 2 Energy', xOffset: -190})
base2HealthLabel.show()

export const base2HealthBar = ui.createComponent(ui.UIBar, {value: 0, color: Color4.Green(), style: BarStyles.ROUNDSILVER})
base2HealthBar.show()

const base3HealthLabel = ui.createComponent(ui.CornerLabel, {value: 'Beacon 3 Energy', xOffset: -190})
base3HealthLabel.show()

export const base3HealthBar = ui.createComponent(ui.UIBar, {value: 0, color: Color4.Green(), style: BarStyles.ROUNDSILVER})
base3HealthBar.show()

const uiComponent = () => (
    <UiEntity
        uiTransform={{
            width: '400px',
            height: '100%',
            positionType: "absolute",
            position: {right: 10},
            justifyContent: 'center',
            display: "flex",
            alignItems: "center",
            flexDirection: "row"
        }}
    >

        <UiEntity
            uiTransform={{
                width: '400px',
                height: '700px',
            }}
        >
            {/*<UiEntity*/}
            {/*    uiTransform={{*/}
            {/*        width: '100%',*/}
            {/*        height: 100,*/}
            {/*        margin: '8px 0'*/}
            {/*    }}*/}
            {/*    uiBackground={{*/}
            {/*        textureMode: 'stretch',*/}
            {/*        texture: {*/}
            {/*            src: 'images/Hide_seek.png',*/}
            {/*        },*/}
            {/*    }}*/}
            {/*    uiText={{value: '', fontSize: 18}}*/}
            {/*/>*/}

            <UiEntity
                uiTransform={{width: '400px', height:'600px', display: "flex", flexDirection: "column"}}>

                <UiEntity
                    uiTransform={{width: '100%', height: 60}}>
                    {baseHealthLabel.render()}
                    {baseHealthBar.render()}
                </UiEntity>

                <UiEntity
                    uiTransform={{width: '100%', height: 60}}>
                    {base1HealthLabel.render()}
                    {base1HealthBar.render()}
                </UiEntity>

                <UiEntity
                    uiTransform={{width: '100%', height: 60}}>
                    {base2HealthLabel.render()}
                    {base2HealthBar.render()}
                </UiEntity>

                <UiEntity
                    uiTransform={{width: '100%', height: 60}}>
                    {base3HealthLabel.render()}
                    {base3HealthBar.render()}
                </UiEntity>


                <UiEntity
                    uiTransform={{width: '100%', height: 60}}>
                    {ammoLabel.render()}
                    {ammoBar.render()}
                </UiEntity>
                <UiEntity
                    uiTransform={{width: '100%', height: 60}}>
                    {healthLabel.render()}
                    {healthBar.render()}
                </UiEntity>


                <Label
                    onMouseDown={() => {
                        console.log('Player Position clicked !')
                    }}
                    value={`Time Left: ${countdown}`}
                    fontSize={18}
                    uiTransform={{width: '100%', height: 30, margin: {top: 10}}}
                />

                <Label
                    onMouseDown={() => {
                    }}
                    value={`Enemies: ${[...engine.getEntitiesWith(EnemyComponent)].length}`}
                    fontSize={18}
                    uiTransform={{width: '100%', height: 30, margin: {top: 10}}}
                />

                <Label
                    onMouseDown={() => {
                    }}
                    value={`Total Enemies: ${zombiesForRound}`}
                    fontSize={18}
                    uiTransform={{width: '100%', height: 30, margin: {top: 10}}}
                />

            </UiEntity>

        </UiEntity>
        {/*<UiEntity*/}
        {/*    uiTransform={{*/}

        {/*        positionType: "absolute",*/}
        {/*        position: {right: 700, bottom: 200},*/}
        {/*    }}>*/}
        {/*<NpcUtilsUi />*/}
        {/*</UiEntity>*/}
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

