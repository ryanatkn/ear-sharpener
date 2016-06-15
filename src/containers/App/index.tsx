import * as React from 'react';
import {AppState} from '../../types';
import AppHeader from '../../components/AppHeader';
import {connect} from 'react-redux';
import {Dispatch} from 'redux';
import {loadAudio} from '../../actions/assetLoaderActions';

import './style.css';

interface SelectedProps {
  isAudioLoaded: boolean;
}

interface ContainerProps {
  dispatch: Dispatch;
}

interface Props extends SelectedProps, ContainerProps {
  children: React.ReactNode;
}

class App extends React.Component<Props, {}> {
  componentWillMount(): void {
    this.props.dispatch(loadAudio());
  }

  render(): JSX.Element {
    const {isAudioLoaded, children} = this.props;
    return (
      <div className="app">
        <AppHeader isLoading={!isAudioLoaded}/>
        {isAudioLoaded ? children : null}
      </div>
    );
  }
}

// TODO decorator type is broken atm
export default connect((state: AppState): SelectedProps => ({
  isAudioLoaded: state.assetLoader.isAudioLoaded,
}))(App);
