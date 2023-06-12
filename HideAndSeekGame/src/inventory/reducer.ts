import { Inventory } from "./types"
import { LogInventoryToServer } from "../api/api"
// import axios from "axios"

export enum INVENTORY_ACTIONS {
    INCREASE_ITEM = "INCREASE_ITEM",
    REDUCE_ITEM = "REDUCE_ITEM_BY",
}

export enum INVENTORY_ACTION_REASONS {
    KILLED_NPC = "KILLED_NPC",
    MINED_RESOURCE = "MINED_RESOURCE",
    CLAIMED_REWARD = "CLAIMED_REWARD"
}

type Payload = {
    type: INVENTORY_ACTIONS
    itemKey: string
    count?: number
    reason?: INVENTORY_ACTION_REASONS
}

export const UpdateInventory = (
    state: Inventory,
    payload: Payload
): Inventory => {
    const oldItem = state[payload.itemKey] || {
        count: 0,
    }

    LogInventoryToServer(payload.type, payload.itemKey, payload.count).then(
        () => {
            log("Logged information correctly")
        }
    )

    switch (payload.type) {
        case INVENTORY_ACTIONS.INCREASE_ITEM:
            return {
                ...state,
                [payload.itemKey]: {
                    ...oldItem,
                    name: payload.itemKey,
                    count: oldItem?.count + (payload.count || 1),
                },
            }
        case INVENTORY_ACTIONS.REDUCE_ITEM:
            return {
                ...state,
                [payload.itemKey]: {
                    ...oldItem,
                    name: payload.itemKey,
                    count: (oldItem?.count || 0) - (payload.count || 1),
                },
            }
    }
}
