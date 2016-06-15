import LevelMap from './index';
import * as React from 'react';
import {shallow} from 'enzyme';
import * as I from 'immutable';

describe('LevelMap', () => {
  it('should not blow up', () => {
    shallow(
      <LevelMap
        levelCount={5}
        stepCounts={I.Map<number, number>(I.Range(1, 5).zip(I.Range(1, 5)))}
        activeLevel={1}
        activeStep={1}
        onSetDifficulty={() => null}
      />
    );
  });
});
