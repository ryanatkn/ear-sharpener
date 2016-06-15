import NoteNameChoices from '../NoteNameChoices';
import * as React from 'react';
import {shallow} from 'enzyme';
import * as I from 'immutable';
import {NoteName} from '../../models/Notes';
import {assert} from 'chai';
import NoteNameChoice from '../NoteNameChoice';

describe('NoteNameChoices', () => {
  it('should render a set of choices', () => {
    const choices = I.List<NoteName>(['C', 'C#', 'B']);
    const wrapper = shallow(
      <NoteNameChoices
        noteNameChoices={choices}
        lastGuess="C"
        wasLastGuessCorrect={false}
        guessCount={1}
        isGuessIndicatorEnabled={true}
      />
    );
    assert.equal(wrapper.find(NoteNameChoice).length, choices.size);
  });
});
