import * as ui from "@dcl/ui-scene-utils"

export interface InventoryItem {
    name: string;
    count: number;
}

export type Inventory = Record<string, InventoryItem>;
