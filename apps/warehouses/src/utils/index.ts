import { Inventory } from '@app/common';
import { format } from 'date-fns';

export const calculateOccupiedArea = (inventories: Inventory[]): number => {
  return inventories.reduce((total, inventory) => {
    // add every existing product inventory to the totla amount
    total += inventory.size * inventory.quantity;
    return total;
  }, 0);
};

export const DATE_FORMAT = 'YYYY-MM-DD HH:MM:SS';

export const toDateFormat = (date: Date | string): Date => {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  return new Date(format(date, DATE_FORMAT));
};
