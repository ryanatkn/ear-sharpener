import NoteDistanceChoices from './index';
import * as React from 'react';
import {shallow} from 'enzyme';
import * as I from 'immutable';
import {assert} from 'chai';
import NoteDistanceChoice from '../NoteDistanceChoice';

describe('NoteDistanceChoices', () => {
  it('should render a set of choices', () => {
    const choices = I.List<number>([1, 2, 3]);
    const wrapper = shallow(
      <NoteDistanceChoices
        distanceChoices={choices}
        lastGuess={2}
        wasLastGuessCorrect={false}
        guessCount={1}
        isGuessIndicatorEnabled={true}
      />
    );
    assert.equal(wrapper.find(NoteDistanceChoice).length, choices.size);
  });
});
