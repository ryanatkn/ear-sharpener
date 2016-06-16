import * as React from 'react';
import Link from '../Link';
import {GameName} from '../../types';
import pureComponent from '../../utils/pureComponent';

import './style.css';

function getPath(gameName: GameName): string {
  return '/' + gameName;
}

/**
 * Would be nice if TypeScript allowed this type signature,
 * but only `number` and `string` work as index types.
 *    interface GameNameTitles {
 *      [key: GameName]: string;
 *    }
 */
export function getGameNameTitle(gameName: GameName): string {
  switch (gameName) {
    case 'combo-game': return 'Combo Game';
    case 'piano-game': return 'Piano Game';
    case 'note-name-game': return 'Note Name Game';
    case 'note-distance-game': return 'Note Distance Game';
    default: throw new Error(`Unknown game name "${gameName}"`);
  }
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
        {getGameNameTitle(gameName)}
      </Link>
    );
  }
}
