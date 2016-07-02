import * as React from 'react';
import LoadingIndicator from '../LoadingIndicator';
import GameLink from '../GameLink';
import pureComponent from '../../utils/pureComponent';
import Link from '../Link';
import {GameName, gameNames} from '../../types';

import './style.css';

interface Props {
  isLoading: boolean;
}

@pureComponent
export default class AppHeader extends React.Component<Props, {}> {
  render(): JSX.Element {
    const {isLoading} = this.props;
    return (
      <div className="app-header">
        <Link to="/" className="link-unstyled" onlyActiveOnIndex={true}>
          <h1>
            Ear Sharpener
          </h1>
        </Link>
        <div className="app-header-nav">
          {isLoading
            ? <LoadingIndicator/>
            : <div className="app-header-game-links">
                {gameNames.map((gameName: GameName): JSX.Element => {
                  return <GameLink key={gameName} gameName={gameName}/>;
                })}
              </div>
          }
        </div>
      </div>
    );
  }
}
