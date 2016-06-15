import PianoKey from './index';
import * as React from 'react';
import {shallow} from 'enzyme';
import {spy} from 'sinon';
import {assert} from 'chai';
import {Note} from '../../models/Notes';

describe('PianoKey', () => {
  it('should not blow up', () => {
    shallow(
      <PianoKey
        note="C3"
        leftOffset={0}
        width={50}
        height={150}
        guessedCorrectly={false}
        guessedIncorrectly={false}
      />
    );
  });

  it('should respond to a click', () => {
    const note: Note = 'C3';
    const onPress = spy();
    const wrapper = shallow(
      <PianoKey
        note={note}
        leftOffset={0}
        width={50}
        height={150}
        guessedCorrectly={false}
        guessedIncorrectly={false}
        onPress={onPress}
      />
    );
    wrapper.simulate('click');
    assert(onPress.calledOnce);
    assert(onPress.calledWithExactly(note));
  });
});
