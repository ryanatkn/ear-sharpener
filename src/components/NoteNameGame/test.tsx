import NoteNameGame from './index';
import * as React from 'react';
import {shallow} from 'enzyme';
import * as NoteNameGameModel from '../../models/NoteNameGame';

describe('NoteNameGame', () => {
  it('should not blow up', () => {
    shallow(
      <NoteNameGame
        gameState={NoteNameGameModel.create()}
        isGuessIndicatorEnabled={true}
        isInputEnabled={true}
        onGuess={() => null}
        onSetDifficulty={() => null}
      />
    );
  });
});
