import {assert} from 'chai';
import {getSurroundingItems, getDistanceBetweenItems, getItemAtDistance,
  resolveArrayIndex, getItemBefore, getItemAfter} from './index';

describe('arrayHelpers', () => {
  describe('getSurroundingItems', () => {
    it('should return a number of items around the specified item of an array', () => {
      assert.deepEqual(
        getSurroundingItems([1, 2, 3, 4, 5, 6], 3, 4),
        [2, 3, 4, 5]
      );
    });

    it('should handle running out of items at the beginning of the list', () => {
      assert.deepEqual(
        getSurroundingItems([1, 2, 3, 4, 5, 6], 2, 5),
        [1, 2, 3, 4, 5]
      );
    });

    it('should handle running out of items at the end of the list', () => {
      assert.deepEqual(
        getSurroundingItems([1, 2, 3, 4, 5, 6], 5, 5),
        [2, 3, 4, 5, 6]
      );
    });

    it('should handle running out of items at both ends of the list', () => {
      assert.deepEqual(
        getSurroundingItems([1, 2, 3, 4, 5, 6], 3, 10),
        [1, 2, 3, 4, 5, 6]
      );
    });

    it('should return `undefined` if the item is not in the array', () => {
      assert.deepEqual(
        getSurroundingItems([1, 2, 3, 4, 5, 6], -1, 5),
        undefined
      );
    });
  });

  describe('getDistanceBetweenItems', () => {
    it('should find the index distance when the first item is before the second', () => {
      assert.strictEqual(
        getDistanceBetweenItems([1, 2, 3, 4, 5], 2, 4),
        2
      );
    });

    it('should find the index distance when the first item is after the second', () => {
      assert.strictEqual(
        getDistanceBetweenItems([1, 2, 3, 4, 5], 4, 2),
        2
      );
    });

    it('should return `undefined` if the first item is not in the array', () => {
      assert.strictEqual(
        getDistanceBetweenItems([1, 2, 3, 4, 5], -1, 4),
        undefined
      );
    });

    it('should return `undefined` if the second item is not in the array', () => {
      assert.strictEqual(
        getDistanceBetweenItems([1, 2, 3, 4, 5], 2, -1),
        undefined
      );
    });
  });

  describe('getItemAtDistance', () => {
    it('should get an item from the array at the specified distance after the given value', () => {
      assert.strictEqual(
        getItemAtDistance([1, 2, 3, 4, 5], 2, 2),
        4
      );
    });

    it('should get an item from the array at the specified distance before the given value', () => {
      assert.strictEqual(
        getItemAtDistance([1, 2, 3, 4, 5], 4, -2),
        2
      );
    });

    it('should wrap around to the beginning as many times as is necessary', () => {
      assert.strictEqual(
        getItemAtDistance([1, 2, 3, 4, 5], 2, 11),
        3
      );
    });

    it('should wrap around to the end as many times as is necessary', () => {
      assert.strictEqual(
        getItemAtDistance([1, 2, 3, 4, 5], 2, -11),
        1
      );
    });

    it('should return `undefined` if the item is not in the array', () => {
      assert.strictEqual(
        getItemAtDistance([1, 2, 3, 4, 5], -1, 2),
        undefined
      );
    });
  });

  describe('resolveArrayIndex', () => {
    it('should resolve to the given index when it is already valid', () => {
      assert.strictEqual(
        resolveArrayIndex([1, 2, 3, 4, 5], 3),
        3
      );
    });

    it('should resolve to the proper index when it is too large for the array', () => {
      assert.strictEqual(
        resolveArrayIndex([1, 2, 3, 4, 5], 13),
        3
      );
    });

    it('should resolve to the proper index when it is too small for the array', () => {
      assert.strictEqual(
        resolveArrayIndex([1, 2, 3, 4, 5], -13),
        2
      );
    });

    it('should return `undefined` if the array is empty', () => {
      assert.strictEqual(
        resolveArrayIndex([], 3),
        undefined
      );
    });
  });

  describe('getItemBefore', () => {
    it('should get the item before another in an array', () => {
      assert.strictEqual(
        getItemBefore([1, 2, 3, 4, 5], 3),
        2
      );
    });

    it('should wrap around to the end as necessary', () => {
      assert.strictEqual(
        getItemBefore([1, 2, 3, 4, 5], 1),
        5
      );
    });

    it('should return the given item for single item arrays', () => {
      assert.strictEqual(
        getItemBefore([1], 1),
        1
      );
    });

    it('should return `undefined` for empty arrays', () => {
      assert.strictEqual(
        getItemBefore([], 1),
        undefined
      );
    });

    it('should return `undefined` if the item is not in the array', () => {
      assert.strictEqual(
        getItemBefore([1, 2, 3, 4, 5], -1),
        undefined
      );
    });
  });

  describe('getItemAfter', () => {
    it('should get the item after another in an array', () => {
      assert.strictEqual(
        getItemAfter([1, 2, 3, 4, 5], 3),
        4
      );
    });

    it('should wrap around to the beginning as necessary', () => {
      assert.strictEqual(
        getItemAfter([1, 2, 3, 4, 5], 5),
        1
      );
    });

    it('should return the given item for single item arrays', () => {
      assert.strictEqual(
        getItemAfter([1], 1),
        1
      );
    });

    it('should return `undefined` for empty arrays', () => {
      assert.strictEqual(
        getItemAfter([], 1),
        undefined
      );
    });

    it('should return `undefined` if the item is not in the array', () => {
      assert.strictEqual(
        getItemAfter([1, 2, 3, 4, 5], -1),
        undefined
      );
    });
  });
});
