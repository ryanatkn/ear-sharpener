import * as React from 'react';
import pureComponent from '../../utils/pureComponent';

import './style.css';

export interface Props {
  isEnabled: boolean;
  onClick(): void;
}

@pureComponent
export default class GamePresentButton extends React.Component<Props, {}> {
  render(): JSX.Element {
    const {isEnabled, onClick, children} = this.props;
    return (
      <div className={'game-present-button' + (isEnabled ? '' : ' disabled')}
        onClick={isEnabled ? onClick : null}
      >
        <div className="game-present-button-icon"/>
        <div>{children}</div>
      </div>
    );
  }
}
