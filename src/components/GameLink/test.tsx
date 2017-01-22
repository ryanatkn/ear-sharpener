import GameLink, {gameNameTitle} from './index';
import * as React from 'react';
import {shallow} from 'enzyme';
import {assert} from 'chai';
import Link from '../Link';
import {GameName} from '../../types';

describe('GameLink', () => {
  it('should render a link to a game', () => {
    const gameName: GameName = 'piano-game';
    const wrapper = shallow(
      <GameLink gameName={gameName}/>
    );
    assert(
      wrapper.containsMatchingElement(
        <Link to={`/${gameName}`}>
          {gameNameTitle[gameName]}
        </Link>
      ),
      'should have the expected link and text'
    );
  });
});
