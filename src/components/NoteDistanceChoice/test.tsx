import NoteDistanceChoice from './index';
import * as React from 'react';
import {shallow} from 'enzyme';
import {spy} from 'sinon';
import {assert} from 'chai';

describe('NoteDistanceChoice', () => {
  it('should not blow up', () => {
    shallow(
      <NoteDistanceChoice
        noteDistance={1}
        guessedCorrectly={false}
        guessedIncorrectly={false}
      />
    );
  });

  it('should respond to a click', () => {
    const noteDistance = 1;
    const onChoose = spy();
    const wrapper = shallow(
      <NoteDistanceChoice
        noteDistance={noteDistance}
        guessedCorrectly={false}
        guessedIncorrectly={false}
        onChoose={onChoose}
      />
    );
    wrapper.simulate('click');
    assert(onChoose.calledOnce);
    assert(onChoose.calledWithExactly(noteDistance));
  });
});
