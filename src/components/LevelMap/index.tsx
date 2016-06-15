import * as React from 'react';
import * as I from 'immutable';
import pureComponent from '../../utils/pureComponent';
import LevelMapLevel from '../LevelMapLevel';

import './style.css';

interface Props {
  levelCount: number;
  stepCounts: I.Map<number, number>;
  activeLevel: number;
  activeStep: number;
  onSetDifficulty(level: number, step: number): void;
  minRenderedCount?: number;
}

@pureComponent
export default class LevelMap extends React.Component<Props, {}> {
  static defaultProps = {
    minRenderedCount: 5,
  };

  render(): JSX.Element {
    const {levelCount, stepCounts, activeLevel, activeStep, onSetDifficulty,
      minRenderedCount} = this.props;
    const renderedLevelCount = Math.min(Math.max(minRenderedCount, activeLevel + 1), levelCount);
    const levelMapLevels: JSX.Element[] = [];
    for (let i = 1; i <= renderedLevelCount; i++) {
      const isActive = activeLevel === i;
      levelMapLevels.push(
        <LevelMapLevel key={i} level={i} isComplete={i < activeLevel} isActive={isActive}
          stepCount={stepCounts.get(i)} activeStep={isActive ? activeStep : null}
          onSetDifficulty={onSetDifficulty}
        />
      );
    }

    return (
      <div className="level-map">
        {levelMapLevels}
      </div>
    );
  }
}
