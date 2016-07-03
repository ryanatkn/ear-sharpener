import NoteDistanceGame from './index';
import * as React from 'react';
import {shallow} from 'enzyme';
import * as NoteDistanceGameModel from '../../models/NoteDistanceGame';

describe('NoteDistanceGame', () => {
  it('should not blow up', () => {
    shallow(
      <NoteDistanceGame
        gameState={NoteDistanceGameModel.create()}
        isGuessIndicatorEnabled={true}
        isInputEnabled={true}
        onGuess={(): void => null}
        onSetDifficulty={(): void => null}
        onPresent={(): void => null}
      />
    );
  });
});
