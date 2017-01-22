import * as React from 'react';
import Link from '../Link';
import {GameName} from '../../types';
import pureComponent from '../../utils/pureComponent';

import './style.css';

function getPath(gameName: GameName): string {
  return '/' + gameName;
}

export const gameNameTitle: Record<GameName, string> = {
  'combo-game': 'Combo Game',
  'piano-game': 'Piano Game',
  'note-name-game': 'Note Name Game',
  'note-distance-game': 'Note Distance Game',
};

interface Props {
  gameName: GameName;
}

@pureComponent
export default class GameLink extends React.Component<Props, {}> {
  render(): JSX.Element {
    const {gameName} = this.props;
    return (
      <Link to={getPath(gameName)} className="game-link link-unstyled">
        {gameNameTitle[gameName]}
      </Link>
    );
  }
}
