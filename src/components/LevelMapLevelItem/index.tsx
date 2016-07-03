import * as React from 'react';
import pureComponent from '../../utils/pureComponent';

import './style.css';

interface Props {
  step: number;
  isComplete: boolean;
  isActive: boolean;
  onClick(step: number): void;
}

@pureComponent
export default class LevelMapLevelItem extends React.Component<Props, {}> {
  render(): JSX.Element {
    const {isComplete, isActive} = this.props;

    let className = 'level-map-level-item';
    if (isActive) {
      className += ' level-map-level-item--selected';
    }
    if (isComplete) {
      className += ' level-map-level-item--complete';
    }

    return (
      <div className={className} onClick={this.doClick}></div>
    );
  }

  doClick = (): void => {
    this.props.onClick(this.props.step);
  };
}
