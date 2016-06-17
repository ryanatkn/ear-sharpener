import PianoGame from './index';
import * as React from 'react';
import {shallow} from 'enzyme';
import * as PianoGameModel from '../../models/PianoGame';

describe('PianoGame', () => {
  it('should not blow up', () => {
    shallow(
      <PianoGame
        gameState={PianoGameModel.create()}
        isGuessIndicatorEnabled={true}
        isInputEnabled={true}
        onGuess={() => null}
        onSetDifficulty={() => null}
        onPresent={() => null}
      />
    );
  });
});
