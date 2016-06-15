import * as React from 'react';
import pureComponent from '../../utils/pureComponent';

import './style.css';

export interface Props {
  text: string;
}

@pureComponent
export default class GameInstructions extends React.Component<Props, {}> {
  render(): JSX.Element {
    const {text} = this.props;
    return (
      <div className="game-instructions">
        {text}
      </div>
    );
  }
}
