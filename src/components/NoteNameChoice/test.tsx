import NoteNameChoice from './index';
import * as React from 'react';
import {shallow} from 'enzyme';
import {spy} from 'sinon';
import {assert} from 'chai';
import {NoteName} from '../../models/Notes';

describe('NoteNameChoice', () => {
  it('should not blow up', () => {
    shallow(
      <NoteNameChoice
        noteName="C"
        guessedCorrectly={false}
        guessedIncorrectly={false}
      />
    );
  });

  it('should respond to a click', () => {
    const noteName: NoteName = 'C';
    const onChoose = spy();
    const wrapper = shallow(
      <NoteNameChoice
        noteName={noteName}
        guessedCorrectly={false}
        guessedIncorrectly={false}
        onChoose={onChoose}
      />
    );
    wrapper.simulate('click');
    assert(onChoose.calledOnce);
    assert(onChoose.calledWithExactly(noteName));
  });
});
