import { Inventory } from "./types";
import {
  INVENTORY_ACTIONS,
  INVENTORY_ACTION_REASONS,
  UpdateInventory,
} from "./reducer";

export class PlayerInventory {
  inventory: Inventory;

  constructor() {
    this.inventory = {};
  }

  incrementItem = (
    itemKey: string,
    by: number = 1,
    reason?: INVENTORY_ACTION_REASONS
  ) => {
    this.inventory = UpdateInventory(this.inventory, {
      type: INVENTORY_ACTIONS.INCREASE_ITEM,
      itemKey,
      count: by,
      reason,
    });
  };

  reduceItem(
    itemKey: string,
    by: number = 1,
    reason?: INVENTORY_ACTION_REASONS
  ) {
    this.inventory = UpdateInventory(this.inventory, {
      type: INVENTORY_ACTIONS.REDUCE_ITEM,
      itemKey,
      count: by,
      reason,
    });
  }

  setItem(itemKey: string, count = 0) {
    this.inventory[itemKey] = {
      count,
      name: itemKey,
    };
  }

  getItem(itemKey: string) {
    return this.inventory?.[itemKey];
  }

  getItemCount(itemKey: string) {
    return this.getItem(itemKey)?.count || 0;
  }

  getInventoryKeys() {
    return Object.keys(this.inventory);
  }

  getInventoryValues() {
    return Object.keys(this.inventory).map((key) => this.inventory[key]);
  }
}
