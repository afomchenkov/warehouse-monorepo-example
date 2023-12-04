import { Inventory } from '@app/common';

export const calculateOccupiedArea = (inventories: Inventory[]): number => {
  return inventories.reduce((total, inventory) => {
    total += inventory.size;
    return total;
  }, 0);
};
