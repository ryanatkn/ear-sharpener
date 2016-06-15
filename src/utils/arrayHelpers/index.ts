/**
 * Gets `count` items around `startingItem` using === equality, alternating after and before.
 * For example, getting 4 items around `3` in `[1, 2, 3, 4, 5, 6]` should return `[2, 3, 4, 5]`.
 * Returns `undefined` if the item is not in the array.
 */
export function getSurroundingItems<T>(items: T[], startingItem: T, count: number): T[] {
  const itemIndex = items.indexOf(startingItem);
  if (itemIndex === -1) {
    return undefined;
  }
  const startIndex = Math.max(0, itemIndex - Math.floor((count - 1) / 2));
  const endIndex = startIndex + count;
  // The `endIndex` can be greater than `items.length` without causing problems,
  // but `startIndex` must be adjusted in that case to grab the desired number of items.
  const finalStartIndex = endIndex <= items.length
    ? startIndex
    : Math.max(0, startIndex - (endIndex - items.length));
  return items.slice(finalStartIndex, endIndex);
}

/**
 * Gets the absolute value of the index distance between two array items using === equality.
 * Returns `undefined` if either item is not in the array.
 */
export function getDistanceBetweenItems<T>(items: T[], item1: T, item2: T): number {
  const index1 = items.indexOf(item1);
  const index2 = items.indexOf(item2);
  if (index1 === -1 || index2 === -1) {
    return undefined;
  }
  return index1 > index2
    ? index1 - index2
    : index2 - index1;
}

/**
 * Gets the item at index `distance` from `item`,
 * choosing before or after randomly if specified.
 * Wraps around to the beginning or end of the array as necessary.
 * Returns `undefined` if the item is not in the array.
 */
export function getItemAtDistance<T>(
  items: T[],
  item: T,
  distance: number,
  randomizeDirection: boolean = false
): T {
  const itemIndex = items.indexOf(item);
  if (itemIndex === -1) {
    return undefined;
  }
  const finalDistance = randomizeDirection && Math.random() > 0.5
    ? -distance
    : distance;
  const resultIndex = itemIndex + finalDistance;
  const finalIndex = resolveArrayIndex(items, resultIndex);
  return items[finalIndex];
}

/**
 * Returns a valid index for `items`, wrapping around to the end if too 
 * large or to the beginning if too small as many times as necessary.
 * Returns `undefined` if the array is empty.
 */
export function resolveArrayIndex(items: any[], index: number): number {
  let finalIndex = index;
  const len = items.length;
  if (len === 0) {
    return undefined;
  }
  while (finalIndex >= len) {
    finalIndex -= len;
  }
  while (finalIndex < 0) {
    finalIndex += len;
  }
  return finalIndex;
}

/**
 * Gets the item before `item` from `items`, wrapping to the end if necessary.
 */
export function getItemBefore<T>(items: T[], item: T): T {
  return getItemAtDistance(items, item, -1);
}

/**
 * Gets the item after `item` from `items`, wrapping to the beginning if necessary.
 */
export function getItemAfter<T>(items: T[], item: T): T {
  return getItemAtDistance(items, item, 1);
}
