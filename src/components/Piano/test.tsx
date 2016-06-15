import Piano from '../Piano';
import * as React from 'react';
import {shallow} from 'enzyme';
import * as I from 'immutable';
import {Note} from '../../models/Notes';
import PianoKey from '../PianoKey';
import {assert} from 'chai';

describe('Piano', () => {
  it('should render a set of piano keys', () => {
    const notes = I.List<Note>(['C3', 'C#3', 'B3']);
    const wrapper = shallow(
      <Piano
        notes={notes}
        lastGuess="C3"
        wasLastGuessCorrect={false}
        guessCount={1}
      />
    );
    // The Piano tries to measure its DOM element when rendering,
    // so to test it we need to set a fake width and stub the function
    // that measures the DOM.
    const instance = wrapper.instance() as Piano;
    instance.updatePianoWrapperWidth = (): void => null;
    wrapper.setState({pianoWrapperWidth: 400});
    assert.equal(wrapper.find(PianoKey).length, notes.size);
  });
});
