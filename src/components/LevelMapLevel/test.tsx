import LevelMapLevel from './index';
import * as React from 'react';
import {shallow, ShallowWrapper} from 'enzyme';
import {assert} from 'chai';
import LevelMapLevelItem from '../LevelMapLevelItem';
import {spy} from 'sinon';

describe('LevelMapLevel', () => {
  it('should render an item for each step and exactly one should be active', () => {
    const stepCount = 3;
    const wrapper = shallow(
      <LevelMapLevel
        level={1}
        isComplete={false}
        isActive={true}
        stepCount={stepCount}
        activeStep={1}
        onSetDifficulty={(): void => null}
      />
    );
    const levelItemsWrapper = wrapper.find(LevelMapLevelItem);
    assert.equal(levelItemsWrapper.length, stepCount);
    const activeItemCount = levelItemsWrapper.reduce(
      (total: number, g: ShallowWrapper<any, any>) => g.prop('isActive') ? total + 1 : total,
      0
    );
    assert.equal(activeItemCount, 1);
  });

  it('should render items that respond to clicks', () => {
    const level = 1;
    const stepCount = 3;
    const stepToClick = 2;
    const onSetDifficulty = spy();
    const wrapper = shallow(
      <LevelMapLevel
        level={level}
        isComplete={false}
        isActive={false}
        stepCount={stepCount}
        activeStep={1}
        onSetDifficulty={onSetDifficulty}
      />
    );
    const levelItemsWrapper = wrapper.find(LevelMapLevelItem);
    const stepIndexToClick = stepToClick - 1; // steps start counting at 1, so adjust the index
    levelItemsWrapper.at(stepIndexToClick).shallow().simulate('click');
    assert(onSetDifficulty.calledOnce);
    assert(onSetDifficulty.calledWithExactly(level, stepToClick));
  });
});
