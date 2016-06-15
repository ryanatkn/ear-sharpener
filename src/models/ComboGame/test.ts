import {getNextGame} from './index';
import {GameName} from '../../types';
import {assert} from 'chai';
import * as values from 'lodash/values';

describe('ComboGame', () => {
  describe('getNextGame', () => {
    it('should get the next game in a circular loop', () => {
      const countsPerGame: Dict<number> = {};
      const firstGameName: GameName = 'piano-game';
      let currentGameName = firstGameName;
      let loopCount = 0;
      while (true) {
        currentGameName = getNextGame(currentGameName);
        // Track the number of times we see each game so we can ensure that it circles back.
        countsPerGame[currentGameName] = (countsPerGame[currentGameName] || 0) + 1;
        // Break when we circle back to the first game
        if (currentGameName === firstGameName) {
          break;
        }
        // Sanity check the loop count in case the exit condition never hits.
        loopCount++;
        if (loopCount > 999) {
          assert.fail('Looped way too many times - getting the next game name should be circular.');
          break;
        }
      }
      assert(
        values(countsPerGame).every((count: number) => count === 1),
        'should have looped through each game once'
      );
      assert.equal(
        Object.keys(countsPerGame).length,
        3,
        'expected to loop through exactly 3 game names'
      );
    });
  });
});
