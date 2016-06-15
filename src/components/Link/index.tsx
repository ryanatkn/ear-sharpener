import * as React from 'react';
import {connect} from 'react-redux';
import {AppState} from '../../types';
import {Link as RRLink} from 'react-router';

import './style.css';

interface SelectedProps {
  // The `routerKey` is used to make props distinct on a route change,
  // otherwise the component does not re-render.
  routerKeyRerenderHack?: string;
}

interface Props extends SelectedProps, ReactRouter.LinkProps {}

// This wrapper class is needed to let all other components in the app
// implement `shouldComponentUpdate`.
// This class is connected to the react-router-redux state in the store.
class Link extends React.Component<Props, {}> {
  render(): JSX.Element {
    return (
      <RRLink activeClassName="active" {...this.props as any}>
        {this.props.children}
      </RRLink>
    );
  }
}

const mapStateToProps = (state: AppState): SelectedProps => ({
  routerKeyRerenderHack: state.routing.locationBeforeTransitions.key,
});

// TODO decorator type is broken atm
export default connect(mapStateToProps)(Link) as typeof Link;
