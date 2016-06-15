import * as React from 'react';
import pureComponent from '../../utils/pureComponent';

import './style.css';

const TICK_INTERVAL = __TEST__ ? 0 : 333;
const TICK_COUNTER_MAX = 3;

interface State {
  tickCount: number;
}

@pureComponent
export default class LoadingIndicator extends React.Component<{}, State> {
  state = {
    tickCount: 0,
  };

  tickIntervalId: number = null;

  componentDidMount(): void {
    this.tickIntervalId = setInterval(this.onTick, TICK_INTERVAL);
  }

  componentWillUnmount(): void {
    clearInterval(this.tickIntervalId);
    this.tickIntervalId = null;
  }

  renderIndicator(tickCount: number): JSX.Element {
    const text = 'loading';
    switch (tickCount) {
      case 0:
        return <span>{text}&nbsp;&nbsp;&nbsp;</span>;
      case 1:
        return <span>{text}.&nbsp;&nbsp;</span>;
      case 2:
        return <span>{text}..&nbsp;</span>;
      case 3:
        return <span>{text}...</span>;
      default:
        throw new Error(`Unknown tick count "${tickCount}"`);
    }
  }

  render(): JSX.Element {
    const {tickCount} = this.state;
    return (
      <div className="loading-indicator">{this.renderIndicator(tickCount)}</div>
    );
  }

  onTick = (): void => {
    this.setState({tickCount: nextTickCount(this.state.tickCount)});
  }
}

function nextTickCount(currentTickCount: number): number {
  let nextTickCount = currentTickCount + 1;
  if (nextTickCount > TICK_COUNTER_MAX) {
    nextTickCount = 0;
  }
  return nextTickCount;
}
