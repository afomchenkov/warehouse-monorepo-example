import {
  Inventory,
  TransactionType,
  calculateOccupiedArea,
  isSameOrGreaterDate,
  groupInventoriesByDay,
} from '@app/common';
import { isToday } from 'date-fns';

export const throwIfEmptyInventoriesExport = (
  inventories: Inventory[],
  transactionType: string,
) => {
  if (transactionType === TransactionType.IMPORT) {
    return;
  }

  if (inventories.length === 0) {
    throw new Error('Cannot export the requested amount on zero inventory');
  }
};

export const throwIfNotEnoughInventoryForProductExport = (
  inventories: Inventory[],
  transactionType: string,
  productId: number,
  exportSize: number,
) => {
  if (transactionType === TransactionType.IMPORT) {
    return;
  }

  const availableProductInventory = inventories.find(
    (inventory) =>
      isToday(inventory.effectiveDate) && inventory.product.id == productId,
  );

  if (!availableProductInventory) {
    throw new Error(
      `Cannot export the requested amount on zero inventory of the requested product: [${productId}]`,
    );
  }

  const exisitingAmount =
    availableProductInventory.quantity * availableProductInventory.size;
  if (exisitingAmount < exportSize) {
    throw new Error(
      `Not enough export amount, the current inventory amount for product: [${productId}] is [${exisitingAmount}]`,
    );
  }
};

export const throwIfNotEnoughCapacityForProductImport = (
  inventories: Inventory[],
  transactionType: string,
  importSize: number,
  transactionDate: string,
  maxWarehouseAmount: number,
) => {
  if (transactionType === TransactionType.EXPORT) {
    return;
  }

  const availableProductInventories = inventories.filter((inventory) =>
    isSameOrGreaterDate(new Date(transactionDate), inventory.effectiveDate),
  );

  if (availableProductInventories.length === 0) {
    return;
  }

  const groupedInventories = groupInventoriesByDay(availableProductInventories);

  // check if the total amount will exceed the max warehouse capacity at a given date
  for (const inventoriesEntry of groupedInventories.entries()) {
    const [date, inventories] = inventoriesEntry;
    const totalInventoryAmountForDate = calculateOccupiedArea(inventories);

    if (totalInventoryAmountForDate + importSize > maxWarehouseAmount) {
      throw new Error(
        `Cannot import the product amount: [${importSize}], the total size exceeds the max allowed stock at: [${date}]`,
      );
    }
  }
};
