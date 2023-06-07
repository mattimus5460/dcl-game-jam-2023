import { LEVEL_TYPES } from "./types"

export const LEVEL_TYPE_CONFIG: { [key: string]: any } = {
    [LEVEL_TYPES.PLAYER]: {
        label: "Player",
        noLabel: true,
    },
    [LEVEL_TYPES.TREE]: {
        label: "Lumberjack",
        xOffset: -90,
        yOffSet: 460,
    },
    [LEVEL_TYPES.KNOWLEDGE]: {
        label: "Knowledge",
        xOffset: -90,
        yOffSet: 480,
    },
    [LEVEL_TYPES.GEM]: {
        label: "Gem cutter",
        xOffset: -90,
        yOffSet: 500,
    },
    [LEVEL_TYPES.ROCK]: {
        label: "Miner",
        xOffset: -90,
        yOffSet: 440,
    },
    [LEVEL_TYPES.MEAT]: {
        label: "Butcher",
        xOffset: -90,
        yOffSet: 400,
    },
    [LEVEL_TYPES.ENEMY]: {
        label: "Assassin",
        xOffset: -90,
        yOffSet: 420,
    },
}
