import * as React from 'react';
import pureComponent from '../../utils/pureComponent';
import LevelMapLevelItem from '../LevelMapLevelItem';

import './style.css';

interface Props {
  level: number;
  isComplete: boolean;
  isActive: boolean;
  stepCount: number;
  activeStep: number; // will be null if the level is not active to prevent unnecessary re-renders
  onSetDifficulty(level: number, step: number): void;
}

@pureComponent
export default class LevelMapLevel extends React.Component<Props, {}> {
  render(): JSX.Element {
    const {isComplete, isActive, stepCount, activeStep} = this.props;

    const levelMapLevelItems: JSX.Element[] = [];
    for (let i = 1; i <= stepCount; i++) {
      levelMapLevelItems.push(
        <LevelMapLevelItem key={i} step={i}
          isComplete={isComplete || (isActive && i < activeStep)}
          isActive={isActive && i === activeStep} onClick={this.doClickItem}
        />
      );
    }

    return (
      <div className="level-map-level">
        {levelMapLevelItems}
      </div>
    );
  }

  doClickItem = (step: number) => {
    this.props.onSetDifficulty(this.props.level, step);
  };
}
